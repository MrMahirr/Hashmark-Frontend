"use client";

import Link from "next/link";
import { Repo } from "@/shared/types/repo.types";
import { DebtType, DEBT_TYPE_CONFIG } from "@/shared/types/debt.types";

const GithubIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"></path>
  </svg>
);

interface RepoCardProps {
  repo: Repo;
}

export const RepoCard = ({ repo }: RepoCardProps) => {
  return (
    <div 
      className="bg-hm-surface rounded-card border-[0.5px] border-hm-border p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-hm-bg transition-colors relative group"
    >
      <Link href={`/dashboard/repos/${repo.id}`} className="absolute inset-0 z-0" aria-label={`View ${repo.name}`} />
      <div className="flex items-center gap-4 relative z-10 pointer-events-none">
        <div className="w-8 h-8 rounded-full bg-hm-border-light flex items-center justify-center text-hm-text-primary shrink-0 pointer-events-auto">
          <GithubIcon className="w-4 h-4" />
        </div>
        <div className="pointer-events-auto">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[13px] font-medium text-hm-text-primary">{repo.fullName}</span>
            <span className="font-sans text-[11px] font-medium bg-hm-bg border-[0.5px] border-hm-border text-hm-text-secondary px-2 py-0.5 rounded-lg">
              {repo.isPrivate ? "private" : "public"}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            {repo.debtBreakdown &&
              Object.entries(repo.debtBreakdown).map(([type, count]) => {
                const config = DEBT_TYPE_CONFIG[type as DebtType];
                if (!config || !count) return null;
                return (
                  <span
                    key={type}
                    className={`font-mono text-[11px] px-1.5 py-0.5 rounded border-[0.5px] ${config.colorClass} ${config.bgClass} border-current/20`}
                  >
                    {type}:{count}
                  </span>
                );
              })}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-6 justify-between md:justify-end border-t-[0.5px] border-hm-border md:border-t-0 pt-3 md:pt-0 pointer-events-none">
        <div className="flex flex-col text-right">
          <span className="font-sans text-[12px] text-hm-text-secondary">
            Last scan {repo.lastScanAt || "never"}
          </span>
          <span className="font-sans text-[13px] font-medium text-hm-text-primary mt-0.5">
            {repo.debtCount} debts
          </span>
        </div>
        <div className="flex items-center gap-2 pointer-events-auto">
          <button 
            className="border-[0.5px] border-hm-border bg-transparent text-hm-text-primary px-3 py-1.5 rounded font-sans text-[12px] hover:bg-hm-bg transition-colors relative z-10"
            onClick={(e) => e.preventDefault()}
          >
            Scan now
          </button>
          <span className="font-sans text-[13px] font-medium text-hm-blue group-hover:underline px-2 relative z-10">
            View
          </span>
        </div>
      </div>
    </div>
  );
};
