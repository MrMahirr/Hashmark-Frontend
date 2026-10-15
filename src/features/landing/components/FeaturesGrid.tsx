import { getServerI18n } from "@/shared/i18n/server";
import { Heading } from "@/shared/ui/Typography";
import { cn } from "@/shared/ui/cn";
import { DigestPanel, RepoMixPanel, TrendPanel } from "./FeaturePanels";
import { Wrap } from "./Wrap";
import type { ReactNode } from "react";

interface FeatureRowProps {
  index: 1 | 2 | 3;
  title: string;
  text: string;
  /** Sağdaki görsel panel. */
  children: ReactNode;
  reverse?: boolean;
  last?: boolean;
}

function FeatureRow({ index, title, text, children, reverse = false, last = false }: FeatureRowProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-14", reverse && "flex-row-reverse", !last && "mb-[120px]")}>
      <div className="flex min-w-0 flex-[1_1_340px] flex-col gap-5">
        <span className="font-mono text-sm font-bold text-hm-acc">{index} / 3</span>
        <Heading as="h3" className="text-[44px] leading-[1.05]">
          {title}
        </Heading>
        <p className="m-0 text-pretty text-lg leading-[1.6] text-hm-text-secondary">{text}</p>
      </div>
      {children}
    </div>
  );
}

/** "Özellikler" bölümü: üç zigzag satır (tarama, trend, haftalık özet). */
export async function FeaturesGrid() {
  const { t } = await getServerI18n();

  return (
    <Wrap>
      <section id="ozellikler" className="pb-10 pt-[120px]">
        <div className="mb-[88px] flex max-w-[760px] flex-col gap-5">
          <span className="font-mono text-[13px] uppercase tracking-[0.08em] text-hm-text-secondary">
            {t("landing.nav.features")}
          </span>
          <Heading as="h2" className="text-[40px] leading-[1.02] tracking-[-0.015em] sm:text-[60px]">
            {t("landing.features.title")}
          </Heading>
        </div>

        <FeatureRow index={1} title={t("landing.feature.1.title")} text={t("landing.feature.1.text")}>
          <RepoMixPanel />
        </FeatureRow>
        <FeatureRow index={2} reverse title={t("landing.feature.2.title")} text={t("landing.feature.2.text")}>
          <TrendPanel />
        </FeatureRow>
        <FeatureRow index={3} last title={t("landing.feature.3.title")} text={t("landing.feature.3.text")}>
          <DigestPanel />
        </FeatureRow>
      </section>
    </Wrap>
  );
}
