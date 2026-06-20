# Architecture

## Current Architecture

The project is currently a basic Next.js 16 App Router application:

```text
monitoring-system/
  app/
    globals.css
    layout.tsx
    page.tsx
  public/
  stitch_api_pulse_monitor_dashboard/
    api_details_customer_api_v2/
    api_logs_viewer_v2/
    api_pulse_monitor/
    overview_dashboard_v2/
```

There are no application feature folders, backend route handlers, Prisma files, database models, or shared UI components yet.

## Current Routing

Only one Next route currently exists:

- `/` from `app/page.tsx`, currently placeholder content.

The generated Stitch screens are static HTML files and are not currently wired into the Next routing system.

Planned routes:

- `/` dashboard overview.
- `/apis/[id]` API details.
- `/logs` developer logs.

## Reusable UI Components Identified

The generated screens repeat several component patterns that should be extracted before backend wiring:

- App shell: fixed top navigation, desktop sidebar, mobile bottom navigation.
- Navigation items with active states.
- Bento card container with border, white surface, hover lift, and soft shadow.
- Metric/KPI cards with label, primary value, trend or status footer.
- Status badges for healthy, warning, down, success, client error, and server error.
- Pulse dot indicator for live/healthy/error states.
- Data tables for live activity, recent transactions, and developer logs.
- Method tags for GET, POST, PATCH, DELETE.
- Filter controls: search input, service select, status buttons, time range selector.
- Pagination controls.
- CSS-only chart primitives for donut, bar, trend, distribution, and volume visuals.

## Proposed Scalable Structure

Future implementation should move toward feature-based organization while keeping App Router conventions:

```text
app/
  page.tsx
  apis/
    [id]/
      page.tsx
  logs/
    page.tsx
  api/
    dashboard/
      route.ts
    apis/
      route.ts
      [id]/
        route.ts
        transactions/
          route.ts
    logs/
      route.ts
    realtime/
      route.ts
components/
  layout/
  ui/
features/
  dashboard/
  api-details/
  logs/
lib/
  prisma.ts
  repositories/
  services/
  dto/
  validation/
prisma/
  schema.prisma
  seed.ts
docs/
```

## Architectural Principles

- Preserve existing Stitch UI first, then refactor.
- Keep route pages thin and compose feature-level components.
- Use Server Components by default.
- Use Client Components only for browser behavior: filters, pagination state, refresh actions, and realtime subscription.
- Shape backend responses around screen needs, not speculative future features.
- Keep all persistence in PostgreSQL through Prisma.
- Avoid unused endpoints, unused models, and generic abstractions until needed.

## Planned Data Flow

1. Browser loads a Next route.
2. Route/server component calls a feature service or fetches an internal API contract.
3. Service reads data through repository modules.
4. Repositories use Prisma to query PostgreSQL.
5. DTO functions shape data for the exact UI widget contracts.
6. Client components handle local interactions and call API routes for filtered/paginated data.

## Realtime Approach

Use a simple Server-Sent Events endpoint for Phase 8:

- `GET /api/realtime`
- Event types: `activity`, `metrics`, `health`
- Dashboard subscribes through `EventSource`.
- Keep polling fallback for metrics if the SSE connection fails.

This avoids introducing WebSockets, Redis, queues, or a complex event system.

