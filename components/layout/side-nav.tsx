import Link from "next/link";
import { navItems } from "./nav-items";

type SideNavProps = {
  active: "dashboard" | "apis" | "logs";
};

export function SideNav({ active }: SideNavProps) {
  return (
    <aside className="fixed left-0 top-16 z-40 hidden h-[calc(100vh-64px)] w-[260px] flex-col gap-1 border-r border-outline-variant bg-surface-container-low px-4 py-6 md:flex">
      <div className="mb-6 flex items-center gap-2 px-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-on-secondary">
          <span className="material-symbols-outlined">analytics</span>
        </div>
        <div>
          <h3 className="text-xl font-bold leading-tight text-on-background">
            System Health
          </h3>
          <p className="text-xs font-semibold uppercase text-success-emerald">
            All systems operational
          </p>
        </div>
      </div>
      <nav className="flex flex-1 flex-col gap-1">
        {navItems.map((item) =>
          item.href ? (
            <Link
              className={
                item.id === active
                  ? "flex translate-x-1 items-center gap-2 rounded-xl bg-secondary-container px-4 py-2 text-on-secondary-container transition-transform"
                  : "flex items-center gap-2 px-4 py-2 text-on-surface-variant transition-colors hover:bg-surface-container-highest"
              }
              href={item.href}
              key={item.id}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          ) : (
            <span
              aria-disabled="true"
              className="flex cursor-default items-center gap-2 px-4 py-2 text-on-surface-variant/70"
              key={item.id}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className="text-sm font-medium">{item.label}</span>
            </span>
          ),
        )}
      </nav>
      <button className="mt-auto flex w-full items-center justify-center gap-2 rounded-xl bg-secondary py-2 font-bold text-on-secondary transition-opacity hover:opacity-90">
        <span className="material-symbols-outlined">add</span>
        New Monitor
      </button>
    </aside>
  );
}
