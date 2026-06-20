import type { ReactNode } from "react";
import { MobileNav } from "./mobile-nav";
import { SideNav } from "./side-nav";
import { TopNav } from "./top-nav";

type AppShellProps = {
  active: "dashboard" | "apis" | "logs";
  children: ReactNode;
};

export function AppShell({ active, children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background text-on-surface">
      <TopNav active={active} />
      <SideNav active={active} />
      <main className="min-h-screen pt-16 pb-20 md:pl-[260px] md:pb-0">
        <div className="mx-auto max-w-container-max p-6">{children}</div>
      </main>
      <MobileNav active={active} />
    </div>
  );
}
