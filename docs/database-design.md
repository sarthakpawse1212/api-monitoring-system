# Database Design

## Current State

No database schema exists yet. Prisma is not installed or configured. There is no `prisma/` folder and no backend data layer.

## Database Requirements

Future implementation must use:

- PostgreSQL only.
- Prisma ORM only.
- A single database architecture.

Do not add:

- Redis.
- Elasticsearch.
- MongoDB.
- Additional persistence engines.

## Planned Data Model Concepts

The schema should be introduced in a later phase, not during Phase 1. Based on the visible screens, the minimum domain concepts are:

- API/service monitor
  - Name, slug or stable ID, base URL, version, status, last checked time.
- Health/metric rollup
  - Availability, average response time, requests today, error count, uptime, success rate, traffic share.
- Transaction/log event
  - Timestamp, service/API, HTTP method, endpoint path, status code, status text, latency, message or trace detail.
- Optional chart series rows or generated rollups
  - Response trend, request volume, error rate, traffic distribution.

## Screen Data Needs

Dashboard:

- Total APIs.
- Healthy APIs.
- Down APIs.
- Requests today.
- Average response time.
- Uptime percentage.
- API status board.
- Live activity feed.
- Success rate.
- Traffic distribution.
- Response trend.
- Recent alerts derived from status/error conditions.

API Details:

- API header metadata.
- Availability.
- Average response time.
- Requests today.
- Error count.
- Response time trend.
- Request volume.
- Error rate.
- Recent transactions.

Developer Logs:

- Logs table.
- Search by endpoint, message, trace-like text.
- Filter by service/API.
- Filter by status family or status code.
- Filter by time range.
- Pagination.
- Average latency.
- Error rate.
- Total requests.

## Seed Data Guidance

Seed data should mirror the Stitch screens so the first connected implementation visually matches the generated UI. Suggested seed services include Customer, Billing, Auth, Order, Notification, and Payment, with mixed healthy, warning, and down states.

## Deferred Decisions

These should be decided in the database phase:

- Exact Prisma model names and field names.
- Whether chart series are stored directly or derived from transaction events.
- Indexing strategy for log filters.
- Pagination implementation details.

