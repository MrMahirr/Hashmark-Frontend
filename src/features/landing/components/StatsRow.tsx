import { getServerI18n } from "@/shared/i18n/server";

export async function StatsRow() {
  const { t } = await getServerI18n();

  return (
    <section className="flex flex-wrap items-center gap-x-12 gap-y-6 border-y-thin border-hm-border py-8">
      <div className="flex flex-col gap-1">
        <span className="text-lg font-semibold text-hm-text-primary">2,400+</span>
        <span className="text-[12px] font-medium text-hm-text-secondary">{t("landing.stats.annotations")}</span>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-lg font-semibold text-hm-text-primary">180</span>
        <span className="text-[12px] font-medium text-hm-text-secondary">{t("landing.stats.repos")}</span>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-lg font-semibold text-hm-text-primary">{t("landing.stats.auto")}</span>
        <span className="text-[12px] font-medium text-hm-text-secondary">{t("landing.stats.weekly")}</span>
      </div>
    </section>
  );
}
