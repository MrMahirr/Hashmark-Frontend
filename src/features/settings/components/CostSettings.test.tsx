import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../api/settings.api", () => ({
  getSettings: vi.fn(),
  updateSettings: vi.fn(),
}));

import { getSettings, updateSettings } from "../api/settings.api";
import { renderWithQuery } from "@/test/helpers";
import { CostSettings, parseHourlyRate } from "./CostSettings";

describe("parseHourlyRate", () => {
  it("boş = ücret yok, virgül ondalık kabul edilir, geçersizler reddedilir", () => {
    expect(parseHourlyRate("  ")).toBeNull();
    expect(parseHourlyRate("12,5")).toBe(12.5);
    expect(parseHourlyRate("750")).toBe(750);
    expect(parseHourlyRate("0")).toBeUndefined();
    expect(parseHourlyRate("1.234")).toBeUndefined();
    expect(parseHourlyRate("abc")).toBeUndefined();
    expect(parseHourlyRate("100001")).toBeUndefined();
  });
});

describe("CostSettings", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("ücret ve para birimini kaydeder", async () => {
    vi.mocked(getSettings).mockResolvedValue({ emailNotify: true, notifyDay: "MONDAY", hourlyRate: null, currency: null });
    vi.mocked(updateSettings).mockResolvedValue({ emailNotify: true, notifyDay: "MONDAY", hourlyRate: 60, currency: "EUR" });
    const user = userEvent.setup();
    renderWithQuery(<CostSettings />);

    const input = await screen.findByLabelText("Saatlik ücret");
    const save = screen.getByRole("button", { name: "Kaydet" });
    expect(save).toBeDisabled();

    await user.type(input, "abc");
    expect(screen.getByText(/0 ile 100 000 arasında/)).toBeInTheDocument();
    expect(save).toBeDisabled();

    await user.clear(input);
    await user.type(input, "60");
    await user.click(screen.getByRole("button", { name: "EUR" }));
    await user.click(save);

    await waitFor(() => expect(updateSettings).toHaveBeenCalledWith({ hourlyRate: 60, currency: "EUR" }));
  });

  it("alan boşaltılınca ücret 0 ile kaldırılır", async () => {
    vi.mocked(getSettings).mockResolvedValue({ emailNotify: true, notifyDay: "MONDAY", hourlyRate: 40, currency: "TRY" });
    vi.mocked(updateSettings).mockResolvedValue({ emailNotify: true, notifyDay: "MONDAY", hourlyRate: null, currency: "TRY" });
    const user = userEvent.setup();
    renderWithQuery(<CostSettings />);

    const input = await screen.findByLabelText("Saatlik ücret");
    expect(input).toHaveValue("40");
    await user.clear(input);
    await user.click(screen.getByRole("button", { name: "Kaydet" }));

    await waitFor(() => expect(updateSettings).toHaveBeenCalledWith({ hourlyRate: 0, currency: "TRY" }));
  });
});
