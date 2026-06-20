# Agent Handover

## Current Architecture

This is a Next.js 16 App Router project with TypeScript and Tailwind CSS v4. The live application is still a minimal scaffold. Product screens exist only as Google Stitch generated static HTML and screenshots under `stitch_api_pulse_monitor_dashboard/`.

No backend APIs, Prisma schema, database connection, repositories, services, DTOs, or validation modules exist yet.

## Current Folder Structure

```text
monitoring-system/
  app/
    favicon.ico
    globals.css
    layout.tsx
    page.tsx
  docs/
    agent-handover.md
    api-contracts.md
    architecture.md
    database-design.md
    phase-progress.md
    project-overview.md
  public/
    file.svg
    globe.svg
    next.svg
    vercel.svg
    window.svg
  stitch_api_pulse_monitor_dashboard/
    api_details_customer_api_v2/
      code.html
      screen.png
    api_logs_viewer_v2/
      code.html
      screen.png
    api_pulse_monitor/
      DESIGN.md
    overview_dashboard_v2/
      code.html
      screen.png
```

## Existing Pages

Current real Next route:

- `/` from `app/page.tsx`, currently placeholder UI.

Stitch-generated pages not yet wired into Next:

- Dashboard Overview from `overview_dashboard_v2/code.html`.
- API Details from `api_details_customer_api_v2/code.html`.
- Developer Logs from `api_logs_viewer_v2/code.html`.

## Implemented APIs

None.

## Database Schema

None.

Prisma is not installed or configured yet. PostgreSQL schema work is pending Phase 3.

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

Phase 1 documentation has been prepared:

- Current screens documented.
- Current routing documented.
- Reusable components identified.
- Architecture direction proposed.
- Planned API contracts documented.
- Planned database concepts documented.

## Pending Phases

1. Refactor Stitch UI into real Next routes and reusable components.
2. Add Prisma/PostgreSQL schema and seed data.
3. Add repositories, services, DTOs, and validation.
4. Implement and connect dashboard API.
5. Implement and connect API details APIs.
6. Implement and connect logs API.
7. Add simple realtime SSE support.
8. Run cleanup and final verification.

## Known Issues

- `git status` is blocked by Git dubious ownership protection until the safe directory is configured.
- The current root page does not represent the Stitch dashboard yet.
- No `docs/` folder existed before Phase 1.
- Some generated Stitch text includes encoding artifacts for bullets/arrows.
- The generated UI uses Material Symbols and remote images/fonts that should be handled deliberately during UI conversion.

## Setup Steps

Current project commands:

```bash
pnpm install
pnpm dev
pnpm lint
pnpm build
```

Future database setup will require a PostgreSQL connection string in `.env` once Prisma is introduced:

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
```

Do not add auth, RBAC, multi-tenancy, notifications, Redis, Elasticsearch, MongoDB, or Kubernetes work unless the project scope changes.

