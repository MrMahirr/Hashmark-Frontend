import { Navbar } from "@/widgets/Navbar";
import { ReposPageContent } from "@/features/repos/components/ReposPageContent";
import { getServerI18n } from "@/shared/i18n/server";

export default async function ReposPage() {
  const { t } = await getServerI18n();

  return (
    <>
      <Navbar title={t("nav.repos")} />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 w-full">
        <ReposPageContent />
      </div>
    </>
  );
}
