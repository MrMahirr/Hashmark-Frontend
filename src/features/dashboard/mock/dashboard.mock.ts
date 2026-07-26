import { DebtType } from "@/shared/types/debt.types";
import { DashboardStats, TrendDataPoint, LabelDistribution, RecentDebt } from "@/shared/types/dashboard.types";

export const MOCK_DASHBOARD_STATS: DashboardStats = {
  totalDebts: 284,
  activeDebts: 277,
  resolvedDebts: 7,
  activeRepos: 5,
  resolutionRate: 2.4,
};

export const MOCK_TREND_DATA: TrendDataPoint[] = [
  { date: "Mon", total: 150, resolved: 5, added: 10 },
  { date: "Tue", total: 165, resolved: 8, added: 23 },
  { date: "Wed", total: 180, resolved: 12, added: 27 },
  { date: "Thu", total: 210, resolved: 15, added: 45 },
  { date: "Fri", total: 235, resolved: 18, added: 43 },
  { date: "Sat", total: 260, resolved: 22, added: 47 },
  { date: "Sun", total: 284, resolved: 25, added: 49 },
];

export const MOCK_LABEL_DISTRIBUTION: LabelDistribution[] = [
  { type: DebtType.TODO, count: 142, percentage: 38 },
  { type: DebtType.FIXME, count: 86, percentage: 23 },
  { type: DebtType.HACK, count: 41, percentage: 11 },
  { type: DebtType.XXX, count: 15, percentage: 4 },
  { type: DebtType.NOTE, count: 48, percentage: 13 },
  { type: DebtType.DOC, count: 26, percentage: 7 },
  { type: DebtType.INFO, count: 16, percentage: 4 },
];

export const MOCK_RECENT_DEBTS: RecentDebt[] = [
  {
    id: "1",
    type: DebtType.TODO,
    message: "Refactor this routing logic later",
    filePath: "src/components/Navigation.tsx:42",
    repoName: "frontend-core",
    createdAt: "2h ago",
  },
  {
    id: "2",
    type: DebtType.FIXME,
    message: "Potential race condition here",
    filePath: "api/handlers/auth.go:118",
    repoName: "backend-api",
    createdAt: "5h ago",
  },
  {
    id: "3",
    type: DebtType.HACK,
    message: "Temporary workaround for IE11",
    filePath: "utils/formatters.js:22",
    repoName: "legacy-utils",
    createdAt: "1d ago",
  },
  {
    id: "4",
    type: DebtType.NOTE,
    message: "Refactored module structure, monitor memory usage",
    filePath: "services/analytics.ts:14",
    repoName: "backend-api",
    createdAt: "2d ago",
  },
  {
    id: "5",
    type: DebtType.DOC,
    message: "@return Updated user session object with permissions",
    filePath: "src/auth/session.ts:88",
    repoName: "frontend-core",
    createdAt: "3d ago",
  },
];
