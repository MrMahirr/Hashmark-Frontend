"use client";

import { Languages, Monitor, Moon, Sun } from "lucide-react";
import { useI18n } from "@/shared/i18n/I18nProvider";
import { LOCALES, type Locale } from "@/shared/i18n/locales";
import { useTheme } from "@/shared/theme/ThemeProvider";
import { nextTheme, type Theme } from "@/shared/theme/theme";

const THEME_ICONS: Record<Theme, typeof Sun> = { light: Sun, dark: Moon, system: Monitor };

/** Tek tıkla açık → koyu → sistem döngüsü. Mevcut durum etiketle ve ikonla bildirilir. */
export function ThemeToggle({ className = "" }: { className?: string }) {
  const { t } = useI18n();
  const { theme, setTheme } = useTheme();
  const Icon = THEME_ICONS[theme];
  const label = `${t("theme.label")}: ${t(`theme.${theme}` as const)}`;

  return (
    <button
      type="button"
      onClick={() => setTheme(nextTheme(theme))}
      aria-label={label}
      title={label}
      className={`p-2 rounded-full text-hm-text-secondary hover:text-hm-text-primary hover:bg-hm-bg transition-colors ${className}`}
    >
      <Icon size={18} aria-hidden="true" />
    </button>
  );
}

/** TR / EN arasında geçiş; seçilen dil çerezde saklanır. */
export function LanguageToggle({ className = "" }: { className?: string }) {
  const { t, locale, setLocale } = useI18n();
  const target: Locale = LOCALES.find((l) => l !== locale) ?? "en";

  return (
    <button
      type="button"
      onClick={() => setLocale(target)}
      aria-label={`${t("lang.label")}: ${target.toUpperCase()}`}
      title={`${t("lang.label")}: ${target.toUpperCase()}`}
      className={`flex items-center gap-1.5 px-2 py-1.5 rounded-full text-[11px] font-mono font-medium text-hm-text-secondary hover:text-hm-text-primary hover:bg-hm-bg transition-colors ${className}`}
    >
      <Languages size={16} aria-hidden="true" />
      <span aria-hidden="true">{locale.toUpperCase()}</span>
    </button>
  );
}
