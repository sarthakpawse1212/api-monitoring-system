# Agent Handover

## Current Architecture

This is a Next.js 16 App Router project with TypeScript and Tailwind CSS v4. Phase 2 has converted the Stitch product screens into real App Router pages using reusable React components and typed static data. The original Google Stitch generated static HTML and screenshots remain under `stitch_api_pulse_monitor_dashboard/` as the visual reference.

No backend APIs, Prisma schema, database connection, repositories, services, DTOs, or validation modules exist yet.

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
  public/
    file.svg
    globe.svg
    next.svg
    vercel.svg
    window.svg
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

Current real Next routes:

- `/` from `app/page.tsx`, rendering the dashboard overview from typed static data.
- `/apis/[id]` from `app/apis/[id]/page.tsx`, rendering the Customer API details screen from typed static data.
- `/logs` from `app/logs/page.tsx`, rendering the Developer Logs screen from typed static data.

Stitch-generated pages not yet wired into Next:

- The original generated HTML remains available for reference but is no longer the only representation of the UI.

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

Phase 2 UI refactor has been implemented:

- Dashboard, API details, and logs screens are now real Next routes.
- Shared layout/UI components were added under `components/`.
- Feature-specific screen composition and static data were added under `features/`.
- Static data is shaped to resemble future API DTOs.
- No backend APIs, Prisma files, database schema, or realtime endpoint were added.

## Pending Phases

1. Add Prisma/PostgreSQL schema and seed data.
2. Add repositories, services, DTOs, and validation.
3. Implement and connect dashboard API.
4. Implement and connect API details APIs.
5. Implement and connect logs API.
6. Add simple realtime SSE support.
7. Run cleanup and final verification.

## Known Issues

- `git status` is blocked by Git dubious ownership protection until the safe directory is configured.
- The UI is currently static; filters, pagination, refresh, and live feed controls are visual only until backend phases.
- Some generated Stitch text includes encoding artifacts for bullets/arrows.
- Material Symbols are loaded through a Google Fonts CSS import in `app/globals.css`.

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
