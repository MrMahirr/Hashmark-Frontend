import type { DebtType } from "./debt.types";

export interface DashboardStats {
  totalDebts: number;
  activeDebts: number;
  resolvedDebts: number;
  activeRepos: number;
  resolutionRate: number;
}

export interface TrendDataPoint {
  date: string;
  total: number;
  resolved: number;
  added: number;
}

export interface LabelDistribution {
  type: DebtType;
  count: number;
  percentage: number;
}

export interface ModuleDistribution {
  module: string;
  count: number;
}

export interface RecentDebt {
  id: string;
  type: DebtType;
  message: string;
  filePath: string;
  repoName: string;
  createdAt: string;
}
