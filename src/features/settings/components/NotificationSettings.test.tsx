import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  useSettings: vi.fn(),
  mutate: vi.fn(),
  testMutate: vi.fn(),
}));

vi.mock("../hooks/useSendTestEmail", () => ({
  useSendTestEmail: () => ({ mutate: mocks.testMutate, isPending: false }),
}));

vi.mock("../hooks/useSettings", () => ({
  useSettings: mocks.useSettings,
  useUpdateSettings: () => ({ mutate: mocks.mutate, isPending: false, isError: false }),
}));

import { NotificationSettings } from "./NotificationSettings";
import { axeViolations } from "@/test/helpers";

describe("NotificationSettings (haftalık özet)", () => {
  beforeEach(() => {
    mocks.mutate.mockReset();
    mocks.testMutate.mockReset();
    mocks.useSettings.mockReturnValue({
      data: { emailNotify: true, notifyDay: "MONDAY", digestTimezone: "Europe/Istanbul" },
      isLoading: false,
      isError: false,
    });
  });

  it("anahtar rol=switch ve sunucudaki durumu yansıtır; değişmeden Kaydet pasiftir", () => {
    render(<NotificationSettings />);

    expect(screen.getByRole("switch", { name: "E-posta özetini aç/kapat" })).toHaveAttribute("aria-checked", "true");
    expect(screen.getByRole("button", { name: "Kaydet" })).toBeDisabled();
  });

  it("gün seçimi taslağı değiştirir ve Kaydet doğru yükü gönderir", async () => {
    render(<NotificationSettings />);

    const days = screen.getByRole("group", { name: "Gönderim günü" });
    const buttons = days.querySelectorAll("button");
    expect(buttons).toHaveLength(7);
    expect(buttons[0]).toHaveAttribute("aria-pressed", "true"); // Pazartesi

    await userEvent.click(buttons[4]); // Cuma
    expect(buttons[4]).toHaveAttribute("aria-pressed", "true");

    await userEvent.click(screen.getByRole("button", { name: "Kaydet" }));
    expect(mocks.mutate).toHaveBeenCalledTimes(1);
    expect(mocks.mutate.mock.calls[0][0]).toEqual({
      emailNotify: true,
      notifyDay: "FRIDAY",
      digestLabels: [],
      digestEmail: "",
      digestFrequency: "WEEKLY",
      digestHour: 8,
      digestTimezone: "Europe/Istanbul",
    });
  });

  it("sıklık, saat ve saat dilimi kaydedilir; gün yalnızca haftalıkta sorulur", async () => {
    render(<NotificationSettings />);

    await userEvent.click(screen.getByRole("button", { name: "Günlük" }));
    expect(screen.queryByRole("group", { name: "Gönderim günü" })).not.toBeInTheDocument();
    await userEvent.selectOptions(screen.getByLabelText("Saat"), "18");
    await userEvent.selectOptions(screen.getByLabelText("Saat dilimi"), "America/New_York");
    expect(screen.getByText(/^Sonraki özet: /)).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Kaydet" }));
    expect(mocks.mutate.mock.calls[0][0]).toMatchObject({
      digestFrequency: "DAILY",
      digestHour: 18,
      digestTimezone: "America/New_York",
    });
  });

  it("e-posta kapalıyken etiket çipleri pasif, zamanlama (kanallar için) açık kalır", async () => {
    render(<NotificationSettings />);

    await userEvent.click(screen.getByRole("switch", { name: "E-posta özetini aç/kapat" }));

    const labels = screen.getByRole("group", { name: "Dahil edilecek etiketler" });
    labels.querySelectorAll("button").forEach((button) => expect(button).toBeDisabled());
    const days = screen.getByRole("group", { name: "Gönderim günü" });
    days.querySelectorAll("button").forEach((button) => expect(button).toBeEnabled());
  });

  it("etiket çipleri varsayılanda hepsi seçili; alt küme sunucuya sıralı gider", async () => {
    render(<NotificationSettings />);

    const group = screen.getByRole("group", { name: "Dahil edilecek etiketler" });
    const chips = Array.from(group.querySelectorAll("button"));
    expect(chips).toHaveLength(7);
    chips.forEach((chip) => expect(chip).toHaveAttribute("aria-pressed", "true"));

    // TODO ve HACK dışındakileri kapat
    for (const chip of chips) {
      if (!["TODO", "HACK"].includes(chip.textContent ?? "")) await userEvent.click(chip);
    }
    await userEvent.click(screen.getByRole("button", { name: "Kaydet" }));

    expect(mocks.mutate.mock.calls[0][0]).toMatchObject({ digestLabels: ["TODO", "HACK"] });
  });

  it("en az bir etiket seçili kalır", async () => {
    mocks.useSettings.mockReturnValue({
      data: { emailNotify: true, notifyDay: "MONDAY", digestLabels: ["TODO"] },
      isLoading: false,
      isError: false,
    });
    render(<NotificationSettings />);

    const todo = screen.getByRole("button", { name: "TODO" });
    await userEvent.click(todo);
    expect(todo).toHaveAttribute("aria-pressed", "true");
  });

  it("geçersiz e-posta hata gösterir ve kaydı engeller; geçerli adres gönderilir", async () => {
    render(<NotificationSettings />);
    const input = screen.getByLabelText("E-posta adresi");

    await userEvent.type(input, "yanlis");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByRole("alert")).toHaveTextContent("Geçerli bir e-posta adresi girin.");
    expect(screen.getByRole("button", { name: "Kaydet" })).toBeDisabled();

    await userEvent.clear(input);
    await userEvent.type(input, "ekip@ornek.com");
    await userEvent.click(screen.getByRole("button", { name: "Kaydet" }));
    expect(mocks.mutate.mock.calls[0][0]).toMatchObject({ digestEmail: "ekip@ornek.com" });
  });

  it("test e-postası yalnızca kaydedilmiş ayarlarla tetiklenir", async () => {
    render(<NotificationSettings />);
    const test = screen.getByRole("button", { name: "Test e-postası gönder" });
    expect(test).toBeEnabled();

    await userEvent.click(test);
    expect(mocks.testMutate).toHaveBeenCalledTimes(1);

    await userEvent.type(screen.getByLabelText("E-posta adresi"), "a@b.co");
    expect(test).toBeDisabled(); // değişiklik varken önce kaydedilmeli
  });

  // Saat dilimi seçicisi ~400 seçenek içerir; tüm paket paralel koşarken axe 5 sn'yi aşabiliyor
  it("erişilebilirlik ihlali içermez", { timeout: 20_000 }, async () => {
    const { container } = render(<NotificationSettings />);
    expect(await axeViolations(container)).toEqual([]);
  });
});
