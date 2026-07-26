"use client";

import Link from "next/link";
import { Clock, ChevronRight, Radar, Loader2 } from "lucide-react";
import { Repo } from "@/shared/types/repo.types";
import { useStartScan } from "@/features/scanner/hooks/useScanner";

interface RepoHeaderProps {
  repo: Repo;
}

export const RepoHeader = ({ repo }: RepoHeaderProps) => {
  const scanMutation = useStartScan();

  const handleScan = () => {
    if (!scanMutation.isPending && repo.id) {
      scanMutation.mutate(repo.id);
    }
  };

  return (
    <div className="mb-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 font-sans text-[11px] font-medium text-hm-text-secondary mb-6">
        <Link href="/dashboard/repos" className="hover:text-hm-blue transition-colors">Repos</Link>
        <ChevronRight size={14} />
        <span className="text-hm-text-primary">{repo.fullName}</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-mono text-base font-medium text-hm-text-primary flex items-center gap-2">
            <span className="text-hm-text-secondary">#</span> {repo.fullName}
          </h2>
          <p className="font-sans text-[11px] font-medium text-hm-text-secondary mt-1 flex items-center gap-1">
            <Clock size={14} /> Last scanned: {repo.lastScanAt || "never"}
          </p>
        </div>
        <button 
          onClick={handleScan}
          disabled={scanMutation.isPending}
          className="bg-hm-text-primary text-hm-surface px-4 py-2 rounded-lg font-sans text-sm font-medium hover:bg-hm-text-primary/90 transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {scanMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <Radar size={16} />}
          {scanMutation.isPending ? "Scanning..." : "Scan now"}
        </button>
      </div>
    </div>
  );
};
