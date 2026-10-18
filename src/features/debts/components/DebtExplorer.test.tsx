import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { DebtStatus, DebtType, type Debt } from "@/shared/types/debt.types";

const mocks = vi.hoisted(() => ({
  useMappedDebts: vi.fn(),
  bulkMutate: vi.fn(),
  exportMutate: vi.fn(),
  issuesMutate: vi.fn(),
}));

vi.mock("../hooks/useDebts", () => ({
  useMappedDebts: mocks.useMappedDebts,
  useBulkTriage: () => ({ mutate: mocks.bulkMutate, isPending: false }),
  useExportDebts: () => ({ mutate: mocks.exportMutate, isPending: false }),
  useDebtContext: () => ({ data: undefined, isLoading: false, isError: false }),
  useTriageDebt: () => ({ mutate: vi.fn(), isPending: false }),
  useCreateDebtIssue: () => ({ mutate: vi.fn(), isPending: false }),
  useCreateDebtIssues: () => ({ mutate: mocks.issuesMutate, isPending: false }),
  useDebtAuthors: () => ({ data: ["ayse", "octocat"] }),
}));

import { DebtExplorer } from "./DebtExplorer";

function debt(index: number): Debt {
  return {
    id: String(index),
    type: DebtType.TODO,
    message: `message ${index}`,
    filePath: `src/File${index}.java`,
    lineNumber: index + 1,
    repoId: "1",
    repoName: "octo/hello",
    status: DebtStatus.ACTIVE,
    createdAt: "2026-01-02T00:00:00Z",
    resolvedAt: null,
    triageStatus: "OPEN",
    permalink: null,
    commitSha: null,
    assignee: null,
    priority: null,
    dueDate: null,
    issueRef: null,
    authorLogin: null,
    authorName: null,
    introducedAt: null,
  };
}

function mockPage(overrides: Record<string, unknown> = {}) {
  mocks.useMappedDebts.mockReturnValue({
    data: { content: [debt(0), debt(1), debt(2)], page: 0, size: 20, totalElements: 45, totalPages: 3 },
    isLoading: false,
    isFetching: false,
    isError: false,
    refetch: vi.fn(),
    ...overrides,
  });
}

const lastFilters = () => mocks.useMappedDebts.mock.calls.at(-1)?.[0] as Record<string, unknown>;

