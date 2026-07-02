import { Navbar } from "@/widgets/Navbar";
import { GlobalDebtTable } from "@/features/debts/components/GlobalDebtTable";
import { MOCK_GLOBAL_DEBTS } from "@/features/debts/mock/debts.mock";
import { RefreshCw } from "lucide-react";

export default function DebtsPage() {
  const title = (
    <div className="flex items-center gap-3">
      <h2 className="text-[16px] font-medium text-hm-text-primary leading-tight">All debts</h2>
      <span className="font-sans text-hm-text-secondary bg-hm-bg border-[0.5px] border-hm-border px-2 py-0.5 rounded-full text-xs">284 open</span>
    </div>
  );

  const action = (
    <button className="h-8 px-3 rounded-md bg-hm-text-primary text-hm-surface font-sans text-xs font-medium hover:bg-hm-text-primary/90 transition-colors flex items-center gap-2">
      <RefreshCw size={14} />
      Scan Now
    </button>
  );

  return (
    <div className="flex-1 flex flex-col h-full relative w-full overflow-hidden">
      <Navbar title={title} action={action} />
      
      <div className="flex-1 overflow-auto px-6 pb-6 pt-4 w-full">
        <div className="max-w-[1400px] mx-auto w-full flex flex-col h-full gap-4">
          <GlobalDebtTable data={MOCK_GLOBAL_DEBTS} />
        </div>
      </div>
    </div>
  );
}
