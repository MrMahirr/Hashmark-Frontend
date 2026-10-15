import type { Metadata } from "next";
import { Navbar } from "@/widgets/Navbar";
import { ProfileContent } from "@/features/auth/components/ProfileContent";
import { getServerI18n } from "@/shared/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getServerI18n();
  return { title: `${t("profile.title")} | Hashmark`, description: t("profile.subtitle") };
}

export default async function ProfilePage() {
  const { t } = await getServerI18n();

  return (
    <>
      <Navbar title={t("profile.title")} />
      <div className="flex w-full max-w-[960px] flex-col gap-5 px-4 py-5 sm:p-8">
        <ProfileContent />
      </div>
    </>
  );
}
