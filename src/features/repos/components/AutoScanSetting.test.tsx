import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  mutate: vi.fn(),
  isPending: false,
}));

vi.mock("../hooks/useRepos", () => ({
  useSetAutoScan: () => ({ mutate: mocks.mutate, isPending: mocks.isPending }),
}));

import { AutoScanSetting } from "./AutoScanSetting";

describe("AutoScanSetting", () => {
  beforeEach(() => {
    mocks.mutate.mockReset();
    mocks.isPending = false;
  });

  it("kapalıyken anahtar açmayı ister", async () => {
    render(<AutoScanSetting repoId="7" enabled={false} />);

    const sw = screen.getByRole("switch", { name: "Push'ta otomatik tara" });
    expect(sw).toHaveAttribute("aria-checked", "false");
    expect(sw).toHaveAccessibleDescription(/yönetici yetkisi/);

    await userEvent.click(sw);
    expect(mocks.mutate).toHaveBeenCalledWith({ repoId: "7", enabled: true });
  });

  it("açıkken kapatmayı ister", async () => {
    render(<AutoScanSetting repoId="7" enabled />);

    await userEvent.click(screen.getByRole("switch"));
    expect(mocks.mutate).toHaveBeenCalledWith({ repoId: "7", enabled: false });
  });

  it("istek sürerken anahtar devre dışı", () => {
    mocks.isPending = true;
    render(<AutoScanSetting repoId="7" enabled={false} />);

    expect(screen.getByRole("switch")).toBeDisabled();
  });
});
