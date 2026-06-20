import { AppShell } from "@/components/layout/app-shell";
import { MetricCard } from "@/components/ui/metric-card";
import { MethodTag, StatusBadge } from "@/components/ui/status";
import { apiDetailsData } from "./data";

export function ApiDetailsPage() {
  return (
    <AppShell active="apis">
      <section className="glass-card mb-6 flex flex-col justify-between gap-6 rounded-xl p-6 md:flex-row md:items-center">
        <div className="flex flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-semibold">{apiDetailsData.name}</h1>
            <StatusBadge label={apiDetailsData.status} pulse status="healthy" />
          </div>
          <div className="flex items-center gap-3 font-mono text-sm text-on-surface-variant">
            <span className="material-symbols-outlined text-[18px]">link</span>
            <span>{apiDetailsData.url}</span>
          </div>
        </div>
        <div className="flex flex-col md:items-end">
          <p className="text-xs font-semibold uppercase tracking-wide text-outline">
            Last Checked
          </p>
          <p className="font-semibold">{apiDetailsData.lastChecked}</p>
        </div>
      </section>

      <section className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {apiDetailsData.metrics.map((metric) => (
          <MetricCard
            accent={metric.accent}
            footer={metric.footer}
            icon={metric.icon}
            key={metric.label}
            label={metric.label}
            value={metric.value}
          />
        ))}
      </section>

      <section className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="glass-card flex min-h-[360px] flex-col gap-6 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Response Time Trend</h2>
            <div className="flex gap-1">
              <button className="rounded border border-outline-variant bg-surface-container-low px-2 py-1 text-xs font-semibold">
                1H
              </button>
              <button className="rounded bg-on-surface px-2 py-1 text-xs font-semibold text-white">
                24H
              </button>
            </div>
          </div>
          <div className="flex flex-1 items-end overflow-hidden rounded-lg border border-outline-variant bg-surface-container-low px-4 py-2">
            <div className="flex h-48 w-full items-end gap-1">
              {/* CSS-only chart placeholder retained from Stitch until real chart data lands. */}
              {apiDetailsData.responseTrend.map((value, index) => (
                <div
                  className="flex-1 rounded-t-sm bg-secondary opacity-60 transition-opacity hover:opacity-100"
                  key={`${value}-${index}`}
                  style={{ height: `${value}%` }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="glass-card flex min-h-[170px] flex-1 flex-col gap-4 rounded-xl p-6">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-outline">
              Request Volume (last 24h)
            </h2>
            <div className="flex flex-1 items-center justify-center rounded-lg border border-outline-variant bg-surface-container-low">
              {/* CSS-only chart placeholder retained from Stitch until real chart data lands. */}
              <div className="mx-6 h-16 w-full rounded-t-lg border-t border-secondary/30 bg-gradient-to-t from-secondary/10 to-transparent" />
            </div>
          </div>
          <div className="glass-card flex min-h-[170px] flex-1 flex-col gap-4 rounded-xl p-6">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-outline">
              Error Rate (%)
            </h2>
            <div className="flex flex-1 items-end gap-2 rounded-lg border border-outline-variant bg-surface-container-low px-4 py-2">
              {/* CSS-only chart placeholder retained from Stitch until real chart data lands. */}
              {apiDetailsData.errorRate.map((value, index) => (
                <div
                  className={`flex-1 rounded-sm ${
                    value > 40 ? "bg-error" : "bg-error-container"
                  }`}
                  key={`${value}-${index}`}
                  style={{ height: `${value}%` }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="glass-card overflow-hidden rounded-xl shadow-sm">
        <div className="flex items-center justify-between border-b border-outline-variant bg-surface-container-low px-6 py-4">
          <h2 className="text-lg font-semibold">Recent Transactions</h2>
          <button className="flex items-center gap-1 text-xs font-bold uppercase tracking-wide text-secondary hover:underline">
            View All
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          </button>
        </div>
        <div className="custom-scrollbar overflow-x-auto">
          <table className="w-full min-w-[780px] border-collapse text-left">
            <thead>
              <tr className="bg-surface text-xs font-semibold uppercase tracking-wide text-outline">
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4">Method</th>
                <th className="px-6 py-4">Endpoint Path</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Latency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant text-sm">
              {apiDetailsData.transactions.map((transaction) => (
                <tr
                  className="transition-colors hover:bg-surface-container-low"
                  key={`${transaction.timestamp}-${transaction.endpoint}`}
                >
                  <td className="px-6 py-4 font-mono text-sm">{transaction.timestamp}</td>
                  <td className="px-6 py-4">
                    <MethodTag method={transaction.method} />
                  </td>
                  <td className="px-6 py-4 font-mono text-sm text-on-surface-variant">
                    {transaction.endpoint}
                  </td>
                  <td
                    className={`px-6 py-4 font-bold ${
                      transaction.statusKind === "error"
                        ? "text-error"
                        : transaction.statusKind === "success"
                          ? "text-success-emerald"
                          : "text-outline"
                    }`}
                  >
                    {transaction.status}
                  </td>
                  <td className="px-6 py-4 text-right font-mono text-sm">
                    {transaction.latency}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AppShell>
  );
}
