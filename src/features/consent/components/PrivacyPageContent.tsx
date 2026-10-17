"use client";

import Link from "next/link";
import { LanguageToggle, ThemeToggle } from "@/shared/components/AppearanceToggles";
import { useI18n } from "@/shared/i18n/I18nProvider";
import { Panel } from "@/shared/ui/Panel";
import { ErrorState, LoadingState } from "@/shared/ui/StateViews";
import { Heading } from "@/shared/ui/Typography";
import { useConsentPolicy } from "../hooks/useConsent";
import { PolicyText } from "./PolicyText";

/** Herkese açık aydınlatma metni: kullanıcı giriş yapmadan neyin işlendiğini okuyabilir (plan 5.10). */
export function PrivacyPageContent() {
  const { t, locale } = useI18n();
  const policy = useConsentPolicy(locale);

  return (
    <main id="main-content" className="flex min-h-screen justify-center bg-hm-bg px-4 py-8 sm:py-12">
      <div className="flex w-full max-w-[760px] flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <Link href="/" className="font-mono text-sm text-hm-text-secondary underline underline-offset-2">
            {t("common.homepage")}
          </Link>
          <div className="flex gap-2.5">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>
        <Heading as="h1" className="text-[40px] leading-[1.05]">
          {t("privacy.title")}
        </Heading>
        {policy.isLoading && <LoadingState label={t("common.loading")} className="min-h-[300px]" />}
        {policy.isError && (
          <ErrorState
            title={t("consent.loadFailed")}
            description={t("consent.loadFailedDescription")}
            retryLabel={t("common.retry")}
            onRetry={() => policy.refetch()}
          />
        )}
        {policy.data && (
          <Panel className="flex flex-col gap-7 p-7">
            <PolicyText text={policy.data.text} />
            <p className="m-0 font-mono text-xs text-hm-text-secondary">
              {t("consent.version", { version: String(policy.data.version) })}
            </p>
          </Panel>
        )}
      </div>
    </main>
  );
}
