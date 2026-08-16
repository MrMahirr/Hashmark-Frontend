import { Navbar } from "@/widgets/Navbar";
import { DashboardOverviewContent } from "@/features/dashboard/components/DashboardOverviewContent";

export default function DashboardPage() {
  return (
    <>
      <Navbar title="Genel Bakış" />
      <div className="px-6 pb-6 flex flex-col gap-4 max-w-7xl mx-auto w-full">
        <DashboardOverviewContent />
      </div>
    </>
  );
}
