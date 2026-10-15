import type { Page } from "@playwright/test";

const AXE_PATH = require.resolve("axe-core/axe.min.js");

export interface AxeIssue {
  id: string;
  impact: string | null | undefined;
  help: string;
  nodes: string[];
}

/** Gerçek tarayıcıda axe-core (kontrast dahil) çalıştırır. */
export async function runAxe(page: Page): Promise<AxeIssue[]> {
  await page.addScriptTag({ path: AXE_PATH });
  const result = await page.evaluate(async () => {
    // @ts-expect-error axe sayfaya enjekte edilir
    const out = await window.axe.run(document, { resultTypes: ["violations"] });
    return out.violations.map((v: { id: string; impact: string; help: string; nodes: { target: string[]; failureSummary?: string }[] }) => ({
      id: v.id,
      impact: v.impact,
      help: v.help,
      nodes: v.nodes.slice(0, 6).map((n) => n.target.join(" ") + " :: " + (n.failureSummary ?? "").split("\n").slice(0, 3).join(" | ")),
    }));
  });
  return result as AxeIssue[];
}
