import { prisma } from "../prisma";
import { ChartKind } from "@prisma/client";

/**
 * Repository for ChartDataPoint model.
 * Provides data access methods for chart data series.
 */
export const chartDataRepository = {
  /**
   * Get dashboard response trend chart data.
   */
  async getDashboardResponseTrend() {
    return prisma.chartDataPoint.findMany({
      where: {
        chartKind: "DASHBOARD_RESPONSE_TREND",
        apiId: null,
      },
      orderBy: { sequence: "asc" },
      select: {
        value: true,
        label: true,
        sequence: true,
      },
    });
  },

  /**
   * Get chart data for a specific API and chart kind.
   */
  async getApiChartData(apiId: string, chartKind: ChartKind) {
    return prisma.chartDataPoint.findMany({
      where: {
        apiId,
        chartKind,
      },
      orderBy: { sequence: "asc" },
      select: {
        value: true,
        label: true,
        sequence: true,
      },
    });
  },

  /**
   * Get all chart data for an API (for details page).
   */
  async getAllApiCharts(apiId: string) {
    const [responseTrend, errorRate] = await Promise.all([
      this.getApiChartData(apiId, "RESPONSE_TREND"),
      this.getApiChartData(apiId, "ERROR_RATE"),
    ]);

    return {
      responseTrend,
      errorRate,
    };
  },
};
