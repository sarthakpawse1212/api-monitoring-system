import { MonitoredApi, RequestLog } from "@prisma/client";

/**
 * DTO functions to shape database results for the API details screen.
 */

export type ApiHeaderDTO = {
  id: string;
  name: string;
  url: string;
  status: string;
  lastChecked: string;
};

export type ApiMetricDTO = {
  label: string;
  value: string;
  footer: string;
  accent: "success" | "secondary" | "muted" | "error";
  icon: string;
};

export type TransactionDTO = {
  timestamp: string;
  method: string;
  endpoint: string;
  status: string;
  statusKind: "success" | "error" | "neutral";
  latency: string;
};

/**
 * Shape API header information.
 */
export function toApiHeader(api: MonitoredApi): ApiHeaderDTO {
  const now = new Date();
  const lastChecked = new Date(api.lastCheckedAt);
  const minutesAgo = Math.floor((now.getTime() - lastChecked.getTime()) / 60000);

  let lastCheckedStr: string;
  if (minutesAgo < 1) {
    lastCheckedStr = "Just now";
  } else if (minutesAgo < 60) {
    lastCheckedStr = `${minutesAgo}m ago`;
  } else {
    const hoursAgo = Math.floor(minutesAgo / 60);
    lastCheckedStr = `${hoursAgo}h ago`;
  }

  return {
    id: api.slug,
    name: api.name,
    url: api.baseUrl,
    status: api.status === "HEALTHY" ? "Healthy" : api.status === "WARNING" ? "Warning" : "Down",
    lastChecked: lastCheckedStr,
  };
}

/**
 * Shape API metrics cards.
 */
export function toApiMetrics(api: MonitoredApi): ApiMetricDTO[] {
  const availability = api.availabilityPercent || 100;
  const avgResponseTime = api.avgLatencyMs || 0;
  const requestsToday = api.requestsToday || 0;
  const errorCount = api.errorCount || 0;

  const formatNumber = (num: number): string => {
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
    if (num >= 1_000) return `${(num / 1_000).toFixed(0)}k`;
    return num.toString();
  };

  return [
    {
      label: "Availability",
      value: `${availability.toFixed(1)}%`,
      footer: availability >= 99.9 ? "No downtime in 30 days" : "Some downtime detected",
      accent: availability >= 99 ? "success" : "error",
      icon: "check_circle",
    },
    {
      label: "Avg Response Time",
      value: `${avgResponseTime}ms`,
      footer: avgResponseTime < 200 ? "Stable latency trend" : "Latency above target",
      accent: "secondary",
      icon: "speed",
    },
    {
      label: "Requests Today",
      value: formatNumber(requestsToday),
      footer: "Up 12% from yesterday",
      accent: "muted",
      icon: "lan",
    },
    {
      label: "Error Count",
      value: errorCount.toString(),
      footer: `Critical threshold: 50`,
      accent: errorCount > 50 ? "error" : "muted",
      icon: "error_outline",
    },
  ];
}

/**
 * Shape transactions table.
 */
export function toTransactions(
  logs: {
    occurredAt: Date;
    httpMethod: string | null;
    endpoint: string | null;
    statusCode: number;
    statusLabel: string;
    latencyMs: number;
  }[]
): TransactionDTO[] {
  return logs.map((log) => {
    const timestamp = new Date(log.occurredAt);
    const dateStr = timestamp.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    const timeStr = timestamp.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    let statusKind: "success" | "error" | "neutral";
    if (log.statusCode >= 200 && log.statusCode < 300) {
      statusKind = "success";
    } else if (log.statusCode >= 500) {
      statusKind = "error";
    } else if (log.statusCode >= 400) {
      statusKind = "neutral";
    } else {
      statusKind = "neutral";
    }

    const latencyStr =
      log.latencyMs >= 1000
        ? `${(log.latencyMs / 1000).toFixed(1)}s`
        : `${log.latencyMs}ms`;

    return {
      timestamp: `${dateStr} ${timeStr}`,
      method: log.httpMethod || "GET",
      endpoint: log.endpoint || "/",
      status: log.statusLabel,
      statusKind,
      latency: latencyStr,
    };
  });
}

/**
 * Shape chart data points to simple number array.
 */
export function toChartSeries(
  points: { value: number; sequence: number }[]
): number[] {
  return points.map((p) => p.value);
}
