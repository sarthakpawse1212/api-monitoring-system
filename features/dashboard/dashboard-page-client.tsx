"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { BarTrend, DistributionBars, DonutChart } from "@/components/ui/charts";
import { MetricCard } from "@/components/ui/metric-card";
import { MethodTag, StatusBadge } from "@/components/ui/status";
import { RealtimeProvider } from "./realtime-provider";

/**
 * Client-side dashboard page component with real-time updates.
 * 
 * This component:
 * - Receives initial data from server component
 * - Subscribes to SSE endpoint for real-time updates
 * - Updates activity feed, metrics, and health status in real-time
 */

type DashboardData = {
  metrics: Array<{
    label: string;
    value: string;
    footer: string;
    accent?: "success" | "error" | "warning";
  }>;
  services: Array<{
    name: string;
    version: string;
    latency: string;
    status: "HEALTHY" | "WARNING" | "DOWN";
  }>;
  activity: Array<{
    timestamp: string;
    method: string;
    endpoint: string;
    status: string;
    statusKind: "success" | "error";
    responseTime: string;
  }>;
  alerts: Array<{
    title: string;
    body: string;
    icon: string;
    tone: "error" | "warning" | "info";
  }>;
  distribution: Array<{
    label: string;
    value: number;
  }>;
  trend: number[];
  successRate: number;
};

type DashboardPageClientProps = {
  initialData: DashboardData;
};

