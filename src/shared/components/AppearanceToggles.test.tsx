import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const refresh = vi.hoisted(() => vi.fn());
vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh, replace: vi.fn(), push: vi.fn() }),
}));

import { I18nProvider } from "@/shared/i18n/I18nProvider";
import { ThemeProvider } from "@/shared/theme/ThemeProvider";
import { LanguageToggle, ThemeToggle } from "./AppearanceToggles";
import { nextTheme, themeAttribute, toggleTheme } from "@/shared/theme/theme";

const cookies = () => document.cookie;

describe("tema yardımcıları", () => {
  it("açık → koyu → sistem döngüsü ve öznitelik eşlemesi", () => {
    expect(nextTheme("light")).toBe("dark");
    expect(nextTheme("dark")).toBe("system");
    expect(nextTheme("system")).toBe("light");
    expect(themeAttribute("system")).toBeUndefined();
    expect(themeAttribute("dark")).toBe("dark");
  });

  it("iki durumlu düğme: koyu <-> açık; sistemde OS tercihinin tersine geçer", () => {
    expect(toggleTheme("dark", false)).toBe("light");
    expect(toggleTheme("light", true)).toBe("dark");
    expect(toggleTheme("system", true)).toBe("light");
    expect(toggleTheme("system", false)).toBe("dark");
  });
});

describe("ThemeToggle", () => {
  beforeEach(() => {
    document.documentElement.removeAttribute("data-theme");
  });

  it("temayı değiştirir, html özniteliğini ve çerezi günceller", async () => {
    render(
      <ThemeProvider theme="light">
        <ThemeToggle />
      </ThemeProvider>
    );

    await userEvent.click(screen.getByRole("button", { name: "Tema: Açık" }));
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
    expect(cookies()).toContain("hm_theme=dark");

    await userEvent.click(screen.getByRole("button", { name: "Tema: Koyu" }));
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
    expect(cookies()).toContain("hm_theme=light");
  });
});

describe("LanguageToggle", () => {
  beforeEach(() => {
    refresh.mockReset();
    document.documentElement.lang = "";
  });

  it("dili değiştirir, çerezi yazar ve sunucu bileşenlerini yeniler", async () => {
    render(
      <I18nProvider locale="tr">
        <LanguageToggle />
      </I18nProvider>
    );

    await userEvent.click(screen.getByRole("button", { name: "EN" }));

    expect(cookies()).toContain("hm_lang=en");
    expect(refresh).toHaveBeenCalledTimes(1);
    expect(document.documentElement.lang).toBe("en");
    expect(screen.getByRole("button", { name: "EN" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("group", { name: "Language" })).toBeInTheDocument();
  });
});
