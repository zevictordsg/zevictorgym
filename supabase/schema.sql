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

-- RLS: por padrão, todo acesso passa pela service_role key (usada só nas
-- API routes do Next.js), então mantemos RLS ativado e sem policies públicas.
alter table public.leads enable row level security;
alter table public.funnel_events enable row level security;
