type Status = "healthy" | "warning" | "down" | "success" | "error" | "neutral";

const statusClasses: Record<Status, string> = {
  healthy: "bg-emerald-100 text-emerald-800",
  warning: "bg-orange-100 text-orange-800",
  down: "bg-error-container text-on-error-container",
  success: "bg-success-emerald/10 text-success-emerald border border-success-emerald/20",
  error: "bg-error-container text-on-error-container border border-error/20",
  neutral: "bg-surface-container-high text-on-surface-variant",
};

export function StatusBadge({
  label,
  status,
  pulse = false,
}: {
  label: string;
  status: Status;
  pulse?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-bold uppercase ${statusClasses[status]}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          status === "down" || status === "error" ? "bg-error" : "bg-success-emerald"
        } ${pulse ? (status === "down" || status === "error" ? "pulse-error" : "pulse-emerald") : ""}`}
      />
      {label}
    </span>
  );
}

export function MethodTag({ method }: { method: string }) {
  const colors: Record<string, string> = {
    GET: "bg-surface-container-high text-on-surface-variant",
    POST: "bg-secondary-container/20 text-secondary",
    PATCH: "bg-tertiary-fixed text-on-surface",
    DELETE: "bg-error-container text-on-error-container",
    PUT: "bg-secondary-container/20 text-secondary",
  };

  return (
    <span
      className={`rounded px-2 py-1 text-[10px] font-bold uppercase ${
        colors[method] ?? "bg-surface-container-high text-on-surface-variant"
      }`}
    >
      {method}
    </span>
  );
}
