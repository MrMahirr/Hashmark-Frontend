"use client";

import { useI18n } from "@/shared/i18n/I18nProvider";
import { useSettings, useUpdateSettings } from "../hooks/useSettings";

export function NotificationSettings() {
  const { t } = useI18n();
  const { data: settings, isLoading, isError } = useSettings();
  const updateSettings = useUpdateSettings();

  const emailEnabled = settings?.emailNotify ?? false;
  const disabled = isLoading || isError || updateSettings.isPending;

  return (
    <section className="bg-hm-surface rounded-card border-[0.5px] border-solid border-hm-border p-5 space-y-6">
      <div>
        <h3 className="font-medium text-sm text-hm-text-primary mb-1">{t("settings.report.title")}</h3>
        <p className="text-sm text-hm-text-secondary">{t("settings.report.description")}</p>
      </div>

      <div className="flex items-center justify-between">
        <label
          htmlFor="email-toggle"
          className="text-sm font-medium text-hm-text-primary cursor-pointer select-none"
        >
          {t("settings.report.email")}
        </label>

        <button
          id="email-toggle"
          type="button"
          role="switch"
          aria-checked={emailEnabled}
          disabled={disabled}
          onClick={() => updateSettings.mutate({ emailNotify: !emailEnabled })}
          className={`
            relative inline-flex h-5 w-10 items-center rounded-full
            transition-colors duration-200 ease-in-out
            disabled:opacity-60 disabled:cursor-not-allowed
            ${emailEnabled ? "bg-hm-blue" : "bg-hm-border"}
          `}
        >
          <span className="sr-only">{t("settings.report.toggle")}</span>
          <span
            aria-hidden="true"
            className={`
              inline-block h-3.5 w-3.5 transform rounded-full bg-white transition duration-200 ease-in-out
              ${emailEnabled ? "translate-x-5.5" : "translate-x-1"}
            `}
          />
        </button>
      </div>

      {isError ? (
        <p role="alert" className="text-xs text-hm-danger">
          {t("settings.report.loadFailed")}
        </p>
      ) : null}
      {updateSettings.isError ? (
        <p role="alert" className="text-xs text-hm-danger">
          {t("settings.report.saveFailed")}
        </p>
      ) : null}
    </section>
  );
}
