import { requestLogRepository } from "@/lib/repositories/request-log.repository";
import { monitoredApiRepository } from "@/lib/repositories/monitored-api.repository";
import { toActivityFeed } from "@/lib/dto/dashboard.dto";

/**
 * GET /api/realtime
 * 
 * Server-Sent Events endpoint for real-time dashboard updates.
 * 
 * Event types:
 * - activity: New request logs/transactions
 * - metrics: Updated dashboard metrics
 * - health: API status changes
 * 
 * Flow:
 * 1. Client opens SSE connection
 * 2. Server sends periodic updates every 3 seconds
 * 3. Fetches latest activity from database
 * 4. Sends formatted SSE events to client
 * 5. Connection stays open until client disconnects
 * 
 * SSE Format:
 * event: activity
 * data: {"timestamp":"...","method":"GET",...}
 * 
 * This is a simple implementation. Production systems would use:
 * - WebSockets or Redis pub/sub for true real-time
 * - Database triggers or change streams
 * - Message queues for event distribution
 */
export async function GET() {
  // Create a TransformStream for SSE
  const encoder = new TextEncoder();
  
  let intervalId: NodeJS.Timeout;
  
  const stream = new ReadableStream({
    async start(controller) {
      // Send initial connection event
      const connectMessage = `event: connected\ndata: ${JSON.stringify({ message: "Connected to real-time stream" })}\n\n`;
      controller.enqueue(encoder.encode(connectMessage));

      // Function to send activity updates
      const sendUpdate = async () => {
        try {
          // Fetch latest activity (last 5 logs)
          const recentLogs = await requestLogRepository.getRecentActivity(5);
          const activityData = toActivityFeed(recentLogs);

          // Send activity event
          if (activityData.length > 0) {
            const activityMessage = `event: activity\ndata: ${JSON.stringify(activityData)}\n\n`;
            controller.enqueue(encoder.encode(activityMessage));
          }

          // Fetch API health status
          const apis = await monitoredApiRepository.findAll();
          const healthData = apis.map((api) => ({
            id: api.slug,
            name: api.name,
            status: api.status,
            latency: api.avgLatencyMs,
          }));

          // Send health event
          const healthMessage = `event: health\ndata: ${JSON.stringify(healthData)}\n\n`;
          controller.enqueue(encoder.encode(healthMessage));

          // Calculate and send metrics
          const totalApis = apis.length;
          const healthyApis = apis.filter((api) => api.status === "HEALTHY").length;
          const downApis = apis.filter((api) => api.status === "DOWN").length;
          
          const metricsData = {
            totalApis,
            healthyApis,
            downApis,
            timestamp: new Date().toISOString(),
          };

          const metricsMessage = `event: metrics\ndata: ${JSON.stringify(metricsData)}\n\n`;
          controller.enqueue(encoder.encode(metricsMessage));

        } catch (error) {
          console.error("Error sending SSE update:", error);
        }
      };

      // Send initial update immediately
      await sendUpdate();

      // Send updates every 3 seconds
      intervalId = setInterval(sendUpdate, 3000);
    },
    
    cancel() {
      // Clean up interval when client disconnects
      if (intervalId) {
        clearInterval(intervalId);
      }
    },
  });

  // Return SSE response with proper headers
  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
      "X-Accel-Buffering": "no", // Disable buffering in nginx
    },
  });
}
