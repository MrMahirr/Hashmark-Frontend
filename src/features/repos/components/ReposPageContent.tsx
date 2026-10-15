"use client";

import { FolderGit2, Plus } from "lucide-react";
import { useState } from "react";
import { RepoList } from "./RepoList";
import { AddRepoDialog } from "./AddRepoDialog";
import { useMappedRepos } from "../hooks/useRepos";
import { useI18n } from "@/shared/i18n/I18nProvider";
import { Button } from "@/shared/ui/Button";
import { Panel } from "@/shared/ui/Panel";
import { Heading } from "@/shared/ui/Typography";
import { ErrorState, LoadingState } from "@/shared/ui/StateViews";

/**
 * SRP & Client Boundary:
 * Repolar sayfasındaki interaksiyonu ve API durumlarını (yükleniyor, hata, boş liste) yönetir.
 */
export function ReposPageContent() {
  const { t } = useI18n();
  const { data: repos, isLoading, isError, refetch } = useMappedRepos();
  const [addOpen, setAddOpen] = useState(false);
  const openAdd = () => setAddOpen(true);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="m-0 text-base font-bold text-hm-text-primary">{t("repos.title")}</h2>
        <Button onClick={openAdd} leftIcon={<Plus size={18} aria-hidden="true" />}>
          {t("repos.connect")}
        </Button>
      </div>

      {isLoading ? (
        <LoadingState label={t("repos.loading")} className="min-h-[300px]" />
      ) : isError ? (
        <ErrorState
          title={t("repos.errorTitle")}
          description={t("repos.errorDescription")}
          retryLabel={t("common.retry")}
          onRetry={() => refetch()}
        />
      ) : !repos || repos.length === 0 ? (
        <Panel className="flex flex-col items-center gap-4 px-7 py-14 text-center">
          <FolderGit2 className="h-8 w-8 text-hm-text-secondary" aria-hidden="true" />
          <Heading as="h2" className="text-4xl">
            {t("repos.emptyTitle")}
          </Heading>
          <p className="m-0 max-w-[420px] text-hm-text-secondary">{t("repos.emptyDescription")}</p>
          <Button onClick={openAdd}>{t("repos.connectNow")}</Button>
        </Panel>
      ) : (
        <RepoList repos={repos} onConnectClick={openAdd} />
      )}

      <AddRepoDialog open={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  );
}
