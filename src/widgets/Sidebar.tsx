"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUserProfile } from "@/features/auth/hooks/useUserProfile";
import { useI18n } from "@/shared/i18n/I18nProvider";
import { Avatar } from "@/shared/ui/Avatar";
import { Logo } from "@/shared/ui/Logo";
import { SideLink } from "@/shared/ui/SideLink";
import { NAV_ITEMS, isNavActive } from "./navItems";

interface SidebarNavProps {
  /** Mobil çekmecede bir bağlantıya tıklanınca menüyü kapatmak için. */
  onNavigate?: () => void;
}

/** Masaüstü kenar çubuğu ve mobil çekmecenin paylaştığı içerik. */
export function SidebarContent({ onNavigate }: SidebarNavProps) {
  const pathname = usePathname();
  const { data: profile } = useUserProfile();
  const { t } = useI18n();
  const displayName = profile?.name ?? profile?.githubLogin ?? t("nav.profile");

  return (
    <>
      <div className="flex flex-col gap-7">
        <Link
          href="/"
          onClick={onNavigate}
          className="flex items-center gap-3.5 pl-2 no-underline"
        >
          <Logo />
          <span className="flex flex-col gap-0.5">
            <span className="font-serif text-[28px] leading-none text-hm-text-primary">hashmark</span>
            <span className="font-mono text-[11px] text-hm-text-secondary">{t("nav.tagline")}</span>
          </span>
        </Link>

        <nav aria-label={t("nav.main")} className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <SideLink
                key={item.href}
                href={item.href}
                active={isNavActive(pathname, item.href)}
                onClick={onNavigate}
                icon={<Icon size={18} aria-hidden="true" />}
              >
                {t(item.labelKey)}
              </SideLink>
            );
          })}
        </nav>
      </div>

      <Link
        href="/dashboard/profile"
        onClick={onNavigate}
        aria-current={pathname === "/dashboard/profile" ? "page" : undefined}
        className="mt-auto flex items-center gap-3 border-t border-hm-border px-2 pt-4 text-sm text-hm-text-secondary no-underline hover:text-hm-text-primary"
      >
        <Avatar src={profile?.avatarUrl} name={displayName} size={32} />
        <span className="truncate">{displayName}</span>
      </Link>
    </>
  );
}

export const Sidebar = () => {
  return (
    <aside className="fixed left-0 top-0 z-10 hidden h-full w-[240px] flex-col gap-8 border-r border-hm-border bg-hm-surface px-4 py-6 md:flex">
      <SidebarContent />
    </aside>
  );
};
