import { Folder, LayoutDashboard, List, Settings, type LucideIcon } from "lucide-react";
import type { MessageKey } from "@/shared/i18n";

export interface NavItem {
  labelKey: MessageKey;
  href: string;
  icon: LucideIcon;
}

/** Kenar çubuğu ve mobil menü aynı listeyi kullanır. */
export const NAV_ITEMS: readonly NavItem[] = [
  { labelKey: "nav.overview", href: "/dashboard", icon: LayoutDashboard },
  { labelKey: "nav.repos", href: "/dashboard/repos", icon: Folder },
  { labelKey: "nav.debts", href: "/dashboard/debts", icon: List },
  { labelKey: "nav.settings", href: "/dashboard/settings", icon: Settings },
];

/** Alt yollar (ör. /dashboard/repos/12) üst öğeyi aktif gösterir; "/dashboard" yalnızca tam eşleşir. */
export function isNavActive(pathname: string, href: string): boolean {
  if (href === "/dashboard") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}
