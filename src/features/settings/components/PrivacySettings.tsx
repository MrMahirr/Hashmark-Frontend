"use client";

import Link from "next/link";
import { useState } from "react";
import { useConsentStatus, useWithdrawConsent } from "@/features/consent/hooks/useConsent";
import { ConfirmDialog } from "@/shared/components/ConfirmDialog";
import { useI18n } from "@/shared/i18n/I18nProvider";
import { useToastStore } from "@/shared/store/toast.store";
import { Button, ButtonLink } from "@/shared/ui/Button";
import { FieldLabel, SettingsSection } from "./SettingsSection";

/**
 * Gizlilik ve veriler (plan 5.10): neyin saklandığının özeti, onay tarihi/sürümü, geri çekme.
 * Hesap silme Hesap panelindedir (ProfileSection).
 */
export function PrivacySettings() {
  const { t, formatDate } = useI18n();
  const addToast = useToastStore((state) => state.addToast);
  const status = useConsentStatus();
  const withdraw = useWithdrawConsent();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const accepted = status.data?.acceptedAt ? status.data : null;

  return (
    <SettingsSection id="privacy" title={t("settings.privacy.title")} description={t("settings.privacy.description")}>
      <ul className="m-0 flex list-disc flex-col gap-1.5 pl-5 text-base leading-relaxed text-hm-text-secondary">
        <li>{t("settings.privacy.stored")}</li>
        <li>{t("settings.privacy.notStored")}</li>
        <li>{t("settings.privacy.protection")}</li>
      </ul>

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <FieldLabel>{t("settings.privacy.consent")}</FieldLabel>
          <span className="font-mono text-[13px] text-hm-text-primary">
            {accepted
              ? t("settings.privacy.acceptedOn", {
                  date: formatDate(accepted.acceptedAt!),
                  version: String(accepted.acceptedVersion ?? ""),
                })
              : t("settings.privacy.notAccepted")}
          </span>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/privacy" className="self-center text-sm text-hm-text-secondary underline underline-offset-2">
            {t("settings.privacy.readPolicy")}
          </Link>
          {accepted ? (
            <Button variant="outline" onClick={() => setConfirmOpen(true)}>
              {t("settings.privacy.withdraw")}
            </Button>
          ) : (
            <ButtonLink href="/consent">{t("settings.privacy.give")}</ButtonLink>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title={t("settings.privacy.withdrawTitle")}
        confirmLabel={t("settings.privacy.withdraw")}
        pending={withdraw.isPending}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() =>
          withdraw.mutate(undefined, {
            onSuccess: () => {
              setConfirmOpen(false);
              addToast({ title: t("settings.privacy.withdrawn"), type: "success" });
            },
            onError: () => addToast({ title: t("settings.privacy.withdrawFailed"), type: "error" }),
          })
        }
      >
        <p className="m-0">{t("settings.privacy.withdrawText")}</p>
      </ConfirmDialog>
    </SettingsSection>
  );
}
