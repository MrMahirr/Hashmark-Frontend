import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useToastStore } from "@/shared/store/toast.store";
import type { ScanStatusResponse } from "../api/scanner.types";

const mocks = vi.hoisted(() => ({ useScanStatus: vi.fn() }));
vi.mock("../hooks/useScanner", () => ({ useScanStatus: mocks.useScanStatus }));

import { ScanProgress } from "./ScanProgress";

function job(overrides: Partial<ScanStatusResponse> = {}): ScanStatusResponse {
  return {
    id: 1,
    repoId: 5,
    status: "RUNNING",
    branch: null,
    commitSha: null,
    attempts: 1,
    startedAt: null,
    finishedAt: null,
    debtFound: 0,
    filesScanned: 0,
    filesSkipped: 0,
    filesFailed: 0,
    message: null,
    createdAt: "2026-01-01T00:00:00Z",
    ...overrides,
  };
}

function setup() {
  const client = new QueryClient();
  const invalidate = vi.spyOn(client, "invalidateQueries");
  // Her seferinde yeni element: aynı referansla rerender React'te atlanır
  const view = () => (
    <QueryClientProvider client={client}>
      <ScanProgress repoId="5" />
    </QueryClientProvider>
  );
  const utils = render(view());
  return { ...utils, invalidate, view };
}

describe("ScanProgress", () => {
  beforeEach(() => {
    mocks.useScanStatus.mockReset();
    useToastStore.setState({ toasts: [] });
  });

  it("kuyruktaki ve çalışan taramayı canlı durum olarak duyurur", () => {
    mocks.useScanStatus.mockReturnValue({ data: job({ status: "PENDING" }) });
    const { rerender, view } = setup();
    expect(screen.getByRole("status")).toHaveTextContent("Tarama sırada bekliyor");

    mocks.useScanStatus.mockReturnValue({ data: job({ status: "RUNNING", filesScanned: 150 }) });
    rerender(view());
    expect(screen.getByRole("status")).toHaveTextContent("Taranıyor: 150 dosya işlendi");
  });

  it("izlenen tarama bitince verileri yeniler ve tek bildirim gösterir", () => {
    mocks.useScanStatus.mockReturnValue({ data: job({ status: "RUNNING" }) });
    const { rerender, view, invalidate } = setup();
    expect(invalidate).not.toHaveBeenCalled();

    const finished = job({
      status: "DONE",
      debtFound: 12,
      filesScanned: 340,
      finishedAt: new Date().toISOString(),
    });
    mocks.useScanStatus.mockReturnValue({ data: finished });
    rerender(view());
    rerender(view()); // aynı sonuçla tekrar render: ikinci bildirim olmamalı

    expect(invalidate).toHaveBeenCalledTimes(3); // debts, dashboard, repos
    expect(useToastStore.getState().toasts).toHaveLength(1);
    expect(useToastStore.getState().toasts[0]).toMatchObject({ title: "Tarama Tamamlandı", type: "success" });
    expect(screen.getByRole("status")).toHaveTextContent("12 borç, 340 dosya");
  });

  it("sayfa açıldığında zaten bitmiş eski taramayı bildirim olarak göstermez", () => {
    mocks.useScanStatus.mockReturnValue({
      data: job({ status: "DONE", finishedAt: "2020-01-01T00:00:00Z" }),
    });
    const { container, invalidate } = setup();

    expect(container).toBeEmptyDOMElement();
    expect(invalidate).not.toHaveBeenCalled();
    expect(useToastStore.getState().toasts).toHaveLength(0);
  });

  it("başarısız taramada hata ve sebebi gösterir", () => {
    mocks.useScanStatus.mockReturnValue({ data: job({ status: "RUNNING" }) });
    const { rerender, view } = setup();

    mocks.useScanStatus.mockReturnValue({
      data: job({ status: "FAILED", message: "GitHub API rate limit exceeded" }),
    });
    rerender(view());

    expect(screen.getByRole("status")).toHaveTextContent("Tarama başarısız oldu");
    expect(screen.getByRole("status")).toHaveTextContent("rate limit");
    expect(useToastStore.getState().toasts[0]).toMatchObject({ type: "error" });
  });

  it("atlanan/işlenemeyen dosya ve kısmi tarama bilgisini listeler", () => {
    mocks.useScanStatus.mockReturnValue({
      data: job({
        status: "DONE",
        finishedAt: new Date().toISOString(),
        filesSkipped: 4,
        filesFailed: 2,
        message: "Partial scan: File limit of 20000 reached",
      }),
    });
    setup();

    const text = screen.getByRole("status").textContent ?? "";
    expect(text).toContain("Partial scan");
    expect(text).toContain("4 dosya atlandı");
    expect(text).toContain("2 dosya işlenemedi");
  });

  it("veri yokken (hiç tarama yapılmamış) hiçbir şey göstermez", () => {
    mocks.useScanStatus.mockReturnValue({ data: undefined });
    const { container } = setup();

    expect(container).toBeEmptyDOMElement();
  });
});
