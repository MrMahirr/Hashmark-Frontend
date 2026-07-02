"use client";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Search } from "lucide-react";
import { DebtType, DEBT_TYPE_CONFIG } from "@/shared/types/debt.types";

interface DebtItem {
  id: string;
  type: DebtType;
  filePath: string;
  line: number;
  content: string;
  createdAt: string;
}

const columnHelper = createColumnHelper<DebtItem>();

const columns = [
  columnHelper.accessor("type", {
    header: "Label",
    cell: (info) => {
      const type = info.getValue();
      const config = DEBT_TYPE_CONFIG[type];
      return (
        <span className={`px-2 py-0.5 rounded-lg font-mono text-[11px] font-medium border-[0.5px] border-current/20 ${config?.bgClass} ${config?.colorClass}`}>
          {type}
        </span>
      );
    },
  }),
  columnHelper.accessor("filePath", {
    header: "File path",
    cell: (info) => (
      <span className="font-mono text-[13px] text-hm-text-secondary hover:text-hm-blue cursor-pointer truncate block max-w-[250px]">
        {info.getValue()}
      </span>
    ),
  }),
  columnHelper.accessor("line", {
    header: "Line",
    cell: (info) => (
      <span className="font-mono text-[13px] text-hm-text-secondary">
        {info.getValue()}
      </span>
    ),
  }),
  columnHelper.accessor("content", {
    header: "Content",
    cell: (info) => (
      <span className="font-mono text-[13px] text-hm-text-primary truncate block max-w-[300px]">
        {info.getValue()}
      </span>
    ),
  }),
  columnHelper.accessor("createdAt", {
    header: "Detected",
    cell: (info) => (
      <span className="text-[12px] text-hm-text-secondary">
        {info.getValue()}
      </span>
    ),
  }),
];

interface RepoDebtTableProps {
  data: DebtItem[];
}

export const RepoDebtTable = ({ data }: RepoDebtTableProps) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="bg-hm-surface rounded-card border-[0.5px] border-hm-border flex flex-col">
      {/* Filter Bar */}
      <div className="p-3 border-b-[0.5px] border-hm-border flex flex-col sm:flex-row items-center justify-between gap-4 bg-hm-bg rounded-t-card">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select className="bg-hm-surface border-[0.5px] border-hm-border text-hm-text-primary font-sans text-[12px] py-1.5 px-3 rounded-md outline-none focus:border-hm-blue cursor-pointer">
            <option value="">All Labels</option>
            <option value="TODO">TODO</option>
            <option value="FIXME">FIXME</option>
            <option value="HACK">HACK</option>
            <option value="XXX">XXX</option>
          </select>
          <select className="bg-hm-surface border-[0.5px] border-hm-border text-hm-text-primary font-sans text-[12px] py-1.5 px-3 rounded-md outline-none focus:border-hm-blue cursor-pointer">
            <option value="">All Modules</option>
            <option value="auth">src/auth</option>
            <option value="core">src/core</option>
          </select>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-hm-text-secondary" size={16} />
          <input
            className="w-full bg-hm-surface border-[0.5px] border-hm-border text-hm-text-primary font-sans text-[12px] py-1.5 pl-8 pr-3 rounded-md outline-none focus:border-hm-blue"
            placeholder="Search content..."
            type="text"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="bg-hm-bg border-b-[0.5px] border-hm-border">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="py-2 px-4 font-sans text-[11px] font-medium text-hm-text-secondary uppercase"
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
          <tbody className="font-sans text-[13px]">
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="border-b-[0.5px] border-hm-border hover:bg-hm-bg transition-colors last:border-0"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="py-3 px-4">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
