"use client";

import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useDeleteAccount, useLogout } from "@/features/auth/hooks/useAuth";
import { ConfirmDialog } from "@/shared/components/ConfirmDialog";
import { useUserProfile } from "@/features/auth/hooks/useUserProfile";
import { LanguageToggle, ThemeToggle } from "@/shared/components/AppearanceToggles";
import { queryKeys } from "@/shared/api/query-keys";
import { useI18n } from "@/shared/i18n/I18nProvider";
import { useToastStore } from "@/shared/store/toast.store";
import { Button } from "@/shared/ui/Button";
import { Panel } from "@/shared/ui/Panel";
import { ErrorState, LoadingState } from "@/shared/ui/StateViews";
import { Heading } from "@/shared/ui/Typography";
import { POLICY_OUTDATED, errorCode } from "../api/consent.api";
import { useAcceptConsent, useConsentPolicy } from "../hooks/useConsent";
import { PolicyText } from "./PolicyText";

/**
 * Onay ekranı (plan 5.10): metin backend'den gelir, kutu varsayılan olarak BOŞTUR, onay gösterilen metnin
 * sürüm + özetiyle kaydedilir. Reddeden kullanıcı çıkış yapabilir ya da hesabını silebilir.
 */
export function ConsentPageContent() {
  const { t, locale, formatDate } = useI18n();
  const router = useRouter();
  const queryClient = useQueryClient();
  const addToast = useToastStore((state) => state.addToast);
  const checkboxId = useId();
  const policy = useConsentPolicy(locale);
  const profile = useUserProfile();
  const accept = useAcceptConsent();
  const logout = useLogout();
  const deleteAccount = useDeleteAccount();
  const [checked, setChecked] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const alreadyAccepted = profile.data && !profile.data.consentRequired && profile.data.consentAcceptedAt;

  const onAccept = () => {
    if (!policy.data) return;
    accept.mutate(policy.data, {
      onSuccess: () => router.replace("/dashboard"),
      onError: (err) => {
        if (errorCode(err) === POLICY_OUTDATED) {
          // Metin bu sırada değişti: yenisini göster, kullanıcı yeniden okusun
          setChecked(false);
          queryClient.invalidateQueries({ queryKey: queryKeys.consent.policy(locale) });
          addToast({ title: t("consent.outdated"), type: "error" });
        } else {
          addToast({ title: t("consent.failed"), type: "error" });
        }
      },
    });
  };

  return (
    <main id="main-content" className="flex min-h-screen justify-center bg-hm-bg px-4 py-8 sm:py-12">
      <div className="flex w-full max-w-[760px] flex-col gap-6">
        <div className="flex flex-wrap items-center justify-end gap-2.5">
          <LanguageToggle />
          <ThemeToggle />
        </div>

        <div className="flex flex-col gap-2">
          <Heading as="h1" className="text-[40px] leading-[1.05]">
            {t("consent.title")}
          </Heading>
          <p className="m-0 text-base leading-normal text-hm-text-secondary">{t("consent.intro")}</p>
        </div>

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

            {alreadyAccepted ? (
              <p role="status" className="m-0 text-base text-hm-text-primary">
                {t("consent.alreadyAccepted", { date: formatDate(profile.data!.consentAcceptedAt!) })}
              </p>
            ) : (
              <div className="flex flex-col gap-5">
                <label htmlFor={checkboxId} className="flex cursor-pointer items-start gap-3 text-base text-hm-text-primary">
                  <input
                    id={checkboxId}
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => setChecked(e.target.checked)}
                    className="mt-1 h-4 w-4 accent-hm-acc"
                  />
                  <span>{t("consent.checkbox")}</span>
                </label>
                <div className="flex flex-wrap gap-3">
                  <Button onClick={onAccept} disabled={!checked} isLoading={accept.isPending}>
                    {t("consent.accept")}
                  </Button>
                  <Button variant="outline" onClick={() => logout.mutate()} isLoading={logout.isPending}>
                    {t("consent.decline")}
                  </Button>
                </div>
                <p className="m-0 text-sm text-hm-text-secondary">
                  {t("consent.declineHint")}{" "}
                  <button
                    type="button"
                    onClick={() => setDeleteOpen(true)}
                    className="cursor-pointer border-0 bg-transparent p-0 text-sm text-hm-text-primary underline underline-offset-2"
                  >
                    {t("consent.deleteLink")}
                  </button>
                </p>
              </div>
            )}
          </Panel>
        )}
      </div>

      <ConfirmDialog
        open={deleteOpen}
        title={t("settings.account.deleteTitle")}
        confirmLabel={t("settings.account.delete")}
        pending={deleteAccount.isPending}
        onCancel={() => setDeleteOpen(false)}
        onConfirm={() =>
          deleteAccount.mutate(undefined, {
            onError: () => addToast({ title: t("settings.account.deleteFailed"), type: "error" }),
          })
        }
      >
        <p className="m-0">{t("settings.account.deleteText")}</p>
      </ConfirmDialog>
    </main>
  );
}
