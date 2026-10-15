"use client";

import { useSettings, useUpdateSettings } from "../hooks/useSettings";

export function NotificationSettings() {
  const { data: settings, isLoading, isError } = useSettings();
  const updateSettings = useUpdateSettings();

  const emailEnabled = settings?.emailNotify ?? false;
  const disabled = isLoading || isError || updateSettings.isPending;

  return (
    <section className="bg-hm-surface rounded-card border-[0.5px] border-solid border-hm-border p-5 space-y-6">
      <div>
        <h3 className="font-medium text-sm text-hm-text-primary mb-1">
          Haftalık Rapor
        </h3>
        <p className="text-sm text-hm-text-secondary">
          Haftalık teknik borç özetinizi nasıl alacağınızı yapılandırın.
        </p>
      </div>

      <div className="flex items-center justify-between">
        <label
          htmlFor="email-toggle"
          className="text-sm font-medium text-hm-text-primary cursor-pointer select-none"
        >
          E-posta bildirimleri
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
            transition-colors duration-200 ease-in-out focus:outline-none
            disabled:opacity-60 disabled:cursor-not-allowed
            ${emailEnabled ? "bg-hm-blue" : "bg-hm-border"}
          `}
        >
          <span className="sr-only">E-posta bildirimlerini aç/kapat</span>
          <span
            className={`
              inline-block h-3.5 w-3.5 transform rounded-full bg-white transition duration-200 ease-in-out
              ${emailEnabled ? "translate-x-5.5" : "translate-x-1"}
            `}
          />
        </button>
      </div>

      {isError ? (
        <p role="alert" className="text-xs text-hm-danger">
          Ayarlar yüklenemedi. Lütfen sayfayı yenileyin.
        </p>
      ) : null}
      {updateSettings.isError ? (
        <p role="alert" className="text-xs text-hm-danger">
          Ayar kaydedilemedi, tekrar deneyin.
        </p>
      ) : null}
    </section>
  );
}
