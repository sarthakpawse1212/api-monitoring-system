import { NextResponse } from "next/server";
import { apiService } from "@/lib/services/api.service";
import { validateApiId } from "@/lib/validation/query-params";

/**
 * GET /api/apis/[id]
 * 
 * Returns complete details for a single monitored API.
 * 
 * Response includes:
 * - Header: API name, URL, status, last checked time
 * - Metrics: Availability, avg response time, requests today, error count
 * - Charts: Response time trend, error rate over time
 * - Recent transactions: Latest API calls with method, endpoint, status, latency
 * 
 * Flow:
 * 1. Validate API ID/slug from URL parameter
 * 2. Service fetches API data + transactions + charts in parallel
 * 3. Repositories query Prisma/PostgreSQL
 * 4. DTOs transform data to UI-ready format
 * 5. Return 404 if API not found, otherwise return JSON
 * 
 * @param request - Next.js request object (unused but required by signature)
 * @param params - URL parameters containing the API id/slug
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params to get the id (Next.js 15+ requirement)
    const { id } = await params;

    // Validate the API ID/slug
    const validId = validateApiId(id);
    if (!validId) {
      return NextResponse.json(
        { error: "Invalid API ID" },
        { status: 400 }
      );
    }

    // Fetch complete API details from service
    // This includes: header info, metrics, charts, and recent transactions
    const apiDetails = await apiService.getApiDetails(validId);

    // Return 404 if API not found
    if (!apiDetails) {
      return NextResponse.json(
        { error: "API not found" },
        { status: 404 }
      );
    }

    // Return successful response with API details
    return NextResponse.json(apiDetails);
  } catch (error) {
    // Log error for debugging
    console.error("API details error:", error);

    // Return error response
    return NextResponse.json(
      { error: "Failed to fetch API details" },
      { status: 500 }
    );
  }
}
