import { Navbar } from "@/widgets/Navbar";
import { DashboardOverviewContent } from "@/features/dashboard/components/DashboardOverviewContent";
import { getServerI18n } from "@/shared/i18n/server";

export default async function DashboardPage() {
  const { t } = await getServerI18n();

  return (
    <>
      <Navbar title={t("nav.overview")} />
      <div className="px-4 sm:px-6 pb-6 flex flex-col gap-4 max-w-7xl mx-auto w-full">
        <DashboardOverviewContent />
      </div>
    </>
  );
}
