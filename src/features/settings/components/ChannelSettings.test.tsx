import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../api/channels.api", () => ({
  getChannels: vi.fn(),
  createChannel: vi.fn(),
  updateChannel: vi.fn(),
  deleteChannel: vi.fn(),
  testChannel: vi.fn(),
}));
vi.mock("../api/settings.api", () => ({
  getSettings: vi.fn(),
  updateSettings: vi.fn(),
}));

import { createChannel, getChannels, testChannel, updateChannel } from "../api/channels.api";
import { getSettings, updateSettings } from "../api/settings.api";
import { axeViolations, renderWithQuery } from "@/test/helpers";
import { ChannelSettings, looksLikeWebhook, parseThreshold } from "./ChannelSettings";

const SLACK = {
  id: 3,
  kind: "SLACK" as const,
  urlHint: "hooks.slack.com/…abcd",
  sendDigest: true,
  sendAlerts: false,
  lastStatus: "FAILED" as const,
  lastError: "HTTP 404",
  lastSentAt: "2026-10-20T10:00:00",
};

describe("ChannelSettings", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getSettings).mockResolvedValue({ emailNotify: true, notifyDay: "MONDAY", alertMaxOpen: null, alertOnSecret: true });
  });

  it("kanalları maskeli ipucuyla listeler; özet/uyarı anahtarları ve deneme çalışır", async () => {
    vi.mocked(getChannels).mockResolvedValue([SLACK]);
    vi.mocked(updateChannel).mockResolvedValue({ ...SLACK, sendAlerts: true });
    vi.mocked(testChannel).mockResolvedValue({ ok: true, error: null });
    const user = userEvent.setup();
    const { container } = renderWithQuery(<ChannelSettings />);

    const list = await screen.findByRole("list", { name: "Bildirim Kanalları" });
    expect(within(list).getByText("hooks.slack.com/…abcd")).toBeInTheDocument();
    expect(within(list).getByText("Son gönderim başarısız: HTTP 404")).toBeInTheDocument();

    const alerts = screen.getByRole("switch", { name: "Slack hooks.slack.com/…abcd: uyarılar" });
    expect(alerts).toHaveAttribute("aria-checked", "false");
    await user.click(alerts);
    await waitFor(() => expect(updateChannel).toHaveBeenCalledWith(3, { sendAlerts: true }));

    await user.click(screen.getByRole("button", { name: "Slack hooks.slack.com/…abcd kanalına deneme mesajı gönder" }));
    await waitFor(() => expect(testChannel).toHaveBeenCalledWith(3));

    expect(await axeViolations(container)).toEqual([]);
  });

  it("seçilen türle kanal ekler; https olmayan adres eklenemez", async () => {
    vi.mocked(getChannels).mockResolvedValue([]);
    vi.mocked(createChannel).mockResolvedValue({ ...SLACK, id: 4, kind: "DISCORD" });
    const user = userEvent.setup();
    renderWithQuery(<ChannelSettings />);

    expect(await screen.findByText("Henüz kanal yok.")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Discord" }));
    const input = screen.getByLabelText("Webhook adresi");
    const add = screen.getByRole("button", { name: "Kanal ekle" });

    await user.type(input, "http://discord.com/api/webhooks/1/x");
    expect(add).toBeDisabled();
    await user.clear(input);
    await user.type(input, "https://discord.com/api/webhooks/1/x");
    await user.click(add);

    await waitFor(() =>
      expect(createChannel).toHaveBeenCalledWith({
        kind: "DISCORD",
        url: "https://discord.com/api/webhooks/1/x",
        sendDigest: true,
        sendAlerts: true,
      }),
    );
  });

  it("eşik ve sır uyarısı kaydedilir; boş eşik 0 (kapalı) gider", async () => {
    vi.mocked(getChannels).mockResolvedValue([]);
    vi.mocked(getSettings).mockResolvedValue({ emailNotify: true, notifyDay: "MONDAY", alertMaxOpen: 40, alertOnSecret: true });
    vi.mocked(updateSettings).mockResolvedValue({ emailNotify: true, notifyDay: "MONDAY" });
    const user = userEvent.setup();
    renderWithQuery(<ChannelSettings />);

    const threshold = await screen.findByLabelText("Açık borç eşiği (depo başına)");
    expect(threshold).toHaveValue("40");
    await user.clear(threshold);
    await user.click(screen.getByRole("switch", { name: "Yeni sızan sır bulununca uyar" }));
    await user.click(screen.getByRole("button", { name: "Kaydet" }));

    await waitFor(() => expect(updateSettings).toHaveBeenCalledWith({ alertMaxOpen: 0, alertOnSecret: false }));
  });

  it("yardımcılar", () => {
    expect(looksLikeWebhook(" https://hooks.slack.com/services/x ")).toBe(true);
    expect(looksLikeWebhook("hooks.slack.com/services/x")).toBe(false);
    expect(parseThreshold("")).toBe(0);
    expect(parseThreshold("25")).toBe(25);
    expect(parseThreshold("-3")).toBeUndefined();
    expect(parseThreshold("1.5")).toBeUndefined();
  });
});
