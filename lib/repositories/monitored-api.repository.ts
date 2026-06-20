import { prisma } from "../prisma";
import { ApiStatus, Prisma } from "@prisma/client";

/**
 * Repository for MonitoredApi model.
 * Provides data access methods for API monitoring operations.
 */
export const monitoredApiRepository = {
  /**
   * Find all monitored APIs with basic info.
   */
  async findAll() {
    return prisma.monitoredApi.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        slug: true,
        name: true,
        version: true,
        status: true,
        avgLatencyMs: true,
        baseUrl: true,
        lastCheckedAt: true,
      },
    });
  },

  /**
   * Find a single API by slug or ID.
   */
  async findBySlugOrId(slugOrId: string) {
    return prisma.monitoredApi.findFirst({
      where: {
        OR: [{ slug: slugOrId }, { id: slugOrId }],
      },
      include: {
        alerts: {
          orderBy: { createdAt: "desc" },
          take: 5,
        },
      },
    });
  },

  /**
   * Get dashboard summary metrics.
   * Returns counts and aggregates for the dashboard overview.
   */
  async getDashboardSummary() {
    const [totalCount, healthyCount, downCount, avgLatency, requestsToday] =
      await Promise.all([
        prisma.monitoredApi.count(),
        prisma.monitoredApi.count({ where: { status: "HEALTHY" } }),
        prisma.monitoredApi.count({ where: { status: "DOWN" } }),
        prisma.monitoredApi.aggregate({
          _avg: { avgLatencyMs: true },
        }),
        prisma.monitoredApi.aggregate({
          _sum: { requestsToday: true },
        }),
      ]);

    return {
      totalCount,
      healthyCount,
      downCount,
      avgLatencyMs: avgLatency._avg.avgLatencyMs || 0,
      requestsToday: requestsToday._sum.requestsToday || 0,
    };
  },

  /**
   * Get all APIs with their status for the status board.
   */
  async getStatusBoard() {
    return prisma.monitoredApi.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        slug: true,
        name: true,
        version: true,
        status: true,
        avgLatencyMs: true,
      },
    });
  },

  /**
   * Get traffic distribution data.
   */
  async getTrafficDistribution(limit = 10) {
    return prisma.monitoredApi.findMany({
      where: {
        trafficSharePercent: { not: null },
      },
      orderBy: { trafficSharePercent: "desc" },
      take: limit,
      select: {
        id: true,
        name: true,
        trafficSharePercent: true,
      },
    });
  },

  /**
   * Get API details with metrics for the details page.
   */
  async getApiDetails(slugOrId: string) {
    return prisma.monitoredApi.findFirst({
      where: {
        OR: [{ slug: slugOrId }, { id: slugOrId }],
      },
      include: {
        chartPoints: {
          orderBy: { sequence: "asc" },
        },
      },
    });
  },
};
