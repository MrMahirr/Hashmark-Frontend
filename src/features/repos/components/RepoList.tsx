"use client";

import { Repo } from "@/shared/types/repo.types";
import { RepoCard } from "./RepoCard";
import { PlusCircle } from "lucide-react";
import { useI18n } from "@/shared/i18n/I18nProvider";

interface RepoListProps {
  repos: Repo[];
  onConnectClick?: () => void;
}

export const RepoList = ({ repos, onConnectClick }: RepoListProps) => {
  const { t } = useI18n();

  return (
    <div className="flex flex-col gap-3">
      {repos.map((repo) => (
        <RepoCard key={repo.id} repo={repo} />
      ))}

      <button
        type="button"
        onClick={onConnectClick}
        className="w-full bg-transparent border border-dashed border-hm-border hover:border-hm-text-secondary hover:bg-hm-bg rounded-card p-4 flex flex-col items-center justify-center gap-2 transition-all group mt-2 h-24 cursor-pointer"
      >
        <PlusCircle
          aria-hidden="true"
          className="text-hm-text-muted group-hover:text-hm-text-primary transition-colors"
          size={24}
        />
        <span className="font-sans text-[13px] font-medium text-hm-text-secondary group-hover:text-hm-text-primary transition-colors">
          {t("repos.connectAnother")}
        </span>
      </button>
    </div>
  );
};
