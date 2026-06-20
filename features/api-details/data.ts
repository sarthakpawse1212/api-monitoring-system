export type Transaction = {
  timestamp: string;
  method: string;
  endpoint: string;
  status: string;
  statusKind: "success" | "error" | "neutral";
  latency: string;
};

// Static DTO-shaped data mirrors the future /api/apis/:id response contract.
export const apiDetailsData = {
  id: "customer-api",
  name: "Customer API",
  url: "https://api.example.com/v1/customers",
  status: "Healthy",
  lastChecked: "2m ago",
  metrics: [
    {
      label: "Availability",
      value: "100%",
      footer: "No downtime in 30 days",
      accent: "success" as const,
      icon: "check_circle",
    },
    {
      label: "Avg Response Time",
      value: "180ms",
      footer: "Stable latency trend",
      accent: "secondary" as const,
      icon: "speed",
    },
    {
      label: "Requests Today",
      value: "450k",
      footer: "Up 12% from yesterday",
      accent: "muted" as const,
      icon: "lan",
    },
    {
      label: "Error Count",
      value: "12",
      footer: "Critical threshold: 50",
      accent: "error" as const,
      icon: "error_outline",
    },
  ],
  responseTrend: [40, 45, 42, 38, 55, 48, 50, 62, 45, 35, 30, 40],
  errorRate: [16, 32, 12, 48, 8, 20, 12, 16],
  transactions: [
    {
      timestamp: "2023-10-27 14:22:01",
      method: "GET",
      endpoint: "/customers/c_00129",
      status: "200 OK",
      statusKind: "success" as const,
      latency: "142ms",
    },
    {
      timestamp: "2023-10-27 14:21:58",
      method: "POST",
      endpoint: "/customers/register",
      status: "201 Created",
      statusKind: "success" as const,
      latency: "285ms",
    },
    {
      timestamp: "2023-10-27 14:21:45",
      method: "GET",
      endpoint: "/customers/search?q=Smith",
      status: "500 Error",
      statusKind: "error" as const,
      latency: "1.2s",
    },
    {
      timestamp: "2023-10-27 14:21:30",
      method: "PATCH",
      endpoint: "/customers/c_00129/address",
      status: "200 OK",
      statusKind: "success" as const,
      latency: "198ms",
    },
    {
      timestamp: "2023-10-27 14:21:12",
      method: "GET",
      endpoint: "/customers/c_00135",
      status: "404 Not Found",
      statusKind: "neutral" as const,
      latency: "45ms",
    },
  ],
};
