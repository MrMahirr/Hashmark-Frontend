import { Navbar } from "@/widgets/Navbar";
import { StatCard } from "@/features/dashboard/components/StatCard";
import { TrendChart } from "@/features/dashboard/components/TrendChart";
import { LabelDistribution } from "@/features/dashboard/components/LabelDistribution";
import { RecentDebts } from "@/features/dashboard/components/RecentDebts";
import { 
  MOCK_DASHBOARD_STATS, 
  MOCK_TREND_DATA, 
  MOCK_LABEL_DISTRIBUTION, 
  MOCK_RECENT_DEBTS 
} from "@/features/dashboard/mock/dashboard.mock";

export default function DashboardPage() {
  return (
    <>
      <Navbar title="Overview" />
      <div className="px-6 pb-6 flex flex-col gap-4 max-w-7xl mx-auto w-full">
        {/* Stat Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            title="Total debts" 
            value={MOCK_DASHBOARD_STATS.totalDebts} 
          />
          <StatCard 
            title="Added this week" 
            value={`+${MOCK_TREND_DATA[MOCK_TREND_DATA.length - 1].added}`} 
            badgeText="High" 
            badgeType="high" 
          />
          <StatCard 
            title="Resolved" 
            value={MOCK_DASHBOARD_STATS.resolvedDebts} 
            badgeText="Good" 
            badgeType="good" 
          />
          <StatCard 
            title="Repos" 
            value={MOCK_DASHBOARD_STATS.activeRepos} 
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 flex">
            <div className="w-full h-full min-w-0">
               <TrendChart data={MOCK_TREND_DATA} />
            </div>
          </div>
          <div className="flex">
            <div className="w-full h-full min-w-0">
              <LabelDistribution data={MOCK_LABEL_DISTRIBUTION} />
            </div>
          </div>
        </div>

        {/* Table: Recent Debts */}
        <RecentDebts debts={MOCK_RECENT_DEBTS} />
      </div>
    </>
  );
}
