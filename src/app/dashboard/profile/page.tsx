import { ProfileContent } from "@/features/auth/components/ProfileContent";

export const metadata = {
  title: "Profile | Hashmark",
  description: "View your Hashmark profile and account details.",
};

export default function ProfilePage() {
  return (
    <div className="max-w-[720px] mx-auto py-10 px-6 w-full space-y-4">
      <div className="mb-8">
        <h2 className="font-medium text-2xl text-hm-text-primary">Profile</h2>
        <p className="text-sm text-hm-text-secondary mt-1">
          View your account details and manage your session.
        </p>
      </div>

      <ProfileContent />
    </div>
  );
}
