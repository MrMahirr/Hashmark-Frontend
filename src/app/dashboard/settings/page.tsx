import { ProfileSection } from "@/features/settings/components/ProfileSection";
import { NotificationSettings } from "@/features/settings/components/NotificationSettings";
import { ConnectedRepos } from "@/features/settings/components/ConnectedRepos";

export const metadata = {
  title: "Settings | Hashmark",
  description: "Manage your Hashmark account and preferences.",
};

export default function SettingsPage() {
  return (
    <div className="max-w-[560px] mx-auto py-10 px-6 w-full space-y-4">
      <div className="mb-8">
        <h2 className="font-medium text-2xl text-hm-text-primary">Settings</h2>
        <p className="text-sm text-hm-text-secondary mt-1">
          Manage your account and scan preferences.
        </p>
      </div>

      <ProfileSection />
      <NotificationSettings />
      <ConnectedRepos />
    </div>
  );
}
