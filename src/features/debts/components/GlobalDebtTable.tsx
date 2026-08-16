"use client";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Search, ExternalLink } from "lucide-react";
import { Debt, DebtType, DEBT_TYPE_CONFIG } from "@/shared/types/debt.types";
import Link from "next/link";

const columnHelper = createColumnHelper<Debt>();

const columns = [
  columnHelper.accessor("type", {
    header: "Etiket",
    cell: (info) => {
      const type = info.getValue();
      const config = DEBT_TYPE_CONFIG[type];
      return (
        <span className={`px-1.5 py-0.5 rounded font-mono text-[10px] font-medium border-[0.5px] border-current/20 ${config?.bgClass} ${config?.colorClass}`}>
          {type}
        </span>
      );
    },
  }),
  columnHelper.accessor("repoName", {
    header: "Depo",
    cell: (info) => (
      <span className="font-sans text-[13px] text-hm-text-primary">
        {info.getValue()}
      </span>
    ),
  }),
  columnHelper.accessor("filePath", {
    header: "Dosya Yolu",
    cell: (info) => (
      <span className="font-mono text-[11px] text-hm-text-secondary truncate block max-w-[200px]">
        {info.getValue()}
      </span>
    ),
  }),
  columnHelper.accessor("lineNumber", {
    header: "Satır",
    cell: (info) => (
      <span className="font-mono text-[11px] text-hm-text-secondary text-right block">
        {info.getValue()}
      </span>
    ),
  }),
  columnHelper.accessor("message", {
    header: "İçerik",
    cell: (info) => (
      <span className="font-mono text-[12px] text-hm-text-primary truncate block max-w-[250px]" title={info.getValue()}>
        {info.getValue()}
      </span>
    ),
  }),
  columnHelper.accessor("createdAt", {
    header: "Tespit Tarihi",
    cell: (info) => (
      <span className="font-sans text-[12px] text-hm-text-secondary">
        {info.getValue()}
      </span>
    ),
  }),
  columnHelper.display({
    id: "actions",
    header: () => <div className="text-center">Bağlantı</div>,
    cell: (info) => (
      <div className="text-center">
        <Link
          href={`/dashboard/repos/${info.row.original.repoId}`}
          className="text-hm-text-secondary hover:text-hm-blue transition-colors opacity-0 group-hover:opacity-100 inline-block"
        >
          <ExternalLink size={16} />
        </Link>
      </div>
    ),
  }),
];

interface GlobalDebtTableProps {
  data: Debt[];
  totalElements?: number;
  totalPages?: number;
  currentPage?: number;
  onPageChange?: (newPage: number) => void;
  selectedLabel?: string;
  onLabelChange?: (label: string) => void;
  selectedStatus?: string;
  onStatusChange?: (status: string) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  repos?: { id: string; name: string }[];
  selectedRepo?: string;
  onRepoChange?: (repoId: string) => void;
  isLoading?: boolean;
}

