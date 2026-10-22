"use client";

import { useState } from "react";
import { useI18n } from "@/shared/i18n/I18nProvider";
import { useToastStore } from "@/shared/store/toast.store";
import { Button } from "@/shared/ui/Button";
import { Chip, ChipGroup } from "@/shared/ui/Chip";
import { Field } from "@/shared/ui/Field";
import { Switch } from "@/shared/ui/Switch";
import { tagColor } from "@/shared/ui/TagBadge";
import { cn } from "@/shared/ui/cn";
import type { DigestFrequency, NotifyDay, SettingsResponse } from "../api/settings.types";
import { useSendTestEmail } from "../hooks/useSendTestEmail";
import { useSettings, useUpdateSettings } from "../hooks/useSettings";
import { ALL_DIGEST_LABELS, isValidDigestEmail, labelsFromServer, labelsToServer } from "../utils/digest-labels";
import {
  DIGEST_FREQUENCIES,
  NOTIFY_DAYS,
  browserTimeZone,
  nextDigestAt,
  timeZoneOptions,
  weekdayLabel,
} from "../utils/next-digest";
import { FieldLabel, SettingsSection } from "./SettingsSection";

function isNotifyDay(value: string): value is NotifyDay {
  return (NOTIFY_DAYS as readonly string[]).includes(value);
}

function isFrequency(value: unknown): value is DigestFrequency {
  return (DIGEST_FREQUENCIES as readonly unknown[]).includes(value);
}

const HOURS = Array.from({ length: 24 }, (_, h) => h);
const SELECT =
  "min-h-11 cursor-pointer rounded-pill border border-hm-border bg-hm-bg px-4 font-mono text-[13px] font-bold text-hm-text-primary";

function sameSet(a: ReadonlySet<string>, b: ReadonlySet<string>): boolean {
  return a.size === b.size && [...a].every((v) => b.has(v));
}

