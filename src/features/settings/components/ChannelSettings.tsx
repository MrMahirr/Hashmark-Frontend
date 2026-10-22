"use client";

import { useState } from "react";
import { Send, Trash2 } from "lucide-react";
import { useI18n } from "@/shared/i18n/I18nProvider";
import { useToastStore } from "@/shared/store/toast.store";
import { Button } from "@/shared/ui/Button";
import { Chip, ChipGroup } from "@/shared/ui/Chip";
import { Field } from "@/shared/ui/Field";
import { Switch } from "@/shared/ui/Switch";
import { cn } from "@/shared/ui/cn";
import type { ChannelKind, ChannelResponse } from "../api/channels.api";
import type { SettingsResponse } from "../api/settings.types";
import { useChannels, useCreateChannel, useDeleteChannel, useTestChannel, useUpdateChannel } from "../hooks/useChannels";
import { useSettings, useUpdateSettings } from "../hooks/useSettings";
import { FieldLabel, SettingsSection } from "./SettingsSection";

export const CHANNEL_KINDS: readonly ChannelKind[] = ["SLACK", "DISCORD", "TEAMS"];
const MAX_CHANNELS = 5;

const PLACEHOLDER: Record<ChannelKind, string> = {
  SLACK: "https://hooks.slack.com/services/…",
  DISCORD: "https://discord.com/api/webhooks/…",
  TEAMS: "https://….logic.azure.com/workflows/…",
};

const KIND_LABEL: Record<ChannelKind, string> = { SLACK: "Slack", DISCORD: "Discord", TEAMS: "Teams" };

/** Kaba istemci denetimi; asıl doğrulama (izinli alan adları) sunucuda. */
export function looksLikeWebhook(url: string): boolean {
  const value = url.trim();
  return value.startsWith("https://") && value.length > 12 && value.length <= 500;
}

/** Boş = kapalı (0); aksi halde pozitif tam sayı. */
export function parseThreshold(value: string): number | undefined {
  const trimmed = value.trim();
  if (trimmed === "") return 0;
  if (!/^\d{1,7}$/.test(trimmed)) return undefined;
  return Number(trimmed);
}

function ChannelRow({ channel }: { channel: ChannelResponse }) {
  const { t, formatDate } = useI18n();
  const update = useUpdateChannel();
  const remove = useDeleteChannel();
  const test = useTestChannel();
  const label = `${KIND_LABEL[channel.kind]} ${channel.urlHint}`;

  return (
    <li className="flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-hm-border py-4 first:border-t-0">
      <div className="flex min-w-[200px] flex-1 flex-col gap-1">
        <span className="font-mono text-[13px] font-bold text-hm-text-primary">{KIND_LABEL[channel.kind]}</span>
        <span className="truncate font-mono text-xs text-hm-text-secondary" title={channel.urlHint}>
          {channel.urlHint}
        </span>
        {channel.lastStatus && (
          <span className={cn("text-xs", channel.lastStatus === "OK" ? "text-hm-success" : "text-hm-danger")}>
            {channel.lastStatus === "OK"
              ? t("settings.channels.lastOk", { date: formatDate(channel.lastSentAt ?? "") })
              : t("settings.channels.lastFailed", { error: channel.lastError ?? "" })}
          </span>
        )}
      </div>
      <label className="flex items-center gap-2 text-sm">
        <Switch
          checked={channel.sendDigest}
          onCheckedChange={(value) => update.mutate({ id: channel.id, payload: { sendDigest: value } })}
          aria-label={t("settings.channels.digestFor", { channel: label })}
        />
        <span aria-hidden="true">{t("settings.channels.digest")}</span>
      </label>
      <label className="flex items-center gap-2 text-sm">
        <Switch
          checked={channel.sendAlerts}
          onCheckedChange={(value) => update.mutate({ id: channel.id, payload: { sendAlerts: value } })}
          aria-label={t("settings.channels.alertsFor", { channel: label })}
        />
        <span aria-hidden="true">{t("settings.channels.alerts")}</span>
      </label>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          onClick={() => test.mutate(channel.id)}
          isLoading={test.isPending}
          leftIcon={<Send size={14} aria-hidden="true" />}
          aria-label={t("settings.channels.testFor", { channel: label })}
        >
          {t("settings.channels.test")}
        </Button>
        <Button
          variant="outline"
          onClick={() => remove.mutate(channel.id)}
          isLoading={remove.isPending}
          leftIcon={<Trash2 size={14} aria-hidden="true" />}
          aria-label={t("settings.channels.deleteFor", { channel: label })}
        >
          {t("settings.channels.delete")}
        </Button>
      </div>
    </li>
  );
}

