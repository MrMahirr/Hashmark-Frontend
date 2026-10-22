import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { HotspotResponse } from "@/features/dashboard/api/dashboard.types";

vi.mock("@/features/dashboard/api/dashboard.api", () => ({
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

import { getHotspots } from "@/features/dashboard/api/dashboard.api";
import { axeViolations, renderWithQuery } from "@/test/helpers";
import { HotspotMap, heatColor } from "./HotspotMap";

const ROOT: HotspotResponse = {
  path: "",
  debts: 9,
  weightedDebt: 12,
  staleCount: 2,
  children: [
    { name: "src", path: "src", directory: true, debts: 8, weightedDebt: 10, staleCount: 2, files: 3 },
    { name: "README.md", path: "README.md", directory: false, debts: 1, weightedDebt: 2, staleCount: 0, files: 1 },
  ],
  hiddenChildren: 0,
  topFiles: [
    { name: "Users.java", path: "src/api/Users.java", directory: false, debts: 5, weightedDebt: 7, staleCount: 1, files: 1 },
  ],
  truncated: false,
};

const SRC: HotspotResponse = {
  ...ROOT,
  path: "src",
  children: [{ name: "api", path: "src/api", directory: true, debts: 5, weightedDebt: 7, staleCount: 1, files: 1 }],
  hiddenChildren: 3,
};

describe("HotspotMap", () => {
  beforeEach(() => {
    vi.mocked(getHotspots).mockReset();
  });

  it("klasöre inip ekmek kırıntısıyla geri döner; dosya ve klasörler süzülmüş listeye bağlanır", async () => {
    vi.mocked(getHotspots).mockImplementation(async (_repo, path) => (path === "src" ? SRC : ROOT));
    const user = userEvent.setup();
    const { container } = renderWithQuery(<HotspotMap repoId="7" repoName="octo/app" />);

    expect(await screen.findByRole("link", { name: "README.md" })).toHaveAttribute(
      "href",
      "/dashboard/debts?repoId=7&debtOnly=1&path=README.md",
    );
    expect(screen.getByRole("link", { name: "8 borç · 3 dosya" })).toHaveAttribute(
      "href",
      "/dashboard/debts?repoId=7&debtOnly=1&path=src",
    );
    expect(screen.getByText("2 çürüyen")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "src/api/Users.java" })).toBeInTheDocument();
    expect(await axeViolations(container)).toEqual([]);

    await user.click(screen.getByRole("button", { name: "src/" }));
    await waitFor(() => expect(getHotspots).toHaveBeenLastCalledWith("7", "src"));
    expect(await screen.findByRole("button", { name: "api/" })).toBeInTheDocument();
    expect(screen.getByText("+3 öğe daha (daha az borçlu)")).toBeInTheDocument();
    // En sıcak dosyalar klasöre göre göreli yolla
    expect(screen.getByRole("link", { name: "api/Users.java" })).toBeInTheDocument();

    const crumbs = screen.getByRole("navigation", { name: "Klasör yolu" });
    expect(crumbs).toHaveTextContent("octo/app");
    await user.click(screen.getByRole("button", { name: "octo/app" }));
    await waitFor(() => expect(getHotspots).toHaveBeenLastCalledWith("7", ""));
  });

  it("boş klasör mesajı", async () => {
    vi.mocked(getHotspots).mockResolvedValue({ ...ROOT, children: [], topFiles: [], debts: 0 });
    renderWithQuery(<HotspotMap repoId="7" repoName="octo/app" />);

    expect(await screen.findByText("Bu klasörde açık borç yok.")).toBeInTheDocument();
  });

  it("ısı rengi orana göre koyulaşır ve sınırlanır", () => {
    expect(heatColor(0)).toContain("12%");
    expect(heatColor(1)).toContain("90%");
    expect(heatColor(5)).toContain("90%");
  });
});
