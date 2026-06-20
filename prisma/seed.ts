import {
  AlertTone,
  ApiStatus,
  ChartKind,
  PrismaClient,
} from "@prisma/client";

const prisma = new PrismaClient();

function parseLatencyMs(value: string): number | null {
  if (value === "N/A") {
    return null;
  }

  const msMatch = value.match(/^(\d+(?:\.\d+)?)ms$/);
  if (msMatch) {
    return Math.round(parseFloat(msMatch[1]));
  }

  const secondsMatch = value.match(/^(\d+(?:\.\d+)?)s$/);
  if (secondsMatch) {
    return Math.round(parseFloat(secondsMatch[1]) * 1000);
  }

  return null;
}

function parseStatusCode(status: string): number {
  const match = status.match(/^(\d{3})/);
  return match ? Number.parseInt(match[1], 10) : 0;
}

function parseTimestamp(value: string, fallbackDate = "2024-01-15"): Date {
  if (/^\d{2}:\d{2}:\d{2}/.test(value)) {
    return new Date(`${fallbackDate}T${value}`);
  }

  if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(value)) {
    return new Date(`${value.replace(" ", "T")}Z`);
  }

  if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3}$/.test(value)) {
    return new Date(`${value.replace(" ", "T")}Z`);
  }

  return new Date(value);
}

const primaryApis = [
  {
    slug: "customer-api",
    name: "Customer API",
    baseUrl: "https://api.example.com/v1/customers",
    version: "v1.2.0",
    status: ApiStatus.HEALTHY,
    avgLatencyMs: 45,
    availabilityPercent: 100,
    requestsToday: 450_000,
    errorCount: 12,
    trafficSharePercent: 45,
  },
  {
    slug: "billing-api",
    name: "Billing API",
    baseUrl: "https://api.example.com/v2/billing",
    version: "v2.0.4",
    status: ApiStatus.HEALTHY,
    avgLatencyMs: 89,
    availabilityPercent: 99.9,
    requestsToday: 220_000,
    errorCount: 4,
    trafficSharePercent: 22,
  },
  {
    slug: "auth-api",
    name: "Auth API",
    baseUrl: "https://api.example.com/v1/auth",
    version: "v1.8.1",
    status: ApiStatus.WARNING,
    avgLatencyMs: 1200,
    availabilityPercent: 98.5,
    requestsToday: 180_000,
    errorCount: 28,
    trafficSharePercent: 12,
  },
  {
    slug: "order-api",
    name: "Order API",
    baseUrl: "https://api.example.com/v3/orders",
    version: "v3.1.2",
    status: ApiStatus.HEALTHY,
    avgLatencyMs: 120,
    availabilityPercent: 99.7,
    requestsToday: 160_000,
    errorCount: 6,
    trafficSharePercent: 10,
  },
  {
    slug: "notification-api",
    name: "Notification API",
    baseUrl: "https://api.example.com/v1/notifications",
    version: "v1.1.0",
    status: ApiStatus.DOWN,
    avgLatencyMs: null,
    availabilityPercent: 0,
    requestsToday: 0,
    errorCount: 120,
    trafficSharePercent: 0,
  },
  {
    slug: "payment-api",
    name: "Payment API",
    baseUrl: "https://api.example.com/v2/payments",
    version: "v2.4.4",
    status: ApiStatus.HEALTHY,
    avgLatencyMs: 67,
    availabilityPercent: 99.95,
    requestsToday: 190_000,
    errorCount: 3,
    trafficSharePercent: 11,
  },
] as const;

