import { RecentDebt } from "@/shared/types/dashboard.types";
import { DEBT_TYPE_CONFIG } from "@/shared/types/debt.types";

interface RecentDebtsProps {
  debts: RecentDebt[];
}

export const RecentDebts = ({ debts }: RecentDebtsProps) => {
  return (
    <div className="bg-hm-surface border-[0.5px] border-hm-border rounded-card overflow-hidden">
      <div className="p-4 border-b-[0.5px] border-hm-border bg-hm-surface">
        <h2 className="font-sans text-sm font-medium text-hm-text-primary">Recent debts</h2>
      </div>
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-hm-bg border-b-[0.5px] border-hm-border font-sans text-sm font-medium text-hm-text-secondary">
              <th className="py-2 px-4 font-medium">Label</th>
              <th className="py-2 px-4 font-medium">File path</th>
              <th className="py-2 px-4 font-medium">Note</th>
              <th className="py-2 px-4 font-medium text-right">Date</th>
            </tr>
          </thead>
          <tbody className="font-sans text-sm text-hm-text-primary">
            {debts.map((debt) => {
              const config = DEBT_TYPE_CONFIG[debt.type];
              return (
                <tr
                  key={debt.id}
                  className="bg-hm-surface border-b-[0.5px] border-hm-border hover:bg-hm-bg transition-colors"
                >
                  <td className="py-3 px-4">
                    <span
                      className={`font-mono text-xs px-2 py-1 rounded ${config.bgClass} ${config.colorClass}`}
                    >
                      {debt.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-xs text-hm-text-secondary">
                    {debt.filePath}
                  </td>
                  <td className="py-3 px-4 truncate max-w-[200px]" title={debt.message}>
                    {debt.message}
                  </td>
                  <td className="py-3 px-4 text-right text-hm-text-secondary">
                    {debt.createdAt}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
