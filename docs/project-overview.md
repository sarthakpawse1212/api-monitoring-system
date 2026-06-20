# Project Overview

## Current State

Pulse Monitor Pro is an existing Next.js application intended to become an API monitoring platform. The repository is not greenfield. It already contains a Next.js 16 app scaffold, TypeScript configuration, Tailwind CSS v4 setup, and three Google Stitch generated screen exports.

The live Next app is currently minimal:

- `app/layout.tsx` defines the root HTML/body shell using Geist fonts.
- `app/page.tsx` renders a placeholder `<h1>Sarthak</h1>`.
- `app/globals.css` contains the default Tailwind import and basic background/foreground variables.

The real product UI is currently isolated in generated Stitch folders under `stitch_api_pulse_monitor_dashboard/`.

## Existing Stitch Screens

1. Dashboard Overview
   - Source: `stitch_api_pulse_monitor_dashboard/overview_dashboard_v2/code.html`
   - Screenshot: `stitch_api_pulse_monitor_dashboard/overview_dashboard_v2/screen.png`
   - Intended route: `/`
   - Visible widgets: KPI metrics, system status board, live stream activity table, recent alerts, success rate chart, traffic distribution, response trend.

2. API Details: Customer API
   - Source: `stitch_api_pulse_monitor_dashboard/api_details_customer_api_v2/code.html`
   - Screenshot: `stitch_api_pulse_monitor_dashboard/api_details_customer_api_v2/screen.png`
   - Intended route: `/apis/[id]`
   - Visible widgets: API header, overview metrics, response time trend, request volume, error rate, recent transactions table.

3. Developer Logs
   - Source: `stitch_api_pulse_monitor_dashboard/api_logs_viewer_v2/code.html`
   - Screenshot: `stitch_api_pulse_monitor_dashboard/api_logs_viewer_v2/screen.png`
   - Intended route: `/logs`
   - Visible widgets: page header, search/filter controls, logs table, pagination, average latency, error rate, total requests.

## Design Source Of Truth

The Stitch screens and `stitch_api_pulse_monitor_dashboard/api_pulse_monitor/DESIGN.md` are the frontend source of truth. Future work should preserve the current visual language and refactor generated HTML gradually into maintainable React components.

Important design characteristics:

- Corporate, dense monitoring dashboard style.
- Fixed desktop sidebar width of 260px.
- Soft blue-tinted background with white cards.
- Bento cards with subtle borders and shadows.
- Emerald, orange, and red status colors for healthy, warning, and down/error states.
- Inter for UI text and JetBrains Mono for timestamps, paths, and log-like data.
- Material Symbols are used by the generated HTML; future implementation may keep them through font loading or replace them consistently with an icon library if approved.

## Product Scope

Only functionality visible in the current Stitch screens should be implemented:

- Dashboard metrics and activity.
- API details and transactions.
- Developer logs with filters and pagination.
- Simple realtime support for dashboard activity, metric refresh, and API health changes.

Out of scope:

- Login, registration, auth, RBAC, user management, multi-tenancy.
- Notifications, email, third-party integrations.
- Kubernetes or complex DevOps.
- Additional databases, Redis, Elasticsearch, MongoDB.

