"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ErrorFallback, fallbackButtonClass, fallbackLinkClass } from "@/shared/components/ErrorFallback";

/** Panel içinde oluşan hatalar yalnızca içerik alanını değiştirir; kenar çubuğu çalışmaya devam eder. */
export default function DashboardError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <ErrorFallback
      title="Bu sayfa yüklenemedi"
      description="Veriler alınırken veya gösterilirken bir hata oluştu. Lütfen tekrar deneyin."
      digest={error.digest}
      actions={
        <>
          <button type="button" className={fallbackButtonClass} onClick={() => unstable_retry()}>
            Tekrar dene
          </button>
          <Link href="/dashboard" className={fallbackLinkClass}>
            Panele dön
          </Link>
        </>
      }
    />
  );
}
