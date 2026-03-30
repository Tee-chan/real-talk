# RealTalk

Real-time chat application — Next.js 14, NestJS, Socket.io, PostgreSQL, Redis.

## Prerequisites

- Node.js >= 20
- pnpm >= 9
- Docker + Docker Compose

## Getting started

```bash
# 1. Clone and install
git clone https://github.com/yourname/realtalk.git
cd realtalk
pnpm install

# 2. Set up environment
cp .env.example .env
# Fill in your secrets in .env

# 3. Start PostgreSQL + Redis
docker compose up -d

# 4. Run DB migrations
pnpm db:migrate

# 5. Start everything
pnpm dev
```

Apps run at:
- Frontend → http://localhost:3000
- Backend  → http://localhost:4000
- Health   → http://localhost:4000/api/health

## Project structure

| Path | Purpose |
|---|---|
| `apps/web` | Next.js 14 frontend |
| `apps/api` | NestJS backend |
| `packages/types` | Shared TypeScript interfaces |
| `packages/database` | Prisma schema + client |
| `packages/tsconfig` | Shared TS configs |
| `packages/eslint-config` | Shared ESLint rules |

## Commands

| Command | Description |
|---|---|
| `pnpm dev` | Start all apps in dev mode |
| `pnpm build` | Build all apps |
| `pnpm lint` | Lint all workspaces |
| `pnpm typecheck` | Type-check all workspaces |
| `pnpm test` | Run all tests |
| `pnpm db:migrate` | Run Prisma migrations |
| `pnpm db:generate` | Regenerate Prisma client |
| `pnpm format` | Format all files with Prettier |

## Commit format

```
feat: add cursor-based message pagination
fix: resolve WebSocket auth guard token expiry
chore: upgrade prisma
```
