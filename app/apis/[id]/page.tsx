import { ApiDetailsPage } from "@/features/api-details/api-details-page";
import { apiService } from "@/lib/services/api.service";
import { notFound } from "next/navigation";

/**
 * API Details route: /apis/[id]
 * 
 * Server Component that fetches complete API details from the database.
 * 
 * Flow:
 * 1. Next.js extracts [id] from URL (e.g., /apis/customer-api)
 * 2. Component calls apiService.getApiDetails(id)
 * 3. Service orchestrates parallel queries for API data, transactions, and charts
 * 4. Repositories query Prisma/PostgreSQL
 * 5. DTOs transform data to UI-ready format
 * 6. Data passed as props to ApiDetailsPage component
 * 7. If API not found, trigger Next.js 404 page
 * 
 * @param params - URL parameters containing the API id/slug
 */
export default async function ApiDetailsRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Await params to get the id (Next.js 15+ requirement)
  const { id } = await params;

  // Fetch complete API details from service
  // This includes: header, metrics, charts, and recent transactions
  const data = await apiService.getApiDetails(id);

  // If API not found, show 404 page
  if (!data) {
    notFound();
  }

  // Pass real data to the API details page component
  return <ApiDetailsPage data={data} />;
}
