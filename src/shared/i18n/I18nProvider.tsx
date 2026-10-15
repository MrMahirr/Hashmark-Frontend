"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  DEFAULT_LOCALE,
  createTranslator,
  formatDate,
  formatDateTime,
  writeLocaleCookie,
  type Locale,
  type Translator,
} from "./index";

interface I18nContextValue {
  locale: Locale;
  t: Translator;
  setLocale: (locale: Locale) => void;
  formatDate: (value: string | null | undefined, fallback?: string) => string;
  formatDateTime: (value: string | null | undefined, fallback?: string) => string;
}

function buildValue(locale: Locale, setLocale: (locale: Locale) => void): I18nContextValue {
  return {
    locale,
    t: createTranslator(locale),
    setLocale,
    formatDate: (value, fallback) => formatDate(value, locale, fallback),
    formatDateTime: (value, fallback) => formatDateTime(value, locale, fallback),
  };
}

// Sağlayıcı yoksa (ör. izole bileşen testleri) varsayılan dille çalışır
const I18nContext = createContext<I18nContextValue>(buildValue(DEFAULT_LOCALE, () => undefined));

interface I18nProviderProps {
  /** Sunucunun çerezden belirlediği dil. */
  locale: Locale;
  children: ReactNode;
}

export function I18nProvider({ locale: initialLocale, children }: I18nProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const router = useRouter();

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback(
    (next: Locale) => {
      writeLocaleCookie(next);
      setLocaleState(next);
      // Sunucu bileşenleri (metadata, landing) yeni çerezle yeniden üretilsin
      router.refresh();
    },
    [router]
  );

  const value = useMemo(() => buildValue(locale, setLocale), [locale, setLocale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  return useContext(I18nContext);
}
