import { requestLogRepository } from "../repositories/request-log.repository";
import { monitoredApiRepository } from "../repositories/monitored-api.repository";
import { toLogEntries, toLogStats, toPagination } from "../dto/logs.dto";
import { toApiSummaries } from "../dto/common.dto";
import type { LogsQueryParams } from "../validation/query-params";

/**
 * Logs service.
 * Orchestrates data fetching and transformation for the logs screen.
 */
export const logsService = {
  /**
   * Get filtered logs with stats and pagination.
   */
  async getFilteredLogs(params: LogsQueryParams) {
    // Resolve API slug to ID if provided
    let apiId: string | undefined;
    if (params.serviceId) {
      const api = await monitoredApiRepository.findBySlugOrId(params.serviceId);
      apiId = api?.id;
    }

    // Fetch logs and stats in parallel
    const [logsResult, stats] = await Promise.all([
      requestLogRepository.getFilteredLogs({
        search: params.search,
        status: params.status,
        apiId,
        timeRange: params.timeRange,
        page: params.page || 1,
        pageSize: params.pageSize || 20,
      }),
      requestLogRepository.getLogStats({
        search: params.search,
        status: params.status,
        apiId,
        timeRange: params.timeRange,
      }),
    ]);

    // Transform data using DTOs
    return {
      logs: toLogEntries(logsResult.logs),
      stats: toLogStats(stats),
      pagination: toPagination(
        logsResult.page,
        logsResult.pageSize,
        logsResult.total
      ),
    };
  },

  /**
   * Get API list for the service filter dropdown.
   */
  async getApiList() {
    const apis = await monitoredApiRepository.findAll();
    return toApiSummaries(apis);
  },

  /**
   * Get only log stats (for real-time updates).
   */
  async getLogStats(params: Pick<LogsQueryParams, "search" | "status" | "serviceId" | "timeRange">) {
    // Resolve API slug to ID if provided
    let apiId: string | undefined;
    if (params.serviceId) {
      const api = await monitoredApiRepository.findBySlugOrId(params.serviceId);
      apiId = api?.id;
    }

    const stats = await requestLogRepository.getLogStats({
      search: params.search,
      status: params.status,
      apiId,
      timeRange: params.timeRange,
    });

    return toLogStats(stats);
  },
};
