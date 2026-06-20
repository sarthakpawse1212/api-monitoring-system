import { NextResponse } from "next/server";
import { apiService } from "@/lib/services/api.service";

/**
 * GET /api/apis
 * 
 * Returns a list of all monitored APIs with basic info.
 * Used for navigation and service filter dropdowns.
 * 
 * Response includes:
 * - id, slug (for routing)
 * - name, version (for display)
 * - status (HEALTHY, WARNING, DOWN)
 * - avgLatencyMs (for sorting/display)
 * - baseUrl (for reference)
 * 
 * Flow:
 * 1. Service calls repository to get all APIs
 * 2. Repository queries MonitoredApi table
 * 3. DTO transforms to summary format
 * 4. API returns JSON array
 */
export async function GET() {
  try {
    // Fetch all monitored APIs as summaries
    const apis = await apiService.getApiList();

    // Return API list
    return NextResponse.json(apis);
  } catch (error) {
    // Log error for debugging
    console.error("API list error:", error);

    // Return error response
    return NextResponse.json(
      { error: "Failed to fetch API list" },
      { status: 500 }
    );
  }
}
