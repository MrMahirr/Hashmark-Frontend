"use client";

import { Zap } from "lucide-react";
import { useI18n } from "@/shared/i18n/I18nProvider";
import { Panel } from "@/shared/ui/Panel";
import { Switch } from "@/shared/ui/Switch";
import { useSetAutoScan } from "../hooks/useRepos";

interface AutoScanSettingProps {
  repoId: string;
  enabled: boolean;
}

/** İzlenen dala her push'ta otomatik tarama (GitHub webhook). Açmak depoda admin yetkisi ister. */
export function AutoScanSetting({ repoId, enabled }: AutoScanSettingProps) {
  const { t } = useI18n();
  const mutation = useSetAutoScan();
  const descriptionId = `auto-scan-desc-${repoId}`;

  return (
    <Panel className="flex items-center justify-between gap-4 p-5">
      <div className="flex min-w-0 items-start gap-3">
        <Zap size={18} aria-hidden="true" className="mt-0.5 flex-none text-hm-text-secondary" />
        <div className="min-w-0">
          <p className="font-medium text-hm-text-primary">{t("repos.autoScan.label")}</p>
          <p id={descriptionId} className="text-sm text-hm-text-secondary">
            {t("repos.autoScan.hint")}
          </p>
        </div>
      </div>
      <Switch
        checked={enabled}
        disabled={mutation.isPending}
        onCheckedChange={(next) => mutation.mutate({ repoId, enabled: next })}
        aria-label={t("repos.autoScan.label")}
        aria-describedby={descriptionId}
      />
    </Panel>
  );
}
