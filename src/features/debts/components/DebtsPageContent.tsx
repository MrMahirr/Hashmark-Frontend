"use client";

import React, { useState } from "react";
import { Navbar } from "@/widgets/Navbar";
import { GlobalDebtTable } from "./GlobalDebtTable";
import { useMappedDebts } from "../hooks/useDebts";
import { useMappedRepos, useSyncRepos } from "@/features/repos/hooks/useRepos";
import { useStartScan } from "@/features/scanner/hooks/useScanner";
import { RefreshCw, Loader2, AlertCircle } from "lucide-react";

/**
 * SRP & Client Boundary:
 * Tüm teknik borçların listelendiği sayfanın filtreleme, sayfalama ve arama 
 * durumlarını (state) yöneten Container (Client) bileşeni.
 */
export function DebtsPageContent() {
  const [page, setPage] = useState(0);
  const [label, setLabel] = useState("");
  const [status, setStatus] = useState("OPEN");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRepo, setSelectedRepo] = useState("");

  const filters: Record<string, unknown> = {
    page,
    size: 20,
  };
  if (label) filters.label = label;
  if (selectedRepo) filters.repoId = selectedRepo;
  if (searchQuery) filters.content = searchQuery;

  const { data: pageResponse, isLoading, isError, refetch } = useMappedDebts(filters);
  const { data: repos } = useMappedRepos();
  const syncMutation = useSyncRepos();
  const scanMutation = useStartScan();

  const handleScan = () => {
    if (selectedRepo) {
      if (!scanMutation.isPending) scanMutation.mutate(selectedRepo);
    } else {
      if (!syncMutation.isPending) syncMutation.mutate();
    }
  };

  const isScanning = syncMutation.isPending || scanMutation.isPending;
  const totalElements = pageResponse?.totalElements ?? 0;
  const totalPages = pageResponse?.totalPages ?? 1;

  // İstemci tarafında status filtresi (Eğer backend doğrudan status parametresi almıyorsa ui bütünlüğü için)
  const allDebts = pageResponse?.content || [];
  const displayedDebts = allDebts.filter((d) => {
    if (status === "OPEN") return d.status === "ACTIVE";
    if (status === "RESOLVED") return d.status === "RESOLVED";
    return true;
  });

  const title = (
    <div className="flex items-center gap-3">
      <h2 className="text-[16px] font-medium text-hm-text-primary leading-tight">All debts</h2>
      <span className="font-sans text-hm-text-secondary bg-hm-bg border-[0.5px] border-hm-border px-2 py-0.5 rounded-full text-xs">
        {totalElements} total
      </span>
    </div>
  );

  const action = (
    <button
      onClick={handleScan}
      disabled={isScanning}
      className="h-8 px-3 rounded-md bg-hm-text-primary text-hm-surface font-sans text-xs font-medium hover:bg-hm-text-primary/90 transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
    >
      {isScanning ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
      {isScanning ? "Scanning..." : "Scan Now"}
    </button>
  );

  return (
    <div className="flex-1 flex flex-col h-full relative w-full overflow-hidden">
      <Navbar title={title} action={action} />

      <div className="flex-1 overflow-auto px-6 pb-6 pt-4 w-full">
        <div className="max-w-[1400px] mx-auto w-full flex flex-col h-full gap-4">
          {isError ? (
            <div className="bg-hm-surface border-[0.5px] border-hm-border rounded-card p-8 flex flex-col items-center justify-center text-center gap-4 my-8">
              <div className="w-12 h-12 rounded-full bg-hm-danger-bg flex items-center justify-center text-hm-danger">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-sans text-base font-medium text-hm-text-primary">
                  Borç Listesi Alınamadı
                </h3>
                <p className="font-sans text-xs text-hm-text-secondary mt-1 max-w-md">
                  Teknik borç kayıtlarını çekerken bir sorun oluştu. Lütfen bağlantınızı kontrol edin.
                </p>
              </div>
              <button
                onClick={() => refetch()}
                className="px-4 py-2 bg-hm-text-primary text-hm-surface rounded text-xs font-medium flex items-center gap-2 hover:opacity-90 transition-opacity cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Yeniden Dene
              </button>
            </div>
          ) : (
            <GlobalDebtTable
              data={displayedDebts}
              totalElements={totalElements}
              totalPages={totalPages}
              currentPage={page}
              onPageChange={(newPage) => setPage(newPage)}
              selectedLabel={label}
              onLabelChange={(newLabel) => {
                setLabel(newLabel);
                setPage(0);
              }}
              selectedStatus={status}
              onStatusChange={(newStatus) => {
                setStatus(newStatus);
                setPage(0);
              }}
              searchQuery={searchQuery}
              onSearchChange={(newQuery) => {
                setSearchQuery(newQuery);
                setPage(0);
              }}
              repos={repos?.map((r) => ({ id: r.id, name: r.name })) || []}
              selectedRepo={selectedRepo}
              onRepoChange={(newRepoId) => {
                setSelectedRepo(newRepoId);
                setPage(0);
              }}
              isLoading={isLoading}
            />
          )}
        </div>
      </div>
    </div>
  );
}
