"use client";

import { useEffect } from "react";
import "./globals.css";
import { createTranslator, readLocaleFromCookie } from "@/shared/i18n";

/**
 * Kök layout'un kendisi çöktüğünde devreye girer; bu yüzden kendi <html> ve <body> etiketlerini
 * içermelidir ve Providers/yönlendirme bileşenlerine dayanmamalıdır (düz <a> kullanılır).
 * Dil, sağlayıcı olmadığı için doğrudan çerezden okunur.
 */
export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  const locale = readLocaleFromCookie();
  const t = createTranslator(locale);

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang={locale}>
      <body className="min-h-screen bg-hm-bg font-sans text-hm-text-primary antialiased">
        <div role="alert" className="min-h-screen flex flex-col items-center justify-center gap-4 p-6 text-center">
          <div aria-hidden="true" className="font-mono text-[36px] font-medium leading-none">#</div>
          <h1 className="text-[16px] font-medium">{t("error.global.title")}</h1>
          <p className="text-[13px] text-hm-text-secondary max-w-[420px]">{t("error.global.description")}</p>
          {error.digest ? (
            <p className="text-[11px] font-mono text-hm-text-secondary">{t("error.code", { code: error.digest })}</p>
          ) : null}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => unstable_retry()}
              className="h-10 px-5 rounded-full text-[13px] font-medium bg-hm-text-primary text-hm-surface"
            >
              {t("common.tryAgain")}
            </button>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a
              href="/"
              className="inline-flex items-center h-10 px-5 rounded-full text-[13px] font-medium border-[0.5px] border-hm-border"
            >
              {t("common.homepage")}
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
