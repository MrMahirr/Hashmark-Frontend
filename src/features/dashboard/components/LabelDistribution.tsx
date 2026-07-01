import { LabelDistribution as ILabelDistribution } from "@/shared/types/dashboard.types";
import { DebtType } from "@/shared/types/debt.types";

interface LabelDistributionProps {
  data: ILabelDistribution[];
}

export const LabelDistribution = ({ data }: LabelDistributionProps) => {
  const getLabelColor = (type: DebtType) => {
    switch (type) {
      case DebtType.TODO:
        return "bg-[#D97706]";
      case DebtType.FIXME:
        return "bg-[#DC2626]";
      case DebtType.HACK:
        return "bg-[#EA580C]";
      case DebtType.XXX:
        return "bg-[#7C3AED]";
      default:
        return "bg-hm-border";
    }
  };

  return (
    <div className="bg-hm-surface border-[0.5px] border-hm-border rounded-card p-4 flex flex-col min-h-[300px]">
      <h2 className="font-sans text-sm font-medium text-hm-text-primary mb-6">By label</h2>
      <div className="flex-1 flex flex-col gap-4 justify-center">
        {data.map((item) => (
          <div key={item.type} className="flex items-center gap-3">
            <span className="font-mono text-xs text-hm-text-secondary w-12">
              {item.type}
            </span>
            <div className="flex-1 h-2 bg-hm-bg rounded-full overflow-hidden">
              <div
                className={`h-full ${getLabelColor(item.type)}`}
                style={{ width: `${item.percentage}%` }}
              ></div>
            </div>
            <span className="font-sans text-sm text-hm-text-primary w-8 text-right">
              {item.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
