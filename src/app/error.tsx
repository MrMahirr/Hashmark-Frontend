"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ErrorFallback, fallbackButtonClass, fallbackLinkClass } from "@/shared/components/ErrorFallback";

export default function RootError({
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
      fullScreen
      title="Bir şeyler ters gitti"
      description="Beklenmeyen bir hata oluştu. Tekrar deneyebilir veya ana sayfaya dönebilirsiniz."
      digest={error.digest}
      actions={
        <>
          <button type="button" className={fallbackButtonClass} onClick={() => unstable_retry()}>
            Tekrar dene
          </button>
          <Link href="/" className={fallbackLinkClass}>
            Ana sayfa
          </Link>
        </>
      }
    />
  );
}