export function DashboardPageClient({ initialData }: DashboardPageClientProps) {
  const [data, setData] = useState<DashboardData>(initialData);

  // Handle real-time activity updates
  const handleActivityUpdate = (newActivity: Array<{
    timestamp: string;
    method: string;
    endpoint: string;
    status: string;
    statusKind: "success" | "error";
    responseTime: string;
  }>) => {
    setData((prev) => ({
      ...prev,
      activity: newActivity,
    }));
  };

  // Handle real-time health updates
  const handleHealthUpdate = (healthData: Array<{
    id: string;
    name: string;
    status: "HEALTHY" | "WARNING" | "DOWN";
    latency: number | null;
  }>) => {
    setData((prev) => ({
      ...prev,
      services: prev.services.map((service) => {
        const updated = healthData.find((h) => h.name === service.name);
        if (updated) {
          return {
            ...service,
            status: updated.status,
            latency: updated.latency ? `${updated.latency}ms` : "N/A",
          };
        }
        return service;
      }),
    }));
  };

  // Handle real-time metrics updates
  const handleMetricsUpdate = (metrics: {
    totalApis: number;
    healthyApis: number;
    downApis: number;
    timestamp: string;
  }) => {
    setData((prev) => ({
      ...prev,
      metrics: prev.metrics.map((metric) => {
        if (metric.label === "Total APIs") {
          return { ...metric, value: metrics.totalApis.toString() };
        }
        if (metric.label === "Healthy") {
          return { ...metric, value: metrics.healthyApis.toString() };
        }
        if (metric.label === "Down") {
          return {
            ...metric,
            value: metrics.downApis.toString(),
            footer: metrics.downApis > 0 ? "Critical" : "All systems operational",
            accent: metrics.downApis > 0 ? ("error" as const) : undefined,
          };
        }
        return metric;
      }),
    }));
  };

  return (
    <RealtimeProvider
      onActivityUpdate={handleActivityUpdate}
      onHealthUpdate={handleHealthUpdate}
      onMetricsUpdate={handleMetricsUpdate}
    >
      <AppShell active="dashboard">
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-2xl font-bold text-on-surface">Dashboard Overview</h1>
            <p className="text-sm text-on-surface-variant">
              Infrastructure v2.4 - Last update: Just now
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button className="flex items-center gap-2 rounded border border-outline-variant px-4 py-2 text-sm font-semibold transition-colors hover:bg-surface-container-low">
              <span className="material-symbols-outlined text-[20px]">calendar_today</span>
              Last 24 Hours
            </button>
            <button className="rounded bg-secondary px-4 py-2 text-sm font-bold text-on-secondary transition-opacity hover:opacity-90">
              Generate Report
            </button>
          </div>
        </div>

        <section className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {data.metrics.map((metric) => (
            <MetricCard
              accent={metric.accent}
              footer={metric.footer}
              key={metric.label}
              label={metric.label}
              value={metric.value}
            />
          ))}
        </section>

        <div className="mt-6 grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-8">
            <section className="bento-card rounded-lg p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-semibold">System Status Board</h2>
                <button className="text-xs font-bold uppercase tracking-wide text-secondary hover:underline">
                  Refresh Data
                </button>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {data.services.map((service) => (
                  <div
                    className="flex flex-col gap-2 rounded border border-outline-variant bg-surface-bright p-4"
                    key={service.name}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className="font-bold">{service.name}</span>
                      <StatusBadge
                        label={service.status}
                        pulse={service.status === "HEALTHY"}
                        status={
                          service.status === "DOWN"
                            ? "down"
                            : service.status === "WARNING"
                              ? "warning"
                              : "healthy"
                        }
                      />
                    </div>
                    <div className="flex items-center gap-1 text-xs font-mono text-outline">
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          service.status === "DOWN"
                            ? "bg-error"
                            : service.status === "WARNING"
                              ? "bg-warning-orange"
                              : "pulse-emerald bg-success-emerald"
                        }`}
                      />
                      {service.version} - {service.latency}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="bento-card overflow-hidden rounded-lg">
              <div className="flex items-center justify-between border-b border-outline-variant bg-surface-container-low p-6">
                <h2 className="text-2xl font-semibold">Live Stream Activity</h2>
                <div className="flex gap-2">
                  <span className="rounded bg-secondary px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                    Live
                  </span>
                  <span className="rounded bg-outline-variant px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-on-surface-variant">
                    Filters: All
                  </span>
                </div>
              </div>
              <div className="custom-scrollbar overflow-x-auto">
                <table className="w-full min-w-[680px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-outline-variant bg-surface-bright text-xs font-semibold uppercase tracking-wide text-outline">
                      <th className="px-6 py-2">Timestamp</th>
                      <th className="px-6 py-2">Method</th>
                      <th className="px-6 py-2">Endpoint</th>
                      <th className="px-6 py-2">Status</th>
                      <th className="px-6 py-2">Response</th>
                    </tr>
                  </thead>
                  <tbody className="font-mono text-sm">
                    {data.activity.map((event, idx) => (
                      <tr
                        className={`border-b border-outline-variant transition-colors hover:bg-surface-container-low ${
                          event.statusKind === "error" ? "bg-error-container/10" : ""
                        }`}
                        key={`${event.timestamp}-${event.endpoint}-${idx}`}
                      >
                        <td className="px-6 py-4 text-on-surface-variant">
                          {event.timestamp}
                        </td>
                        <td className="px-6 py-4">
                          <MethodTag method={event.method} />
                        </td>
                        <td className="px-6 py-4">{event.endpoint}</td>
                        <td
                          className={`px-6 py-4 font-bold ${
                            event.statusKind === "error"
                              ? "text-error"
                              : "text-success-emerald"
                          }`}
                        >
                          {event.status}
                        </td>
                        <td className="px-6 py-4 text-outline">{event.responseTime}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          <div className="space-y-6 lg:col-span-4">
            <section className="bento-card rounded-lg border-l-4 border-l-error p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-2xl font-semibold">Recent Alerts</h2>
                <span className="rounded-full bg-error px-2 py-0.5 text-[10px] font-bold text-white">
                  2 ACTIVE
                </span>
              </div>
              <div className="space-y-2">
                {data.alerts.map((alert) => (
                  <div
                    className={`flex gap-4 rounded border p-2 ${
                      alert.tone === "error"
                        ? "border-error/20 bg-error-container/20"
                        : "border-tertiary-fixed-dim/40 bg-tertiary-fixed-dim/20"
                    }`}
                    key={alert.title}
                  >
                    <span
                      className={`material-symbols-outlined ${
                        alert.tone === "error" ? "text-error" : "text-warning-orange"
                      }`}
                    >
                      {alert.icon}
                    </span>
                    <div>
                      <p className="text-sm font-bold">{alert.title}</p>
                      <p className="text-xs text-on-surface-variant">{alert.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="bento-card space-y-6 rounded-lg p-6">
              <div>
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-outline">
                  Success Rate
                </h3>
                <DonutChart value={`${data.successRate.toFixed(1)}%`} />
              </div>
              <div className="border-t border-outline-variant pt-6">
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-outline">
                  Traffic Distribution
                </h3>
                <DistributionBars items={data.distribution} />
              </div>
              <div className="border-t border-outline-variant pt-6">
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-outline">
                  Response Trend
                </h3>
                <BarTrend values={data.trend} />
                <div className="mt-1 flex justify-between font-mono text-[10px] text-outline">
                  <span>12:00 PM</span>
                  <span>NOW</span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </AppShell>
    </RealtimeProvider>
  );
}
