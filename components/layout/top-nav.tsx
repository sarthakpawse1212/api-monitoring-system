import Link from "next/link";

type TopNavProps = {
  active: "dashboard" | "apis" | "logs";
};

type TopLink = {
  id: string;
  label: string;
  href?: string;
};

const topLinks: TopLink[] = [
  { id: "dashboard", label: "Dashboard", href: "/" },
  { id: "apis", label: "APIs", href: "/apis/customer-api" },
  { id: "incidents", label: "Incidents" },
  { id: "alerts", label: "Alerts" },
  { id: "logs", label: "Logs", href: "/logs" },
] as const;

export function TopNav({ active }: TopNavProps) {
  return (
    <header className="fixed top-0 z-50 h-16 w-full border-b border-outline-variant bg-surface-container-lowest shadow-sm">
      <div className="mx-auto flex h-full max-w-container-max items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Link className="text-2xl font-bold text-on-surface" href="/">
            Pulse Monitor Pro
          </Link>
          <div className="hidden items-center gap-2 rounded border border-outline-variant bg-surface-container-low px-2 py-1 lg:flex">
            <span className="material-symbols-outlined text-[20px] text-outline">
              search
            </span>
            <input
              aria-label="Search APIs or logs"
              className="w-64 border-none bg-transparent text-sm text-on-surface outline-none placeholder:text-outline"
              placeholder="Search APIs or Logs..."
              type="text"
            />
          </div>
        </div>
        <nav className="hidden items-center gap-6 md:flex">
          {topLinks.map((item) =>
            item.href ? (
              <Link
                className={
                  item.id === active
                    ? "border-b-2 border-secondary pb-1 font-bold text-secondary"
                    : "font-medium text-on-surface-variant transition-colors hover:text-secondary"
                }
                href={item.href}
                key={item.id}
              >
                {item.label}
              </Link>
            ) : (
              <span
                aria-disabled="true"
                className="cursor-default font-medium text-on-surface-variant/70"
                key={item.id}
              >
                {item.label}
              </span>
            ),
          )}
        </nav>
        <div className="flex items-center gap-4">
          <button
            aria-label="Notifications"
            className="text-on-surface-variant transition-colors hover:text-secondary"
          >
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button
            aria-label="Help"
            className="text-on-surface-variant transition-colors hover:text-secondary"
          >
            <span className="material-symbols-outlined">help</span>
          </button>
          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-outline-variant bg-secondary text-sm font-bold text-on-secondary">
            PM
          </div>
        </div>
      </div>
    </header>
  );
}
