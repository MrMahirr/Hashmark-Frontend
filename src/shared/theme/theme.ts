export const THEMES = ["light", "dark", "system"] as const;
export type Theme = (typeof THEMES)[number];

export const DEFAULT_THEME: Theme = "dark";
export const THEME_COOKIE = "hm_theme";

const ONE_YEAR_SECONDS = 365 * 24 * 60 * 60;

export function isTheme(value: unknown): value is Theme {
  return typeof value === "string" && (THEMES as readonly string[]).includes(value);
}

/** `<html data-theme>` değeri: "system" için öznitelik hiç yazılmaz (CSS prefers-color-scheme'e düşer). */
export function themeAttribute(theme: Theme): "light" | "dark" | undefined {
  return theme === "system" ? undefined : theme;
}

export function nextTheme(theme: Theme): Theme {
  const index = THEMES.indexOf(theme);
  return THEMES[(index + 1) % THEMES.length];
}

/**
 * Tasarımdaki iki durumlu tema düğmesi için hedef: koyu ↔ açık.
 * "Sistem" seçiliyken işletim sisteminin o anki tercihinin tersine geçer.
 */
export function toggleTheme(theme: Theme, systemPrefersDark: boolean): "light" | "dark" {
  const resolved = theme === "system" ? (systemPrefersDark ? "dark" : "light") : theme;
  return resolved === "dark" ? "light" : "dark";
}

export function writeThemeCookie(theme: Theme): void {
  if (typeof document === "undefined") return;
  document.cookie = `${THEME_COOKIE}=${theme}; Path=/; Max-Age=${ONE_YEAR_SECONDS}; SameSite=Lax`;
}

export function applyTheme(theme: Theme): void {
  if (typeof document === "undefined") return;
  const attribute = themeAttribute(theme);
  if (attribute) {
    document.documentElement.setAttribute("data-theme", attribute);
  } else {
    document.documentElement.removeAttribute("data-theme");
  }
}
