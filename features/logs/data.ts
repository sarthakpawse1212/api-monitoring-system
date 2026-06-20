export type LogEntry = {
  timestamp: string;
  endpoint: string;
  message: string;
  status: string;
  statusKind: "success" | "client-error" | "server-error";
  latency: string;
};

// Static DTO-shaped data mirrors the future /api/logs response contract.
export const logsData = {
  logs: [
    {
      timestamp: "2023-11-20 14:32:11.042",
      endpoint: "GET /api/v1/user/profile",
      message: "Successfully retrieved user profile for UID: 84291-BA.",
      status: "200 OK",
      statusKind: "success" as const,
      latency: "42ms",
    },
    {
      timestamp: "2023-11-20 14:32:09.115",
      endpoint: "POST /api/v1/auth/login",
      message: "Authentication failure. Invalid credential set.",
      status: "401 Unauthorized",
      statusKind: "client-error" as const,
      latency: "118ms",
    },
    {
      timestamp: "2023-11-20 14:31:42.004",
      endpoint: "GET /api/internal/health",
      message: "CRITICAL: Connection pool exhausted.",
      status: "503 Unavailable",
      statusKind: "server-error" as const,
      latency: "5000ms",
    },
  ],
  stats: [
    {
      label: "Average Latency",
      value: "142",
      unit: "ms",
      footer: "-12% from last hour",
      icon: "speed",
      accent: "success" as const,
    },
    {
      label: "Error Rate (5xx)",
      value: "0.42",
      unit: "%",
      footer: "+0.05% spike detected",
      icon: "report",
      accent: "error" as const,
    },
    {
      label: "Total Requests",
      value: "84.2",
      unit: "k",
      footer: "Consistent with baseline",
      icon: "data_usage",
      accent: "secondary" as const,
    },
  ],
};
