import { RequestLog } from "@prisma/client";

/**
 * DTO functions to shape database results for the logs screen.
 */

export type LogEntryDTO = {
  timestamp: string;
  endpoint: string;
  message: string;
  status: string;
  statusKind: "success" | "client-error" | "server-error";
  latency: string;
};

export type LogStatsDTO = {
  label: string;
  value: string;
  unit: string;
  footer: string;
  icon: string;
  accent: "success" | "error" | "secondary";
};

export type PaginationDTO = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

/**
 * Shape log entries for the logs table.
 */
export function toLogEntries(
  logs: (RequestLog & { api: { name: string; slug: string } | null })[]
): LogEntryDTO[] {
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
    const ms = timestamp.getMilliseconds().toString().padStart(3, "0");

    let statusKind: "success" | "client-error" | "server-error";
    if (log.statusCode >= 200 && log.statusCode < 300) {
      statusKind = "success";
    } else if (log.statusCode >= 400 && log.statusCode < 500) {
      statusKind = "client-error";
    } else {
      statusKind = "server-error";
    }

    const method = log.httpMethod || "GET";
    const path = log.endpoint || log.path;
    const endpointStr = `${method} ${path}`;

    const message = log.message || `Request processed with status ${log.statusCode}`;

    const latencyStr =
      log.latencyMs >= 1000
        ? `${log.latencyMs}ms`
        : `${log.latencyMs}ms`;

    return {
      timestamp: `${dateStr} ${timeStr}.${ms}`,
      endpoint: endpointStr,
      message,
      status: log.statusLabel,
      statusKind,
      latency: latencyStr,
    };
  });
}

/**
 * Shape log statistics cards.
 */
export function toLogStats(stats: {
  totalCount: number;
  avgLatencyMs: number;
  errorRate: number;
  errorCount: number;
}): LogStatsDTO[] {
  return [
    {
      label: "Average Latency",
      value: Math.round(stats.avgLatencyMs).toString(),
      unit: "ms",
      footer: "-12% from last hour",
      icon: "speed",
      accent: "success",
    },
    {
      label: "Error Rate (5xx)",
      value: stats.errorRate.toFixed(2),
      unit: "%",
      footer: stats.errorRate > 1 ? "+spike detected" : "Within normal range",
      icon: "report",
      accent: stats.errorRate > 1 ? "error" : "success",
    },
    {
      label: "Total Requests",
      value:
        stats.totalCount >= 1000
          ? (stats.totalCount / 1000).toFixed(1)
          : stats.totalCount.toString(),
      unit: stats.totalCount >= 1000 ? "k" : "",
      footer: "Consistent with baseline",
      icon: "data_usage",
      accent: "secondary",
    },
  ];
}

/**
 * Shape pagination metadata.
 */
export function toPagination(
  page: number,
  pageSize: number,
  total: number
): PaginationDTO {
  return {
    page,
    pageSize,
    total,
    totalPages: Math.ceil(total / pageSize),
  };
}
