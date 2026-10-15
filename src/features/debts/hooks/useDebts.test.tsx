import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor, act } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useToastStore } from "@/shared/store/toast.store";
import { DebtStatus, DebtType } from "@/shared/types/debt.types";

const api = vi.hoisted(() => ({
  triageDebt: vi.fn(),
  getDebts: vi.fn(),
  getDebtStats: vi.fn(),
  getDebtContext: vi.fn(),
  exportDebts: vi.fn(),
}));

vi.mock("../api/debts.api", async () => {
  const actual = await vi.importActual<typeof import("../api/debts.api")>("../api/debts.api");
  return { ...actual, ...api };
});

import { mapDebtResponseToDebt, useBulkTriage, useMappedDebts } from "./useDebts";

function wrapper({ children }: { children: ReactNode }) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

describe("mapDebtResponseToDebt", () => {
  it("backend alanlarını UI modeline çevirir ve tarihleri ISO bırakır", () => {
    const debt = mapDebtResponseToDebt({
      id: 5,
      repoId: 2,
      repoFullName: "octo/hello",
      filePath: "src/A.java",
      lineNo: 9,
      label: "FIXME",
      content: "crash",
      detectedAt: "2026-01-02T03:04:05",
      resolvedAt: null,
      permalink: "https://github.com/octo/hello/blob/abc/src/A.java#L9",
      commitSha: "abc",
      triageStatus: "IGNORED",
      assignee: "mahir",
      priority: "HIGH",
      dueDate: "2026-12-01",
      issueRef: "#7",
      authorLogin: "ayse",
    });

    expect(debt).toMatchObject({
      id: "5",
      type: DebtType.FIXME,
      repoName: "octo/hello",
      lineNumber: 9,
      createdAt: "2026-01-02T03:04:05",
      status: DebtStatus.ACTIVE,
      triageStatus: "IGNORED",
      priority: "HIGH",
      assignee: "mahir",
      authorLogin: "ayse",
    });
  });

  it("bilinmeyen triyaj/öncelik değerlerini güvenli varsayılana çevirir", () => {
    const debt = mapDebtResponseToDebt({
      id: 1,
      repoId: 1,
      filePath: "a",
      lineNo: 1,
      label: "TODO",
      content: "x",
      detectedAt: "2026-01-01T00:00:00",
      resolvedAt: "2026-02-01T00:00:00",
      triageStatus: "WEIRD",
      priority: "URGENT!!",
    });

    expect(debt.triageStatus).toBe("OPEN");
    expect(debt.priority).toBeNull();
    expect(debt.status).toBe(DebtStatus.RESOLVED);
    expect(debt.repoName).toBe("Repo #1");
  });
});

describe("useMappedDebts", () => {
  beforeEach(() => api.getDebts.mockReset());

  it("filtreleri API'ye iletir ve içeriği eşler", async () => {
    api.getDebts.mockResolvedValue({
      content: [{ id: 1, repoId: 1, filePath: "a", lineNo: 1, label: "TODO", content: "x", detectedAt: "2026-01-01T00:00:00", resolvedAt: null }],
      page: 0,
      size: 20,
      totalElements: 1,
      totalPages: 1,
    });

    const { result } = renderHook(() => useMappedDebts({ status: "open", q: "x" }), { wrapper });
    await waitFor(() => expect(result.current.data).toBeDefined());

    expect(api.getDebts).toHaveBeenCalledWith({ status: "open", q: "x" });
    expect(result.current.data?.content[0].id).toBe("1");
  });
});

describe("useBulkTriage", () => {
  beforeEach(() => {
    api.triageDebt.mockReset();
    useToastStore.setState({ toasts: [] });
  });

  it("hepsi başarılıysa sayıyı bildirir", async () => {
    api.triageDebt.mockResolvedValue({});
    const { result } = renderHook(() => useBulkTriage(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync({ ids: ["1", "2", "3"], payload: { status: "IGNORED" } });
    });

    expect(api.triageDebt).toHaveBeenCalledTimes(3);
    expect(api.triageDebt).toHaveBeenCalledWith("2", { status: "IGNORED" });
    expect(useToastStore.getState().toasts[0]).toMatchObject({ title: "3 borç güncellendi.", type: "success" });
  });

  it("kısmi başarısızlıkta diğerlerini uygular ve sonucu raporlar", async () => {
    api.triageDebt.mockImplementation(async (id: string) => {
      if (id === "2") throw new Error("boom");
      return {};
    });
    const { result } = renderHook(() => useBulkTriage(), { wrapper });

    let outcome: { ok: number; failed: number } | undefined;
    await act(async () => {
      outcome = await result.current.mutateAsync({ ids: ["1", "2", "3"], payload: { assignee: "ayse" } });
    });

    expect(outcome).toEqual({ ok: 2, failed: 1 });
    expect(useToastStore.getState().toasts[0]).toMatchObject({
      title: "2 borç güncellendi, 1 borç güncellenemedi.",
      type: "info",
    });
  });

  it("hiçbiri uygulanamadıysa hata bildirir", async () => {
    api.triageDebt.mockRejectedValue(new Error("down"));
    const { result } = renderHook(() => useBulkTriage(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync({ ids: ["1", "2"], payload: { status: "WONT_FIX" } });
    });

    expect(useToastStore.getState().toasts[0]).toMatchObject({ type: "error" });
  });

  it("istekleri 5'erli gruplar halinde gönderir", async () => {
    let inFlight = 0;
    let peak = 0;
    api.triageDebt.mockImplementation(async () => {
      inFlight++;
      peak = Math.max(peak, inFlight);
      await new Promise((resolve) => setTimeout(resolve, 5));
      inFlight--;
      return {};
    });
    const { result } = renderHook(() => useBulkTriage(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync({
        ids: Array.from({ length: 12 }, (_, i) => String(i)),
        payload: { status: "IGNORED" },
      });
    });

    expect(api.triageDebt).toHaveBeenCalledTimes(12);
    expect(peak).toBeLessThanOrEqual(5);
  });
});
