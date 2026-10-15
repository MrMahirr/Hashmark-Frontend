"use client";

import Link from "next/link";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useUserProfile } from "@/features/auth/hooks/useUserProfile";
import { useDisconnectGithub, useGitHubLogin, useLogout } from "@/features/auth/hooks/useAuth";
import { ConfirmDialog } from "@/shared/components/ConfirmDialog";
import { useI18n } from "@/shared/i18n/I18nProvider";
import { useToastStore } from "@/shared/store/toast.store";
import { Avatar } from "@/shared/ui/Avatar";
import { Button } from "@/shared/ui/Button";
import { Panel } from "@/shared/ui/Panel";

const GithubGlyph = () => (
  <svg aria-hidden="true" width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.37-3.87-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.69 1.25 3.35.96.1-.74.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.62 1.59.23 2.76.11 3.05.74.81 1.18 1.83 1.18 3.09 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.79.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
  </svg>
);

/** Hesap paneli: GitHub bağlantısı (kes / yeniden bağlan) + çıkış. */
export function ProfileSection() {
  const { t } = useI18n();
  const addToast = useToastStore((state) => state.addToast);
  const { data: profile, isLoading } = useUserProfile();
  const logoutMutation = useLogout();
  const disconnect = useDisconnectGithub();
  const reconnect = useGitHubLogin();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteData, setDeleteData] = useState(false);

  if (isLoading) {
    return (
      <Panel role="status" className="flex items-center justify-center p-7">
        <Loader2 className="h-5 w-5 animate-spin text-hm-acc" aria-hidden="true" />
        <span className="sr-only">{t("common.loading")}</span>
      </Panel>
    );
  }

  if (!profile) return null;

  const displayName = profile.name ?? profile.githubLogin;
  const connected = profile.githubConnected !== false;

  return (
    <Panel className="flex flex-wrap items-center justify-between gap-5 p-7">
      <Link href="/dashboard/profile" className="flex items-center gap-[18px] text-hm-text-primary no-underline hover:opacity-80">
        {profile.avatarUrl ? (
          <Avatar src={profile.avatarUrl} name={displayName} size={52} />
        ) : (
          <span
            aria-hidden="true"
            className="inline-flex h-[52px] w-[52px] items-center justify-center rounded-full bg-hm-text-primary text-hm-bg"
          >
            <GithubGlyph />
          </span>
        )}
        <span className="flex flex-col gap-1">
          <span className="text-[17px] font-bold">{t("settings.account.title")}</span>
          <span className="font-mono text-[13px] text-hm-text-secondary">
            {displayName} ·{" "}
            {connected ? t("settings.account.connected") : t("settings.account.notConnected")}
          </span>
        </span>
      </Link>

      <div className="flex flex-wrap gap-3">
        {connected ? (
          <Button variant="outline" onClick={() => setConfirmOpen(true)}>
            {t("settings.account.disconnect")}
          </Button>
        ) : (
          <Button onClick={() => reconnect.mutate()} isLoading={reconnect.isPending}>
            {t("settings.account.reconnect")}
          </Button>
        )}
        <Button
          variant="outline"
          onClick={() => {
            if (!logoutMutation.isPending) logoutMutation.mutate();
          }}
          isLoading={logoutMutation.isPending}
        >
          {logoutMutation.isPending ? t("common.loggingOut") : t("common.logout")}
        </Button>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title={t("settings.account.disconnectTitle")}
        confirmLabel={t("settings.account.disconnect")}
        pending={disconnect.isPending}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() =>
          disconnect.mutate(deleteData, {
            onSuccess: () => {
              setConfirmOpen(false);
              setDeleteData(false);
              addToast({ title: t("settings.account.disconnected"), type: "success" });
            },
            onError: () => addToast({ title: t("settings.account.disconnectFailed"), type: "error" }),
          })
        }
      >
        <p className="m-0">{t("settings.account.disconnectText")}</p>
        <label className="mt-4 flex cursor-pointer items-center gap-3 text-sm font-semibold text-hm-text-primary">
          <input
            type="checkbox"
            checked={deleteData}
            onChange={(event) => setDeleteData(event.target.checked)}
            className="h-[18px] w-[18px] accent-[var(--hm-acc)]"
          />
          {t("settings.account.deleteData")}
        </label>
      </ConfirmDialog>
    </Panel>
  );
}
