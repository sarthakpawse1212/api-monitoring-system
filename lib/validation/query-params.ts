/**
 * Query parameter validation and sanitization utilities.
 */

export type LogsQueryParams = {
  search?: string;
  status?: string;
  serviceId?: string;
  timeRange?: string;
  page?: number;
  pageSize?: number;
};

/**
 * Validate and sanitize logs query parameters.
 */
export function validateLogsQuery(searchParams: URLSearchParams): LogsQueryParams {
  const result: LogsQueryParams = {};

  // Search parameter
  const search = searchParams.get("search");
  if (search && search.trim().length > 0) {
    result.search = search.trim().substring(0, 200); // Limit length
  }

  // Status parameter
  const status = searchParams.get("status");
  const validStatuses = ["success", "client-error", "server-error"];
  if (status && (validStatuses.includes(status) || !isNaN(parseInt(status)))) {
    result.status = status;
  }

  // Service/API ID parameter
  const serviceId = searchParams.get("serviceId") || searchParams.get("apiId");
  if (serviceId && serviceId.trim().length > 0) {
    result.serviceId = serviceId.trim();
  }

  // Time range parameter
  const timeRange = searchParams.get("timeRange");
  const validTimeRanges = ["1h", "24h", "7d", "30d"];
  if (timeRange && validTimeRanges.includes(timeRange)) {
    result.timeRange = timeRange;
  }

  // Page parameter
  const page = searchParams.get("page");
  if (page) {
    const pageNum = parseInt(page, 10);
    if (!isNaN(pageNum) && pageNum > 0) {
      result.page = Math.min(pageNum, 10000); // Max page limit
    }
  }

  // Page size parameter
  const pageSize = searchParams.get("pageSize");
  if (pageSize) {
    const pageSizeNum = parseInt(pageSize, 10);
    if (!isNaN(pageSizeNum) && pageSizeNum > 0) {
      result.pageSize = Math.min(pageSizeNum, 100); // Max 100 items per page
    }
  }

  return result;
}

/**
 * Validate API slug or ID parameter.
 */
export function validateApiId(slugOrId: string): string | null {
  if (!slugOrId || slugOrId.trim().length === 0) {
    return null;
  }

  const trimmed = slugOrId.trim();

  // Allow alphanumeric, hyphens, underscores, and CUID format
  if (/^[a-zA-Z0-9_-]+$/.test(trimmed) && trimmed.length <= 100) {
    return trimmed;
  }

  return null;
}

/**
 * Validate pagination parameters with defaults.
 */
export function validatePagination(
  page?: number | string,
  pageSize?: number | string
): { page: number; pageSize: number } {
  let validPage = 1;
  let validPageSize = 20;

  if (typeof page === "string") {
    const parsed = parseInt(page, 10);
    if (!isNaN(parsed) && parsed > 0) {
      validPage = Math.min(parsed, 10000);
    }
  } else if (typeof page === "number" && page > 0) {
    validPage = Math.min(page, 10000);
  }

  if (typeof pageSize === "string") {
    const parsed = parseInt(pageSize, 10);
    if (!isNaN(parsed) && parsed > 0) {
      validPageSize = Math.min(parsed, 100);
    }
  } else if (typeof pageSize === "number" && pageSize > 0) {
    validPageSize = Math.min(pageSize, 100);
  }

  return { page: validPage, pageSize: validPageSize };
}

/**
 * Sanitize search string for database queries.
 */
export function sanitizeSearchString(search: string | null | undefined): string | undefined {
  if (!search || search.trim().length === 0) {
    return undefined;
  }

  // Trim, limit length, and remove dangerous characters
  return search
    .trim()
    .substring(0, 200)
    .replace(/[<>]/g, ""); // Basic XSS prevention
}

/**
 * Validate time range parameter.
 */
export function validateTimeRange(timeRange: string | null | undefined): string | undefined {
  if (!timeRange) {
    return undefined;
  }

  const validRanges = ["1h", "24h", "7d", "30d"];
  return validRanges.includes(timeRange) ? timeRange : undefined;
}
