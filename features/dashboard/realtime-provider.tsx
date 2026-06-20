"use client";

import { useEffect, useState } from "react";

/**
 * Real-time Provider Component
 * 
 * Connects to the SSE endpoint and provides real-time updates to the dashboard.
 * 
 * Features:
 * - Subscribes to /api/realtime SSE endpoint
 * - Receives activity, metrics, and health events
 * - Updates dashboard sections with new data
 * - Handles connection errors and reconnection
 * 
 * Event types:
 * - connected: Initial connection confirmation
 * - activity: New request logs
 * - metrics: Updated dashboard metrics
 * - health: API status changes
 */

type ActivityEvent = {
  timestamp: string;
  method: string;
  endpoint: string;
  status: string;
  statusKind: "success" | "error";
  responseTime: string;
};

type HealthEvent = {
  id: string;
  name: string;
  status: "HEALTHY" | "WARNING" | "DOWN";
  latency: number | null;
};

type MetricsEvent = {
  totalApis: number;
  healthyApis: number;
  downApis: number;
  timestamp: string;
};

type RealtimeProviderProps = {
  onActivityUpdate?: (activity: ActivityEvent[]) => void;
  onHealthUpdate?: (health: HealthEvent[]) => void;
  onMetricsUpdate?: (metrics: MetricsEvent) => void;
  children: React.ReactNode;
};

export function RealtimeProvider({
  onActivityUpdate,
  onHealthUpdate,
  onMetricsUpdate,
  children,
}: RealtimeProviderProps) {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Create EventSource connection to SSE endpoint
    const eventSource = new EventSource("/api/realtime");

    // Handle connection
    eventSource.addEventListener("connected", (event) => {
      console.log("[SSE] Connected:", event.data);
      setIsConnected(true);
    });

    // Handle activity updates
    eventSource.addEventListener("activity", (event) => {
      try {
        const activityData = JSON.parse(event.data) as ActivityEvent[];
        console.log("[SSE] Activity update:", activityData.length, "events");
        onActivityUpdate?.(activityData);
      } catch (error) {
        console.error("[SSE] Failed to parse activity data:", error);
      }
    });

    // Handle health updates
    eventSource.addEventListener("health", (event) => {
      try {
        const healthData = JSON.parse(event.data) as HealthEvent[];
        console.log("[SSE] Health update:", healthData.length, "services");
        onHealthUpdate?.(healthData);
      } catch (error) {
        console.error("[SSE] Failed to parse health data:", error);
      }
    });

    // Handle metrics updates
    eventSource.addEventListener("metrics", (event) => {
      try {
        const metricsData = JSON.parse(event.data) as MetricsEvent;
        console.log("[SSE] Metrics update:", metricsData);
        onMetricsUpdate?.(metricsData);
      } catch (error) {
        console.error("[SSE] Failed to parse metrics data:", error);
      }
    });

    // Handle errors
    eventSource.onerror = (error) => {
      console.error("[SSE] Connection error:", error);
      setIsConnected(false);
      // EventSource will automatically try to reconnect
    };

    // Cleanup on unmount
    return () => {
      console.log("[SSE] Closing connection");
      eventSource.close();
      setIsConnected(false);
    };
  }, [onActivityUpdate, onHealthUpdate, onMetricsUpdate]);

  return (
    <>
      {/* Connection indicator */}
      <div className="fixed bottom-4 right-4 z-50">
        {isConnected ? (
          <div className="flex items-center gap-2 rounded-lg bg-success-emerald px-3 py-2 text-xs font-bold text-white shadow-lg">
            <span className="pulse-emerald h-2 w-2 rounded-full bg-white"></span>
            Real-time Connected
          </div>
        ) : (
          <div className="flex items-center gap-2 rounded-lg bg-warning-orange px-3 py-2 text-xs font-bold text-white shadow-lg">
            <span className="h-2 w-2 rounded-full bg-white"></span>
            Connecting...
          </div>
        )}
      </div>
      {children}
    </>
  );
}
