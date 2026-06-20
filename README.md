# Pulse Monitor Pro

API monitoring dashboard built with Next.js 16, TypeScript, Tailwind CSS v4, PostgreSQL, and Prisma.

## Prerequisites

- **Node.js** 20+
- **pnpm** (recommended)
- **PostgreSQL** 14+ (local install, Docker, or a cloud provider such as Neon, Supabase, or Railway)

## Quick Start (UI only)

The dashboard UI runs on static data until backend phases wire APIs to the database.

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Database Setup (Phase 3)

Complete these steps **before** running migrations.

### Step 1: Install and start PostgreSQL

Choose one option:

**Option A — Docker (recommended for local development)**

```bash
docker run --name pulse-postgres ^
  -e POSTGRES_USER=pulse ^
  -e POSTGRES_PASSWORD=pulse ^
  -e POSTGRES_DB=pulse_monitor ^
  -p 5432:5432 ^
  -d postgres:16
```

On macOS/Linux, replace `^` line continuations with `\`.

**Option B — Local PostgreSQL**

Create a database and user:

```sql
CREATE USER pulse WITH PASSWORD 'your_password';
CREATE DATABASE pulse_monitor OWNER pulse;
GRANT ALL PRIVILEGES ON DATABASE pulse_monitor TO pulse;
```

**Option C — Cloud provider**

Create a PostgreSQL project in Neon, Supabase, Railway, or similar, then copy the connection string from the provider dashboard.

### Step 2: Configure environment variables

From the `monitoring-system/` directory:

```bash
cp .env.example .env
```

Edit `.env` and set your connection string:

```env
DATABASE_URL="postgresql://pulse:pulse@localhost:5432/pulse_monitor?schema=public"
```

Replace the username, password, host, port, and database name to match your setup.

> **Important:** Never commit `.env`. Only `.env.example` is tracked in git.

### Step 3: Install dependencies

```bash
pnpm install
```

### Step 4: Generate Prisma Client

```bash
pnpm db:generate
```

Run this after every schema change.

### Step 5: Run migrations

Creates the database tables:

```bash
pnpm db:migrate
```

On the first run, Prisma prompts for a migration name. Use `init`.

For production or CI (apply existing migrations without prompts):

```bash
pnpm db:migrate:deploy
```

### Step 6: Seed demo data

Populates services, logs, transactions, charts, and alerts that mirror the static UI:

```bash
pnpm db:seed
```

Safe to re-run in development. The seed script clears and re-inserts demo data.

### Step 7: Verify (optional)

```bash
pnpm db:studio
```

Opens Prisma Studio at [http://localhost:5555](http://localhost:5555) to browse tables.

## Database Scripts Reference

| Command | Description |
|---------|-------------|
| `pnpm db:generate` | Generate Prisma Client from schema |
| `pnpm db:migrate` | Create and apply a migration (development) |
| `pnpm db:migrate:deploy` | Apply migrations (production/CI) |
| `pnpm db:seed` | Seed demo data |
| `pnpm db:studio` | Open Prisma Studio |
| `pnpm db:reset` | Drop database, re-run migrations, and re-seed (development only) |

## Recommended Setup Order

```text
Install PostgreSQL
  -> Create database
  -> cp .env.example .env
  -> pnpm install
  -> pnpm db:generate
  -> pnpm db:migrate
  -> pnpm db:seed
```

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `Can't reach database server` | Ensure PostgreSQL is running and `DATABASE_URL` host/port are correct |
| `Authentication failed` | Check username and password in `DATABASE_URL` |
| `Database does not exist` | Create the database first (Step 1) |
| `Environment variable not found: DATABASE_URL` | Create `.env` from `.env.example` |
| Schema drift in development | Run `pnpm db:reset` (destroys local data) |

## Project Phases

See `docs/phase-progress.md` for the full roadmap.

- **Phase 1–2:** Documentation and UI refactor (complete)
- **Phase 3:** Database — Prisma schema and seed (complete)
- **Phase 4:** Repositories, services, DTOs, validation
- **Phase 5–7:** Connect dashboard, API details, and logs to backend APIs
- **Phase 8:** Realtime SSE
- **Phase 9:** Cleanup and final verification

## Other Commands

```bash
pnpm lint
pnpm build
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
