import type { Metadata } from "next";
import { Navbar } from "@/widgets/Navbar";
import { ProfileSection } from "@/features/settings/components/ProfileSection";
import { NotificationSettings } from "@/features/settings/components/NotificationSettings";
import { AppearanceSettings } from "@/features/settings/components/AppearanceSettings";
import { PrivacySettings } from "@/features/settings/components/PrivacySettings";
import { getServerI18n } from "@/shared/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getServerI18n();
  return { title: t("meta.settings"), description: t("meta.settingsDescription") };
}

export default async function SettingsPage() {
  const { t } = await getServerI18n();

  return (
    <>
      <Navbar title={t("settings.title")} />
      <div className="flex w-full max-w-[960px] flex-col gap-5 px-4 py-5 sm:p-8">
        <AppearanceSettings />
        <NotificationSettings />
        <PrivacySettings />
        <ProfileSection />
      </div>
    </>
  );
}
