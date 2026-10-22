import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../api/repos.api", () => ({
  getBadge: vi.fn(),
  rotateBadge: vi.fn(),
  disableBadge: vi.fn(),
  setPublicPage: vi.fn(),
}));

import { disableBadge, getBadge, rotateBadge, setPublicPage } from "../api/repos.api";
import { axeViolations, renderWithQuery } from "@/test/helpers";
import { BadgeSetting, badgeUrls } from "./BadgeSetting";

const TOKEN = "t".repeat(43);

describe("badgeUrls", () => {
  it("göreli ve mutlak API köküyle mutlak adres üretir", () => {
    expect(badgeUrls(TOKEN, "/api/v1", "https://app.example").svg).toBe(
      `https://app.example/api/v1/public/badge/${TOKEN}.svg`,
    );
    const abs = badgeUrls(TOKEN, "https://api.example/v1/", "https://app.example");
    expect(abs.json).toBe(`https://api.example/v1/public/badge/${TOKEN}.json`);
    expect(abs.markdown).toBe(`[![Hashmark](https://api.example/v1/public/badge/${TOKEN}.svg)](https://app.example)`);
    expect(abs.shields).toBe(
      `https://img.shields.io/endpoint?url=${encodeURIComponent(`https://api.example/v1/public/badge/${TOKEN}.json`)}`,
    );
  });
});

describe("BadgeSetting", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("kapalıyken etkinleştirir, açıkken Markdown gösterir ve kapatır", async () => {
    vi.mocked(getBadge).mockResolvedValue({ enabled: false, token: null, publicPage: false });
    vi.mocked(rotateBadge).mockResolvedValue({ enabled: true, token: TOKEN, publicPage: false });
    vi.mocked(disableBadge).mockResolvedValue();
    const user = userEvent.setup();
    const { container } = renderWithQuery(<BadgeSetting repoId="7" />);

    await user.click(await screen.findByRole("button", { name: "Rozeti etkinleştir" }));
    const markdown = await screen.findByLabelText("Markdown");
    expect((markdown as HTMLTextAreaElement).value).toContain(`/public/badge/${TOKEN}.svg`);
    expect(screen.getByRole("img", { name: "Hashmark sağlık notu rozeti" })).toHaveAttribute(
      "src",
      expect.stringContaining(TOKEN),
    );
    expect(await axeViolations(container)).toEqual([]);

    await user.click(screen.getByRole("button", { name: "Rozeti kapat" }));
    await waitFor(() => expect(disableBadge).toHaveBeenCalledWith("7"));
    expect(await screen.findByRole("button", { name: "Rozeti etkinleştir" })).toBeInTheDocument();
  });

  it("herkese açık sayfa açılınca rozet ona bağlanır; özel depoda uyarı", async () => {
    vi.mocked(getBadge).mockResolvedValue({ enabled: true, token: TOKEN, publicPage: false });
    vi.mocked(setPublicPage).mockResolvedValue({ enabled: true, token: TOKEN, publicPage: true });
    const user = userEvent.setup();
    renderWithQuery(<BadgeSetting repoId="7" isPrivate />);

    expect(await screen.findByText(/Bu özel bir depo/)).toBeInTheDocument();
    const toggle = screen.getByRole("switch", { name: "Herkese açık skor sayfası" });
    expect(toggle).toHaveAttribute("aria-checked", "false");
    await user.click(toggle);

    await waitFor(() => expect(setPublicPage).toHaveBeenCalledWith("7", true));
    expect(await screen.findByRole("link", { name: "Sayfayı aç ↗" })).toHaveAttribute(
      "href",
      expect.stringMatching(new RegExp(`/p/${TOKEN}$`)),
    );
    expect((screen.getByLabelText("Markdown") as HTMLTextAreaElement).value).toMatch(new RegExp(`\\(.*/p/${TOKEN}\\)$`));
  });

  it("bağlantıyı yenilemek onay ister", async () => {
    vi.mocked(getBadge).mockResolvedValue({ enabled: true, token: TOKEN, publicPage: false });
    vi.mocked(rotateBadge).mockResolvedValue({ enabled: true, token: "n".repeat(43), publicPage: false });
    const user = userEvent.setup();
    renderWithQuery(<BadgeSetting repoId="7" />);

    await user.click(await screen.findByRole("button", { name: "Bağlantıyı yenile" }));
    expect(rotateBadge).not.toHaveBeenCalled();
    expect(screen.getByText("Eski rozet bağlantısı çalışmayı durduracak.")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Yenile" }));
    await waitFor(() => expect(rotateBadge).toHaveBeenCalledWith("7"));
  });
});
