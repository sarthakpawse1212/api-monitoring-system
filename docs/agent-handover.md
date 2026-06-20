# Agent Handover

## Current Architecture

This is a Next.js 16 App Router project with TypeScript and Tailwind CSS v4. Phase 2 converted the Stitch product screens into real App Router pages using reusable React components and typed static data. Phase 3 added Prisma with a PostgreSQL schema and seed data. The UI still reads from static data in `features/` until Phases 5–7 connect APIs.

No backend API routes, repositories, services, DTOs, or validation modules exist yet.

## Current Folder Structure

```text
monitoring-system/
  app/
    apis/
      [id]/
        page.tsx
    favicon.ico
    globals.css
    layout.tsx
    logs/
      page.tsx
    page.tsx
  components/
    layout/
      app-shell.tsx
      mobile-nav.tsx
      nav-items.ts
      side-nav.tsx
      top-nav.tsx
    ui/
      charts.tsx
      metric-card.tsx
      status.tsx
  docs/
    agent-handover.md
    api-contracts.md
    architecture.md
    database-design.md
    phase-progress.md
    project-overview.md
  features/
    api-details/
      api-details-page.tsx
      data.ts
    dashboard/
      dashboard-page.tsx
      data.ts
    logs/
      data.ts
      logs-page.tsx
  lib/
    prisma.ts
  prisma/
    migrations/
    schema.prisma
    seed.ts
  public/
  stitch_api_pulse_monitor_dashboard/
```

## Existing Pages

Current real Next routes:

- `/` from `app/page.tsx`, rendering the dashboard overview from typed static data.
- `/apis/[id]` from `app/apis/[id]/page.tsx`, rendering the Customer API details screen from typed static data.
- `/logs` from `app/logs/page.tsx`, rendering the Developer Logs screen from typed static data.

## Backend Architecture (Phase 4)

Four-layer architecture implemented:

### Repositories (`lib/repositories/`)
- `monitored-api.repository.ts` — API/service data access
- `request-log.repository.ts` — Logs, transactions, activity data access
- `alert.repository.ts` — Alert data access
- `chart-data.repository.ts` — Chart series data access

### DTOs (`lib/dto/`)
- `dashboard.dto.ts` — Dashboard response shaping
- `api-details.dto.ts` — API details response shaping
- `logs.dto.ts` — Logs response shaping
- `common.dto.ts` — Shared utilities (formatting, relative time)

### Validation (`lib/validation/`)
- `query-params.ts` — Query parameter validation and sanitization

### Services (`lib/services/`)
- `dashboard.service.ts` — Dashboard business logic
- `api.service.ts` — API details business logic
- `logs.service.ts` — Logs business logic

## Implemented APIs

None yet. API routes will be added in Phases 5-7.

## Database Schema

Prisma schema is in `prisma/schema.prisma` with four models:

- `MonitoredApi` — monitored services (12 seeded: 6 primary + 6 stub).
- `RequestLog` — activity, transactions, and developer logs.
- `Alert` — dashboard alerts.
- `ChartDataPoint` — response trends, error rates, traffic distribution.

Seed script: `prisma/seed.ts`. Setup instructions: `README.md`.

## Reusable Components Identified

- Top navigation.
- Desktop sidebar.
- Mobile bottom navigation.
- Bento cards.
- KPI/metric cards.
- API status cards.
- Status badges and pulse indicators.
- Live activity table.
- Recent transactions table.
- Developer logs table.
- Search, select, status, and time range filters.
- Pagination.
- CSS-only chart components.

## Completed Phases

Phase 1 documentation, Phase 2 UI refactor, Phase 3 database (Prisma schema, migrations, seed, `lib/prisma.ts`, README database setup), and Phase 4 backend architecture (repositories, DTOs, validation, services).

## Pending Phases

1. Implement and connect dashboard API (Phase 5).
2. Implement and connect API details APIs (Phase 6).
3. Implement and connect logs API (Phase 7).
4. Add simple realtime SSE support (Phase 8).
5. Run cleanup and final verification (Phase 9).

## Known Issues

- `git status` is blocked by Git dubious ownership protection until the safe directory is configured.
- The UI is currently static; filters, pagination, refresh, and live feed controls are visual only until backend phases.
- Some generated Stitch text includes encoding artifacts for bullets/arrows.
- Material Symbols are loaded through a Google Fonts CSS import in `app/globals.css`.

## Setup Steps

```bash
pnpm install
pnpm dev
pnpm lint
pnpm build
```

Database setup (after PostgreSQL is running):

```bash
cp .env.example .env
# edit DATABASE_URL
pnpm db:generate
pnpm db:migrate
pnpm db:seed
```

Do not add auth, RBAC, multi-tenancy, notifications, Redis, Elasticsearch, MongoDB, or Kubernetes work unless the project scope changes.
