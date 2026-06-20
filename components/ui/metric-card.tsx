import type { ReactNode } from "react";

export function MetricCard({
  label,
  value,
  footer,
  accent,
  icon,
}: {
  label: string;
  value: string;
  footer: ReactNode;
  accent?: "success" | "error" | "secondary" | "muted";
  icon?: string;
}) {
  const accentClass =
    accent === "success"
      ? "border-l-4 border-l-success-emerald"
      : accent === "error"
        ? "border-l-4 border-l-error"
        : accent === "secondary"
          ? "border-l-4 border-l-secondary"
          : accent === "muted"
            ? "border-l-4 border-l-on-primary-container"
            : "";

  return (
    <div className={`bento-card flex flex-col rounded-lg p-4 ${accentClass}`}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
          {label}
        </span>
        {icon ? (
          <span className="material-symbols-outlined text-[20px] text-secondary">
            {icon}
          </span>
        ) : null}
      </div>
      <span className="mt-1 text-2xl font-semibold text-on-surface">{value}</span>
      <div className="mt-auto border-t border-outline-variant pt-2 text-[11px] font-semibold text-on-surface-variant">
        {footer}
      </div>
    </div>
  );
}
