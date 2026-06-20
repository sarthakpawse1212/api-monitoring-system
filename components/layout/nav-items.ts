type NavItem = {
  id: string;
  label: string;
  icon: string;
  href?: string;
};

export const navItems: NavItem[] = [
  { id: "dashboard", label: "Overview", icon: "dashboard", href: "/" },
  {
    id: "apis",
    label: "API Monitoring",
    icon: "monitor_heart",
    href: "/apis/customer-api",
  },
  { id: "transactions", label: "Transactions", icon: "swap_horiz" },
  { id: "logs", label: "Logs", icon: "receipt_long", href: "/logs" },
  { id: "analytics", label: "Analytics", icon: "analytics" },
  { id: "settings", label: "Settings", icon: "settings" },
] as const;
