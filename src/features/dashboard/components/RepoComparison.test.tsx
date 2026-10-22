import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { DebtInsightsDto, RepoInsightsRowDto } from "../api/dashboard.types";

vi.mock("../api/dashboard.api", () => ({
  getHotspots: vi.fn(),
  getRepoComparison: vi.fn(),
  getReportSummary: vi.fn(),
  sendTestReport: vi.fn(),
}));
vi.mock("next/link", () => ({
  default: ({ href, children, ...rest }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

import { getRepoComparison } from "../api/dashboard.api";
import { axeViolations, renderWithQuery } from "@/test/helpers";
import { RepoComparison } from "./RepoComparison";

function insights(weightedDebt: number, overrides: Partial<DebtInsightsDto> = {}): DebtInsightsDto {
  return {
    openDebts: weightedDebt,
    ageBuckets: [],
    staleCount: 0,
    rotScore: 0,
    averageAgeDays: 0,
    priorityCounts: { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0, NONE: 0 },
    autoPriorityCount: 0,
    secretCount: 0,
    weightedDebt,
    estimatedHours: weightedDebt * 2,
    hourlyRate: null,
    currency: null,
    estimatedCost: null,
    ...overrides,
  };
}

const ROWS: RepoInsightsRowDto[] = [
  { repoId: 1, fullName: "o/messy", lastScannedAt: "2026-10-01T00:00:00", insights: insights(60, { staleCount: 4, secretCount: 1 }) },
  { repoId: 2, fullName: "o/clean", lastScannedAt: "2026-10-01T00:00:00", insights: insights(2) },
  { repoId: 3, fullName: "o/new", lastScannedAt: null, insights: insights(0) },
];

function repoNames() {
  return within(screen.getByRole("table"))
    .getAllByRole("row")
    .slice(1)
    .map((row) => within(row).getByRole("link").textContent);
}

describe("RepoComparison", () => {
  beforeEach(() => {
    vi.mocked(getRepoComparison).mockReset();
  });

  it("en sağlıklı depo önde, taranmamış depo sonda; başlıkla sıralanır", async () => {
    vi.mocked(getRepoComparison).mockResolvedValue(ROWS);
    const user = userEvent.setup();
    const { container } = renderWithQuery(<RepoComparison />);

    await screen.findByRole("table");
    expect(repoNames()).toEqual(["o/clean", "o/messy", "o/new"]);
    expect(screen.getByLabelText("Not A")).toBeInTheDocument();
    expect(screen.getByLabelText("Not D")).toBeInTheDocument();
    expect(screen.getByText("henüz taranmadı")).toBeInTheDocument();
    expect(screen.getAllByText("1 sızan sır").length).toBeGreaterThan(0);

    await user.click(screen.getByRole("button", { name: /90\+ gün/ }));
    expect(repoNames()).toEqual(["o/clean", "o/messy", "o/new"]);
    await user.click(screen.getByRole("button", { name: /90\+ gün/ }));
    expect(repoNames()).toEqual(["o/messy", "o/clean", "o/new"]);

    expect(await axeViolations(container)).toEqual([]);
  });

  it("tek depoda gösterilmez", async () => {
    vi.mocked(getRepoComparison).mockResolvedValue([ROWS[0]]);
    const { container } = renderWithQuery(<RepoComparison />);

    await new Promise((r) => setTimeout(r, 20));
    expect(container).toBeEmptyDOMElement();
  });
});
