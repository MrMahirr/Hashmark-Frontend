import { FolderOpen, TrendingUp, Mail } from "lucide-react";
import { getServerI18n } from "@/shared/i18n/server";

export async function FeaturesGrid() {
  const { t } = await getServerI18n();

  const features = [
    { icon: FolderOpen, title: t("landing.feature.scan.title"), text: t("landing.feature.scan.text") },
    { icon: TrendingUp, title: t("landing.feature.trend.title"), text: t("landing.feature.trend.text") },
    { icon: Mail, title: t("landing.feature.report.title"), text: t("landing.feature.report.text") },
  ];

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
      {features.map(({ icon: Icon, title, text }) => (
        <div
          key={title}
          className="bg-hm-surface border-[0.5px] border-hm-border rounded-card p-5 flex flex-col gap-4"
        >
          <div className="bg-hm-border-light w-10 h-10 rounded-control flex items-center justify-center">
            <Icon aria-hidden="true" className="w-5 h-5 text-hm-text-primary" />
          </div>
          <div className="flex flex-col gap-1.5">
            <h3 className="text-[14px] font-medium text-hm-text-primary">{title}</h3>
            <p className="font-mono text-[12px] text-hm-text-secondary leading-relaxed">{text}</p>
          </div>
        </div>
      ))}
    </section>
  );
}
