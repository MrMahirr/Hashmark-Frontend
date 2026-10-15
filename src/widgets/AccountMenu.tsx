"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { useLogout } from "@/features/auth/hooks/useAuth";
import { useUserProfile } from "@/features/auth/hooks/useUserProfile";
import { useI18n } from "@/shared/i18n/I18nProvider";
import { Avatar } from "@/shared/ui/Avatar";
import { cn } from "@/shared/ui/cn";

const MENU_ITEM =
  "flex min-h-11 w-full cursor-pointer items-center rounded-[10px] px-3.5 text-left text-sm font-semibold text-hm-text-primary no-underline hover:bg-[color-mix(in_srgb,var(--hm-text-primary)_8%,transparent)]";

/** Üst çubuktaki hesap menüsü: baş harf düğmesi + `role="menu"` (Ayarlar, Çıkış). */
export function AccountMenu() {
  const { t } = useI18n();
  const { data: profile } = useUserProfile();
  const logout = useLogout();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();

  const displayName = profile?.name ?? profile?.githubLogin ?? t("nav.profile");

  // Dışarı tıklama ve Esc ile kapanır; Esc'de odak tetikleyiciye döner
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div className="relative" ref={containerRef}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        className={cn(
          "inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent p-0",
        )}
      >
        <span className="sr-only">{t("nav.account")}</span>
        <Avatar src={profile?.avatarUrl} name={displayName} size={44} />
      </button>

      {open && (
        <div
          id={menuId}
          role="menu"
          aria-label={t("nav.account")}
          className="absolute right-0 top-[52px] z-40 w-60 rounded-[14px] border border-hm-border bg-hm-surface p-2 shadow-[8px_8px_0_var(--hm-border)]"
        >
          <div className="mb-1.5 border-b border-hm-border px-3.5 pb-3 pt-2.5">
            <div className="truncate text-[15px] font-bold text-hm-text-primary">{displayName}</div>
            <div className="font-mono text-xs text-hm-text-secondary">GitHub</div>
          </div>
          <Link href="/dashboard/settings" role="menuitem" className={MENU_ITEM} onClick={() => setOpen(false)}>
            {t("nav.settings")}
          </Link>
          <button
            type="button"
            role="menuitem"
            className={MENU_ITEM}
            disabled={logout.isPending}
            onClick={() => {
              if (!logout.isPending) logout.mutate();
            }}
          >
            {logout.isPending ? t("common.loggingOut") : t("common.logout")}
          </button>
        </div>
      )}
    </div>
  );
}
