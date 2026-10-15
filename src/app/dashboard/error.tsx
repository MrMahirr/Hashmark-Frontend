"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ErrorFallback, fallbackButtonClass, fallbackLinkClass } from "@/shared/components/ErrorFallback";
import { useI18n } from "@/shared/i18n/I18nProvider";

/** Panel içinde oluşan hatalar yalnızca içerik alanını değiştirir; kenar çubuğu çalışmaya devam eder. */
export default function DashboardError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  const { t } = useI18n();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <ErrorFallback
      title={t("error.dashboard.title")}
      description={t("error.dashboard.description")}
      digest={error.digest ? t("error.code", { code: error.digest }) : undefined}
      actions={
        <>
          <button type="button" className={fallbackButtonClass} onClick={() => unstable_retry()}>
            {t("common.tryAgain")}
          </button>
          <Link href="/dashboard" className={fallbackLinkClass}>
            {t("error.dashboard.back")}
          </Link>
        </>
      }
    />
  );
}