/** Taslak durumu: sunucudaki değer değişince (key ile) sıfırlanır. */
function DigestForm({ settings }: { settings: SettingsResponse }) {
  const { t, locale } = useI18n();
  const addToast = useToastStore((state) => state.addToast);
  const update = useUpdateSettings();
  const sendTest = useSendTestEmail();

  const serverDay: NotifyDay = isNotifyDay(settings.notifyDay) ? settings.notifyDay : "MONDAY";
  const serverLabels = labelsFromServer(settings.digestLabels);
  const serverEmail = settings.digestEmail ?? "";
  const serverFrequency: DigestFrequency = isFrequency(settings.digestFrequency) ? settings.digestFrequency : "WEEKLY";
  const serverHour = settings.digestHour ?? 8;
  const serverZone = settings.digestTimezone ?? browserTimeZone();

  const [enabled, setEnabled] = useState(settings.emailNotify);
  const [day, setDay] = useState<NotifyDay>(serverDay);
  const [labels, setLabels] = useState<Set<string>>(serverLabels);
  const [email, setEmail] = useState(serverEmail);
  const [frequency, setFrequency] = useState<DigestFrequency>(serverFrequency);
  const [hour, setHour] = useState(serverHour);
  const [timeZone, setTimeZone] = useState(serverZone);
  const zones = timeZoneOptions(serverZone);

  const emailValid = isValidDigestEmail(email);
  const dirty =
    enabled !== settings.emailNotify ||
    day !== serverDay ||
    !sameSet(labels, serverLabels) ||
    email.trim() !== serverEmail ||
    frequency !== serverFrequency ||
    hour !== serverHour ||
    timeZone !== serverZone;

  // E-posta kapalı olsa da özet alan sohbet kanalları aynı zamanlamayı kullanır
  const next = nextDigestAt({ frequency, day, hour, timeZone });
  const nextLine = next
    ? t("settings.digest.next", {
        date: new Intl.DateTimeFormat(locale, {
          timeZone,
          weekday: "short",
          day: "numeric",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
        }).format(next),
      })
    : t("settings.digest.off");

  const toggleLabel = (label: string) => {
    setLabels((current) => {
      const next = new Set(current);
      if (next.has(label)) {
        if (next.size > 1) next.delete(label); // en az bir etiket kalmalı
      } else {
        next.add(label);
      }
      return next;
    });
  };

  const save = () => {
    update.mutate(
      {
        emailNotify: enabled,
        notifyDay: day,
        digestLabels: labelsToServer(labels),
        digestEmail: email.trim(),
        digestFrequency: frequency,
        digestHour: hour,
        digestTimezone: timeZone,
      },
      { onSuccess: () => addToast({ title: t("settings.digest.saved"), type: "success" }) },
    );
  };

  return (
    <SettingsSection
      id="digest"
      title={t("settings.digest.title")}
      description={t("settings.report.description")}
      aside={
        <Switch
          checked={enabled}
          onCheckedChange={setEnabled}
          aria-label={t("settings.digest.toggle")}
          aria-describedby="digest-desc"
        />
      }
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <FieldLabel>{t("settings.digest.frequency")}</FieldLabel>
          <ChipGroup aria-label={t("settings.digest.frequency")}>
            {DIGEST_FREQUENCIES.map((value) => (
              <Chip key={value} pressed={frequency === value} onClick={() => setFrequency(value)}>
                {t(`settings.digest.frequency.${value}` as const)}
              </Chip>
            ))}
          </ChipGroup>
        </div>

        {frequency === "WEEKLY" && (
          <div className="flex flex-col gap-3">
            <FieldLabel>{t("settings.digest.sendDay")}</FieldLabel>
            <ChipGroup aria-label={t("settings.digest.sendDay")}>
              {NOTIFY_DAYS.map((value) => (
                <Chip key={value} pressed={day === value} onClick={() => setDay(value)}>
                  {weekdayLabel(value, locale)}
                </Chip>
              ))}
            </ChipGroup>
          </div>
        )}

        <div className="flex flex-wrap items-end gap-4">
          <div className="flex flex-col gap-2">
            <FieldLabel id="digest-hour-label">{t("settings.digest.hour")}</FieldLabel>
            <select
              value={hour}
              onChange={(event) => setHour(Number(event.target.value))}
              aria-labelledby="digest-hour-label"
              className={SELECT}
            >
              {HOURS.map((h) => (
                <option key={h} value={h}>
                  {String(h).padStart(2, "0")}:00
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <FieldLabel id="digest-tz-label">{t("settings.digest.timezone")}</FieldLabel>
            <select
              value={timeZone}
              aria-labelledby="digest-tz-label"
              onChange={(event) => setTimeZone(event.target.value)}
              className={cn(SELECT, "max-w-[280px]")}
            >
              {zones.map((zone) => (
                <option key={zone} value={zone}>
                  {zone}
                </option>
              ))}
            </select>
          </div>
        </div>
        <p className="m-0 text-sm text-hm-text-secondary">{t("settings.digest.scheduleHint")}</p>
      </div>

      <div className={cn("flex flex-col gap-6", !enabled && "opacity-50")}>

        <div className="flex flex-col gap-3">
          <FieldLabel>{t("settings.digest.labels")}</FieldLabel>
          <ChipGroup aria-label={t("settings.digest.labels")}>
            {ALL_DIGEST_LABELS.map((label) => (
              <Chip key={label} pressed={labels.has(label)} disabled={!enabled} onClick={() => toggleLabel(label)}>
                <span
                  aria-hidden="true"
                  className="h-2.5 w-2.5 rounded-[3px]"
                  style={{ background: tagColor(label) }}
                />
                {label}
              </Chip>
            ))}
          </ChipGroup>
        </div>

        <div className="max-w-[460px]">
          <Field
            type="email"
            label={t("settings.digest.email")}
            placeholder={t("settings.digest.emailPlaceholder")}
            hint={t("settings.digest.emailHint")}
            error={emailValid ? undefined : t("settings.digest.emailInvalid")}
            disabled={!enabled}
            maxLength={255}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
      </div>

      {update.isError && (
        <p role="alert" className="m-0 text-sm text-hm-danger">
          {t("settings.report.saveFailed")}
        </p>
      )}

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-hm-border pt-5">
        <span className="font-mono text-[13px] text-hm-text-secondary">{nextLine}</span>
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            onClick={() => sendTest.mutate()}
            isLoading={sendTest.isPending}
            disabled={dirty}
            title={dirty ? t("common.save") : undefined}
          >
            {t("settings.digest.sendTest")}
          </Button>
          <Button onClick={save} disabled={!dirty || !emailValid} isLoading={update.isPending}>
            {t("common.save")}
          </Button>
        </div>
      </div>
    </SettingsSection>
  );
}

/** Haftalık özet: anahtar, gün, etiketler, alternatif e-posta, test gönderimi ve kaydet. */
export function NotificationSettings() {
  const { t } = useI18n();
  const { data: settings, isLoading, isError } = useSettings();

  if (isLoading) {
    return (
      <SettingsSection id="digest" title={t("settings.digest.title")}>
        <p role="status" className="m-0 text-sm text-hm-text-secondary">
          {t("common.loading")}
        </p>
      </SettingsSection>
    );
  }

  if (isError || !settings) {
    return (
      <SettingsSection id="digest" title={t("settings.digest.title")}>
        <p role="alert" className="m-0 text-sm text-hm-danger">
          {t("settings.report.loadFailed")}
        </p>
      </SettingsSection>
    );
  }

  const key = [
    settings.emailNotify,
    settings.notifyDay,
    (settings.digestLabels ?? []).join(","),
    settings.digestEmail ?? "",
    settings.digestFrequency ?? "",
    settings.digestHour ?? "",
    settings.digestTimezone ?? "",
  ].join("|");
  return <DigestForm key={key} settings={settings} />;
}
