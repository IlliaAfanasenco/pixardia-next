# Pixardia

Pixardia is a Next.js website for a digital product studio. The application includes the public studio presentation, service and project routes, a contact lead flow backed by PostgreSQL and Prisma, and a scoped AI Terminal.

## Runtime contract

Use the versions declared by the repository:

- Node.js `22.16.0` is the canonical local and verification version (`.nvmrc`).
- Node.js `20.19+`, `22.12+`, and `24.x` are accepted by `package.json`.
- pnpm `10.34.5` is pinned through `packageManager`.

With `nvm` and Corepack:

```bash
nvm install
nvm use
corepack enable
corepack prepare pnpm@10.34.5 --activate
node --version
pnpm --version
```

Do not use npm, Yarn, or Bun for dependency installation in this repository. `pnpm-lock.yaml` is the dependency source of truth.

## Local setup

```bash
pnpm install --frozen-lockfile
cp .env.example .env.local
pnpm prisma:generate
pnpm dev
```

The development server is available at `http://localhost:3000` by default.

`pnpm dev` uses the Webpack development runtime for deterministic local operation. `pnpm dev:turbopack` remains available as an opt-in diagnostic command. This does not change the production build pipeline.

Replace all placeholder public values in `.env.local` before presenting or deploying the site. Never commit `.env.local`, API keys, database credentials, or Upstash tokens.

## Local PostgreSQL

The repository includes a PostgreSQL 16 development service exposed on host port `5433`:

```bash
docker compose up -d postgres
docker compose ps
```

The example `DATABASE_URL` in `.env.example` matches this local container.

Starting the container does not create or change the application schema. Database migrations are intentionally excluded from install, build, and verification scripts. Review migration status and data safety separately before applying any migration.

Do not run destructive database commands such as:

```text
prisma migrate reset
docker compose down -v
DROP TABLE
```

## Environment variables

| Variable | Scope | Required | Purpose |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Browser and server | Production | Absolute canonical site origin. |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Browser and server | Production | Public studio contact email. |
| `NEXT_PUBLIC_TELEGRAM_URL` | Browser and server | No | Optional Telegram contact URL. |
| `NEXT_PUBLIC_WHATSAPP_URL` | Browser and server | No | Optional WhatsApp contact URL. |
| `NEXT_PUBLIC_LINKEDIN_URL` | Browser and server | No | Optional LinkedIn profile URL. |
| `NEXT_PUBLIC_GITHUB_URL` | Browser and server | No | Optional GitHub profile URL. |
| `DATABASE_URL` | Server only | Contact API and Prisma commands | PostgreSQL connection string. |
| `UPSTASH_REDIS_REST_URL` | Server only | Recommended in production | Distributed rate-limit endpoint. |
| `UPSTASH_REDIS_REST_TOKEN` | Server only | Recommended in production | Distributed rate-limit credential. |
| `DEEPSEEK_API_KEY` | Server only | No | Enables live AI Terminal responses. |
| `DEEPSEEK_MODEL` | Server only | No | Overrides the built-in DeepSeek model default. |

Both Upstash variables must be configured together. Without them, the application uses a process-local development fallback that is not a reliable production rate limiter across multiple instances.

## Verification

The canonical verification command is:

```bash
pnpm verify
```

It executes, in order:

1. Prisma Client generation.
2. Prisma schema validation.
3. ESLint.
4. TypeScript type checking.
5. Prisma Client generation inside the standalone build contract.
6. Next.js production build.

The repeated Prisma Client generation is intentional: `pnpm verify` is self-contained on a clean checkout, while direct `pnpm build` remains self-contained as well. The verification flow does not connect to PostgreSQL to write data and does not apply migrations.

Mandatory clean-state verification:

```bash
rm -rf lib/generated/prisma
pnpm verify
```

This must pass without running `pnpm prisma:generate` separately first.

Individual commands:

```bash
pnpm prisma:generate
pnpm prisma:validate
pnpm lint
pnpm typecheck
pnpm build
```

`pnpm build` always generates Prisma Client before `next build`, so a clean checkout does not depend on an untracked `lib/generated/prisma` directory left by another developer.

## Production baseline

A production build requires real values for at least:

```text
NEXT_PUBLIC_SITE_URL
NEXT_PUBLIC_CONTACT_EMAIL
DATABASE_URL
```

The AI Terminal can build without `DEEPSEEK_API_KEY`, but live provider responses remain disabled. Distributed Upstash rate limiting should be configured before exposing cost-sensitive API routes publicly.

Deployment, database migration, legal content, project media, CI, and release operations are separate reviewed tasks. None of them are performed by the commands in this document.
