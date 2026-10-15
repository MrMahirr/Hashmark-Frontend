"use client";

import { useI18n } from "@/shared/i18n/I18nProvider";
import { LOCALES } from "@/shared/i18n/locales";
import { useTheme } from "@/shared/theme/ThemeProvider";
import { THEMES } from "@/shared/theme/theme";
import { Chip, ChipGroup } from "@/shared/ui/Chip";
import { FieldLabel, SettingsSection } from "./SettingsSection";

const LOCALE_NAMES: Record<(typeof LOCALES)[number], string> = {
  tr: "Türkçe",
  en: "English",
};

/** Dil (TR/EN) ve tema (koyu/açık/sistem) tercihleri. */
export function AppearanceSettings() {
  const { t, locale, setLocale } = useI18n();
  const { theme, setTheme } = useTheme();

  return (
    <SettingsSection id="prefs" title={t("settings.prefs.title")}>
      <div className="flex flex-wrap gap-8">
        <div className="flex flex-col gap-3">
          <FieldLabel>{t("lang.label")}</FieldLabel>
          <ChipGroup aria-label={t("lang.label")}>
            {LOCALES.map((value) => (
              <Chip key={value} pressed={locale === value} onClick={() => setLocale(value)}>
                {LOCALE_NAMES[value]}
              </Chip>
            ))}
          </ChipGroup>
          <span className="text-sm text-hm-text-secondary">{t("settings.prefs.moreLangs")}</span>
        </div>

        <div className="flex flex-col gap-3">
          <FieldLabel>{t("theme.label")}</FieldLabel>
          <ChipGroup aria-label={t("theme.label")}>
            {THEMES.map((value) => (
              <Chip key={value} pressed={theme === value} onClick={() => setTheme(value)}>
                {t(`theme.${value}` as const)}
              </Chip>
            ))}
          </ChipGroup>
        </div>
      </div>
    </SettingsSection>
  );
}
