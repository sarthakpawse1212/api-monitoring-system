import { prisma } from "../prisma";

/**
 * Repository for Alert model.
 * Provides data access methods for dashboard alerts.
 */
export const alertRepository = {
  /**
   * Get recent alerts for the dashboard.
   */
  async getRecentAlerts(limit = 5) {
    return prisma.alert.findMany({
      orderBy: { createdAt: "desc" },
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
   * Get alerts for a specific API.
   */
  async getAlertsForApi(apiId: string, limit = 5) {
    return prisma.alert.findMany({
      where: { apiId },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  },

  /**
   * Create a new alert.
   */
  async create(data: {
    apiId?: string;
    title: string;
    body: string;
    icon: string;
    tone: "ERROR" | "WARNING" | "INFO";
  }) {
    return prisma.alert.create({
      data,
    });
  },
};
