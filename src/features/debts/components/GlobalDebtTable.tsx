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
    header: "Label",
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
    header: "Repo",
    cell: (info) => (
      <span className="font-sans text-[13px] text-hm-text-primary">
        {info.getValue()}
      </span>
    ),
  }),
  columnHelper.accessor("filePath", {
    header: "File path",
    cell: (info) => (
      <span className="font-mono text-[11px] text-hm-text-secondary truncate block max-w-[200px]">
        {info.getValue()}
      </span>
    ),
  }),
  columnHelper.accessor("lineNumber", {
    header: "Line",
    cell: (info) => (
      <span className="font-mono text-[11px] text-hm-text-secondary text-right block">
        {info.getValue()}
      </span>
    ),
  }),
  columnHelper.accessor("message", {
    header: "Content",
    cell: (info) => (
      <span className="font-mono text-[12px] text-hm-text-primary truncate block max-w-[250px]" title={info.getValue()}>
        {info.getValue()}
      </span>
    ),
  }),
  columnHelper.accessor("createdAt", {
    header: "Detected",
    cell: (info) => (
      <span className="font-sans text-[12px] text-hm-text-secondary">
        {info.getValue()}
      </span>
    ),
  }),
  columnHelper.display({
    id: "actions",
    header: () => <div className="text-center">Link</div>,
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
}

export const GlobalDebtTable = ({ data }: GlobalDebtTableProps) => {
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
            <select className="w-full sm:w-[160px] h-8 pl-3 pr-8 py-0 rounded-md border-[0.5px] border-hm-border bg-transparent text-hm-text-primary font-sans text-[12px] appearance-none focus:outline-none focus:border-hm-blue cursor-pointer">
              <option>All Repositories</option>
              <option>api-gateway</option>
              <option>web-client</option>
              <option>auth-service</option>
            </select>
          </div>
          {/* Divider */}
          <div className="hidden sm:block w-[1px] h-5 bg-hm-border"></div>
          {/* Tag Toggles */}
          <div className="flex flex-wrap gap-2">
            {Object.values(DebtType).map((type) => {
              const config = DEBT_TYPE_CONFIG[type];
              // Using mock selection state visually
              const isSelected = type === DebtType.TODO;
              return (
                <button
                  key={type}
                  className={`h-8 px-3 rounded-md border-[0.5px] font-mono text-[11px] font-medium transition-colors flex items-center gap-1 ${
                    isSelected
                      ? `${config.bgClass} ${config.colorClass} border-current/20`
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
            <button className="px-3 py-1 rounded-sm bg-hm-surface text-hm-text-primary font-sans text-[11px] font-medium shadow-sm transition-all">Open</button>
            <button className="px-3 py-1 rounded-sm text-hm-text-secondary font-sans text-[11px] font-medium hover:text-hm-text-primary transition-all">Resolved</button>
          </div>
          {/* Search */}
          <div className="relative w-[200px]">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-hm-text-secondary" size={16} />
            <input
              className="w-full h-8 pl-8 pr-3 rounded-md border-[0.5px] border-hm-border bg-hm-surface text-hm-text-primary font-sans text-[12px] focus:outline-none focus:border-hm-blue placeholder:text-hm-text-secondary/50"
              placeholder="Search content..."
              type="text"
            />
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-hm-surface border-[0.5px] border-hm-border rounded-xl flex-1 flex flex-col overflow-hidden min-h-[400px]">
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
              {table.getRowModel().rows.map((row) => (
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
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination Footer */}
        <div className="px-4 py-3 bg-hm-surface border-t-[0.5px] border-hm-border flex items-center justify-between mt-auto">
          <span className="font-sans text-[12px] text-hm-text-secondary">
            Showing 1-{data.length} of 284
          </span>
          <div className="flex items-center gap-2">
            <button disabled className="px-3 py-1.5 rounded-md border-[0.5px] border-hm-border bg-hm-surface text-hm-text-secondary hover:text-hm-text-primary hover:bg-hm-bg transition-colors font-sans text-[12px] disabled:opacity-50">
              Previous
            </button>
            <button className="px-3 py-1.5 rounded-md border-[0.5px] border-hm-border bg-hm-surface text-hm-text-secondary hover:text-hm-text-primary hover:bg-hm-bg transition-colors font-sans text-[12px]">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
