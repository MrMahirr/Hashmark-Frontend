import type { Metadata } from "next";
import { ProfileContent } from "@/features/auth/components/ProfileContent";
import { getServerI18n } from "@/shared/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getServerI18n();
  return { title: `${t("profile.title")} | Hashmark`, description: t("profile.subtitle") };
}

export default async function ProfilePage() {
  const { t } = await getServerI18n();

  return (
    <div className="max-w-[720px] mx-auto py-10 px-4 sm:px-6 w-full space-y-4">
      <div className="mb-8">
        <h2 className="font-medium text-2xl text-hm-text-primary">{t("profile.title")}</h2>
        <p className="text-sm text-hm-text-secondary mt-1">{t("profile.subtitle")}</p>
      </div>

      <ProfileContent />
    </div>
  );
}
