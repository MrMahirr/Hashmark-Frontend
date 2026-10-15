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
        <div role="alert" className="flex min-h-screen flex-col items-center justify-center gap-5 p-6 text-center">
          <div aria-hidden="true" className="font-mono text-[36px] font-medium leading-none">#</div>
          <h1 className="m-0 font-serif text-[44px] font-normal leading-none">{t("error.global.title")}</h1>
          <p className="m-0 max-w-[460px] text-base text-hm-text-secondary">{t("error.global.description")}</p>
          {error.digest ? (
            <p className="m-0 font-mono text-xs text-hm-text-secondary">{t("error.code", { code: error.digest })}</p>
          ) : null}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => unstable_retry()}
              className="inline-flex min-h-11 cursor-pointer items-center rounded-control bg-hm-btn px-5 text-[15px] font-bold text-hm-btn-fg shadow-[4px_4px_0_var(--hm-shadow)]"
            >
              {t("common.tryAgain")}
            </button>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a
              href="/"
              className="inline-flex min-h-11 items-center rounded-control border border-hm-border px-5 text-[15px] font-semibold text-hm-text-primary no-underline"
            >
              {t("common.homepage")}
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
