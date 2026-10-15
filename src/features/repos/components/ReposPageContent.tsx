"use client";

import React from "react";
import { RepoList } from "./RepoList";
import { useMappedRepos, useSyncRepos } from "../hooks/useRepos";
import { useI18n } from "@/shared/i18n/I18nProvider";
import { Plus, Loader2, AlertCircle, RefreshCw, FolderGit2 } from "lucide-react";

/**
 * SRP & Client Boundary:
 * Repolar sayfasındaki interaksiyonu ve API durumlarını (yükleniyor, hata, boş liste) yönetir.
 */
export function ReposPageContent() {
  const { t } = useI18n();
  const { data: repos, isLoading, isError, refetch } = useMappedRepos();
  const syncMutation = useSyncRepos();

  const handleSync = () => {
    if (!syncMutation.isPending) {
      syncMutation.mutate();
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-[16px] font-medium text-hm-text-primary">{t("repos.title")}</h2>
        <button
          type="button"
          onClick={handleSync}
          disabled={syncMutation.isPending}
          className="bg-hm-text-primary text-hm-surface px-4 py-2 rounded font-sans text-sm font-medium flex items-center gap-2 transition-opacity hover:opacity-90 disabled:opacity-50 cursor-pointer"
        >
          {syncMutation.isPending ? (
            <Loader2 size={18} className="animate-spin" aria-hidden="true" />
          ) : (
            <Plus size={18} aria-hidden="true" />
          )}
          {syncMutation.isPending ? t("repos.syncing") : t("repos.connect")}
        </button>
      </div>

      {isLoading ? (
        <div role="status" className="flex flex-col items-center justify-center min-h-[300px] w-full gap-3">
          <Loader2 className="w-8 h-8 text-hm-blue animate-spin" aria-hidden="true" />
          <p className="font-sans text-xs text-hm-text-secondary animate-pulse">{t("repos.loading")}</p>
        </div>
      ) : isError ? (
        <div className="bg-hm-surface border-[0.5px] border-hm-border rounded-card p-8 flex flex-col items-center justify-center text-center gap-4 my-8">
          <div className="w-12 h-12 rounded-full bg-hm-danger-bg flex items-center justify-center text-hm-danger">
            <AlertCircle className="w-6 h-6" aria-hidden="true" />
          </div>
          <div role="alert">
            <h3 className="font-sans text-base font-medium text-hm-text-primary">{t("repos.errorTitle")}</h3>
            <p className="font-sans text-xs text-hm-text-secondary mt-1 max-w-md">{t("repos.errorDescription")}</p>
          </div>
          <button
            type="button"
            onClick={() => refetch()}
            className="px-4 py-2 bg-hm-text-primary text-hm-surface rounded text-xs font-medium flex items-center gap-2 hover:opacity-90 transition-opacity cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
            {t("common.retry")}
          </button>
        </div>
      ) : !repos || repos.length === 0 ? (
        <div className="bg-hm-surface border border-dashed border-hm-border rounded-card p-12 flex flex-col items-center justify-center text-center gap-4 my-4">
          <div className="w-12 h-12 rounded-full bg-hm-bg flex items-center justify-center text-hm-text-secondary">
            <FolderGit2 className="w-6 h-6" aria-hidden="true" />
          </div>
          <div>
            <h3 className="font-sans text-base font-medium text-hm-text-primary">{t("repos.emptyTitle")}</h3>
            <p className="font-sans text-xs text-hm-text-secondary mt-1 max-w-md">{t("repos.emptyDescription")}</p>
          </div>
          <button
            type="button"
            onClick={handleSync}
            disabled={syncMutation.isPending}
            className="mt-2 px-4 py-2 bg-hm-text-primary text-hm-surface rounded text-xs font-medium flex items-center gap-2 hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50"
          >
            {syncMutation.isPending ? (
              <Loader2 size={14} className="animate-spin" aria-hidden="true" />
            ) : (
              <Plus size={14} aria-hidden="true" />
            )}
            {syncMutation.isPending ? t("repos.syncing") : t("repos.connectNow")}
          </button>
        </div>
      ) : (
        <RepoList repos={repos} onConnectClick={handleSync} />
      )}
    </>
  );
}
