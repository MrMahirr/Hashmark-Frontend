import { render, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { DebtStatus, DebtType, type Debt } from "@/shared/types/debt.types";
import { DebtTable, VIRTUALIZE_THRESHOLD } from "./DebtTable";
import { axeViolations } from "@/test/helpers";

function makeDebt(index: number, overrides: Partial<Debt> = {}): Debt {
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
    permalink: `https://github.com/octo/hello/blob/abc/src/File${index}.java#L${index + 1}`,
    commitSha: "abcdef0123",
    assignee: null,
    priority: null,
    dueDate: null,
    issueRef: null,
    authorLogin: "mahir",
    authorName: null,
    introducedAt: null,
    ...overrides,
  };
}

function setup(debts: Debt[], overrides: Partial<React.ComponentProps<typeof DebtTable>> = {}) {
  const props = {
    debts,
    showRepoColumn: true,
    sort: "detectedAt",
    dir: "desc" as const,
    onSortChange: vi.fn(),
    selectedIds: new Set<string>(),
    onToggleRow: vi.fn(),
    onTogglePage: vi.fn(),
    onOpenDetails: vi.fn(),
    emptyMessage: "boş",
    ...overrides,
  };
  const utils = render(<DebtTable {...props} />);
  const table = utils.container.querySelector("table") as HTMLTableElement;
  return { ...utils, props, table, within: within(table) };
}

describe("DebtTable", () => {
  it("satırları, sorumluyu ve GitHub bağlantılarını gösterir", () => {
    const { within: w } = setup([makeDebt(0), makeDebt(1, { assignee: "ayse" })]);

    expect(w.getByText("message 0")).toBeInTheDocument();
    expect(w.getByText("ayse")).toBeInTheDocument(); // atanan, blame yazarından önce gelir
    expect(w.getByText("mahir")).toBeInTheDocument();

    const link = w.getByRole("link", { name: /GitHub'da aç: src\/File0\.java:1/ });
    expect(link).toHaveAttribute("href", expect.stringContaining("/blob/abc/src/File0.java#L1"));
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("issue oluşturma bağlantısı yeni sekmede önceden doldurulmuş açılır", () => {
    const { within: w } = setup([makeDebt(0)]);

    const issue = w.getByRole("link", { name: /issue oluştur/i });
    const url = new URL(issue.getAttribute("href") as string);
    expect(url.pathname).toBe("/octo/hello/issues/new");
    expect(url.searchParams.get("title")).toContain("[TODO] message 0");
  });

  it("sıralanabilir başlıklar aria-sort bildirir ve tıklamada sıralama ister", async () => {
    const { props, within: w } = setup([makeDebt(0)], { sort: "filePath", dir: "asc" });

    const fileHeader = w.getByRole("columnheader", { name: /Dosya/ });
    expect(fileHeader).toHaveAttribute("aria-sort", "ascending");
    expect(w.getByRole("columnheader", { name: /Etiket/ })).toHaveAttribute("aria-sort", "none");

    await userEvent.click(w.getByRole("button", { name: "Etiket sütununa göre sırala" }));
    expect(props.onSortChange).toHaveBeenCalledWith("label");
  });

  it("satır ve sayfa seçimi geri çağrıları tetikler; kısmi seçimde tümünü-seç belirsiz olur", async () => {
    const debts = [makeDebt(0), makeDebt(1)];
    const { props, within: w } = setup(debts, { selectedIds: new Set(["0"]) });

    const all = w.getByLabelText("Bu sayfadaki tümünü seç") as HTMLInputElement;
    expect(all.indeterminate).toBe(true);
    expect(all.checked).toBe(false);

    await userEvent.click(w.getByLabelText("src/File1.java:2 satırını seç"));
    expect(props.onToggleRow).toHaveBeenCalledWith("1");

    await userEvent.click(all);
    expect(props.onTogglePage).toHaveBeenCalledWith(true);
  });

  it("detay düğmesi satırı iletir", async () => {
    const debt = makeDebt(3);
    const { props, within: w } = setup([debt]);

    await userEvent.click(w.getByRole("button", { name: /Ayrıntıları aç/ }));

    expect(props.onOpenDetails).toHaveBeenCalledWith(debt);
  });

  it("çözülen ve yok sayılan borçlar durum rozeti alır", () => {
    const { within: w } = setup([
      makeDebt(0, { status: DebtStatus.RESOLVED, resolvedAt: "2026-01-05T00:00:00Z" }),
      makeDebt(1, { triageStatus: "WONT_FIX" }),
    ]);

    expect(w.getByText("Çözülen")).toBeInTheDocument();
    expect(w.getByText("Düzeltilmeyecek")).toBeInTheDocument();
  });

  it("depo sütunu gizlenebilir", () => {
    const { within: w } = setup([makeDebt(0)], { showRepoColumn: false });

    expect(w.queryByRole("columnheader", { name: "Depo" })).not.toBeInTheDocument();
  });

  it("boş listede mesaj gösterir", () => {
    const { container } = setup([]);

    expect(container).toHaveTextContent("boş");
    expect(container.querySelector("table")).toBeNull();
  });

  it("eşik altında tüm satırlar, üstünde yalnızca görünür pencere render edilir", () => {
    const few = setup(Array.from({ length: VIRTUALIZE_THRESHOLD }, (_, i) => makeDebt(i)));
    expect(few.table.querySelectorAll("tbody tr")).toHaveLength(VIRTUALIZE_THRESHOLD);
    few.unmount();

    // jsdom'da yerleşim yok: kaydırma alanına 600px yükseklik ver
    const sizes = { offsetWidth: 1000, offsetHeight: 600 };
    const originals = Object.entries(sizes).map(([prop, value]) => {
      const descriptor = Object.getOwnPropertyDescriptor(HTMLElement.prototype, prop);
      Object.defineProperty(HTMLElement.prototype, prop, { configurable: true, get: () => value });
      return [prop, descriptor] as const;
    });
    const many = setup(Array.from({ length: 500 }, (_, i) => makeDebt(i)));
    const rendered = many.table.querySelectorAll("tbody tr");
    expect(rendered.length).toBeGreaterThan(0);
    expect(rendered.length).toBeLessThan(100); // 500 satırın tamamı DOM'a basılmaz
    // boşluk satırları kaydırma çubuğunu doğru tutar
    expect(many.table.querySelector('tbody tr[aria-hidden="true"]')).not.toBeNull();

    originals.forEach(([prop, descriptor]) => {
      if (descriptor) Object.defineProperty(HTMLElement.prototype, prop, descriptor);
      else delete (HTMLElement.prototype as unknown as Record<string, unknown>)[prop];
    });
  });

  it("erişilebilirlik ihlali içermez", async () => {
    const { container } = setup([makeDebt(0), makeDebt(1, { permalink: null })]);

    expect(await axeViolations(container)).toEqual([]);
  });
});
