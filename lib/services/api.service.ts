import { monitoredApiRepository } from "../repositories/monitored-api.repository";
import { requestLogRepository } from "../repositories/request-log.repository";
import { chartDataRepository } from "../repositories/chart-data.repository";
import { toApiSummaries } from "../dto/common.dto";
import {
  toApiHeader,
  toApiMetrics,
  toTransactions,
  toChartSeries,
} from "../dto/api-details.dto";

/**
 * API service.
 * Orchestrates data fetching and transformation for API-related screens.
 */
export const apiService = {
  /**
   * Get list of all monitored APIs (for filters and navigation).
   */
  async getApiList() {
    const apis = await monitoredApiRepository.findAll();
    return toApiSummaries(apis);
  },

  /**
   * Get complete API details page data.
   */
  async getApiDetails(slugOrId: string) {
    // Fetch API and related data
    const [api, transactions, charts] = await Promise.all([
      monitoredApiRepository.getApiDetails(slugOrId),
      requestLogRepository.getApiTransactions(slugOrId, 10),
      chartDataRepository.getAllApiCharts(slugOrId),
    ]);

    if (!api) {
      return null;
    }

    // Transform data using DTOs
    return {
      header: toApiHeader(api),
      metrics: toApiMetrics(api),
      responseTrend: toChartSeries(charts.responseTrend),
      errorRate: toChartSeries(charts.errorRate),
      transactions: toTransactions(transactions),
    };
  },

  /**
   * Get only transactions for an API (for pagination).
   */
  async getApiTransactions(slugOrId: string, limit = 10) {
    const api = await monitoredApiRepository.findBySlugOrId(slugOrId);
    if (!api) {
      return null;
    }

    const transactions = await requestLogRepository.getApiTransactions(api.id, limit);
    return toTransactions(transactions);
  },

  /**
   * Check if an API exists by slug or ID.
   */
  async apiExists(slugOrId: string): Promise<boolean> {
    const api = await monitoredApiRepository.findBySlugOrId(slugOrId);
    return api !== null;
  },
};
