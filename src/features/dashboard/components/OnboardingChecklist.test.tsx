import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ repos: vi.fn(), syncMutate: vi.fn() }));

vi.mock("@/features/repos/hooks/useRepos", () => ({
  useMappedRepos: mocks.repos,
  useSyncRepos: () => ({ mutate: mocks.syncMutate, isPending: false }),
}));
vi.mock("next/link", () => ({
  default: ({ href, children, ...rest }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

import { OnboardingChecklist } from "./OnboardingChecklist";

describe("OnboardingChecklist", () => {
  beforeEach(() => {
    mocks.repos.mockReset();
    mocks.syncMutate.mockReset();
  });

  it("yüklenirken ve depolar gelmeden görünmez", () => {
    mocks.repos.mockReturnValue({ data: undefined, isLoading: true });
    const { container } = render(<OnboardingChecklist />);

    expect(container).toBeEmptyDOMElement();
  });

  it("depo yokken senkronizasyon adımını önerir", async () => {
    mocks.repos.mockReturnValue({ data: [], isLoading: false });
    render(<OnboardingChecklist />);

    expect(screen.getByRole("heading", { name: "Hashmark'a hoş geldiniz" })).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Depoları senkronize et" }));
    expect(mocks.syncMutate).toHaveBeenCalledTimes(1);
  });

  it("depo var ama taranmadıysa taramaya yönlendirir", () => {
    mocks.repos.mockReturnValue({ data: [{ id: "1", lastScanAt: null }], isLoading: false });
    render(<OnboardingChecklist />);

    expect(screen.getByRole("link", { name: "Depolara git" })).toHaveAttribute("href", "/dashboard/repos");
    expect(screen.queryByRole("button", { name: "Depoları senkronize et" })).not.toBeInTheDocument();
  });

  it("ilk tarama yapıldıysa kendiliğinden kaybolur", () => {
    mocks.repos.mockReturnValue({ data: [{ id: "1", lastScanAt: "2026-01-01T00:00:00Z" }], isLoading: false });
    const { container } = render(<OnboardingChecklist />);

    expect(container).toBeEmptyDOMElement();
  });
});
