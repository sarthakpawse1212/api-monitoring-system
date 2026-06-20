import { MonitoredApi } from "@prisma/client";

/**
 * Common DTO functions used across multiple screens.
 */

export type ApiSummaryDTO = {
  id: string;
  slug: string;
  name: string;
  version: string;
  status: "HEALTHY" | "WARNING" | "DOWN";
  avgLatencyMs: number | null;
  baseUrl: string;
};

/**
 * Shape API list for filters and navigation.
 */
export function toApiSummaries(
  apis: Array<{
    id: string;
    slug: string;
    name: string;
    version: string;
    status: "HEALTHY" | "WARNING" | "DOWN";
    avgLatencyMs: number | null;
    baseUrl: string;
  }>
): ApiSummaryDTO[] {
  return apis.map((api) => ({
    id: api.id,
    slug: api.slug,
    name: api.name,
    version: api.version,
    status: api.status,
    avgLatencyMs: api.avgLatencyMs,
    baseUrl: api.baseUrl,
  }));
}

/**
 * Format timestamp to relative time.
 */
export function toRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

/**
 * Format latency value.
 */
export function formatLatency(ms: number | null | undefined): string {
  if (ms === null || ms === undefined) return "N/A";
  if (ms >= 1000) return `${(ms / 1000).toFixed(1)}s`;
  return `${ms}ms`;
}

/**
 * Format large numbers with k/M suffix.
 */
export function formatNumber(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}k`;
  return num.toString();
}

/**
 * Determine status kind from status code.
 */
export function getStatusKind(
  statusCode: number
): "success" | "client-error" | "server-error" | "neutral" {
  if (statusCode >= 200 && statusCode < 300) return "success";
  if (statusCode >= 400 && statusCode < 500) return "client-error";
  if (statusCode >= 500) return "server-error";
  return "neutral";
}
