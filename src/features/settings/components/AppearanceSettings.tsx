"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useI18n } from "@/shared/i18n/I18nProvider";
import { LOCALES } from "@/shared/i18n/locales";
import { useTheme } from "@/shared/theme/ThemeProvider";
import { THEMES, type Theme } from "@/shared/theme/theme";

const THEME_ICONS: Record<Theme, typeof Sun> = { light: Sun, dark: Moon, system: Monitor };

const LOCALE_NAMES: Record<(typeof LOCALES)[number], string> = {
  tr: "Türkçe",
  en: "English",
};

/** Tema (açık/koyu/sistem) ve dil (TR/EN) tercihleri. */
export function AppearanceSettings() {
  const { t, locale, setLocale } = useI18n();
  const { theme, setTheme } = useTheme();

  const optionClass = (selected: boolean) =>
    `flex items-center gap-2 px-3 py-2 rounded-control border-[0.5px] text-sm transition-colors cursor-pointer ${
      selected
        ? "border-hm-blue bg-hm-blue-light text-hm-text-primary"
        : "border-hm-border bg-hm-bg text-hm-text-secondary hover:text-hm-text-primary"
    }`;

  return (
    <section className="bg-hm-surface rounded-card border-[0.5px] border-solid border-hm-border p-5 space-y-6">
      <div>
        <h3 className="font-medium text-sm text-hm-text-primary mb-1">{t("settings.appearance.title")}</h3>
        <p className="text-sm text-hm-text-secondary">{t("settings.appearance.description")}</p>
      </div>

      <fieldset>
        <legend className="mb-2 text-xs font-medium text-hm-text-secondary">{t("theme.label")}</legend>
        <div className="flex flex-wrap gap-2">
          {THEMES.map((value) => {
            const Icon = THEME_ICONS[value];
            return (
              <label key={value} className={optionClass(theme === value)}>
                <input
                  type="radio"
                  name="theme"
                  value={value}
                  checked={theme === value}
                  onChange={() => setTheme(value)}
                  className="sr-only"
                />
                <Icon size={16} aria-hidden="true" />
                {t(`theme.${value}` as const)}
              </label>
            );
          })}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-2 text-xs font-medium text-hm-text-secondary">{t("lang.label")}</legend>
        <div className="flex flex-wrap gap-2">
          {LOCALES.map((value) => (
            <label key={value} className={optionClass(locale === value)}>
              <input
                type="radio"
                name="locale"
                value={value}
                checked={locale === value}
                onChange={() => setLocale(value)}
                className="sr-only"
              />
              {LOCALE_NAMES[value]}
            </label>
          ))}
        </div>
      </fieldset>
    </section>
  );
}
