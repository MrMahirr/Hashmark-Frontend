import { getServerI18n } from "@/shared/i18n/server";
import { intlLocale } from "@/shared/i18n/locales";
import { Heading } from "@/shared/ui/Typography";
import { fetchPublicStats } from "../api/public-stats";
import { Wrap } from "./Wrap";

/**
 * Üç sayaç bandı. İlk ikisi gerçek verilerdir (`/public/stats`); API ulaşılamazsa
 * örnek rakamlara düşülür ve altında "örnek veri" etiketi gösterilir.
 */
export async function StatsRow() {
  const { t, locale } = await getServerI18n();
  const stats = await fetchPublicStats();
  const format = (n: number) => new Intl.NumberFormat(intlLocale(locale)).format(n);

  const items = [
    {
      key: "1",
      value: stats ? format(stats.trackedMarkers) : t("landing.stats.1.value"),
      label: t("landing.stats.1.label"),
    },
    {
      key: "2",
      value: stats ? format(stats.repositories) : t("landing.stats.2.value"),
      label: t("landing.stats.2.label"),
    },
    { key: "3", value: t("landing.stats.3.value"), label: t("landing.stats.3.label") },
  ];

  return (
    <section className="border-y border-hm-border">
      <Wrap>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))]">
          {items.map((item) => (
            <div key={item.key} className="flex flex-col gap-3.5 py-12 pr-8">
              <Heading as="span" className="text-[72px] leading-[0.95] tracking-[-0.02em] sm:text-[104px]">
                {item.value}
              </Heading>
              <span className="font-mono text-sm uppercase tracking-[0.06em] text-hm-text-secondary">
                {item.label}
              </span>
            </div>
          ))}
        </div>
        {!stats && <p className="m-0 pb-4 font-mono text-xs text-hm-text-secondary">{t("landing.sample")}</p>}
      </Wrap>
    </section>
  );
}