const stubApis = [
  {
    slug: "inventory-api",
    name: "Inventory API",
    baseUrl: "https://api.example.com/v1/inventory",
    version: "v1.0.3",
    status: ApiStatus.HEALTHY,
    avgLatencyMs: 95,
  },
  {
    slug: "catalog-api",
    name: "Catalog API",
    baseUrl: "https://api.example.com/v1/catalog",
    version: "v2.2.1",
    status: ApiStatus.HEALTHY,
    avgLatencyMs: 72,
  },
  {
    slug: "shipping-api",
    name: "Shipping API",
    baseUrl: "https://api.example.com/v1/shipping",
    version: "v1.4.0",
    status: ApiStatus.HEALTHY,
    avgLatencyMs: 110,
  },
  {
    slug: "analytics-api",
    name: "Analytics API",
    baseUrl: "https://api.example.com/v1/analytics",
    version: "v3.0.0",
    status: ApiStatus.HEALTHY,
    avgLatencyMs: 130,
  },
  {
    slug: "search-api",
    name: "Search API",
    baseUrl: "https://api.example.com/v1/search",
    version: "v2.1.5",
    status: ApiStatus.HEALTHY,
    avgLatencyMs: 58,
  },
  {
    slug: "legacy-api",
    name: "Legacy API",
    baseUrl: "https://api.example.com/v0/legacy",
    version: "v0.9.8",
    status: ApiStatus.DOWN,
    avgLatencyMs: null,
  },
] as const;

