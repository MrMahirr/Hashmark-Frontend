"use client";

import { useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useAuthCallback } from "../hooks/useAuth";
import { useI18n } from "@/shared/i18n/I18nProvider";

function OAuthCallbackContent() {
  const { t } = useI18n();
  const searchParams = useSearchParams();
  const { mutate: handleCallback, isError } = useAuthCallback();
  const isCalledRef = useRef(false);

  useEffect(() => {
    const code = searchParams.get("code");
    if (code && !isCalledRef.current) {
      isCalledRef.current = true;
      handleCallback({ code, state: searchParams.get("state") ?? "" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return (
    <main
      id="main-content"
      className="flex flex-col items-center justify-center space-y-8 p-6 text-center min-h-screen bg-hm-bg"
    >
      <div aria-hidden="true" className="font-mono text-[36px] font-medium text-hm-text-primary leading-none">
        #
      </div>

      <div
        aria-hidden="true"
        className="w-8 h-8 rounded-full border-[1.5px] border-hm-border border-t-hm-text-primary animate-spin"
      />

      <div className="flex flex-col gap-1 mt-4" role={isError ? "alert" : "status"}>
        <h1 className="text-[14px] font-medium text-hm-text-primary">
          {isError ? t("auth.callback.errorTitle") : t("auth.callback.connecting")}
        </h1>
        <p className="text-[12px] text-hm-text-secondary">
          {isError ? t("auth.callback.errorDescription") : t("auth.callback.soon")}
        </p>
      </div>
    </main>
  );
}

// useSearchParams kullandığımız için Next.js client-side Suspense Boundary'sine ihtiyaç duyar (Best Practice)
export function OAuthCallback() {
  return (
    <Suspense>
      <OAuthCallbackContent />
    </Suspense>
  );
}
