import type { CSSProperties } from "react";
import { getServerI18n } from "@/shared/i18n/server";
import { Heading } from "@/shared/ui/Typography";
import { Panel } from "@/shared/ui/Panel";
import { tagColor } from "@/shared/ui/TagBadge";
import { Wrap } from "./Wrap";

const MARKERS = ["TODO", "FIXME", "HACK", "XXX", "NOTE", "DOC", "INFO"] as const;

/** Yedi işaret kartı: üzerine gelince yükselir. */
export async function MarkersSection() {
  const { t } = await getServerI18n();

  return (
    <Wrap>
      <section id="isaretler" className="py-[120px]">
        <div className="mb-14 flex max-w-[760px] flex-col gap-5">
          <span className="font-mono text-[13px] uppercase tracking-[0.08em] text-hm-text-secondary">
            {t("landing.nav.markers")}
          </span>
          <Heading as="h2" className="text-[40px] leading-[1.02] tracking-[-0.015em] sm:text-[60px]">
            {t("landing.markers.title")}
          </Heading>
        </div>
        <ul className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(min(250px,100%),1fr))] gap-5 p-0">
          {MARKERS.map((tag) => (
            <li key={tag} className="contents">
              <Panel
                radius="landing"
                style={{ "--c": tagColor(tag) } as CSSProperties}
                className="flex min-h-60 flex-col gap-4 p-7 transition-[transform,border-color] duration-200 hover:-translate-y-1 hover:border-hm-text-primary"
              >
                <span className="font-mono text-[44px] font-bold tracking-[-0.02em] text-[var(--c)]">{tag}</span>
                <span className="font-serif text-[28px] leading-[1.1]">{t(`landing.marker.${tag}.title` as const)}</span>
                <span className="text-base leading-[1.55] text-hm-text-secondary">
                  {t(`landing.marker.${tag}.text` as const)}
                </span>
              </Panel>
            </li>
          ))}
        </ul>
      </section>
    </Wrap>
  );
}
