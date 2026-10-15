"use client";

import Link from "next/link";
import { CheckCircle2, Circle, Loader2 } from "lucide-react";
import { useI18n } from "@/shared/i18n/I18nProvider";
import { useMappedRepos, useSyncRepos } from "@/features/repos/hooks/useRepos";

/**
 * Yeni kullanıcıyı ilk raporuna götüren 3 adımlı rehber. Depo bağlanıp ilk tarama
 * yapıldığında kendiliğinden kaybolur.
 */
export function OnboardingChecklist() {
  const { t } = useI18n();
  const { data: repos, isLoading } = useMappedRepos();
  const syncMutation = useSyncRepos();

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
    <section
      aria-labelledby="onboarding-title"
      className="bg-hm-surface border-[0.5px] border-hm-border rounded-card p-5"
    >
      <h2 id="onboarding-title" className="text-sm font-medium text-hm-text-primary">
        {t("onboarding.title")}
      </h2>
      <p className="mt-1 text-xs text-hm-text-secondary">{t("onboarding.subtitle")}</p>

      <ol className="mt-4 flex flex-col gap-3">
        {steps.map((step, index) => (
          <li key={step.key} className="flex items-start gap-3">
            <span className="mt-0.5" aria-hidden="true">
              {step.done ? (
                <CheckCircle2 size={18} className="text-hm-success" />
              ) : (
                <Circle size={18} className={step.key === currentKey ? "text-hm-blue" : "text-hm-border"} />
              )}
            </span>
            <div className="min-w-0 flex-1">
              <p className={`text-[13px] ${step.done ? "text-hm-text-secondary line-through" : "text-hm-text-primary font-medium"}`}>
                <span className="sr-only">{`${index + 1}. `}</span>
                {step.title}
                {step.done && <span className="sr-only"> — {t("onboarding.done")}</span>}
              </p>
              {!step.done && step.hint && <p className="mt-0.5 text-xs text-hm-text-secondary">{step.hint}</p>}

              {step.key === "sync" && currentKey === "sync" && (
                <button
                  type="button"
                  onClick={() => syncMutation.mutate()}
                  disabled={syncMutation.isPending}
                  className="mt-2 inline-flex items-center gap-2 rounded-md bg-hm-text-primary px-3 py-1.5 text-xs font-medium text-hm-surface disabled:opacity-50"
                >
                  {syncMutation.isPending && <Loader2 size={12} className="animate-spin" aria-hidden="true" />}
                  {t("onboarding.action.sync")}
                </button>
              )}
              {step.key === "scan" && currentKey === "scan" && (
                <Link
                  href="/dashboard/repos"
                  className="mt-2 inline-flex items-center rounded-md bg-hm-text-primary px-3 py-1.5 text-xs font-medium text-hm-surface"
                >
                  {t("onboarding.action.goRepos")}
                </Link>
              )}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
