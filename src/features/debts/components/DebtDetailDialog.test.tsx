import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { DebtStatus, DebtType, type Debt } from "@/shared/types/debt.types";
import { useToastStore } from "@/shared/store/toast.store";

const mocks = vi.hoisted(() => ({
  context: vi.fn(),
  triageMutate: vi.fn(),
  issueMutate: vi.fn(),
}));

vi.mock("../hooks/useDebts", () => ({
  useDebtContext: mocks.context,
  useTriageDebt: () => ({ mutate: mocks.triageMutate, isPending: false }),
  useCreateDebtIssue: () => ({ mutate: mocks.issueMutate, isPending: false }),
}));

import { DebtDetailDialog } from "./DebtDetailDialog";
import { axeViolations } from "@/test/helpers";

const debt: Debt = {
  id: "9",
  type: DebtType.FIXME,
  message: "handle null user",
  filePath: "src/Service.java",
  lineNumber: 12,
  repoId: "1",
  repoName: "octo/hello",
  status: DebtStatus.ACTIVE,
  createdAt: "2026-01-02T00:00:00Z",
  resolvedAt: null,
  triageStatus: "OPEN",
  permalink: "https://github.com/octo/hello/blob/abc1234/src/Service.java#L12",
  commitSha: "abc1234def",
  assignee: "mahir",
  priority: "HIGH",
  dueDate: "2026-12-01",
  issueRef: "#42",
  authorLogin: "ayse",
  authorName: "Ayşe",
  introducedAt: "2025-06-01T00:00:00Z",
};

function setContext(value: Record<string, unknown>) {
  mocks.context.mockReturnValue({ isLoading: false, isError: false, data: undefined, ...value });
}

describe("DebtDetailDialog", () => {
  beforeEach(() => {
    mocks.context.mockReset();
    mocks.triageMutate.mockReset();
    mocks.issueMutate.mockReset();
    useToastStore.setState({ toasts: [] });
    setContext({
      data: {
        filePath: "src/Service.java",
        commitSha: "abc1234def",
        startLine: 10,
        highlightLine: 12,
        totalLines: 40,
        lines: ["int a = 1;", "int b = 2;", "// FIXME: handle null user", "return a + b;"],
        tooLarge: false,
      },
    });
  });

  it("kapalıyken hiçbir şey render etmez", () => {
    const { container } = render(<DebtDetailDialog debt={null} onClose={() => undefined} />);

    expect(container).toBeEmptyDOMElement();
  });

  it("meta bilgiyi, kod bağlamını ve bağlantıları gösterir", () => {
    render(<DebtDetailDialog debt={debt} onClose={() => undefined} />);

    expect(screen.getByText("handle null user")).toBeInTheDocument();
    expect(screen.getByText("octo/hello")).toBeInTheDocument();
    expect(screen.getByText("ayse")).toBeInTheDocument();
    expect(screen.getByText("Yüksek")).toBeInTheDocument();
    expect(screen.getByText("#42")).toBeInTheDocument();
    expect(screen.getByText("abc1234")).toBeInTheDocument();

    // vurgulanan satır numarası 12, 4 satır 10..13
    const context = screen.getByLabelText("Kod bağlamı", { selector: "pre" });
    expect(context).toHaveTextContent("12// FIXME: handle null user");
    expect(screen.getByRole("link", { name: /GitHub'da aç/ })).toHaveAttribute("href", debt.permalink);
  });

  it("issue yoksa Hashmark üzerinden oluşturur (borca bağlanır)", async () => {
    render(<DebtDetailDialog debt={debt} onClose={() => undefined} />);

    await userEvent.click(screen.getByRole("button", { name: /issue oluştur/i }));
    expect(mocks.issueMutate).toHaveBeenCalledWith("9");
    expect(screen.getByText(/Issue GitHub'da kapanınca/)).toBeInTheDocument();
  });

  it("bağlı issue varsa bağlantısını ve kapalı durumunu gösterir", () => {
    const linked: Debt = {
      ...debt,
      githubIssueNumber: 77,
      githubIssueUrl: "https://github.com/octo/hello/issues/77",
      githubIssueState: "closed",
    };
    render(<DebtDetailDialog debt={linked} onClose={() => undefined} />);

    expect(screen.getByRole("link", { name: "Issue #77 (kapalı)" })).toHaveAttribute(
      "href",
      "https://github.com/octo/hello/issues/77"
    );
    expect(screen.queryByRole("button", { name: /issue oluştur/i })).not.toBeInTheDocument();
  });

  it("kod bağlamı yüklenirken ve hata durumunda uygun mesaj verir", () => {
    setContext({ isLoading: true, data: undefined });
    const { rerender } = render(<DebtDetailDialog debt={debt} onClose={() => undefined} />);
    expect(screen.getByText("Kod yükleniyor...")).toBeInTheDocument();

    setContext({ isLoading: false, isError: true, data: undefined });
    rerender(<DebtDetailDialog debt={debt} onClose={() => undefined} />);
    expect(screen.getByRole("alert")).toHaveTextContent("Kod bağlamı alınamadı");
  });

  it("çok büyük dosyada önizleme yerine açıklama gösterir", () => {
    setContext({ data: { lines: [], startLine: 0, highlightLine: 12, totalLines: 0, tooLarge: true } });
    render(<DebtDetailDialog debt={debt} onClose={() => undefined} />);

    expect(screen.getByText(/önizleme gösterilemiyor/)).toBeInTheDocument();
  });

  it("kaydet yalnızca değişiklik varken etkindir ve triyajı gönderir", async () => {
    render(<DebtDetailDialog debt={debt} onClose={() => undefined} />);
    const save = screen.getByRole("button", { name: "Kaydet" });
    expect(save).toBeDisabled();

    await userEvent.selectOptions(screen.getByLabelText("Durum"), "WONT_FIX");
    const assignee = screen.getByLabelText("Atanan");
    await userEvent.clear(assignee);
    await userEvent.type(assignee, "ayse");
    expect(save).toBeEnabled();

    await userEvent.click(save);

    expect(mocks.triageMutate).toHaveBeenCalledTimes(1);
    expect(mocks.triageMutate.mock.calls[0][0]).toEqual({
      id: "9",
      payload: { status: "WONT_FIX", assignee: "ayse" },
    });
  });

  it("başarılı kayıtta bildirim gösterir", async () => {
    mocks.triageMutate.mockImplementation((_vars, options) => options.onSuccess());
    render(<DebtDetailDialog debt={debt} onClose={() => undefined} />);

    await userEvent.selectOptions(screen.getByLabelText("Durum"), "IGNORED");
    await userEvent.click(screen.getByRole("button", { name: "Kaydet" }));

    expect(useToastStore.getState().toasts[0]).toMatchObject({ title: "Değişiklikler kaydedildi.", type: "success" });
  });

  it("Kapat düğmesi onClose çağırır", async () => {
    const onClose = vi.fn();
    render(<DebtDetailDialog debt={debt} onClose={onClose} />);

    await userEvent.click(screen.getByRole("button", { name: "Kapat" }));

    expect(onClose).toHaveBeenCalled();
  });

  it("erişilebilirlik ihlali içermez", async () => {
    const { baseElement } = render(<DebtDetailDialog debt={debt} onClose={() => undefined} />);

    expect(await axeViolations(baseElement)).toEqual([]);
  });
});
