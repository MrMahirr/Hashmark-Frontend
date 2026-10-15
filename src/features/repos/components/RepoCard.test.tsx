import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ScanStatus, type Repo } from "@/shared/types/repo.types";

const mocks = vi.hoisted(() => ({
  deleteMutate: vi.fn(),
  scanMutate: vi.fn(),
}));

vi.mock("../hooks/useRepos", () => ({
  useDeleteRepo: () => ({ mutate: mocks.deleteMutate, isPending: false }),
}));
vi.mock("@/features/scanner/hooks/useScanner", () => ({
  useStartScan: () => ({ mutate: mocks.scanMutate, isPending: false }),
}));

import { RepoCard } from "./RepoCard";

const repo: Repo = {
  id: "7",
  name: "hello",
  fullName: "octo/hello",
  owner: "octo",
  language: "Java",
  description: "",
  isPrivate: false,
  lastScanAt: null,
  scanStatus: ScanStatus.IDLE,
  debtCount: 12,
  resolvedCount: 0,
  connectedAt: "2026-01-01T00:00:00Z",
  trackedBranch: null,
  debtBreakdown: { TODO: 8, FIXME: 4 },
};

describe("RepoCard", () => {
  beforeEach(() => {
    mocks.deleteMutate.mockReset();
    mocks.scanMutate.mockReset();
  });

  it("toplamı, taranmadı notunu ve etiket lejantını gösterir", () => {
    render(<RepoCard repo={repo} />);

    expect(screen.getByText("12")).toBeInTheDocument();
    expect(screen.getByText("Bu depo henüz taranmadı.")).toBeInTheDocument();
    expect(screen.getByText("TODO 8")).toBeInTheDocument();
    expect(screen.getByText("FIXME 4")).toBeInTheDocument();
  });

  it("Kaldır önce onay (alertdialog) ister; onaylanınca siler", async () => {
    render(<RepoCard repo={repo} />);

    await userEvent.click(screen.getByRole("button", { name: "Kaldır" }));
    expect(mocks.deleteMutate).not.toHaveBeenCalled();

    const dialog = await screen.findByRole("alertdialog", { name: "Depo kaldırılsın mı?" });
    expect(dialog).toBeInTheDocument();

    const confirm = screen.getAllByRole("button", { name: "Kaldır" }).at(-1) as HTMLElement;
    await userEvent.click(confirm);
    expect(mocks.deleteMutate).toHaveBeenCalledTimes(1);
    expect(mocks.deleteMutate.mock.calls[0][0]).toBe("7");
  });

  it("Tara düğmesi taramayı başlatır", async () => {
    render(<RepoCard repo={repo} />);

    await userEvent.click(screen.getByRole("button", { name: "Şimdi Tara" }));
    expect(mocks.scanMutate).toHaveBeenCalledWith("7");
  });
});
