import { prisma } from "../prisma";
import { Prisma } from "@prisma/client";

/**
 * Repository for RequestLog model.
 * Provides data access methods for API request logs, transactions, and activity.
 */
export const requestLogRepository = {
  /**
   * Get recent activity for the dashboard live feed.
   */
  async getRecentActivity(limit = 10) {
    return prisma.requestLog.findMany({
      orderBy: { occurredAt: "desc" },
      take: limit,
      include: {
        api: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
    });
  },

  /**
   * Get recent transactions for a specific API.
   */
  async getApiTransactions(apiId: string, limit = 10) {
    return prisma.requestLog.findMany({
      where: { apiId },
      orderBy: { occurredAt: "desc" },
      take: limit,
      select: {
        id: true,
        occurredAt: true,
        httpMethod: true,
        endpoint: true,
        statusCode: true,
        statusLabel: true,
        latencyMs: true,
      },
    });
  },

  /**
   * Get filtered logs with pagination for the logs page.
   */
  async getFilteredLogs(params: {
    search?: string;
    status?: string;
    apiId?: string;
    timeRange?: string;
    page?: number;
    pageSize?: number;
  }) {
    const {
      search,
      status,
      apiId,
      page = 1,
      pageSize = 20,
    } = params;

    const where: Prisma.RequestLogWhereInput = {};

    // Search filter (endpoint or message)
    if (search) {
      where.OR = [
        { endpoint: { contains: search, mode: "insensitive" } },
        { message: { contains: search, mode: "insensitive" } },
        { path: { contains: search, mode: "insensitive" } },
      ];
    }

    // Status filter
    if (status) {
      if (status === "success") {
        where.statusCode = { gte: 200, lt: 300 };
      } else if (status === "client-error") {
        where.statusCode = { gte: 400, lt: 500 };
      } else if (status === "server-error") {
        where.statusCode = { gte: 500 };
      } else if (!isNaN(parseInt(status))) {
        where.statusCode = parseInt(status);
      }
    }

    // API filter
    if (apiId) {
      where.apiId = apiId;
    }

    // Time range filter (simplified for now)
    if (params.timeRange) {
      const now = new Date();
      let since: Date | undefined;

      if (params.timeRange === "1h") {
        since = new Date(now.getTime() - 60 * 60 * 1000);
      } else if (params.timeRange === "24h") {
        since = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      } else if (params.timeRange === "7d") {
        since = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      }

      if (since) {
        where.occurredAt = { gte: since };
      }
    }

    const skip = (page - 1) * pageSize;

    const [logs, total] = await Promise.all([
      prisma.requestLog.findMany({
        where,
        orderBy: { occurredAt: "desc" },
        take: pageSize,
        skip,
        include: {
          api: {
            select: {
              name: true,
              slug: true,
            },
          },
        },
      }),
      prisma.requestLog.count({ where }),
    ]);

    return { logs, total, page, pageSize };
  },

  /**
   * Get log statistics (avg latency, error rate, total requests).
   */
  async getLogStats(params: {
    search?: string;
    status?: string;
    apiId?: string;
    timeRange?: string;
  }) {
    const where: Prisma.RequestLogWhereInput = {};

    // Apply same filters as getFilteredLogs
    if (params.search) {
      where.OR = [
        { endpoint: { contains: params.search, mode: "insensitive" } },
        { message: { contains: params.search, mode: "insensitive" } },
        { path: { contains: params.search, mode: "insensitive" } },
      ];
    }

    if (params.status) {
      if (params.status === "success") {
        where.statusCode = { gte: 200, lt: 300 };
      } else if (params.status === "client-error") {
        where.statusCode = { gte: 400, lt: 500 };
      } else if (params.status === "server-error") {
        where.statusCode = { gte: 500 };
      } else if (!isNaN(parseInt(params.status))) {
        where.statusCode = parseInt(params.status);
      }
    }

    if (params.apiId) {
      where.apiId = params.apiId;
    }

    if (params.timeRange) {
      const now = new Date();
      let since: Date | undefined;

      if (params.timeRange === "1h") {
        since = new Date(now.getTime() - 60 * 60 * 1000);
      } else if (params.timeRange === "24h") {
        since = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      } else if (params.timeRange === "7d") {
        since = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      }

      if (since) {
        where.occurredAt = { gte: since };
      }
    }

    const [totalCount, avgLatency, errorCount] = await Promise.all([
      prisma.requestLog.count({ where }),
      prisma.requestLog.aggregate({
        where,
        _avg: { latencyMs: true },
      }),
      prisma.requestLog.count({
        where: {
          ...where,
          statusCode: { gte: 500 },
        },
      }),
    ]);

    const errorRate = totalCount > 0 ? (errorCount / totalCount) * 100 : 0;

    return {
      totalCount,
      avgLatencyMs: avgLatency._avg.latencyMs || 0,
      errorRate,
      errorCount,
    };
  },

  /**
   * Calculate success rate for the dashboard.
   */
  async getSuccessRate(since?: Date) {
    const where: Prisma.RequestLogWhereInput = {};
    if (since) {
      where.occurredAt = { gte: since };
    }

    const [total, successful] = await Promise.all([
      prisma.requestLog.count({ where }),
      prisma.requestLog.count({
        where: {
          ...where,
          statusCode: { gte: 200, lt: 300 },
        },
      }),
    ]);

    return total > 0 ? (successful / total) * 100 : 0;
  },
};
