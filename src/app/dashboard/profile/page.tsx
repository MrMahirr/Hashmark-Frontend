import { ProfileContent } from "@/features/auth/components/ProfileContent";

export const metadata = {
  title: "Profil | Hashmark",
  description: "Hashmark profil ve hesap bilgilerinizi görüntüleyin.",
};

export default function ProfilePage() {
  return (
    <div className="max-w-[720px] mx-auto py-10 px-6 w-full space-y-4">
      <div className="mb-8">
        <h2 className="font-medium text-2xl text-hm-text-primary">Profil</h2>
        <p className="text-sm text-hm-text-secondary mt-1">
          Hesap bilgilerinizi görüntüleyin ve oturumunuzu yönetin.
        </p>
      </div>

      <ProfileContent />
    </div>
  );
}
