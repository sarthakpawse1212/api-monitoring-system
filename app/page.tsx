import { DashboardPageClient } from "@/features/dashboard/dashboard-page-client";
import { dashboardService } from "@/lib/services/dashboard.service";

/**
 * Dashboard route: /
 * 
 * Server Component that fetches initial dashboard data from the database,
 * then hands off to the client component for real-time updates via SSE.
 * 
 * Flow:
 * 1. Next.js calls this component on the server
 * 2. Component calls dashboardService.getDashboardData()
 * 3. Service orchestrates repository calls -> Prisma -> PostgreSQL
 * 4. DTOs transform data to UI-ready format
 * 5. Data is passed as initial props to DashboardPageClient
 * 6. Client component subscribes to /api/realtime SSE endpoint
 * 7. Real-time updates stream to the client every 3 seconds
 * 
 * Benefits:
 * - Fast initial page load with server-rendered data
 * - Real-time updates without polling
 * - SEO-friendly (data is in initial HTML)
 * - Efficient server resources (SSE vs constant API polling)
 */
export default async function Home() {
  // Fetch dashboard data directly from the service
  // This runs on the server, so it's fast and secure
  const data = await dashboardService.getDashboardData();

  // Pass real data to the client dashboard page component
  // Client component will handle real-time updates
  return <DashboardPageClient initialData={data} />;
}
