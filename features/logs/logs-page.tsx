import { AppShell } from "@/components/layout/app-shell";
import { logsData } from "./data";

export function LogsPage() {
  return (
    <AppShell active="logs">
      <section className="mb-6 rounded-xl border border-outline-variant bg-surface-container-lowest p-4 shadow-sm">
        <div className="mb-4 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <h1 className="text-4xl font-bold text-on-surface">Developer Logs</h1>
            <p className="text-sm text-on-surface-variant">
              Real-time observability and trace data across all active endpoints.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1 rounded border border-outline-variant bg-surface-container-high px-4 py-2 text-sm text-on-surface-variant transition-colors hover:bg-surface-container-highest">
              <span className="material-symbols-outlined text-[20px]">file_download</span>
              Export CSV
            </button>
            <button className="flex items-center gap-1 rounded bg-secondary px-4 py-2 text-sm text-on-secondary transition-opacity hover:opacity-90">
              <span className="material-symbols-outlined text-[20px]">refresh</span>
              Live Feed
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
              Search Logs
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-[20px] text-on-surface-variant/60">
                search
              </span>
              <input
                className="w-full rounded-lg border border-outline-variant bg-surface py-2 pl-8 pr-2 text-sm outline-none focus:ring-1 focus:ring-secondary-container"
                placeholder="Trace ID, Message..."
                type="text"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
              Service/API
            </label>
            <select className="w-full rounded-lg border border-outline-variant bg-surface px-2 py-2 text-sm outline-none focus:ring-1 focus:ring-secondary-container">
              <option>All Services</option>
              <option>Auth Gateway</option>
              <option>Billing Processor</option>
              <option>User Store v3</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
              Status Code
            </label>
            <div className="flex gap-1">
              {["2xx", "4xx", "5xx"].map((label) => (
                <button
                  className="flex-1 rounded border border-outline-variant bg-surface-container-high py-2 text-[11px] font-bold text-on-surface-variant transition-colors hover:bg-secondary-container hover:text-on-secondary-container"
                  key={label}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
              Time Range
            </label>
            <button className="flex w-full items-center gap-2 rounded-lg border border-outline-variant bg-surface px-2 py-2 text-sm">
              <span className="material-symbols-outlined text-[18px] text-on-surface-variant">
                calendar_today
              </span>
              <span className="flex-1 truncate text-left">Last 24 Hours</span>
              <span className="material-symbols-outlined text-[18px] text-on-surface-variant">
                expand_more
              </span>
            </button>
          </div>
        </div>
      </section>

      <section className="mb-6 flex flex-col overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest shadow-sm">
        <div className="custom-scrollbar overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse text-left">
            <thead className="border-b border-outline-variant bg-surface-container-low">
              <tr className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
                <th className="px-4 py-2">Timestamp</th>
                <th className="px-4 py-2">API Endpoint</th>
                <th className="px-4 py-2">Log Message</th>
                <th className="px-4 py-2 text-center">Status</th>
                <th className="px-4 py-2 text-right">Latency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30 text-sm">
              {logsData.logs.map((log) => (
                <tr
                  className={`cursor-pointer transition-colors hover:bg-surface-container-low ${
                    log.statusKind === "server-error"
                      ? "bg-error/10"
                      : log.statusKind === "client-error"
                        ? "bg-error/5"
                        : ""
                  }`}
                  key={`${log.timestamp}-${log.endpoint}`}
                >
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-sm text-on-surface-variant">
                    {log.timestamp}
                  </td>
                  <td className="px-4 py-3 font-mono text-sm font-bold text-secondary">
                    {log.endpoint}
                  </td>
                  <td
                    className={`max-w-md truncate px-4 py-3 font-mono text-sm ${
                      log.statusKind === "success" ? "text-on-surface" : "font-semibold text-error"
                    }`}
                  >
                    {log.message}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-bold ${
                        log.statusKind === "success"
                          ? "border-success-emerald/20 bg-success-emerald/10 text-success-emerald"
                          : log.statusKind === "server-error"
                            ? "border-error bg-error text-white"
                            : "border-error/20 bg-error-container text-on-error-container"
                      }`}
                    >
                      <span
                        className={`mr-1.5 h-1.5 w-1.5 rounded-full ${
                          log.statusKind === "success" ? "bg-success-emerald" : "pulse-error bg-error"
                        }`}
                      />
                      {log.status}
                    </span>
                  </td>
                  <td
                    className={`px-4 py-3 text-right font-mono text-sm ${
                      log.statusKind === "server-error"
                        ? "font-bold text-error"
                        : "text-on-surface-variant"
                    }`}
                  >
                    {log.latency}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col gap-3 border-t border-outline-variant bg-surface-container-low p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-on-surface-variant">
            Showing <span className="font-bold text-on-surface">1 - 50</span> of
            14,209 logs
          </div>
          <div className="flex items-center gap-2">
            <button
              className="flex h-8 w-8 items-center justify-center rounded border border-outline-variant bg-surface opacity-40"
              disabled
            >
              <span className="material-symbols-outlined text-[20px]">chevron_left</span>
            </button>
            <button className="h-8 w-8 rounded bg-secondary text-xs font-bold text-on-secondary">
              1
            </button>
            <button className="h-8 w-8 rounded border border-outline-variant bg-surface text-xs">
              2
            </button>
            <button className="flex h-8 w-8 items-center justify-center rounded border border-outline-variant bg-surface transition-colors hover:bg-surface-container-high">
              <span className="material-symbols-outlined text-[20px]">chevron_right</span>
            </button>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {logsData.stats.map((stat) => (
          <div
            className={`rounded-xl border border-outline-variant bg-surface-container-lowest p-4 shadow-sm ${
              stat.accent === "success"
                ? "border-l-4 border-l-success-emerald"
                : stat.accent === "error"
                  ? "border-l-4 border-l-error"
                  : "border-l-4 border-l-secondary"
            }`}
            key={stat.label}
          >
            <div className="mb-2 flex items-start justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
                {stat.label}
              </span>
              <span
                className={`material-symbols-outlined text-[20px] ${
                  stat.accent === "error"
                    ? "text-error"
                    : stat.accent === "success"
                      ? "text-success-emerald"
                      : "text-secondary"
                }`}
              >
                {stat.icon}
              </span>
            </div>
            <div className="text-4xl font-bold text-on-surface">
              {stat.value}
              <span className="ml-1 text-2xl font-normal text-on-surface-variant">
                {stat.unit}
              </span>
            </div>
            <div
              className={`mt-1 flex items-center gap-1 text-[11px] font-bold ${
                stat.accent === "error"
                  ? "text-error"
                  : stat.accent === "success"
                    ? "text-success-emerald"
                    : "text-on-surface-variant"
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">
                {stat.accent === "error" ? "trending_up" : "trending_down"}
              </span>
              {stat.footer}
            </div>
          </div>
        ))}
      </section>
    </AppShell>
  );
}
