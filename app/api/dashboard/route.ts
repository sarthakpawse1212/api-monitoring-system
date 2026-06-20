import { NextResponse } from "next/server";
import { dashboardService } from "@/lib/services/dashboard.service";

/**
 * GET /api/dashboard
 * 
 * Returns all data needed for the dashboard overview screen:
 * - Metrics (Total APIs, Healthy, Down, Requests Today, Avg Response, Uptime)
 * - Services status board (all monitored APIs with their health status)
 * - Activity feed (recent request logs)
 * - Alerts (recent system alerts)
 * - Traffic distribution (top APIs by traffic share)
 * - Response trend (chart data for dashboard trend line)
 * - Success rate percentage
 * 
 * Flow:
 * 1. Service orchestrates multiple repository calls in parallel
 * 2. Repositories query Prisma/PostgreSQL
 * 3. DTOs transform raw database results into UI-ready format
 * 4. API route returns JSON response
 */
export async function GET() {
  try {
    // Call dashboard service to get all aggregated data
    // This executes multiple database queries in parallel for efficiency
    const data = await dashboardService.getDashboardData();

    // Return successful response with dashboard data
    return NextResponse.json(data);
  } catch (error) {
    // Log error for debugging
    console.error("Dashboard API error:", error);

    // Return error response with 500 status
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
