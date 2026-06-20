# API Contracts

## Current State

No backend API routes exist yet. This document records the planned contracts only. Backend implementation is deferred to later phases.

## Contract Principles

- Create only endpoints needed by the current screens.
- Return screen-shaped DTOs.
- Avoid generic CRUD endpoints unless the UI needs them.
- Keep query parsing lightweight and explicit.
- Use JSON for normal API responses.
- Use Server-Sent Events only for the realtime dashboard stream.

## Planned Endpoints

### `GET /api/dashboard`

Returns all data needed by the dashboard screen:

- Dashboard metrics.
- API status board.
- Live activity feed.
- Recent alerts.
- Success rate.
- Traffic distribution.
- Response trend.

### `GET /api/apis`

Returns API/service summaries:

- ID or slug.
- Display name.
- Version.
- Current status.
- Average response time.
- Base URL.

This supports navigation and service/API filters.

### `GET /api/apis/:id`

Returns one API details screen:

- API header metadata.
- Overview metrics.
- Response time trend.
- Request volume.
- Error rate.

Missing APIs should return `404`.

### `GET /api/apis/:id/transactions`

Returns recent transactions for one API:

- Timestamp.
- Method.
- Endpoint path.
- Status code and label.
- Latency.
- Pagination metadata if pagination is implemented.

Missing APIs should return `404`.

### `GET /api/logs`

Returns filtered developer logs:

Query parameters planned:

- `search`
- `status`
- `serviceId`
- `timeRange`
- `page`
- `pageSize`

Response should include:

- Logs.
- Pagination metadata.
- Average latency.
- Error rate.
- Total requests.

### `GET /api/realtime`

Returns a `text/event-stream` response.

Planned event types:

- `activity`
- `metrics`
- `health`

This endpoint should stay simple and dashboard-focused.

## Deferred Work

Exact TypeScript DTOs, validation helpers, status code behavior, and repository/service implementation are deferred to backend phases.

