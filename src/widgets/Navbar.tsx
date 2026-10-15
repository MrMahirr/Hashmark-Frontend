"use client";

import Link from "next/link";
import { useUserProfile } from "@/features/auth/hooks/useUserProfile";
import { useI18n } from "@/shared/i18n/I18nProvider";
import { LanguageToggle, ThemeToggle } from "@/shared/components/AppearanceToggles";
import { ScanAllButton } from "@/features/scanner/components/ScanAllButton";
import { MobileNav } from "./MobileNav";
import { NotificationBell } from "./NotificationBell";

interface NavbarProps {
  title: string | React.ReactNode;
  action?: React.ReactNode;
}

export const Navbar = ({ title, action }: NavbarProps) => {
  const { data: profile } = useUserProfile();
  const { t } = useI18n();

  return (
    <header className="flex justify-between items-center gap-3 px-4 sm:px-6 py-3 sm:py-4 bg-hm-surface border-b-[0.5px] border-hm-border sticky top-0 z-20">
      <div className="flex items-center gap-3 min-w-0">
        <MobileNav />
        <h1 className="font-sans text-lg font-semibold text-hm-text-primary leading-snug truncate">{title}</h1>
      </div>

      <div className="flex items-center gap-1 sm:gap-3 shrink-0">
        {action !== undefined ? action : <ScanAllButton />}

        <div aria-hidden="true" className="hidden sm:block h-6 w-[1px] bg-hm-border mx-1"></div>

        <LanguageToggle />
        <ThemeToggle />
        <NotificationBell />

        <Link href="/dashboard/profile" aria-label={t("nav.profile")}>
          {profile?.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              alt=""
              className="w-8 h-8 rounded-full object-cover border-[0.5px] border-hm-border ml-1 hover:ring-2 hover:ring-hm-border transition-all"
              src={profile.avatarUrl}
            />
          ) : (
            <div
              aria-hidden="true"
              className="w-8 h-8 rounded-full bg-hm-bg border-[0.5px] border-hm-border ml-1 hover:ring-2 hover:ring-hm-border transition-all flex items-center justify-center"
            >
              <span className="font-medium text-sm text-hm-text-primary">
                {profile?.name?.charAt(0) ?? profile?.githubLogin?.charAt(0) ?? "U"}
              </span>
            </div>
          )}
        </Link>
      </div>
    </header>
  );
};