async function main() {
  const lastCheckedAt = new Date(Date.now() - 2 * 60 * 1000);

  await prisma.chartDataPoint.deleteMany();
  await prisma.requestLog.deleteMany();
  await prisma.alert.deleteMany();
  await prisma.monitoredApi.deleteMany();

  const apiRecords = await Promise.all(
    [...primaryApis, ...stubApis].map((api) =>
      prisma.monitoredApi.create({
        data: {
          slug: api.slug,
          name: api.name,
          baseUrl: api.baseUrl,
          version: api.version,
          status: api.status,
          avgLatencyMs: api.avgLatencyMs,
          lastCheckedAt,
          availabilityPercent:
            "availabilityPercent" in api ? api.availabilityPercent : 99.9,
          requestsToday: "requestsToday" in api ? api.requestsToday : 50_000,
          errorCount: "errorCount" in api ? api.errorCount : 1,
          trafficSharePercent:
            "trafficSharePercent" in api ? api.trafficSharePercent : null,
        },
      }),
    ),
  );

  const apiBySlug = Object.fromEntries(apiRecords.map((api) => [api.slug, api]));

  await prisma.alert.createMany({
    data: [
      {
        apiId: apiBySlug["notification-api"].id,
        title: "API Down: Notification Service",
        body: "Service unresponsive for 12m. High priority.",
        icon: "error",
        tone: AlertTone.ERROR,
      },
      {
        apiId: apiBySlug["auth-api"].id,
        title: "High Latency: Auth Service",
        body: "Latency spiked to 1.2s. Affecting 15% of sessions.",
        icon: "warning",
        tone: AlertTone.WARNING,
      },
    ],
  });

  const dashboardTrend = [40, 45, 60, 85, 50];
  const trafficDistribution = [
    { label: "Customer API", value: 45 },
    { label: "Billing API", value: 22 },
  ];
  const customerResponseTrend = [40, 45, 42, 38, 55, 48, 50, 62, 45, 35, 30, 40];
  const customerErrorRate = [16, 32, 12, 48, 8, 20, 12, 16];

  await prisma.chartDataPoint.createMany({
    data: [
      ...dashboardTrend.map((value, sequence) => ({
        chartKind: ChartKind.DASHBOARD_RESPONSE_TREND,
        value,
        sequence,
      })),
      ...trafficDistribution.map(({ label, value }, sequence) => ({
        chartKind: ChartKind.TRAFFIC_DISTRIBUTION,
        label,
        value,
        sequence,
      })),
      ...customerResponseTrend.map((value, sequence) => ({
        apiId: apiBySlug["customer-api"].id,
        chartKind: ChartKind.RESPONSE_TREND,
        value,
        sequence,
      })),
      ...customerErrorRate.map((value, sequence) => ({
        apiId: apiBySlug["customer-api"].id,
        chartKind: ChartKind.ERROR_RATE,
        value,
        sequence,
      })),
    ],
  });

  const dashboardActivity = [
    {
      timestamp: "14:23:45.021",
      method: "GET",
      endpoint: "/users/u_9102/profile",
      status: "200 OK",
      responseTime: "12ms",
      apiSlug: "customer-api",
    },
    {
      timestamp: "14:23:44.912",
      method: "POST",
      endpoint: "/orders/checkout",
      status: "201 Created",
      responseTime: "245ms",
      apiSlug: "order-api",
    },
    {
      timestamp: "14:23:44.801",
      method: "DELETE",
      endpoint: "/notifications/clear",
      status: "500 Server Error",
      responseTime: "1502ms",
      apiSlug: "notification-api",
    },
  ] as const;

  const customerTransactions = [
    {
      timestamp: "2023-10-27 14:22:01",
      method: "GET",
      endpoint: "/customers/c_00129",
      status: "200 OK",
      latency: "142ms",
    },
    {
      timestamp: "2023-10-27 14:21:58",
      method: "POST",
      endpoint: "/customers/register",
      status: "201 Created",
      latency: "285ms",
    },
    {
      timestamp: "2023-10-27 14:21:45",
      method: "GET",
      endpoint: "/customers/search?q=Smith",
      status: "500 Error",
      latency: "1.2s",
    },
    {
      timestamp: "2023-10-27 14:21:30",
      method: "PATCH",
      endpoint: "/customers/c_00129/address",
      status: "200 OK",
      latency: "198ms",
    },
    {
      timestamp: "2023-10-27 14:21:12",
      method: "GET",
      endpoint: "/customers/c_00135",
      status: "404 Not Found",
      latency: "45ms",
    },
  ] as const;

  const developerLogs = [
    {
      timestamp: "2023-11-20 14:32:11.042",
      endpoint: "GET /api/v1/user/profile",
      message: "Successfully retrieved user profile for UID: 84291-BA.",
      status: "200 OK",
      latency: "42ms",
      apiSlug: "customer-api",
    },
    {
      timestamp: "2023-11-20 14:32:09.115",
      endpoint: "POST /api/v1/auth/login",
      message: "Authentication failure. Invalid credential set.",
      status: "401 Unauthorized",
      latency: "118ms",
      apiSlug: "auth-api",
    },
    {
      timestamp: "2023-11-20 14:31:42.004",
      endpoint: "GET /api/internal/health",
      message: "CRITICAL: Connection pool exhausted.",
      status: "503 Unavailable",
      latency: "5000ms",
      apiSlug: "notification-api",
    },
  ] as const;

  await prisma.requestLog.createMany({
    data: [
      ...dashboardActivity.map((entry) => ({
        apiId: apiBySlug[entry.apiSlug].id,
        occurredAt: parseTimestamp(entry.timestamp),
        httpMethod: entry.method,
        path: entry.endpoint,
        statusCode: parseStatusCode(entry.status),
        statusLabel: entry.status,
        latencyMs: parseLatencyMs(entry.responseTime) ?? 0,
      })),
      ...customerTransactions.map((entry) => ({
        apiId: apiBySlug["customer-api"].id,
        occurredAt: parseTimestamp(entry.timestamp),
        httpMethod: entry.method,
        path: entry.endpoint,
        statusCode: parseStatusCode(entry.status),
        statusLabel: entry.status,
        latencyMs: parseLatencyMs(entry.latency) ?? 0,
      })),
      ...developerLogs.map((entry) => ({
        apiId: apiBySlug[entry.apiSlug].id,
        occurredAt: parseTimestamp(entry.timestamp),
        path: entry.endpoint.split(" ").slice(1).join(" ") || entry.endpoint,
        endpoint: entry.endpoint,
        message: entry.message,
        httpMethod: entry.endpoint.split(" ")[0] ?? null,
        statusCode: parseStatusCode(entry.status),
        statusLabel: entry.status,
        latencyMs: parseLatencyMs(entry.latency) ?? 0,
      })),
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
