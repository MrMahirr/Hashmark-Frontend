export enum DebtType {
  TODO = "TODO",
  FIXME = "FIXME",
  HACK = "HACK",
  XXX = "XXX",
}

export enum DebtStatus {
  ACTIVE = "ACTIVE",
  RESOLVED = "RESOLVED",
}

export interface Debt {
  id: string;
  type: DebtType;
  message: string;
  filePath: string;
  lineNumber: number;
  repoId: string;
  repoName: string;
  author: string;
  status: DebtStatus;
  createdAt: string;
  resolvedAt: string | null;
}

/**
 * Debt type'a göre CSS pill class döndüren yardımcı mapping.
 * Tailwind token'ları globals.css'de tanımlı.
 */
export const DEBT_TYPE_CONFIG: Record<
  DebtType,
  { label: string; pillClass: string; colorClass: string; bgClass: string }
> = {
  [DebtType.TODO]: {
    label: "TODO",
    pillClass: "bg-hm-todo-bg text-hm-todo",
    colorClass: "text-hm-todo",
    bgClass: "bg-hm-todo-bg",
  },
  [DebtType.FIXME]: {
    label: "FIXME",
    pillClass: "bg-hm-fixme-bg text-hm-fixme",
    colorClass: "text-hm-fixme",
    bgClass: "bg-hm-fixme-bg",
  },
  [DebtType.HACK]: {
    label: "HACK",
    pillClass: "bg-hm-hack-bg text-hm-hack",
    colorClass: "text-hm-hack",
    bgClass: "bg-hm-hack-bg",
  },
  [DebtType.XXX]: {
    label: "XXX",
    pillClass: "bg-hm-xxx-bg text-hm-xxx",
    colorClass: "text-hm-xxx",
    bgClass: "bg-hm-xxx-bg",
  },
};
