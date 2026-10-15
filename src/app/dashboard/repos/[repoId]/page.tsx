import { Navbar } from "@/widgets/Navbar";
import { RepoDetailContent } from "@/features/repos/components/RepoDetailContent";
import { getServerI18n } from "@/shared/i18n/server";

export default async function RepoDetailPage() {
  const { t } = await getServerI18n();

  return (
    <>
      <Navbar title={t("nav.repos")} />
      <div className="w-full px-4 py-5 sm:p-8">
        <RepoDetailContent />
      </div>
    </>
  );
}
