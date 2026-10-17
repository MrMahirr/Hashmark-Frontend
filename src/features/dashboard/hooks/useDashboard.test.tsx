import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../api/dashboard.api", () => ({
  getReportSummary: vi.fn(),
  sendTestReport: vi.fn(),
}));
vi.mock("@/features/debts/hooks/useDebts", () => ({
  useDebtStats: vi.fn(),
}));
vi.mock("@/features/repos/hooks/useRepos", () => ({
  useMappedRepos: () => ({ data: [{ id: "1" }, { id: "2" }, { id: "3" }] }),
}));

import { getReportSummary } from "../api/dashboard.api";
import { useDebtStats } from "@/features/debts/hooks/useDebts";
import { useDashboardOverview } from "./useDashboard";

function wrapper({ children }: { children: ReactNode }) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

function mockData(labelStats: Record<string, unknown> | null) {
  vi.mocked(getReportSummary).mockResolvedValue({
    labelStats,
    trendData: [{ weekStart: "2026-10-05", totalDebts: 12, newDebts: 4, resolvedDebts: 2 }],
    topModules: [{ modulePath: "src", debtCount: 7 }],
  } as never);
  vi.mocked(useDebtStats).mockReturnValue({
    data: { total: 20, addedThisWeek: 5, resolvedThisWeek: 5 },
    isLoading: false,
    isError: false,
    refetch: vi.fn(),
  } as never);
}

describe("useDashboardOverview", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("etiket yüzdelerinin toplamı 100'dür", async () => {
    mockData({ todoCount: 1, fixmeCount: 1, hackCount: 1, xxxCount: 0, noteCount: 0, docCount: 0, infoCount: 0 });

    const { result } = renderHook(() => useDashboardOverview(), { wrapper });
    await waitFor(() => expect(result.current.labelDistribution.length).toBeGreaterThan(0));

    const total = result.current.labelDistribution.reduce((sum, l) => sum + l.percentage, 0);
    expect(total).toBe(100);
    expect(result.current.labelDistribution.map((l) => l.type)).toEqual(["TODO", "FIXME", "HACK"]);
  });

  it("yalnızca TODO/FIXME/HACK/XXX sağlık skorunu etkiler", async () => {
    mockData({ todoCount: 10, fixmeCount: 0, hackCount: 0, xxxCount: 0, noteCount: 500, docCount: 300, infoCount: 100 });

    const { result } = renderHook(() => useDashboardOverview(), { wrapper });
    await waitFor(() => expect(result.current.labelDistribution.length).toBeGreaterThan(0));

    expect(result.current.grade).toBe("A");
    expect(result.current.healthScore).toBe(85);
  });

  it(".hashmark.yml özel etiketleri borç sayılır ve dağılımda bilgi etiketlerinden önce gelir", async () => {
    mockData({
      todoCount: 0, fixmeCount: 0, hackCount: 0, xxxCount: 0, noteCount: 5, docCount: 0, infoCount: 0,
      customCounts: { SECURITY: 6, OPTIMIZE: 4, UNUSED: 0 },
    });

    const { result } = renderHook(() => useDashboardOverview(), { wrapper });
    await waitFor(() => expect(result.current.labelDistribution.length).toBeGreaterThan(0));

    // 10 özel etiket borcu = 10 TODO ile aynı not
    expect(result.current.healthScore).toBe(85);
    expect(result.current.labelDistribution.map((l) => l.type)).toEqual(["OPTIMIZE", "SECURITY", "NOTE"]);
    expect(result.current.labelDistribution.reduce((sum, l) => sum + l.percentage, 0)).toBe(100);
  });

  it("etiket istatistiği yokken toplam borçla not hesaplar", async () => {
    mockData(null);
    vi.mocked(useDebtStats).mockReturnValue({
      data: { total: 90, addedThisWeek: 0, resolvedThisWeek: 0 },
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    } as never);

    const { result } = renderHook(() => useDashboardOverview(), { wrapper });
    await waitFor(() => expect(result.current.trendData.length).toBe(1));

    expect(result.current.grade).toBe("F");
    expect(result.current.labelDistribution).toEqual([]);
  });

  it("trend ve modül verisini arayüz modeline çevirir", async () => {
    mockData({ todoCount: 2, fixmeCount: 0, hackCount: 0, xxxCount: 0, noteCount: 0, docCount: 0, infoCount: 0 });

    const { result } = renderHook(() => useDashboardOverview(), { wrapper });
    await waitFor(() => expect(result.current.trendData.length).toBe(1));

    expect(result.current.trendData[0]).toEqual({ date: "2026-10-05", total: 12, added: 4, resolved: 2 });
    expect(result.current.moduleDistribution).toEqual([{ module: "src", count: 7 }]);
    expect(result.current.stats.activeDebts).toBe(15);
    expect(result.current.stats.activeRepos).toBe(3);
  });
});
