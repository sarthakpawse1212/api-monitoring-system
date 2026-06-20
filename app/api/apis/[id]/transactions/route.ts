import { NextResponse } from "next/server";
import { apiService } from "@/lib/services/api.service";
import { validateApiId, validatePagination } from "@/lib/validation/query-params";

/**
 * GET /api/apis/[id]/transactions
 * 
 * Returns paginated transaction history for a specific API.
 * 
 * Query parameters:
 * - limit: Number of transactions to return (default: 10, max: 100)
 * 
 * Response includes:
 * - Array of transactions with timestamp, method, endpoint, status, latency
 * 
 * Flow:
 * 1. Validate API ID from URL
 * 2. Validate query parameters (limit)
 * 3. Service fetches transactions for the API
 * 4. Repository queries RequestLog table filtered by apiId
 * 5. DTO transforms to UI format with formatted timestamps
 * 6. Return 404 if API not found
 * 
 * @param request - Next.js request object with query parameters
 * @param params - URL parameters containing the API id/slug
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params to get the id
    const { id } = await params;

    // Validate the API ID/slug
    const validId = validateApiId(id);
    if (!validId) {
      return NextResponse.json(
        { error: "Invalid API ID" },
        { status: 400 }
      );
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get("limit");
    
    // Validate pagination parameters
    const { pageSize: limit } = validatePagination(1, limitParam || "10");

    // Fetch transactions from service
    const transactions = await apiService.getApiTransactions(validId, limit);

    // Return 404 if API not found
    if (!transactions) {
      return NextResponse.json(
        { error: "API not found" },
        { status: 404 }
      );
    }

    // Return transactions array
    return NextResponse.json(transactions);
  } catch (error) {
    // Log error for debugging
    console.error("API transactions error:", error);

    // Return error response
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}
