/**
 * Query Key Factory Pattern
 * SRP (Single Responsibility Principle) ve OCP (Open/Closed Principle) kurallarına uygun olarak,
 * TanStack Query key'lerini modüler, öngörülebilir ve tipli bir hiyerarşi içinde merkezi olarak yönetiyoruz.
 * Yeni bir modül eklendiğinde sadece bu obje genişletilir.
 */
export const queryKeys = {
  repos: {
    all: ["repos"] as const,
    detail: (id: string) => ["repos", id] as const,
  },
  debts: {
    all: ["debts"] as const,
    filtered: (filters: Record<string, unknown>) => ["debts", filters] as const,
    stats: (repoId?: string) => ["debts", "stats", repoId] as const,
  },
  dashboard: {
    summary: (repoId?: string) => ["dashboard", "summary", repoId] as const,
  },
  scanner: {
    status: (repoId: string) => ["scanner", "status", repoId] as const,
  },
  settings: {
    current: ["settings"] as const,
  },
} as const;
