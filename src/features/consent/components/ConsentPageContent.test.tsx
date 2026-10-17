import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from "axios";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { axeViolations, renderWithQuery } from "@/test/helpers";

const mocks = vi.hoisted(() => ({
  replace: vi.fn(),
  accept: vi.fn(),
  logout: vi.fn(),
  profile: { consentRequired: true, consentAcceptedAt: null as string | null },
}));

vi.mock("next/navigation", () => ({ useRouter: () => ({ replace: mocks.replace, push: vi.fn() }) }));
vi.mock("@/features/auth/hooks/useUserProfile", () => ({ useUserProfile: () => ({ data: mocks.profile }) }));
vi.mock("@/features/auth/hooks/useAuth", () => ({
  useLogout: () => ({ mutate: mocks.logout, isPending: false }),
  useDeleteAccount: () => ({ mutate: vi.fn(), isPending: false }),
}));
vi.mock("../hooks/useConsent", () => ({
  useConsentPolicy: () => ({
    data: { version: 1, language: "tr", text: "## Aldığımız veriler\n- Dosya yolları\n\n## Neden\n- Takip", hash: "h1" },
    isLoading: false,
    isError: false,
  }),
  useAcceptConsent: () => ({ mutate: mocks.accept, isPending: false }),
}));

import { ConsentPageContent } from "./ConsentPageContent";
import { parsePolicy } from "./PolicyText";

describe("ConsentPageContent (onay ekranı)", () => {
  beforeEach(() => {
    mocks.replace.mockReset();
    mocks.accept.mockReset();
    mocks.logout.mockReset();
    mocks.profile = { consentRequired: true, consentAcceptedAt: null };
  });

  it("backend metnini gösterir; kutu varsayılan boş ve onay düğmesi pasif", () => {
    renderWithQuery(<ConsentPageContent />);

    expect(screen.getByRole("heading", { name: "Aldığımız veriler" })).toBeInTheDocument();
    expect(screen.getByText("Dosya yolları")).toBeInTheDocument();
    expect(screen.getByRole("checkbox")).not.toBeChecked();
    expect(screen.getByRole("button", { name: "Onayla ve devam et" })).toBeDisabled();
  });

  it("kutu işaretlenince gösterilen metnin sürüm+özetiyle onay gönderir ve panele döner", async () => {
    mocks.accept.mockImplementation((_policy, opts) => opts.onSuccess());
    renderWithQuery(<ConsentPageContent />);

    await userEvent.click(screen.getByRole("checkbox"));
    await userEvent.click(screen.getByRole("button", { name: "Onayla ve devam et" }));

    expect(mocks.accept).toHaveBeenCalledWith(
      expect.objectContaining({ version: 1, hash: "h1" }),
      expect.anything(),
    );
    expect(mocks.replace).toHaveBeenCalledWith("/dashboard");
  });

  it("metin değiştiyse (409 POLICY_OUTDATED) kutuyu sıfırlar ve yeniden okutur", async () => {
    const config = { headers: {} } as InternalAxiosRequestConfig;
    const response = { status: 409, data: { code: "POLICY_OUTDATED" }, config } as AxiosResponse;
    mocks.accept.mockImplementation((_policy, opts) =>
      opts.onError(new AxiosError("409", "409", config, null, response)),
    );
    renderWithQuery(<ConsentPageContent />);

    await userEvent.click(screen.getByRole("checkbox"));
    await userEvent.click(screen.getByRole("button", { name: "Onayla ve devam et" }));

    expect(screen.getByRole("checkbox")).not.toBeChecked();
    expect(mocks.replace).not.toHaveBeenCalled();
  });

  it("reddeden kullanıcı çıkış yapabilir", async () => {
    renderWithQuery(<ConsentPageContent />);
    await userEvent.click(screen.getByRole("button", { name: "Onaylamadan çık" }));
    expect(mocks.logout).toHaveBeenCalled();
  });

  it("erişilebilirlik ihlali yok", async () => {
    const { container } = renderWithQuery(<ConsentPageContent />);
    expect(await axeViolations(container)).toEqual([]);
  });
});

describe("parsePolicy", () => {
  it("başlık, madde ve paragrafları ayırır", () => {
    expect(parsePolicy("Giriş\n## A\n- x\n- y\nmetin\n\n## B\n- z")).toEqual([
      { title: null, items: [], paragraphs: ["Giriş"] },
      { title: "A", items: ["x", "y"], paragraphs: ["metin"] },
      { title: "B", items: ["z"], paragraphs: [] },
    ]);
  });
});
