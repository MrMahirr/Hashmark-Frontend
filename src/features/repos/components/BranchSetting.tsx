"use client";

import { useState } from "react";
import { GitBranch } from "lucide-react";
import { useI18n } from "@/shared/i18n/I18nProvider";
import { Button } from "@/shared/ui/Button";
import { Field } from "@/shared/ui/Field";
import { Panel } from "@/shared/ui/Panel";
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
    <Panel className="p-5">
      <form
        className="flex flex-col gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          if (invalid || unchanged || mutation.isPending) return;
          mutation.mutate({ repoId, branch: trimmed === "" ? null : trimmed });
        }}
      >
        <Field
          id={`branch-${repoId}`}
          label={t("repos.branch.label")}
          icon={<GitBranch size={18} />}
          hint={t("repos.branch.hint")}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder={t("repos.branch.placeholder")}
          aria-invalid={invalid}
          maxLength={255}
          className="max-w-[420px] font-mono"
        />
        <Button type="submit" className="self-start" disabled={invalid || unchanged} isLoading={mutation.isPending}>
          {t("common.save")}
        </Button>
      </form>
    </Panel>
  );
}
