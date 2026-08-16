import { ProfileSection } from "@/features/settings/components/ProfileSection";
import { NotificationSettings } from "@/features/settings/components/NotificationSettings";
import { ConnectedRepos } from "@/features/settings/components/ConnectedRepos";

export const metadata = {
  title: "Ayarlar | Hashmark",
  description: "Hashmark hesabınızı ve tercihlerinizi yönetin.",
};

export default function SettingsPage() {
  return (
    <div className="max-w-[560px] mx-auto py-10 px-6 w-full space-y-4">
      <div className="mb-8">
        <h2 className="font-medium text-2xl text-hm-text-primary">Ayarlar</h2>
        <p className="text-sm text-hm-text-secondary mt-1">
          Hesap ve tarama tercihlerinizi yönetin.
        </p>
      </div>

      <ProfileSection />
      <NotificationSettings />
      <ConnectedRepos />
    </div>
  );
}
