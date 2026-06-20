import { MonitoredApi, RequestLog, Alert } from "@prisma/client";

/**
 * DTO functions to shape database results for the dashboard screen.
 */

export type DashboardMetricDTO = {
  label: string;
  value: string;
  footer: string;
  accent?: "success" | "error" | "warning";
};

export type ServiceStatusDTO = {
  name: string;
  version: string;
  latency: string;
  status: "HEALTHY" | "WARNING" | "DOWN";
};

export type ActivityDTO = {
  timestamp: string;
  method: string;
  endpoint: string;
  status: string;
  statusKind: "success" | "error";
  responseTime: string;
};

export type AlertDTO = {
  title: string;
  body: string;
  icon: string;
  tone: "error" | "warning" | "info";
};

export type TrafficDistributionDTO = {
  label: string;
  value: number;
};

/**
 * Shape dashboard metrics from database summary.
 */
export function toDashboardMetrics(summary: {
  totalCount: number;
  healthyCount: number;
  downCount: number;
  avgLatencyMs: number;
  requestsToday: number;
}): DashboardMetricDTO[] {
  const formatNumber = (num: number): string => {
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
    if (num >= 1_000) return `${(num / 1_000).toFixed(1)}k`;
    return num.toString();
  };

  return [
    {
      label: "Total APIs",
      value: summary.totalCount.toString(),
      footer: "+2 New",
    },
    {
      label: "Healthy",
      value: summary.healthyCount.toString(),
      footer: "Optimal",
      accent: "success",
    },
    {
      label: "Down",
      value: summary.downCount.toString(),
      footer: summary.downCount > 0 ? "Critical" : "All systems operational",
      accent: summary.downCount > 0 ? "error" : undefined,
    },
    {
      label: "Requests Today",
      value: formatNumber(summary.requestsToday),
      footer: "Avg 50k/hr",
    },
    {
      label: "Avg Response",
      value: `${Math.round(summary.avgLatencyMs)}ms`,
      footer: "-12ms vs avg",
    },
    {
      label: "Uptime",
      value: "99.98%",
      footer: "Last 30 Days",
    },
  ];
}

/**
 * Shape API status board from monitored APIs.
 */
export function toServiceStatus(
  apis: Array<{
    name: string;
    version: string;
    status: "HEALTHY" | "WARNING" | "DOWN";
    avgLatencyMs: number | null;
  }>
): ServiceStatusDTO[] {
  return apis.map((api) => ({
    name: api.name,
    version: api.version,
    latency: api.avgLatencyMs ? `${api.avgLatencyMs}ms` : "N/A",
    status: api.status,
  }));
}

/**
 * Shape activity feed from request logs.
 */
export function toActivityFeed(
  logs: (RequestLog & { api: { name: string; slug: string } | null })[]
): ActivityDTO[] {
  return logs.map((log) => {
    const timestamp = new Date(log.occurredAt);
    const timeStr = timestamp.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    const ms = timestamp.getMilliseconds().toString().padStart(3, "0");

    const isSuccess = log.statusCode >= 200 && log.statusCode < 300;

    return {
      timestamp: `${timeStr}.${ms}`,
      method: log.httpMethod || "GET",
      endpoint: log.endpoint || log.path,
      status: log.statusLabel,
      statusKind: isSuccess ? "success" : "error",
      responseTime: `${log.latencyMs}ms`,
    };
  });
}

/**
 * Shape alerts for the dashboard.
 */
export function toAlertCards(
  alerts: (Alert & { api: { name: string; slug: string } | null })[]
): AlertDTO[] {
  return alerts.map((alert) => ({
    title: alert.title,
    body: alert.body,
    icon: alert.icon,
    tone: alert.tone.toLowerCase() as "error" | "warning" | "info",
  }));
}

/**
 * Shape traffic distribution data.
 */
export function toTrafficDistribution(
  apis: { name: string; trafficSharePercent: number | null }[]
): TrafficDistributionDTO[] {
  return apis
    .filter((api) => api.trafficSharePercent !== null)
    .map((api) => ({
      label: api.name,
      value: api.trafficSharePercent!,
    }));
}

/**
 * Shape chart data points to simple number array.
 */
export function toChartValues(
  points: { value: number; sequence: number }[]
): number[] {
  return points.map((p) => p.value);
}

/**
 * Calculate success rate percentage.
 */
export function formatSuccessRate(rate: number): number {
  return Math.round(rate * 100) / 100;
}
