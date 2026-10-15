import Link from "next/link";
import type { Metadata } from "next";
import { ErrorFallback, fallbackLinkClass } from "@/shared/components/ErrorFallback";

export const metadata: Metadata = {
  title: "Sayfa bulunamadı | Hashmark",
};

export default function NotFound() {
  return (
    <ErrorFallback
      fullScreen
      title="Sayfa bulunamadı"
      description="Aradığınız sayfa taşınmış, silinmiş veya hiç var olmamış olabilir."
      actions={
        <>
          <Link href="/dashboard" className={fallbackLinkClass}>
            Panele git
          </Link>
          <Link href="/" className={fallbackLinkClass}>
            Ana sayfa
          </Link>
        </>
      }
    />
  );
}
