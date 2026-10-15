import { cookies } from "next/headers";
import { DEFAULT_LOCALE, LOCALE_COOKIE, createTranslator, isLocale, type Locale, type Translator } from "./index";

/** Sunucu bileşenleri ve metadata için çerezden dili okur. */
export async function getServerLocale(): Promise<Locale> {
  const store = await cookies();
  const value = store.get(LOCALE_COOKIE)?.value;
  return isLocale(value) ? value : DEFAULT_LOCALE;
}

export async function getServerI18n(): Promise<{ locale: Locale; t: Translator }> {
  const locale = await getServerLocale();
  return { locale, t: createTranslator(locale) };
}
