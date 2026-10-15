import { en } from "./messages.en";
import { tr, type MessageKey } from "./messages.tr";
import { DEFAULT_LOCALE, intlLocale, type Locale } from "./locales";

export type { MessageKey } from "./messages.tr";
export * from "./locales";

export const messages: Record<Locale, Record<MessageKey, string>> = { tr, en };

export type MessageParams = Record<string, string | number>;

/** `{ad}` yer tutucularını doldurur; eksik parametre olduğu gibi bırakılır. */
export function format(template: string, params?: MessageParams): string {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in params ? String(params[name]) : match
  );
}

export type Translator = (key: MessageKey, params?: MessageParams) => string;

export function createTranslator(locale: Locale): Translator {
  const dictionary = messages[locale] ?? messages[DEFAULT_LOCALE];
  return (key, params) => format(dictionary[key] ?? messages[DEFAULT_LOCALE][key] ?? key, params);
}

/** ISO tarih metnini seçili dile göre biçimlendirir; geçersiz/boş değerde `fallback` döner. */
export function formatDate(value: string | null | undefined, locale: Locale, fallback = ""): string {
  if (!value) return fallback;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return fallback;
  return date.toLocaleDateString(intlLocale(locale));
}

export function formatDateTime(value: string | null | undefined, locale: Locale, fallback = ""): string {
  if (!value) return fallback;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return fallback;
  return date.toLocaleString(intlLocale(locale), {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
