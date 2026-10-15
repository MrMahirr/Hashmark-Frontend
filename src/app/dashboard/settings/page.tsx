import type { Metadata } from "next";
import { ProfileSection } from "@/features/settings/components/ProfileSection";
import { NotificationSettings } from "@/features/settings/components/NotificationSettings";
import { AppearanceSettings } from "@/features/settings/components/AppearanceSettings";
import { ConnectedRepos } from "@/features/settings/components/ConnectedRepos";
import { getServerI18n } from "@/shared/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getServerI18n();
  return { title: t("meta.settings"), description: t("meta.settingsDescription") };
}

export default async function SettingsPage() {
  const { t } = await getServerI18n();

  return (
    <div className="max-w-[560px] mx-auto py-10 px-4 sm:px-6 w-full space-y-4">
      <div className="mb-8">
        <h2 className="font-medium text-2xl text-hm-text-primary">{t("settings.title")}</h2>
        <p className="text-sm text-hm-text-secondary mt-1">{t("settings.subtitle")}</p>
      </div>

      <ProfileSection />
      <AppearanceSettings />
      <NotificationSettings />
      <ConnectedRepos />
    </div>
  );
}
