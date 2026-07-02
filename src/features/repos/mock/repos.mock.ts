import { Repo, ScanStatus } from "@/shared/types/repo.types";
import { DebtType } from "@/shared/types/debt.types";

export const MOCK_REPOS: Repo[] = [
  {
    id: "1",
    name: "core-api",
    fullName: "acme/core-api",
    owner: "acme",
    language: "Go",
    description: "Core API for Acme Corp",
    isPrivate: true,
    lastScanAt: "3h ago",
    scanStatus: ScanStatus.COMPLETED,
    debtCount: 142,
    resolvedCount: 0,
    connectedAt: "2023-01-01T00:00:00Z",
    debtBreakdown: {
      [DebtType.TODO]: 82,
      [DebtType.FIXME]: 34,
      [DebtType.HACK]: 18,
      [DebtType.XXX]: 8,
    },
  },
  {
    id: "2",
    name: "web-client",
    fullName: "acme/web-client",
    owner: "acme",
    language: "TypeScript",
    description: "Frontend web client",
    isPrivate: true,
    lastScanAt: "5h ago",
    scanStatus: ScanStatus.COMPLETED,
    debtCount: 62,
    resolvedCount: 0,
    connectedAt: "2023-01-01T00:00:00Z",
    debtBreakdown: {
      [DebtType.TODO]: 45,
      [DebtType.FIXME]: 12,
      [DebtType.HACK]: 5,
    },
  },
  {
    id: "3",
    name: "docs",
    fullName: "hashmark/docs",
    owner: "hashmark",
    language: "Markdown",
    description: "Documentation",
    isPrivate: false,
    lastScanAt: "1d ago",
    scanStatus: ScanStatus.COMPLETED,
    debtCount: 16,
    resolvedCount: 0,
    connectedAt: "2023-01-01T00:00:00Z",
    debtBreakdown: {
      [DebtType.TODO]: 14,
      [DebtType.XXX]: 2,
    },
  },
];

export const MOCK_REPO_MODULES = [
  { name: "src/auth", count: 42, percentage: 60 },
  { name: "src/core", count: 28, percentage: 45 },
  { name: "src/utils", count: 18, percentage: 30 },
  { name: "src/api", count: 10, percentage: 15 },
];

export const MOCK_REPO_DEBTS = [
  {
    id: "1",
    type: DebtType.TODO,
    filePath: "src/auth/session.ts",
    line: 42,
    content: "// TODO: Implement redis caching for active sessions",
    createdAt: "2 days ago",
  },
  {
    id: "2",
    type: DebtType.FIXME,
    filePath: "src/core/db/connection.ts",
    line: 115,
    content: "// FIXME: Race condition during hot reload dev cycle",
    createdAt: "5 days ago",
  },
  {
    id: "3",
    type: DebtType.HACK,
    filePath: "src/api/v1/users.ts",
    line: 22,
    content: "@deprecated Use v2 endpoints for user management",
    createdAt: "1 week ago",
  },
  {
    id: "4",
    type: DebtType.TODO,
    filePath: "src/utils/logger.ts",
    line: 8,
    content: "// TODO: integrate Datadog transport in prod",
    createdAt: "2 weeks ago",
  },
];
