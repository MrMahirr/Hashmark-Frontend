"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useUserProfile } from "@/features/auth/hooks/useUserProfile";
import { useLogout } from "@/features/auth/hooks/useAuth";
import { useI18n } from "@/shared/i18n/I18nProvider";
import { intlLocale } from "@/shared/i18n/locales";
import { Avatar } from "@/shared/ui/Avatar";
import { Button } from "@/shared/ui/Button";
import { Panel } from "@/shared/ui/Panel";

function DetailRow({ label, children, mono = false }: { label: string; children: React.ReactNode; mono?: boolean }) {
  return (
    <div className="grid grid-cols-1 gap-1 border-t border-hm-border py-4 first:border-t-0 md:grid-cols-3 md:gap-4">
      <dt className="font-mono text-xs uppercase tracking-[0.06em] text-hm-text-secondary">{label}</dt>
      <dd className={`m-0 text-[15px] text-hm-text-primary md:col-span-2 ${mono ? "font-mono" : ""}`}>{children}</dd>
    </div>
  );
}

export function ProfileContent() {
  const { t, locale } = useI18n();
  const { data: profile, isLoading, isError } = useUserProfile();
  const logoutMutation = useLogout();

  // Hydration hatasını önlemek için client-side mount kontrolü
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  if (isLoading) {
    return (
      <div role="status" className="flex items-center justify-center gap-2 py-20 text-sm text-hm-text-secondary">
        <Loader2 className="h-5 w-5 animate-spin text-hm-acc" aria-hidden="true" />
        {t("profile.loading")}
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div
        role="alert"
        className="rounded-card border border-hm-danger bg-hm-danger-bg p-4 text-sm text-hm-danger"
      >
        {t("profile.error")}
      </div>
    );
  }

  const joinDate = new Date(profile.createdAt).toLocaleDateString(intlLocale(locale), {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const displayName = profile.name ?? profile.githubLogin;

  return (
    <div className="flex flex-col gap-5">
      <Panel className="flex flex-wrap items-center justify-between gap-6 p-7">
        <div className="flex items-center gap-5">
          <Avatar src={profile.avatarUrl} name={displayName} size={64} />
          <div>
            <h2 className="m-0 font-serif text-[32px] font-normal leading-none text-hm-text-primary">{displayName}</h2>
            <p className="m-0 mt-1.5 text-sm text-hm-text-secondary">{profile.email ?? t("profile.noEmail")}</p>
          </div>
        </div>

        <Button
          variant="outline"
          onClick={() => {
            if (!logoutMutation.isPending) logoutMutation.mutate();
          }}
          isLoading={logoutMutation.isPending}
        >
          {logoutMutation.isPending ? t("common.loggingOut") : t("common.logout")}
        </Button>
      </Panel>

      <Panel className="overflow-hidden">
        <div className="border-b border-hm-border px-7 py-4">
          <h2 className="m-0 text-base font-bold text-hm-text-primary">{t("profile.details")}</h2>
        </div>
        <dl className="m-0 px-7">
          <DetailRow label={t("profile.githubUser")} mono>
            @{profile.githubLogin}
          </DetailRow>
          <DetailRow label={t("profile.email")}>{profile.email ?? t("profile.noEmail")}</DetailRow>
          <DetailRow label={t("profile.joined")}>{joinDate}</DetailRow>
        </dl>
      </Panel>
    </div>
  );
}