function AddChannelForm({ disabled }: { disabled: boolean }) {
  const { t } = useI18n();
  const addToast = useToastStore((state) => state.addToast);
  const create = useCreateChannel();
  const [kind, setKind] = useState<ChannelKind>("SLACK");
  const [url, setUrl] = useState("");
  const valid = looksLikeWebhook(url);

  const submit = () => {
    if (!valid || disabled) return;
    create.mutate(
      { kind, url: url.trim(), sendDigest: true, sendAlerts: true },
      {
        onSuccess: () => {
          setUrl("");
          addToast({ title: t("settings.channels.added"), type: "success" });
        },
      },
    );
  };

  return (
    <div className="flex flex-col gap-4 border-t border-hm-border pt-5">
      <div className="flex flex-col gap-3">
        <FieldLabel>{t("settings.channels.kind")}</FieldLabel>
        <ChipGroup aria-label={t("settings.channels.kind")}>
          {CHANNEL_KINDS.map((value) => (
            <Chip key={value} pressed={kind === value} onClick={() => setKind(value)}>
              {KIND_LABEL[value]}
            </Chip>
          ))}
        </ChipGroup>
      </div>
      <div className="flex flex-wrap items-start gap-3">
        <div className="min-w-[260px] max-w-[560px] flex-1">
          <Field
            type="url"
            label={t("settings.channels.url")}
            placeholder={PLACEHOLDER[kind]}
            hint={t(`settings.channels.urlHint.${kind}` as const)}
            error={create.isError ? (create.error as Error).message : undefined}
            maxLength={500}
            autoComplete="off"
            spellCheck={false}
            value={url}
            onChange={(event) => setUrl(event.target.value)}
          />
        </div>
        <Button onClick={submit} disabled={!valid || disabled} isLoading={create.isPending} className="mt-7">
          {t("settings.channels.add")}
        </Button>
      </div>
      {disabled && <p className="m-0 text-sm text-hm-text-secondary">{t("settings.channels.limit", { max: MAX_CHANNELS })}</p>}
    </div>
  );
}

function AlertForm({ settings }: { settings: SettingsResponse }) {
  const { t } = useI18n();
  const addToast = useToastStore((state) => state.addToast);
  const update = useUpdateSettings();
  const serverThreshold = settings.alertMaxOpen != null ? String(settings.alertMaxOpen) : "";
  const serverSecret = settings.alertOnSecret ?? true;
  const [threshold, setThreshold] = useState(serverThreshold);
  const [secret, setSecret] = useState(serverSecret);
  const parsed = parseThreshold(threshold);
  const dirty = threshold.trim() !== serverThreshold || secret !== serverSecret;

  const save = () => {
    if (parsed === undefined) return;
    update.mutate(
      { alertMaxOpen: parsed, alertOnSecret: secret },
      { onSuccess: () => addToast({ title: t("settings.alerts.saved"), type: "success" }) },
    );
  };

  return (
    <div className="flex flex-col gap-4 border-t border-hm-border pt-5">
      <h3 className="m-0 text-base font-bold text-hm-text-primary">{t("settings.alerts.title")}</h3>
      <div className="flex flex-wrap items-start gap-6">
        <div className="w-[240px]">
          <Field
            inputMode="numeric"
            label={t("settings.alerts.threshold")}
            placeholder={t("settings.alerts.thresholdPlaceholder")}
            hint={t("settings.alerts.thresholdHint")}
            error={parsed === undefined ? t("settings.alerts.thresholdInvalid") : undefined}
            maxLength={7}
            value={threshold}
            onChange={(event) => setThreshold(event.target.value)}
          />
        </div>
        <label className="mt-8 flex items-center gap-3 text-sm text-hm-text-primary">
          <Switch checked={secret} onCheckedChange={setSecret} aria-label={t("settings.alerts.secret")} />
          <span aria-hidden="true">{t("settings.alerts.secret")}</span>
        </label>
      </div>
      <div className="flex justify-end">
        <Button onClick={save} disabled={!dirty || parsed === undefined} isLoading={update.isPending}>
          {t("common.save")}
        </Button>
      </div>
    </div>
  );
}

/** Slack / Discord / Teams kanalları ve tarama sonrası uyarı ayarları. */
export function ChannelSettings() {
  const { t } = useI18n();
  const channels = useChannels();
  const settings = useSettings();
  const list = channels.data ?? [];

  return (
    <div id="channels" className="scroll-mt-6">
      <SettingsSection id="channels-settings" title={t("settings.channels.title")} description={t("settings.channels.description")}>
        {channels.isLoading ? (
          <p role="status" className="m-0 text-sm text-hm-text-secondary">
            {t("common.loading")}
          </p>
        ) : channels.isError ? (
          <p role="alert" className="m-0 text-sm text-hm-danger">
            {t("settings.channels.loadFailed")}
          </p>
        ) : list.length === 0 ? (
          <p className="m-0 text-sm text-hm-text-secondary">{t("settings.channels.empty")}</p>
        ) : (
          <ul className="m-0 list-none p-0" aria-label={t("settings.channels.title")}>
            {list.map((channel) => (
              <ChannelRow key={channel.id} channel={channel} />
            ))}
          </ul>
        )}

        <AddChannelForm disabled={list.length >= MAX_CHANNELS} />

        {settings.data && (
          <AlertForm
            key={`${settings.data.alertMaxOpen ?? ""}|${settings.data.alertOnSecret ?? ""}`}
            settings={settings.data}
          />
        )}
      </SettingsSection>
    </div>
  );
}
