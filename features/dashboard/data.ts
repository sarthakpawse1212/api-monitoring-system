export type DashboardActivity = {
  timestamp: string;
  method: string;
  endpoint: string;
  status: string;
  statusKind: "success" | "error";
  responseTime: string;
};

// Static DTO-shaped data mirrors the future /api/dashboard response contract.
export const dashboardData = {
  metrics: [
    { label: "Total APIs", value: "12", footer: "+2 New" },
    { label: "Healthy", value: "10", footer: "Optimal", accent: "success" as const },
    { label: "Down", value: "2", footer: "Critical", accent: "error" as const },
    { label: "Requests Today", value: "1.2M", footer: "Avg 50k/hr" },
    { label: "Avg Response", value: "245ms", footer: "-12ms vs avg" },
    { label: "Uptime", value: "99.98%", footer: "Last 30 Days" },
  ],
  services: [
    { name: "Customer", version: "v1.2.0", latency: "45ms", status: "HEALTHY" },
    { name: "Billing", version: "v2.0.4", latency: "89ms", status: "HEALTHY" },
    { name: "Auth", version: "v1.8.1", latency: "1.2s", status: "WARNING" },
    { name: "Order", version: "v3.1.2", latency: "120ms", status: "HEALTHY" },
    { name: "Notification", version: "v1.1.0", latency: "N/A", status: "DOWN" },
    { name: "Payment", version: "v2.4.4", latency: "67ms", status: "HEALTHY" },
  ],
  activity: [
    {
      timestamp: "14:23:45.021",
      method: "GET",
      endpoint: "/users/u_9102/profile",
      status: "200 OK",
      statusKind: "success" as const,
      responseTime: "12ms",
    },
    {
      timestamp: "14:23:44.912",
      method: "POST",
      endpoint: "/orders/checkout",
      status: "201 Created",
      statusKind: "success" as const,
      responseTime: "245ms",
    },
    {
      timestamp: "14:23:44.801",
      method: "DELETE",
      endpoint: "/notifications/clear",
      status: "500 Server Error",
      statusKind: "error" as const,
      responseTime: "1502ms",
    },
  ],
  alerts: [
    {
      title: "API Down: Notification Service",
      body: "Service unresponsive for 12m. High priority.",
      icon: "error",
      tone: "error" as const,
    },
    {
      title: "High Latency: Auth Service",
      body: "Latency spiked to 1.2s. Affecting 15% of sessions.",
      icon: "warning",
      tone: "warning" as const,
    },
  ],
  distribution: [
    { label: "Customer API", value: 45 },
    { label: "Billing API", value: 22 },
  ],
  trend: [40, 45, 60, 85, 50],
};
