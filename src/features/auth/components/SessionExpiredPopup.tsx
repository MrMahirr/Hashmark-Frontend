"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { Dialog } from "@/shared/components/Dialog";
import { useI18n } from "@/shared/i18n/I18nProvider";

const REDIRECT_DELAY_MS = 3500;

export function SessionExpiredPopup() {
  const { t } = useI18n();
  const sessionExpired = useAuthStore((state) => state.sessionExpired);
  const clearTokens = useAuthStore((state) => state.clearTokens);
  const router = useRouter();

  useEffect(() => {
    if (!sessionExpired) return;

    let cleanup: ReturnType<typeof setTimeout> | undefined;
    const timer = setTimeout(() => {
      router.replace("/auth/login");
      // Yönlendirme başladıktan hemen sonra temizle
      cleanup = setTimeout(() => clearTokens(), 100);
    }, REDIRECT_DELAY_MS);

    return () => {
      clearTimeout(timer);
      if (cleanup) clearTimeout(cleanup);
    };
  }, [sessionExpired, clearTokens, router]);

  return (
    <Dialog open={sessionExpired} onClose={() => undefined} title={t("auth.session.title")}>
      <div role="alertdialog" className="flex flex-col items-center p-6 text-center">
        <div className="w-12 h-12 rounded-full bg-hm-danger-bg flex items-center justify-center mb-4 text-hm-danger">
          <AlertTriangle size={24} aria-hidden="true" />
        </div>
        <p className="text-sm text-hm-text-secondary mb-6">{t("auth.session.description")}</p>
        <div className="flex items-center justify-center gap-2 text-hm-acc text-sm font-semibold" role="status">
          <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
          {t("auth.session.redirecting")}
        </div>
      </div>
    </Dialog>
  );
}
