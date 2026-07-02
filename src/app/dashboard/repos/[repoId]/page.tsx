import { Navbar } from "@/widgets/Navbar";
import { RepoHeader } from "@/features/repos/components/RepoHeader";
import { RepoStatsRow } from "@/features/repos/components/RepoStatsRow";
import { RepoModuleDistribution } from "@/features/repos/components/RepoModuleDistribution";
import { RepoDebtTable } from "@/features/repos/components/RepoDebtTable";
import { TrendChart } from "@/features/dashboard/components/TrendChart";
import { LabelDistribution } from "@/features/dashboard/components/LabelDistribution";

import { 
  MOCK_REPOS, 
  MOCK_REPO_MODULES, 
  MOCK_REPO_DEBTS 
} from "@/features/repos/mock/repos.mock";
import { MOCK_TREND_DATA, MOCK_LABEL_DISTRIBUTION } from "@/features/dashboard/mock/dashboard.mock";

interface RepoDetailPageProps {
  params: {
    repoId: string;
  };
}

export default function RepoDetailPage({ params }: RepoDetailPageProps) {
  const repo = MOCK_REPOS.find((r) => r.id === params.repoId) || MOCK_REPOS[0];

  return (
    <>
      <Navbar title="Repo Detail" />
      <div className="max-w-7xl mx-auto px-6 py-8 w-full">
        <RepoHeader repo={repo} />
        
        <RepoStatsRow 
          totalCount={repo.debtCount} 
          addedCount={9} 
          resolvedCount={3} 
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
          <div className="lg:col-span-2 flex">
            <div className="w-full min-w-0">
               <TrendChart data={MOCK_TREND_DATA} />
            </div>
          </div>
          <div className="flex">
            <div className="w-full min-w-0">
              <LabelDistribution data={MOCK_LABEL_DISTRIBUTION} />
            </div>
          </div>
        </div>
        
        <div className="mb-4">
          <RepoModuleDistribution data={MOCK_REPO_MODULES} />
        </div>
        
        <RepoDebtTable data={MOCK_REPO_DEBTS} />
        
        <div className="h-12"></div>
      </div>
    </>
  );
}
