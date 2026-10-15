"use client";

import { Button } from "@/shared/components/Button";
import { useMappedRepos, useSyncRepos, useDeleteRepo } from "@/features/repos/hooks/useRepos";
import { useI18n } from "@/shared/i18n/I18nProvider";
import { GitBranch, Unplug, Loader2 } from "lucide-react";

export function ConnectedRepos() {
  const { t, formatDate } = useI18n();
  const { data: repos, isLoading } = useMappedRepos();
  const syncMutation = useSyncRepos();
  const deleteMutation = useDeleteRepo();

  return (
    <section className="bg-hm-surface rounded-card border-[0.5px] border-solid border-hm-border p-5 space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="font-medium text-sm text-hm-text-primary mb-1">{t("settings.repos.title")}</h3>
          <p className="text-sm text-hm-text-secondary">{t("settings.repos.description")}</p>
        </div>
        <Button
          variant="secondary"
          leftIcon={
            syncMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
            ) : (
              <GitBranch className="w-4 h-4" aria-hidden="true" />
            )
          }
          onClick={() => {
            if (!syncMutation.isPending) syncMutation.mutate();
          }}
          disabled={syncMutation.isPending}
        >
          {syncMutation.isPending ? t("repos.syncing") : t("repos.connect")}
        </Button>
      </div>

      {isLoading ? (
        <div role="status" className="flex items-center justify-center py-8 text-hm-text-secondary gap-2 text-sm">
          <Loader2 className="w-4 h-4 animate-spin text-hm-blue" aria-hidden="true" />
          {t("settings.repos.loading")}
        </div>
      ) : repos && repos.length > 0 ? (
        <ul className="space-y-3">
          {repos.map((repo) => (
            <li
              key={repo.id}
              className="flex items-center justify-between gap-3 p-3 rounded-control border-[0.5px] border-solid border-hm-border bg-hm-bg"
            >
              <div className="flex items-center gap-3 min-w-0">
                <GitBranch className="w-5 h-5 text-hm-text-secondary shrink-0" aria-hidden="true" />
                <div className="min-w-0">
                  <h4 className="text-sm font-medium text-hm-text-primary truncate">{repo.fullName}</h4>
                  <p className="text-xs text-hm-text-secondary mt-0.5">
                    {t("settings.repos.connectedAt", {
                      date: formatDate(repo.connectedAt, t("settings.repos.recently")),
                    })}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-hm-text-secondary hover:text-hm-danger hover:bg-hm-danger-bg cursor-pointer shrink-0"
                leftIcon={
                  deleteMutation.isPending ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
                  ) : (
                    <Unplug className="w-3.5 h-3.5" aria-hidden="true" />
                  )
                }
                onClick={() => {
                  if (!deleteMutation.isPending && repo.id) {
                    deleteMutation.mutate(repo.id);
                  }
                }}
                disabled={deleteMutation.isPending}
                aria-label={`${t("settings.repos.remove")}: ${repo.fullName}`}
              >
                {t("settings.repos.remove")}
              </Button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center py-6">
          <p className="text-sm text-hm-text-secondary">{t("settings.repos.empty")}</p>
        </div>
      )}
    </section>
  );
}
