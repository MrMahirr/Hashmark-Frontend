export const LOCALES = ["tr", "en"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "tr";

/** Seçilen dili tutan çerez (sunucu ve istemci aynı değeri okur; ilk boyamada yanlış dil flaşı olmaz). */
export const LOCALE_COOKIE = "hm_lang";

const ONE_YEAR_SECONDS = 365 * 24 * 60 * 60;

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}

/** Tarih/sayı biçimlendirmesi için BCP-47 karşılığı. */
export function intlLocale(locale: Locale): string {
  return locale === "en" ? "en-US" : "tr-TR";
}

/** Tarayıcıda çerezden dili okur (global-error gibi sağlayıcı dışındaki yerler için). */
export function readLocaleFromCookie(cookieString?: string): Locale {
  const source = cookieString ?? (typeof document !== "undefined" ? document.cookie : "");
  const match = source.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${LOCALE_COOKIE}=`));
  const value = match?.slice(LOCALE_COOKIE.length + 1);
  return isLocale(value) ? value : DEFAULT_LOCALE;
}

export function writeLocaleCookie(locale: Locale): void {
  if (typeof document === "undefined") return;
  document.cookie = `${LOCALE_COOKIE}=${locale}; Path=/; Max-Age=${ONE_YEAR_SECONDS}; SameSite=Lax`;
}
