import { Navbar } from "@/widgets/Navbar";
import { ReposPageContent } from "@/features/repos/components/ReposPageContent";
import { getServerI18n } from "@/shared/i18n/server";

export default async function ReposPage() {
  const { t } = await getServerI18n();

  return (
    <>
      <Navbar title={t("nav.repos")} />
      <div className="w-full px-4 py-5 sm:p-8">
        <ReposPageContent />
      </div>
    </>
  );
}
