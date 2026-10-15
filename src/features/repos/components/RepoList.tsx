"use client";

import { Repo } from "@/shared/types/repo.types";
import { RepoCard } from "./RepoCard";
import { useI18n } from "@/shared/i18n/I18nProvider";
import { Button } from "@/shared/ui/Button";
import { Plus } from "lucide-react";

interface RepoListProps {
  repos: Repo[];
  onConnectClick?: () => void;
}

export const RepoList = ({ repos, onConnectClick }: RepoListProps) => {
  const { t } = useI18n();

  return (
    <div className="flex flex-col gap-5">
      {repos.map((repo) => (
        <RepoCard key={repo.id} repo={repo} />
      ))}

      <Button
        variant="outline"
        className="self-start"
        onClick={onConnectClick}
        leftIcon={<Plus size={16} aria-hidden="true" />}
      >
        {t("repos.connectAnother")}
      </Button>
    </div>
  );
};
