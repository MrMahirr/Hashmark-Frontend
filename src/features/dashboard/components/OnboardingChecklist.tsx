"use client";

import { CheckCircle2, Circle } from "lucide-react";
import { useI18n } from "@/shared/i18n/I18nProvider";
import { useMappedRepos } from "@/features/repos/hooks/useRepos";
import { ButtonLink } from "@/shared/ui/Button";
import { Panel } from "@/shared/ui/Panel";

/**
 * Yeni kullanıcıyı ilk raporuna götüren 3 adımlı rehber. Depo bağlanıp ilk tarama
 * yapıldığında kendiliğinden kaybolur.
 */
export function OnboardingChecklist() {
  const { t } = useI18n();
  const { data: repos, isLoading } = useMappedRepos();

  if (isLoading || !repos) return null;

  const hasRepos = repos.length > 0;
  const hasScanned = repos.some((repo) => !!repo.lastScanAt);
  if (hasRepos && hasScanned) return null;

  const steps = [
    { key: "account", title: t("onboarding.step.account"), hint: null as string | null, done: true },
    { key: "sync", title: t("onboarding.step.sync"), hint: t("onboarding.step.syncHint"), done: hasRepos },
    { key: "scan", title: t("onboarding.step.scan"), hint: t("onboarding.step.scanHint"), done: hasScanned },
  ];
  const currentKey = steps.find((step) => !step.done)?.key;

  return (
    <Panel aria-labelledby="onboarding-title" className="p-6">
      <h2 id="onboarding-title" className="m-0 font-serif text-[28px] font-normal leading-none text-hm-text-primary">
        {t("onboarding.title")}
      </h2>
      <p className="mb-0 mt-2 text-sm text-hm-text-secondary">{t("onboarding.subtitle")}</p>

      <ol className="mt-4 flex flex-col gap-3">
        {steps.map((step, index) => (
          <li key={step.key} className="flex items-start gap-3">
            <span className="mt-0.5" aria-hidden="true">
              {step.done ? (
                <CheckCircle2 size={18} className="text-hm-success" />
              ) : (
                <Circle size={18} className={step.key === currentKey ? "text-hm-acc" : "text-hm-border"} />
              )}
            </span>
            <div className="min-w-0 flex-1">
              <p className={`m-0 text-[15px] ${step.done ? "text-hm-text-secondary line-through" : "text-hm-text-primary font-medium"}`}>
                <span className="sr-only">{`${index + 1}. `}</span>
                {step.title}
                {step.done && <span className="sr-only"> — {t("onboarding.done")}</span>}
              </p>
              {!step.done && step.hint && <p className="mt-0.5 text-sm text-hm-text-secondary">{step.hint}</p>}

              {step.key === "sync" && currentKey === "sync" && (
                <ButtonLink href="/dashboard/repos" className="mt-3">
                  {t("onboarding.action.sync")}
                </ButtonLink>
              )}
              {step.key === "scan" && currentKey === "scan" && (
                <ButtonLink href="/dashboard/repos" className="mt-3">
                  {t("onboarding.action.goRepos")}
                </ButtonLink>
              )}
            </div>
          </li>
        ))}
      </ol>
    </Panel>
  );
}
