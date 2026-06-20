import { monitoredApiRepository } from "../repositories/monitored-api.repository";
import { requestLogRepository } from "../repositories/request-log.repository";
import { alertRepository } from "../repositories/alert.repository";
import { chartDataRepository } from "../repositories/chart-data.repository";
import {
  toDashboardMetrics,
  toServiceStatus,
  toActivityFeed,
  toAlertCards,
  toTrafficDistribution,
  toChartValues,
  formatSuccessRate,
} from "../dto/dashboard.dto";

/**
 * Dashboard service.
 * Orchestrates data fetching and transformation for the dashboard screen.
 */
export const dashboardService = {
  /**
   * Get all dashboard data in a single call.
   */
  async getDashboardData() {
    // Fetch all data in parallel
    const [
      summary,
      statusBoard,
      activity,
      alerts,
      trafficDistribution,
      responseTrend,
      successRate,
    ] = await Promise.all([
      monitoredApiRepository.getDashboardSummary(),
      monitoredApiRepository.getStatusBoard(),
      requestLogRepository.getRecentActivity(10),
      alertRepository.getRecentAlerts(5),
      monitoredApiRepository.getTrafficDistribution(10),
      chartDataRepository.getDashboardResponseTrend(),
      requestLogRepository.getSuccessRate(),
    ]);

    // Transform data using DTOs
    return {
      metrics: toDashboardMetrics(summary),
      services: toServiceStatus(statusBoard),
      activity: toActivityFeed(activity),
      alerts: toAlertCards(alerts),
      distribution: toTrafficDistribution(trafficDistribution),
      trend: toChartValues(responseTrend),
      successRate: formatSuccessRate(successRate),
    };
  },

  /**
   * Get only dashboard metrics (for partial refresh).
   */
  async getDashboardMetrics() {
    const summary = await monitoredApiRepository.getDashboardSummary();
    return toDashboardMetrics(summary);
  },

  /**
   * Get only the activity feed (for realtime updates).
   */
  async getActivityFeed(limit = 10) {
    const activity = await requestLogRepository.getRecentActivity(limit);
    return toActivityFeed(activity);
  },

  /**
   * Get only the status board (for health monitoring).
   */
  async getStatusBoard() {
    const statusBoard = await monitoredApiRepository.getStatusBoard();
    return toServiceStatus(statusBoard);
  },

  /**
   * Get only alerts.
   */
  async getAlerts(limit = 5) {
    const alerts = await alertRepository.getRecentAlerts(limit);
    return toAlertCards(alerts);
  },
};
