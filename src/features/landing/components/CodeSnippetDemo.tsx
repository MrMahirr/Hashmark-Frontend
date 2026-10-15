import { getServerI18n } from "@/shared/i18n/server";
import { Panel } from "@/shared/ui/Panel";
import { TagBadge, tagColor } from "@/shared/ui/TagBadge";
import type { CSSProperties } from "react";

type CodeLine =
  | { n: number; code: string }
  | { n: number; indent: string; tag: string; noteKey: "landing.code.note1" | "landing.code.note2" | "landing.code.note3" | "landing.code.note4" };

const LINES: CodeLine[] = [
  { n: 1, code: "public class PaymentProcessor {" },
  { n: 2, code: "" },
  { n: 3, indent: "    ", tag: "TODO", noteKey: "landing.code.note1" },
  { n: 4, code: "    public Receipt charge(Order order) {" },
  { n: 5, indent: "        ", tag: "FIXME", noteKey: "landing.code.note2" },
  { n: 6, code: "        var res = gateway.send(order.total());" },
  { n: 7, indent: "        ", tag: "HACK", noteKey: "landing.code.note3" },
  { n: 8, code: '        if (res.raw().startsWith("{")) res = parse(res);' },
  { n: 9, indent: "        ", tag: "XXX", noteKey: "landing.code.note4" },
  { n: 10, code: "        return Receipt.of(res);" },
  { n: 11, code: "    }" },
  { n: 12, code: "}" },
];

/** Hero'daki kod paneli: işaretli satırlar `--c` renginin %12 tonuyla vurgulanır. */
export async function CodeSnippetDemo() {
  const { t } = await getServerI18n();

  return (
    <Panel radius="landing" className="min-w-0 flex-[1_1_480px] overflow-hidden shadow-[12px_12px_0_var(--hm-border)]">
      <div className="flex items-center justify-between gap-3 border-b border-hm-border px-5 py-3.5">
        <span className="font-mono text-[13px] text-hm-text-secondary">PaymentProcessor.java</span>
        <span className="font-mono text-xs font-bold tracking-[0.06em]">{t("landing.code.count")}</span>
      </div>
      <div
        className="overflow-x-auto py-4 font-mono text-[13.5px] leading-7"
        role="region"
        aria-label="PaymentProcessor.java"
        tabIndex={0}
      >
        {LINES.map((line) => {
          const isTag = "tag" in line;
          return (
            <div
              key={line.n}
              style={isTag ? ({ "--c": tagColor(line.tag) } as CSSProperties) : undefined}
              className={`flex min-w-max pr-5 ${isTag ? "bg-[color-mix(in_srgb,var(--c)_12%,transparent)]" : ""}`}
            >
              <span className="w-12 flex-none select-none pr-4 text-right text-hm-text-secondary">{line.n}</span>
              {isTag ? (
                <span className="whitespace-pre">
                  {line.indent}
                  <span className="text-hm-text-secondary">{"// "}</span>
                  <TagBadge tag={line.tag} size="sm" flat className="tracking-[0.04em]" /> {t(line.noteKey)}
                </span>
              ) : (
                <span className="whitespace-pre">{line.code || " "}</span>
              )}
            </div>
          );
        })}
      </div>
    </Panel>
  );
}
