import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { DebtInsightsDto } from "../api/dashboard.types";

vi.mock("next/link", () => ({
  default: ({ href, children, ...rest }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

import { DebtInsights } from "./DebtInsights";
import { axeViolations } from "@/test/helpers";

function insights(overrides: Partial<DebtInsightsDto> = {}): DebtInsightsDto {
  return {
    openDebts: 6,
    ageBuckets: [
      { key: "0-30", minDays: 0, maxDays: 30, count: 2 },
      { key: "30-90", minDays: 30, maxDays: 90, count: 1 },
      { key: "90-180", minDays: 90, maxDays: 180, count: 2 },
      { key: "180-365", minDays: 180, maxDays: 365, count: 0 },
      { key: "365+", minDays: 365, maxDays: null, count: 1 },
    ],
    staleCount: 3,
    rotScore: 42,
    averageAgeDays: 120,
    priorityCounts: { CRITICAL: 1, HIGH: 2, MEDIUM: 0, LOW: 0, NONE: 3 },
    autoPriorityCount: 2,
    secretCount: 0,
    weightedDebt: 9,
    estimatedHours: 18,
    hourlyRate: null,
    currency: null,
    estimatedCost: null,
    ...overrides,
  };
}

describe("DebtInsights", () => {
  it("çürüme, acil borç ve yaş dağılımını depo süzgeçli bağlantılarla gösterir", () => {
    render(<DebtInsights insights={insights()} grade="B" healthScore={86} repoId="5" />);

    expect(screen.getByText("42")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "3 borç 90+ gündür açık →" })).toHaveAttribute(
      "href",
      "/dashboard/debts?repoId=5&olderThanDays=90&debtOnly=1",
    );
    expect(screen.getByRole("link", { name: "1 kritik borç →" })).toHaveAttribute(
      "href",
      "/dashboard/debts?repoId=5&priority=CRITICAL",
    );
    expect(screen.getByRole("link", { name: "365+ gün" })).toHaveAttribute(
      "href",
      "/dashboard/debts?repoId=5&olderThanDays=365&debtOnly=1",
    );
    // Boş aralık bağlantı değildir
    expect(screen.queryByRole("link", { name: "180–365 gün" })).not.toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("ücret yoksa saati gösterir ve ayarlara yönlendirir", () => {
    render(<DebtInsights insights={insights()} grade="B" healthScore={86} />);

    expect(screen.getByText("18 sa")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Saatlik ücret ayarla →" })).toHaveAttribute(
      "href",
      "/dashboard/settings#cost",
    );
  });

  it("ücret varsa para birimiyle tutarı gösterir", () => {
    render(
      <DebtInsights
        insights={insights({ hourlyRate: 50, currency: "USD", estimatedCost: 900 })}
        grade="B"
        healthScore={86}
      />,
    );

    expect(screen.getByText(/\$900|900\s?\$/)).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Saatlik ücret ayarla →" })).not.toBeInTheDocument();
  });

  it("sızan sır varsa uyarı ve sır süzgeci bağlantısı", async () => {
    const { container } = render(<DebtInsights insights={insights({ secretCount: 2 })} grade="D" healthScore={20} />);

    expect(screen.getByRole("alert")).toHaveTextContent("2 yorumda sızmış sır");
    expect(screen.getByRole("link", { name: "Sırları gör →" })).toHaveAttribute("href", "/dashboard/debts?secret=1");
    expect(await axeViolations(container)).toEqual([]);
  });
});
