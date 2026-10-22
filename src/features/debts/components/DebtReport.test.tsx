import { screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../api/debts.api", () => ({ exportDebts: vi.fn() }));
vi.mock("@/features/dashboard/api/dashboard.api", () => ({ getReportSummary: vi.fn() }));
vi.mock("@/features/repos/hooks/useRepos", () => ({
  useMappedRepos: () => ({ data: [{ id: "3", fullName: "octo/app" }] }),
}));

import { exportDebts } from "../api/debts.api";
import { getReportSummary } from "@/features/dashboard/api/dashboard.api";
import { renderWithQuery } from "@/test/helpers";
import { DebtReport, MAX_REPORT_ROWS } from "./DebtReport";

function debts(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    repoId: 3,
    repoFullName: "octo/app",
    filePath: `src/F${i}.ts`,
    lineNo: i + 1,
    label: "TODO",
    content: `iş ${i}`,
    detectedAt: "2026-01-01T00:00:00",
    resolvedAt: null,
    priority: i === 0 ? "HIGH" : null,
  }));
}

function mockData(count: number) {
  vi.mocked(exportDebts).mockResolvedValue({
    blob: new Blob([JSON.stringify(debts(count))], { type: "application/json" }),
    filename: "x.json",
  });
  vi.mocked(getReportSummary).mockResolvedValue({
    trendData: [],
    labelStats: { todoCount: count, fixmeCount: 0, hackCount: 0, xxxCount: 0 },
    topModules: [],
    insights: {
      openDebts: count, ageBuckets: [], staleCount: 1, rotScore: 30, averageAgeDays: 120,
      priorityCounts: { CRITICAL: 0, HIGH: 1, MEDIUM: 0, LOW: 0, NONE: 1 }, autoPriorityCount: 0, secretCount: 0,
      weightedDebt: 12, estimatedHours: 4, hourlyRate: null, currency: null, estimatedCost: null,
    },
  });
}

describe("DebtReport", () => {
  const print = vi.fn();
  beforeEach(() => {
    vi.clearAllMocks();
    window.print = print;
  });
  afterEach(() => {
    document.documentElement.removeAttribute("data-theme");
  });

  it("süzgeçle dışa aktarılan borçları ve özeti basar; istenirse bir kez yazdırır", async () => {
    mockData(2);
    renderWithQuery(<DebtReport filters={{ repoId: "3", label: "TODO" }} autoPrint />);

    expect(await screen.findByRole("heading", { level: 1, name: "octo/app" })).toBeInTheDocument();
    expect(exportDebts).toHaveBeenCalledWith({ repoId: "3", label: "TODO" }, "json");
    expect(screen.getByText(/Etiket: TODO/)).toBeInTheDocument();
    expect(screen.getByText("B · 82/100")).toBeInTheDocument();
    expect(screen.getByText("src/F0.ts:1")).toBeInTheDocument();
    expect(screen.getByText("Yüksek")).toBeInTheDocument();
    await waitFor(() => expect(print).toHaveBeenCalledTimes(1));
  });

  it("çok satırda ilk sayfayı basar ve kalanı söyler", async () => {
    mockData(MAX_REPORT_ROWS + 5);
    renderWithQuery(<DebtReport filters={{}} />);

    expect(await screen.findByText(/İlk 1000 satır gösteriliyor \(toplam 1005\)/)).toBeInTheDocument();
    expect(print).not.toHaveBeenCalled();
  });

  it("yazdırırken açık temaya geçer, sonra eski temaya döner", async () => {
    mockData(1);
    document.documentElement.dataset.theme = "dark";
    renderWithQuery(<DebtReport filters={{}} />);
    await screen.findByRole("heading", { level: 1 });

    window.dispatchEvent(new Event("beforeprint"));
    expect(document.documentElement.dataset.theme).toBe("light");
    window.dispatchEvent(new Event("afterprint"));
    expect(document.documentElement.dataset.theme).toBe("dark");
  });
});
