import { Navbar } from "@/widgets/Navbar";
import { RepoDetailContent } from "@/features/repos/components/RepoDetailContent";
import { getServerI18n } from "@/shared/i18n/server";

export default async function RepoDetailPage() {
  const { t } = await getServerI18n();

  return (
    <>
      <Navbar title={t("nav.repos")} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 w-full">
        <RepoDetailContent />
        <div className="h-12"></div>
      </div>
    </>
  );
}