describe("DebtExplorer", () => {
  beforeEach(() => {
    mocks.useMappedDebts.mockReset();
    mocks.bulkMutate.mockReset();
    mocks.exportMutate.mockReset();
    mocks.issuesMutate.mockReset();
    mockPage();
  });

  it("yazar ve yaş süzgeçlerini sunucuya iletir", async () => {
    render(<DebtExplorer />);

    await userEvent.selectOptions(screen.getByLabelText("Yazar"), "octocat");
    expect(lastFilters()).toMatchObject({ author: "octocat", page: 0 });

    await userEvent.selectOptions(screen.getByLabelText("Yaş"), "90");
    expect(lastFilters()).toMatchObject({ author: "octocat", olderThanDays: 90 });

    await userEvent.selectOptions(screen.getByLabelText("Yaş"), "0");
    expect(lastFilters().olderThanDays).toBeUndefined();
  });

  it("seçili borçlar için toplu GitHub issue ister", async () => {
    render(<DebtExplorer />);

    await userEvent.click(screen.getAllByRole("checkbox", { name: "src/File0.java:1 satırını seç" })[0]);
    await userEvent.click(screen.getAllByRole("checkbox", { name: "src/File2.java:3 satırını seç" })[0]);
    await userEvent.click(screen.getByRole("button", { name: "GitHub issue oluştur" }));

    expect(mocks.issuesMutate).toHaveBeenCalledTimes(1);
    expect(mocks.issuesMutate.mock.calls[0][0]).toEqual(["0", "2"]);
  });

  it("varsayılan olarak açık borçları, tespit tarihine göre azalan çeker", () => {
    render(<DebtExplorer />);

    expect(lastFilters()).toMatchObject({ status: "open", sort: "detectedAt", dir: "desc", page: 0, size: 20 });
  });

  it("durum, etiket ve depo filtrelerini sunucuya iletir ve ilk sayfaya döner", async () => {
    render(
      <DebtExplorer repos={[{ id: "7", name: "octo/hello" }]} selectedRepo="" onRepoChange={vi.fn()} />
    );

    await userEvent.click(screen.getByRole("button", { name: "Çözülen" }));
    expect(lastFilters()).toMatchObject({ status: "resolved", page: 0 });

    await userEvent.click(screen.getByRole("button", { name: "Tümü", pressed: false }));
    expect(lastFilters().status).toBeUndefined();

    const labelGroup = screen.getByRole("group", { name: "Etiket" });
    await userEvent.click(within(labelGroup).getByRole("button", { name: "FIXME" }));
    expect(lastFilters()).toMatchObject({ label: "FIXME" });
  });

  it("depo çipleri seçimi üst bileşene iletir ve açık borç sayısını gösterir", async () => {
    const onRepoChange = vi.fn();
    render(
      <DebtExplorer
        repos={[
          { id: "7", name: "octo/hello", debtCount: 12 },
          { id: "8", name: "octo/world", debtCount: 3 },
        ]}
        selectedRepo=""
        onRepoChange={onRepoChange}
      />,
    );

    const group = screen.getByRole("group", { name: "Depo" });
    expect(within(group).getByRole("button", { name: "Tüm Depolar" })).toHaveAttribute("aria-pressed", "true");

    await userEvent.click(within(group).getByRole("button", { name: /octo\/world/ }));
    expect(onRepoChange).toHaveBeenCalledWith("8");
    expect(within(group).getByRole("button", { name: "octo/hello (12)" })).toBeInTheDocument();
  });

  it("depoya göre grupla anahtarı aria-pressed ile değişir", async () => {
    render(<DebtExplorer repos={[{ id: "7", name: "octo/hello" }]} selectedRepo="" onRepoChange={vi.fn()} />);

    const toggle = screen.getByRole("button", { name: "Depoya göre grupla" });
    expect(toggle).toHaveAttribute("aria-pressed", "false");
    await userEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-pressed", "true");
  });

  it("aramayı bekletir (debounce) ve q olarak gönderir", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    try {
      render(<DebtExplorer />);

      await userEvent.type(screen.getByRole("searchbox", { name: "Ara" }), "cache", {
        advanceTimers: vi.advanceTimersByTime,
      });
      expect(lastFilters().q).toBeUndefined();

      await act(async () => {
        vi.advanceTimersByTime(400);
      });
      expect(lastFilters()).toMatchObject({ q: "cache", page: 0 });
    } finally {
      vi.useRealTimers();
    }
  });

  it("sıralamayı değiştirir ve aynı sütuna tekrar tıklayınca yönü çevirir", async () => {
    render(<DebtExplorer />);
    const table = screen.getAllByRole("table")[0];

    await userEvent.click(within(table).getByRole("button", { name: "Dosya sütununa göre sırala" }));
    expect(lastFilters()).toMatchObject({ sort: "filePath", dir: "asc" });

    await userEvent.click(within(table).getByRole("button", { name: "Dosya sütununa göre sırala" }));
    expect(lastFilters()).toMatchObject({ sort: "filePath", dir: "desc" });
  });

  it("sayfa boyutu ve sayfalama", async () => {
    render(<DebtExplorer />);

    expect(screen.getByText("45 kayıttan 1-20 arası gösteriliyor")).toBeInTheDocument();
    expect(screen.getByText("Sayfa 1 / 3")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Önceki" })).toBeDisabled();

    await userEvent.click(screen.getByRole("button", { name: "Sonraki" }));
    expect(lastFilters()).toMatchObject({ page: 1 });

    await userEvent.selectOptions(screen.getByLabelText("Sayfa başına"), "50");
    expect(lastFilters()).toMatchObject({ size: 50, page: 0 });
  });

  it("seçili borçlar için toplu triyaj uygular", async () => {
    render(<DebtExplorer />);
    const table = screen.getAllByRole("table")[0];

    await userEvent.click(within(table).getByLabelText("src/File0.java:1 satırını seç"));
    await userEvent.click(within(table).getByLabelText("src/File2.java:3 satırını seç"));
    expect(screen.getByText("2 seçili")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Yok say" }));

    expect(mocks.bulkMutate).toHaveBeenCalledTimes(1);
    expect(mocks.bulkMutate.mock.calls[0][0]).toEqual({ ids: ["0", "2"], payload: { status: "IGNORED" } });
  });

  it("toplu atama kullanıcı adıyla yapılır", async () => {
    render(<DebtExplorer />);
    const table = screen.getAllByRole("table")[0];
    await userEvent.click(within(table).getByLabelText("src/File1.java:2 satırını seç"));

    await userEvent.click(screen.getByRole("button", { name: "Ata" }));
    await userEvent.type(screen.getByLabelText("Atanacak kişinin GitHub kullanıcı adı"), "ayse");
    await userEvent.click(screen.getByRole("button", { name: "Kaydet" }));

    expect(mocks.bulkMutate.mock.calls[0][0]).toEqual({ ids: ["1"], payload: { assignee: "ayse" } });
  });

  it("seçim sayfa/filtre değişince temizlenir", async () => {
    render(<DebtExplorer />);
    const table = screen.getAllByRole("table")[0];
    await userEvent.click(within(table).getByLabelText("src/File0.java:1 satırını seç"));
    expect(screen.getByText("1 seçili")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Sonraki" }));

    expect(screen.queryByText("1 seçili")).not.toBeInTheDocument();
  });

  it("filtrelerle dışa aktarır (sayfalama dahil edilmeden backend'de yok sayılır)", async () => {
    render(<DebtExplorer />);

    await userEvent.click(screen.getByText("Dışa aktar"));
    await userEvent.click(screen.getByRole("button", { name: "SARIF" }));

    expect(mocks.exportMutate).toHaveBeenCalledTimes(1);
    expect(mocks.exportMutate.mock.calls[0][0]).toMatchObject({
      format: "sarif",
      filters: { status: "open" },
    });
  });

  it("sabit depo verildiğinde depo seçicisini gizler ve filtreye ekler", () => {
    render(<DebtExplorer fixedRepoId="42" fixedRepoName="octo/hello" />);

    expect(screen.queryByLabelText("Depo")).not.toBeInTheDocument();
    expect(lastFilters()).toMatchObject({ repoId: "42" });
  });

  it("hata durumunda yeniden dene sunar", async () => {
    const refetch = vi.fn();
    mockPage({ isError: true, data: undefined, refetch });
    render(<DebtExplorer />);

    expect(screen.getByRole("alert")).toHaveTextContent("Borç Listesi Alınamadı");
    await userEvent.click(screen.getByRole("button", { name: "Yeniden Dene" }));
    expect(refetch).toHaveBeenCalled();
  });

  it("ayrıntı düğmesi paneli açar", async () => {
    render(<DebtExplorer />);
    const table = screen.getAllByRole("table")[0];

    await userEvent.click(within(table).getAllByRole("button", { name: /Ayrıntıları aç/ })[0]);

    expect(await screen.findByRole("dialog", { hidden: true })).toBeInTheDocument();
  });
});
