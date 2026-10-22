"use client";

import { useState } from "react";
import { useI18n } from "@/shared/i18n/I18nProvider";
import { useToastStore } from "@/shared/store/toast.store";
import { Button } from "@/shared/ui/Button";
import { Chip, ChipGroup } from "@/shared/ui/Chip";
import { Field } from "@/shared/ui/Field";
import type { SettingsResponse } from "../api/settings.types";
import { useSettings, useUpdateSettings } from "../hooks/useSettings";
import { FieldLabel, SettingsSection } from "./SettingsSection";

/** Sunucudaki `UserSettingsService.CURRENCIES` ile aynı. */
export const CURRENCIES = ["TRY", "USD", "EUR", "GBP"] as const;
const MAX_RATE = 100_000;

/** Boş = ücret yok (0 gönderilir); aksi halde 0 < ücret ≤ 100 000. Virgül ondalık ayırıcı kabul edilir. */
export function parseHourlyRate(value: string): number | null | undefined {
  const trimmed = value.trim().replace(",", ".");
  if (trimmed === "") return null;
  if (!/^\d+(\.\d{1,2})?$/.test(trimmed)) return undefined;
  const rate = Number(trimmed);
  return rate > 0 && rate <= MAX_RATE ? rate : undefined;
}

function CostForm({ settings }: { settings: SettingsResponse }) {
  const { t } = useI18n();
  const addToast = useToastStore((state) => state.addToast);
  const update = useUpdateSettings();

  const serverRate = settings.hourlyRate != null ? String(settings.hourlyRate) : "";
  const serverCurrency = settings.currency ?? "USD";
  const [rate, setRate] = useState(serverRate);
  const [currency, setCurrency] = useState(serverCurrency);

  const parsed = parseHourlyRate(rate);
  const valid = parsed !== undefined;
  const dirty = rate.trim() !== serverRate || currency !== serverCurrency;

  const save = () => {
    if (!valid) return;
    update.mutate(
      { hourlyRate: parsed ?? 0, currency },
      { onSuccess: () => addToast({ title: t("settings.cost.saved"), type: "success" }) },
    );
  };

  return (
    <SettingsSection id="cost-settings" title={t("settings.cost.title")} description={t("settings.cost.description")}>
      <div className="flex flex-col gap-6">
        <div className="max-w-[260px]">
          <Field
            inputMode="decimal"
            label={t("settings.cost.rate")}
            placeholder={t("settings.cost.ratePlaceholder")}
            hint={t("settings.cost.rateHint")}
            error={valid ? undefined : t("settings.cost.rateInvalid")}
            maxLength={10}
            value={rate}
            onChange={(event) => setRate(event.target.value)}
          />
        </div>
        <div className="flex flex-col gap-3">
          <FieldLabel>{t("settings.cost.currency")}</FieldLabel>
          <ChipGroup aria-label={t("settings.cost.currency")}>
            {CURRENCIES.map((value) => (
              <Chip key={value} pressed={currency === value} onClick={() => setCurrency(value)}>
                {value}
              </Chip>
            ))}
          </ChipGroup>
        </div>
      </div>

      {update.isError && (
        <p role="alert" className="m-0 text-sm text-hm-danger">
          {t("settings.report.saveFailed")}
        </p>
      )}

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-hm-border pt-5">
        <span className="font-mono text-[13px] text-hm-text-secondary">{t("settings.cost.formula")}</span>
        <Button onClick={save} disabled={!dirty || !valid} isLoading={update.isPending}>
          {t("common.save")}
        </Button>
      </div>
    </SettingsSection>
  );
}

/** Teknik borç maliyeti: saatlik ücret ve para birimi (gösterge panelindeki "Tahmini maliyet"). */
export function CostSettings() {
  const { t } = useI18n();
  const { data: settings, isLoading, isError } = useSettings();

  // Gösterge panelindeki "ücret ayarla" bağlantısı #cost'a gelir
  return (
    <div id="cost" className="scroll-mt-6">
      {isLoading ? (
        <SettingsSection id="cost-settings" title={t("settings.cost.title")}>
          <p role="status" className="m-0 text-sm text-hm-text-secondary">
            {t("common.loading")}
          </p>
        </SettingsSection>
      ) : isError || !settings ? (
        <SettingsSection id="cost-settings" title={t("settings.cost.title")}>
          <p role="alert" className="m-0 text-sm text-hm-danger">
            {t("settings.report.loadFailed")}
          </p>
        </SettingsSection>
      ) : (
        <CostForm key={`${settings.hourlyRate ?? ""}|${settings.currency ?? ""}`} settings={settings} />
      )}
    </div>
  );
}
