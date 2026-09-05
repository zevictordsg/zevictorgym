-- Carbmaxxing Funnel — schema inicial
-- Rode isto no SQL editor do seu projeto Supabase (Project > SQL Editor).

create extension if not exists "pgcrypto";

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  nome text,
  whatsapp text,
  email text,
  answers jsonb not null default '{}'::jsonb,
  funnel_step text,
  stripe_customer_id text,
  stripe_checkout_session_id text,
  converted boolean not null default false,
  converted_at timestamptz
);

create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_whatsapp_idx on public.leads (whatsapp);

-- Eventos de progresso no funil — para montar o funil de conversão
-- (quantos leads chegaram em cada tela / onde abandonam).
create table if not exists public.funnel_events (
  id bigint generated always as identity primary key,
  lead_id uuid references public.leads (id) on delete cascade,
  step_id text not null,
  created_at timestamptz not null default now()
);

create index if not exists funnel_events_step_idx on public.funnel_events (step_id);
create index if not exists funnel_events_lead_idx on public.funnel_events (lead_id);

-- Dados de "entrada" do lead — capturados uma única vez, na primeira tela
-- que ele visita (ver /api/track e useLeadSync). `alter table ... add
-- column if not exists` em vez de colocar direto no create table acima
-- pra esse arquivo continuar seguro de rodar de novo em quem já tinha
-- criado a tabela `leads` antes dessas colunas existirem.
alter table public.leads add column if not exists referrer text;
alter table public.leads add column if not exists landing_path text;
alter table public.leads add column if not exists utm_source text;
alter table public.leads add column if not exists utm_medium text;
alter table public.leads add column if not exists utm_campaign text;
alter table public.leads add column if not exists utm_term text;
alter table public.leads add column if not exists utm_content text;
alter table public.leads add column if not exists user_agent text;

-- RLS: por padrão, todo acesso passa pela service_role key (usada só nas
-- API routes do Next.js), então mantemos RLS ativado e sem policies públicas.
alter table public.leads enable row level security;
alter table public.funnel_events enable row level security;

-- Credenciais temporárias da conta criada na área de membros (carbb) logo
-- após o pagamento confirmado pelo webhook do Stripe. O redirect de volta
-- pra /planilhadohack/obrigado acontece assim que o Checkout fecha, mas o
-- webhook (que de fato cria a conta e gera a senha) roda em paralelo/depois
-- — por isso a tela de sucesso não recebe a senha na hora do redirect, e
-- busca aqui via GET /api/checkout/status?session_id=... com polling curto.
-- Registro é apagado assim que lido uma vez (senha em texto plano, vida
-- útil de minutos, não um cofre de credenciais).
create table if not exists public.checkout_credentials (
  session_id text primary key,
  email text not null,
  password text,
  created_at timestamptz not null default now()
);

alter table public.checkout_credentials enable row level security;

-- View pronta pra ver o funil de conversão (quantos leads ÚNICOS chegaram
-- em cada etapa, e o "% que chegou até aqui" em relação à primeira etapa
-- registrada) direto no Table Editor / SQL Editor do Supabase, sem precisar
-- escrever a query de novo toda vez.
create or replace view public.funnel_retention as
with per_step as (
  select
    step_id,
    count(distinct lead_id) as leads_reached,
    min(created_at) as first_seen_at
  from public.funnel_events
  group by step_id
)
select
  step_id,
  leads_reached,
  first_seen_at,
  round(
    100.0 * leads_reached / nullif((select max(leads_reached) from per_step), 0),
    1
  ) as pct_of_top_step
from per_step
order by first_seen_at asc;
