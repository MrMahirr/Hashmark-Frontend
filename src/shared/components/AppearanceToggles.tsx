"use client";

import { Moon, Sun } from "lucide-react";
import { useI18n } from "@/shared/i18n/I18nProvider";
import { LOCALES, type Locale } from "@/shared/i18n/locales";
import { useTheme } from "@/shared/theme/ThemeProvider";
import { toggleTheme } from "@/shared/theme/theme";
import { IconButton } from "@/shared/ui/Button";
import { Segmented } from "@/shared/ui/Segmented";

function systemPrefersDark(): boolean {
  return typeof window !== "undefined" && window.matchMedia?.("(prefers-color-scheme: dark)").matches === true;
}

/** Koyu <-> açık geçişi. İkon geçilecek temayı gösterir; erişilebilir ad mevcut durumu bildirir. */
export function ThemeToggle({ className = "" }: { className?: string }) {
  const { t } = useI18n();
  const { theme, setTheme } = useTheme();

  const target = toggleTheme(theme, systemPrefersDark());
  const Icon = target === "light" ? Sun : Moon;
  const label = `${t("theme.label")}: ${t(`theme.${theme}` as const)}`;

  return (
    <IconButton
      onClick={() => setTheme(toggleTheme(theme, systemPrefersDark()))}
      aria-label={label}
      title={label}
      className={className}
    >
      <Icon size={18} aria-hidden="true" />
    </IconButton>
  );
}

/** TR / EN segmentli seçici; seçilen dil çerezde saklanır. */
export function LanguageToggle({ className = "" }: { className?: string }) {
  const { t, locale, setLocale } = useI18n();

  return (
    <Segmented<Locale>
      aria-label={t("lang.label")}
      value={locale}
      onChange={setLocale}
      className={className}
      options={LOCALES.map((l) => ({ value: l, label: l.toUpperCase() }))}
    />
  );
}
