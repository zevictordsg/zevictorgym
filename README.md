# Carbmaxxing — Funil Gamificado

Funil de vendas gamificado (Next.js 16 + TypeScript + Tailwind v4 + Framer
Motion) para a Carbmaxxing, sincronizado com o arquivo Figma
`Aura - 2.0` via MCP em 2026-08-25.

## Rodando localmente

```bash
npm install
cp .env.local.example .env.local   # preencha com suas chaves (ver abaixo)
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000). O funil é renderizado
dentro de uma moldura de celular centralizada (em telas grandes) para
facilitar a visualização — em um celular de verdade ele ocupa a tela toda.

## Estrutura

```
src/
  app/                 rotas (App Router) — page.tsx monta o <FunnelEngine />
  app/api/lead/         upsert de lead + respostas no Supabase
  app/api/checkout/     cria Stripe Checkout Session
  components/funnel/    engine do funil (state machine + transições) e as telas
  components/ui/        Button, Card/Callout/BadgeCard, CheckItem, ProgressBar…
  data/funnel-steps.tsx REGISTRO CENTRAL DAS 9 TELAS — comece por aqui
  store/funnel-store.ts estado global (Zustand + persist em localStorage)
  lib/                  fonts, Stripe, Supabase, utils
supabase/schema.sql      schema para colar no SQL editor do seu projeto Supabase
```

## Status das 9 telas (ver `src/data/funnel-steps.tsx`)

| # | Tela | Status |
|---|------|--------|
| 1 | Hook (antes/depois) | ✅ implementada, fiel ao Figma |
| 2 | VSL | ✅ implementada (vídeo é placeholder — ver `Screen02VSL.tsx`) |
| 3 | Reveal de calorias | ✅ implementada |
| 4 | Comparação de modelos | ⚠️ placeholder — falta o link do Figma |
| 5 | Simulação de WhatsApp | ✅ implementada (chat animado, com "digitando…") |
| 6 | Comparação + prova social (scroll) | ✅ implementada |
| 7 | Voucher (com animação de giro) | ✅ implementada |
| 8 | Quebra de objeção | ✅ implementada |
| 9 | Oferta final (Stripe) | ⚠️ placeholder — falta o link do Figma |

As fotos reais (antes/depois, refeições, prints) ainda não foram
substituídas — estão como placeholders visuais claramente comentados no
código (`{/* Placeholder — troque pela foto real */}`).

## Variáveis de ambiente (`.env.local`)

Veja `.env.local.example` para a lista completa. Resumo:

- **Supabase** (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
  `SUPABASE_SERVICE_ROLE_KEY`): crie um projeto em supabase.com, rode
  `supabase/schema.sql` no SQL editor, e copie as chaves em
  *Project Settings > API*. Sem essas chaves o funil funciona normalmente,
  só não persiste os leads.
- **Stripe** (`STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`,
  `STRIPE_PRICE_ID_ELITE`): crie o produto/preço no Dashboard do Stripe e
  copie o Price ID. A rota `/api/checkout` já cria a Checkout Session.

## Próximos passos sugeridos

1. Me mandar os links do Figma das telas 4 e 9 (os que eu recebi apontavam
   pro mesmo node de outras telas).
2. Trocar as fotos placeholder pelas reais.
3. Configurar Supabase e Stripe e testar o checkout ponta a ponta.
4. Publicar (Vercel é o caminho mais direto para Next.js).