export const GlobalDebtTable = ({
  data,
  totalElements = data.length,
  totalPages = 1,
  currentPage = 0,
  onPageChange,
  selectedLabel = "",
  onLabelChange,
  selectedStatus = "OPEN",
  onStatusChange,
  searchQuery = "",
  onSearchChange,
  repos = [],
  selectedRepo = "",
  onRepoChange,
  isLoading = false,
}: GlobalDebtTableProps) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Filter Bar */}
      <div className="bg-hm-surface border-[0.5px] border-hm-border rounded-xl p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between flex-shrink-0">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Repo Dropdown */}
          <div className="relative w-full sm:w-auto">
            <select
              value={selectedRepo}
              onChange={(e) => onRepoChange?.(e.target.value)}
              className="w-full sm:w-[160px] h-8 pl-3 pr-8 py-0 rounded-md border-[0.5px] border-hm-border bg-transparent text-hm-text-primary font-sans text-[12px] appearance-none focus:outline-none focus:border-hm-blue cursor-pointer"
            >
              <option value="">Tüm Depolar</option>
              {repos.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>
          {/* Divider */}
          <div className="hidden sm:block w-[1px] h-5 bg-hm-border"></div>
          {/* Tag Toggles */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onLabelChange?.("")}
              className={`h-8 px-3 rounded-md border-[0.5px] font-mono text-[11px] font-medium transition-colors flex items-center gap-1 cursor-pointer ${
                !selectedLabel
                  ? "bg-hm-blue text-white border-hm-blue"
                  : "bg-hm-bg text-hm-text-secondary border-hm-border hover:bg-hm-surface-high"
              }`}
            >
              ALL
            </button>
            {Object.values(DebtType).map((type) => {
              const config = DEBT_TYPE_CONFIG[type];
              const isSelected = selectedLabel === type;
              return (
                <button
                  key={type}
                  onClick={() => onLabelChange?.(isSelected ? "" : type)}
                  className={`h-8 px-3 rounded-md border-[0.5px] font-mono text-[11px] font-medium transition-colors flex items-center gap-1 cursor-pointer ${
                    isSelected
                      ? `${config.bgClass} ${config.colorClass} border-current/20 font-bold ring-1 ring-current`
                      : `bg-hm-bg text-hm-text-secondary border-hm-border hover:bg-hm-surface-high`
                  }`}
                >
                  {type}
                </button>
              );
            })}
          </div>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          {/* Status Toggle */}
          <div className="flex bg-hm-bg rounded-md p-0.5 border-[0.5px] border-hm-border">
            <button
              onClick={() => onStatusChange?.("OPEN")}
              className={`px-3 py-1 rounded-sm font-sans text-[11px] font-medium transition-all cursor-pointer ${
                selectedStatus === "OPEN"
                  ? "bg-hm-surface text-hm-text-primary shadow-sm"
                  : "text-hm-text-secondary hover:text-hm-text-primary"
              }`}
            >
              Açık
            </button>
            <button
              onClick={() => onStatusChange?.("RESOLVED")}
              className={`px-3 py-1 rounded-sm font-sans text-[11px] font-medium transition-all cursor-pointer ${
                selectedStatus === "RESOLVED"
                  ? "bg-hm-surface text-hm-text-primary shadow-sm"
                  : "text-hm-text-secondary hover:text-hm-text-primary"
              }`}
            >
              Çözülen
            </button>
          </div>
          {/* Search */}
          <div className="relative w-[200px]">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-hm-text-secondary" size={16} />
            <input
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="w-full h-8 pl-8 pr-3 rounded-md border-[0.5px] border-hm-border bg-hm-surface text-hm-text-primary font-sans text-[12px] focus:outline-none focus:border-hm-blue placeholder:text-hm-text-secondary/50"
              placeholder="İçerikte ara..."
              type="text"
            />
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-hm-surface border-[0.5px] border-hm-border rounded-xl flex-1 flex flex-col overflow-hidden min-h-[400px] relative">
        {isLoading && (
          <div className="absolute inset-0 bg-hm-surface/70 backdrop-blur-[1px] z-20 flex items-center justify-center">
            <div className="flex items-center gap-2 font-sans text-xs text-hm-text-primary bg-hm-bg px-4 py-2 rounded-lg border border-hm-border shadow-sm">
              <div className="w-4 h-4 border-2 border-hm-blue border-t-transparent rounded-full animate-spin"></div>
              Yükleniyor...
            </div>
          </div>
        )}

        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="font-sans text-[11px] text-hm-text-secondary font-medium py-3 px-4 bg-hm-bg border-b-[0.5px] border-hm-border whitespace-nowrap"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="font-sans text-hm-text-primary bg-hm-surface">
              {!data || data.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="py-12 text-center text-hm-text-secondary font-sans text-xs">
                    Seçilen kriterlere uygun teknik borç kaydı bulunamadı. Temiz kod! 🎉
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-hm-bg/50 transition-colors group border-b-[0.5px] border-hm-border last:border-b-0"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="py-3 px-4 align-top">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Footer */}
        <div className="px-4 py-3 bg-hm-surface border-t-[0.5px] border-hm-border flex items-center justify-between mt-auto">
          <span className="font-sans text-[12px] text-hm-text-secondary">
            {totalElements} kayıttan {data.length > 0 ? currentPage * 20 + 1 : 0}-{Math.min((currentPage + 1) * 20, totalElements)} arası gösteriliyor
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange?.(currentPage - 1)}
              disabled={currentPage <= 0 || isLoading}
              className="px-3 py-1.5 rounded-md border-[0.5px] border-hm-border bg-hm-surface text-hm-text-secondary hover:text-hm-text-primary hover:bg-hm-bg transition-colors font-sans text-[12px] disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
            >
              Önceki
            </button>
            <span className="font-sans text-[12px] text-hm-text-secondary px-2">
              Sayfa {currentPage + 1} / {Math.max(1, totalPages)}
            </span>
            <button
              onClick={() => onPageChange?.(currentPage + 1)}
              disabled={currentPage >= totalPages - 1 || isLoading}
              className="px-3 py-1.5 rounded-md border-[0.5px] border-hm-border bg-hm-surface text-hm-text-secondary hover:text-hm-text-primary hover:bg-hm-bg transition-colors font-sans text-[12px] disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
            >
              Sonraki
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
