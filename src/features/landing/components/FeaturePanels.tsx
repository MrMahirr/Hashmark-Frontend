import type { CSSProperties } from "react";
import { getServerI18n } from "@/shared/i18n/server";
import { Heading } from "@/shared/ui/Typography";
import { Highlight } from "@/shared/ui/Highlight";
import { Panel } from "@/shared/ui/Panel";
import { TagBadge, tagColor } from "@/shared/ui/TagBadge";

const PANEL = "min-w-0 flex-[1.4_1_460px]";
const META = "font-mono text-xs uppercase tracking-[0.06em] text-hm-text-secondary";
const SAMPLE = "font-mono text-xs text-hm-text-secondary";

const MIX_TAGS = ["TODO", "FIXME", "HACK", "XXX"] as const;
const REPOS = [
  { name: "payments-api", total: 412, width: 100, parts: [190, 120, 70, 32] },
  { name: "web-storefront", total: 268, width: 65, parts: [140, 70, 40, 18] },
  { name: "infra-modules", total: 131, width: 32, parts: [50, 30, 41, 10] },
  { name: "mobile-app", total: 97, width: 24, parts: [60, 22, 11, 4] },
];

/** 01 — depo başına yığılmış işaret dağılımı. */
export async function RepoMixPanel() {
  const { t } = await getServerI18n();

  return (
    <Panel radius="landing" className={`${PANEL} flex flex-col gap-[22px] p-7`}>
      <div className="flex flex-wrap justify-between gap-3">
        <span className={META}>{t("landing.feature.1.meta")}</span>
        <span className={SAMPLE}>{t("landing.sample")}</span>
      </div>
      {REPOS.map((repo) => (
        <div key={repo.name} className="flex flex-col gap-2">
          <div className="flex justify-between gap-3 font-mono text-sm">
            <span className="font-medium">{repo.name}</span>
            <span className="text-hm-text-secondary">{repo.total}</span>
          </div>
          <div className="flex h-3.5 gap-[3px]" style={{ width: `${repo.width}%` }} aria-hidden="true">
            {repo.parts.map((n, i) => (
              <span
                key={MIX_TAGS[i]}
                className="min-w-1 rounded-[3px]"
                style={{ flex: `${n} 1 0`, background: tagColor(MIX_TAGS[i]) }}
              />
            ))}
          </div>
        </div>
      ))}
      <div className="flex flex-wrap gap-5 border-t border-hm-border">
        {MIX_TAGS.map((tag) => (
          <span key={tag} className="inline-flex items-center gap-2 pt-3.5 font-mono text-xs">
            <span aria-hidden="true" className="h-3 w-3 rounded-[3px]" style={{ background: tagColor(tag) }} />
            {tag}
          </span>
        ))}
      </div>
    </Panel>
  );
}

const SERIES = [34, 38, 41, 47, 52, 49, 58, 63, 61, 55, 48, 42];

/** 02 — haftalık açık işaret sayısı trendi. */
export async function TrendPanel() {
  const { t } = await getServerI18n();

  return (
    <Panel radius="landing" className={`${PANEL} flex flex-col gap-5 p-7`}>
      <div className="flex flex-wrap justify-between gap-3">
        <span className={META}>{t("landing.feature.2.meta")}</span>
        <span className={SAMPLE}>{t("landing.sample")}</span>
      </div>
      <div
        aria-hidden="true"
        className="flex h-[220px] items-end gap-1.5 border-b border-hm-text-primary"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, transparent 0 54px, var(--hm-border) 54px 55px)",
        }}
      >
        {SERIES.map((value, i) => (
          <div key={i} className="flex h-full flex-1 items-end justify-center">
            <span
              className="w-[9px] rounded-t-[5px]"
              style={{
                height: `${Math.round((value / 70) * 100)}%`,
                background:
                  i === SERIES.length - 1
                    ? "var(--hm-acc)"
                    : "color-mix(in srgb, var(--hm-text-primary) 45%, transparent)",
              }}
            />
          </div>
        ))}
      </div>
      <div className="flex justify-between font-mono text-xs text-hm-text-secondary">
        <span>{t("landing.feature.2.x1")}</span>
        <span>{t("landing.feature.2.x2")}</span>
        <span className="font-bold text-hm-text-primary">{t("landing.feature.2.x3")}</span>
      </div>
    </Panel>
  );
}

const DIGEST = [
  { tag: "FIXME", key: "landing.digest.1", repo: "payments-api", status: "landing.feature.3.closed" },
  { tag: "TODO", key: "landing.digest.2", repo: "web-storefront", status: "landing.feature.3.added" },
  { tag: "HACK", key: "landing.digest.3", repo: "infra-modules", status: "landing.feature.3.added" },
] as const;

function Figure({ value, label, highlight = false }: { value: string; label: string; highlight?: boolean }) {
  return (
    <div className="flex flex-col gap-1">
      <Heading as="span" className="text-[56px]">
        {highlight ? <Highlight>{value}</Highlight> : value}
      </Heading>
      <span className="font-mono text-xs uppercase tracking-[0.06em] text-hm-text-secondary">{label}</span>
    </div>
  );
}

/** 03 — haftalık özet e-postası önizlemesi. */
export async function DigestPanel() {
  const { t } = await getServerI18n();

  return (
    <Panel radius="landing" className={`${PANEL} overflow-hidden`}>
      <div className="flex flex-wrap justify-between gap-3 border-b border-hm-border px-7 py-[18px]">
        <span className="font-bold">{t("landing.feature.3.mail")}</span>
        <span className={SAMPLE}>{t("landing.sample")}</span>
      </div>
      <div className="flex flex-col gap-6 p-7">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(120px,100%),1fr))] gap-4">
          <Figure value="14" label={t("landing.feature.3.closed")} />
          <Figure value="9" label={t("landing.feature.3.added")} />
          <Figure value="−5" label={t("landing.feature.3.net")} highlight />
        </div>
        <ul className="m-0 flex list-none flex-col p-0">
          {DIGEST.map((row) => (
            <li
              key={row.key}
              style={{ "--c": tagColor(row.tag) } as CSSProperties}
              className="flex flex-wrap items-center gap-3.5 border-t border-hm-border py-3.5"
            >
              <TagBadge tag={row.tag} size="sm" />
              <span className="flex-[1_1_200px] text-[15px]">{t(row.key)}</span>
              <span className="font-mono text-xs text-hm-text-secondary">
                {row.repo} · {t(row.status)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Panel>
  );
}
