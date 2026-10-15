import { useMutation } from "@tanstack/react-query";
import { useI18n } from "@/shared/i18n/I18nProvider";
import { useToastStore } from "@/shared/store/toast.store";
import { sendTestEmail } from "../api/report.api";

/** Kullanıcıya deneme özeti gönderir; sağlayıcı yapılandırılmamışsa bunu açıkça bildirir. */
export function useSendTestEmail() {
  const { t } = useI18n();
  const addToast = useToastStore((state) => state.addToast);

  return useMutation({
    mutationFn: sendTestEmail,
    onSuccess: (result) => {
      if (!result.configured) {
        addToast({ title: t("settings.digest.testNotConfigured"), type: "info" });
      } else if (result.sent) {
        addToast({ title: t("settings.digest.testSent"), type: "success" });
      } else {
        addToast({ title: t("settings.digest.testFailed"), type: "error" });
      }
    },
    onError: () => addToast({ title: t("settings.digest.testFailed"), type: "error" }),
  });
}
