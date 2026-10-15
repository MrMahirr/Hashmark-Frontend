"use client";

import { useState } from "react";
import { GitBranch, Loader2 } from "lucide-react";
import { useI18n } from "@/shared/i18n/I18nProvider";
import { useSetTrackedBranch } from "../hooks/useRepos";

interface BranchSettingProps {
  repoId: string;
  /** Şu an kaydedilmiş dal; null = varsayılan dal. */
  currentBranch: string | null;
}

const BRANCH_PATTERN = /^[A-Za-z0-9._/-]{1,255}$/;

/** Depo için taranacak dalı ayarlar. Boş bırakılırsa deponun varsayılan dalı taranır. */
export function BranchSetting({ repoId, currentBranch }: BranchSettingProps) {
  const { t } = useI18n();
  const mutation = useSetTrackedBranch();
  const [value, setValue] = useState(currentBranch ?? "");

  const trimmed = value.trim();
  const unchanged = trimmed === (currentBranch ?? "");
  const invalid = trimmed !== "" && (!BRANCH_PATTERN.test(trimmed) || trimmed.includes(".."));

  return (
    <form
      className="flex flex-col gap-1.5 bg-hm-surface border-[0.5px] border-hm-border rounded-card p-4 mb-4"
      onSubmit={(event) => {
        event.preventDefault();
        if (invalid || unchanged || mutation.isPending) return;
        mutation.mutate({ repoId, branch: trimmed === "" ? null : trimmed });
      }}
    >
      <label htmlFor={`branch-${repoId}`} className="text-[12px] font-medium text-hm-text-secondary flex items-center gap-1.5">
        <GitBranch size={14} aria-hidden="true" />
        {t("repos.branch.label")}
      </label>
      <div className="flex items-center gap-2">
        <input
          id={`branch-${repoId}`}
          type="text"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder={t("repos.branch.placeholder")}
          aria-invalid={invalid}
          aria-describedby={`branch-hint-${repoId}`}
          maxLength={255}
          className="h-9 flex-1 max-w-[320px] rounded-md border-[0.5px] border-hm-border bg-hm-surface px-3 font-mono text-[13px] text-hm-text-primary placeholder:text-hm-text-secondary/70"
        />
        <button
          type="submit"
          disabled={invalid || unchanged || mutation.isPending}
          className="inline-flex h-9 items-center gap-2 rounded-md bg-hm-text-primary px-3 text-[12px] font-medium text-hm-surface disabled:opacity-50"
        >
          {mutation.isPending && <Loader2 size={14} className="animate-spin" aria-hidden="true" />}
          {t("common.save")}
        </button>
      </div>
      <p id={`branch-hint-${repoId}`} className="text-[11px] text-hm-text-secondary">
        {t("repos.branch.hint")}
      </p>
    </form>
  );
}
