"use client";

import { useStartScan } from "@/features/scanner/hooks/useScanner";
import { ConfirmDialog } from "@/shared/components/ConfirmDialog";
import { useI18n } from "@/shared/i18n/I18nProvider";
import { useToastStore } from "@/shared/store/toast.store";
import { useAcknowledgePrivateRepo, usePrivateRepoNotice } from "../hooks/useConsent";
import { usePrivateAckStore } from "../store/private-ack.store";

/**
 * Özel depo ek onayı (plan 5.10, K1): tarama 403 PRIVATE_REPO_ACK_REQUIRED dönünce açılır, backend'in uyarı
 * metnini gösterir; onaylanırsa ack kaydedilir ve tarama yeniden başlatılır.
 */
export function PrivateRepoAckDialog() {
  const { t, locale } = useI18n();
  const addToast = useToastStore((state) => state.addToast);
  const repoId = usePrivateAckStore((state) => state.repoId);
  const clear = usePrivateAckStore((state) => state.clear);
  const notice = usePrivateRepoNotice(locale, repoId !== null);
  const ack = useAcknowledgePrivateRepo();
  const scan = useStartScan();

  const confirm = () => {
    if (!repoId) return;
    ack.mutate(repoId, {
      onSuccess: () => {
        clear();
        scan.mutate(repoId);
      },
      onError: () => addToast({ title: t("privateRepo.failed"), type: "error" }),
    });
  };

  return (
    <ConfirmDialog
      open={repoId !== null}
      title={t("privateRepo.title")}
      confirmLabel={t("privateRepo.confirm")}
      pending={ack.isPending}
      onCancel={clear}
      onConfirm={confirm}
    >
      <p className="m-0">{notice.data?.text ?? t("common.loading")}</p>
    </ConfirmDialog>
  );
}
