import Link from "next/link";

type MobileNavProps = {
  active: "dashboard" | "apis" | "logs";
};

type MobileNavItem = {
  id: string;
  label: string;
  icon: string;
  href?: string;
};

const mobileItems: MobileNavItem[] = [
  { id: "dashboard", label: "Home", icon: "grid_view", href: "/" },
  { id: "apis", label: "Monitor", icon: "monitor_heart", href: "/apis/customer-api" },
  { id: "logs", label: "Logs", icon: "receipt_long", href: "/logs" },
  { id: "settings", label: "Settings", icon: "settings" },
] as const;

export function MobileNav({ active }: MobileNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t border-outline-variant bg-surface-container-lowest px-4 md:hidden">
      {mobileItems.map((item) =>
        item.href ? (
          <Link
            className={
              item.id === active
                ? "flex flex-col items-center gap-1 text-secondary"
                : "flex flex-col items-center gap-1 text-outline"
            }
            href={item.href}
            key={item.id}
          >
            <span className="material-symbols-outlined text-[22px]">
              {item.icon}
            </span>
            <span className="text-[10px] font-bold">{item.label}</span>
          </Link>
        ) : (
          <span
            aria-disabled="true"
            className="flex flex-col items-center gap-1 text-outline/70"
            key={item.id}
          >
            <span className="material-symbols-outlined text-[22px]">
              {item.icon}
            </span>
            <span className="text-[10px] font-bold">{item.label}</span>
          </span>
        ),
      )}
    </nav>
  );
}
