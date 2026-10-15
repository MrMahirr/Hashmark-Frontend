"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUserProfile } from "@/features/auth/hooks/useUserProfile";
import { useI18n } from "@/shared/i18n/I18nProvider";
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

  return (
    <>
      <div className="flex flex-col mb-8 px-2">
        <span className="font-mono text-xl font-medium text-hm-text-primary"># Hashmark</span>
        <span className="font-sans text-sm text-hm-text-secondary mt-1">{t("nav.tagline")}</span>
      </div>

      <nav aria-label={t("nav.main")} className="flex-1 space-y-1">
        {NAV_ITEMS.map((item) => {
          const active = isNavActive(pathname, item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors font-sans text-sm ${
                active ? "text-hm-blue font-medium bg-hm-bg" : "text-hm-text-secondary hover:bg-hm-bg"
              }`}
            >
              <Icon size={18} aria-hidden="true" className={active ? "text-hm-blue" : ""} />
              <span>{t(item.labelKey)}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-4 border-t-[0.5px] border-hm-border">
        <Link
          href="/dashboard/profile"
          onClick={onNavigate}
          aria-current={pathname === "/dashboard/profile" ? "page" : undefined}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-hm-text-secondary font-sans text-sm hover:bg-hm-bg transition-colors"
        >
          {profile?.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              alt=""
              className="w-6 h-6 rounded-full object-cover border-[0.5px] border-hm-border"
              src={profile.avatarUrl}
            />
          ) : (
            <div
              aria-hidden="true"
              className="w-6 h-6 rounded-full bg-hm-bg border-[0.5px] border-hm-border flex items-center justify-center text-[10px] font-medium text-hm-text-primary"
            >
              {profile?.name?.charAt(0) ?? profile?.githubLogin?.charAt(0) ?? "U"}
            </div>
          )}
          <span className="truncate max-w-[120px]">
            {profile?.name ?? profile?.githubLogin ?? t("nav.profile")}
          </span>
        </Link>
      </div>
    </>
  );
}

export const Sidebar = () => {
  return (
    <aside className="h-full w-[220px] fixed left-0 top-0 bg-hm-surface border-r-[0.5px] border-hm-border flex-col py-6 px-4 z-10 hidden md:flex">
      <SidebarContent />
    </aside>
  );
};
