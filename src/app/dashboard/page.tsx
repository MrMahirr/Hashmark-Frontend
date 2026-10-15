import { Navbar } from "@/widgets/Navbar";
import { DashboardOverviewContent } from "@/features/dashboard/components/DashboardOverviewContent";
import { getServerI18n } from "@/shared/i18n/server";

export default async function DashboardPage() {
  const { t } = await getServerI18n();

  return (
    <>
      <Navbar title={t("nav.overview")} />
      <div className="mx-auto flex w-full flex-col gap-5 px-4 py-5 sm:p-8">
        <DashboardOverviewContent />
      </div>
    </>
  );
}
