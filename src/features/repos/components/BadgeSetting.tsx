"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Copy, RefreshCw } from "lucide-react";
import { apiClient } from "@/shared/api/client";
import { useI18n } from "@/shared/i18n/I18nProvider";
import { useToastStore } from "@/shared/store/toast.store";
import { Button } from "@/shared/ui/Button";
import { Panel } from "@/shared/ui/Panel";
import { disableBadge, getBadge, rotateBadge } from "../api/repos.api";

interface BadgeSettingProps {
  repoId: string;
}

/**
 * Rozet adresleri. API kökü göreli olabilir ("/api/v1"); README'ye mutlak adres gerekir, sayfanın kökeniyle
 * tamamlanır.
 */
export function badgeUrls(token: string, apiBase: string, origin: string) {
  const base = new URL(apiBase.endsWith("/") ? apiBase : `${apiBase}/`, origin);
  const svg = new URL(`public/badge/${token}.svg`, base).toString();
  const json = new URL(`public/badge/${token}.json`, base).toString();
  return {
    svg,
    json,
    markdown: `[![Hashmark](${svg})](${origin})`,
    shields: `https://img.shields.io/endpoint?url=${encodeURIComponent(json)}`,
  };
}

/** README rozeti: aç, Markdown'ı kopyala, anahtarı yenile ya da kapat. */
export function BadgeSetting({ repoId }: BadgeSettingProps) {
  const { t } = useI18n();
  const addToast = useToastStore((state) => state.addToast);
  const queryClient = useQueryClient();
  const key = ["repos", repoId, "badge"] as const;
  const badge = useQuery({ queryKey: key, queryFn: () => getBadge(repoId) });
  const [confirmRotate, setConfirmRotate] = useState(false);

  const rotate = useMutation({
    mutationFn: () => rotateBadge(repoId),
    onSuccess: (info) => {
      queryClient.setQueryData(key, info);
      setConfirmRotate(false);
    },
    onError: () => addToast({ title: t("badge.failed"), type: "error" }),
  });
  const disable = useMutation({
    mutationFn: () => disableBadge(repoId),
    onSuccess: () => queryClient.setQueryData(key, { enabled: false, token: null }),
    onError: () => addToast({ title: t("badge.failed"), type: "error" }),
  });

  const token = badge.data?.enabled ? badge.data.token : null;
  const urls =
    token && typeof window !== "undefined"
      ? badgeUrls(token, apiClient.defaults.baseURL ?? "", window.location.origin)
      : null;

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      addToast({ title: t("badge.copied"), type: "success" });
    } catch {
      addToast({ title: t("badge.copyFailed"), type: "error" });
    }
  };

  return (
    <Panel className="flex flex-col gap-4 p-6">
      <div className="flex flex-col gap-1">
        <h2 className="m-0 text-base font-bold text-hm-text-primary">{t("badge.title")}</h2>
        <p className="m-0 text-sm text-hm-text-secondary">{t("badge.description")}</p>
      </div>

      {badge.isLoading ? (
        <p role="status" className="m-0 text-sm text-hm-text-secondary">
          {t("common.loading")}
        </p>
      ) : !urls ? (
        <div>
          <Button onClick={() => rotate.mutate()} isLoading={rotate.isPending}>
            {t("badge.enable")}
          </Button>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element -- harici API'den dinamik SVG */}
            <img src={urls.svg} alt={t("badge.previewAlt")} height={20} className="h-5" />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor={`badge-md-${repoId}`} className="font-mono text-xs uppercase tracking-[0.08em] text-hm-text-secondary">
              {t("badge.markdown")}
            </label>
            <div className="flex flex-wrap items-start gap-2">
              <textarea
                id={`badge-md-${repoId}`}
                readOnly
                rows={2}
                value={urls.markdown}
                onFocus={(event) => event.currentTarget.select()}
                className="min-w-[260px] flex-1 resize-none rounded-control border border-hm-border bg-hm-bg p-3 font-mono text-xs text-hm-text-primary"
              />
              <Button variant="outline" onClick={() => copy(urls.markdown)} leftIcon={<Copy size={14} aria-hidden="true" />}>
                {t("badge.copy")}
              </Button>
            </div>
            <p className="m-0 text-xs text-hm-text-secondary">
              {t("badge.shieldsHint")}{" "}
              <button type="button" onClick={() => copy(urls.shields)} className="cursor-pointer font-semibold underline">
                {t("badge.copyShields")}
              </button>
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 border-t border-hm-border pt-4">
            {confirmRotate ? (
              <>
                <span className="text-sm text-hm-text-primary">{t("badge.rotateConfirm")}</span>
                <Button onClick={() => rotate.mutate()} isLoading={rotate.isPending}>
                  {t("badge.rotateYes")}
                </Button>
                <Button variant="outline" onClick={() => setConfirmRotate(false)}>
                  {t("common.cancel")}
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={() => setConfirmRotate(true)}
                  leftIcon={<RefreshCw size={14} aria-hidden="true" />}
                >
                  {t("badge.rotate")}
                </Button>
                <Button variant="outline" onClick={() => disable.mutate()} isLoading={disable.isPending}>
                  {t("badge.disable")}
                </Button>
              </>
            )}
          </div>
        </>
      )}
    </Panel>
  );
}
