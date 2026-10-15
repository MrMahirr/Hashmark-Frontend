import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ repos: vi.fn() }));

vi.mock("@/features/repos/hooks/useRepos", () => ({
  useMappedRepos: mocks.repos,
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
  });

  it("yüklenirken ve depolar gelmeden görünmez", () => {
    mocks.repos.mockReturnValue({ data: undefined, isLoading: true });
    const { container } = render(<OnboardingChecklist />);

    expect(container).toBeEmptyDOMElement();
  });

  it("depo yokken depo ekleme adımını önerir", () => {
    mocks.repos.mockReturnValue({ data: [], isLoading: false });
    render(<OnboardingChecklist />);

    expect(screen.getByRole("heading", { name: "Hashmark'a hoş geldiniz" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Depo ekle" })).toHaveAttribute("href", "/dashboard/repos");
  });

  it("depo var ama taranmadıysa taramaya yönlendirir", () => {
    mocks.repos.mockReturnValue({ data: [{ id: "1", lastScanAt: null }], isLoading: false });
    render(<OnboardingChecklist />);

    expect(screen.getByRole("link", { name: "Depolara git" })).toHaveAttribute("href", "/dashboard/repos");
    expect(screen.queryByRole("link", { name: "Depo ekle" })).not.toBeInTheDocument();
  });

  it("ilk tarama yapıldıysa kendiliğinden kaybolur", () => {
    mocks.repos.mockReturnValue({ data: [{ id: "1", lastScanAt: "2026-01-01T00:00:00Z" }], isLoading: false });
    const { container } = render(<OnboardingChecklist />);

    expect(container).toBeEmptyDOMElement();
  });
});
