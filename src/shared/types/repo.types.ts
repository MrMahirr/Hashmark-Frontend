export enum ScanStatus {
  IDLE = "IDLE",
  SCANNING = "SCANNING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

export interface Repo {
  id: string;
  name: string;
  fullName: string;
  owner: string;
  language: string;
  description: string;
  isPrivate: boolean;
  lastScanAt: string | null;
  scanStatus: ScanStatus;
  debtCount: number;
  resolvedCount: number;
  connectedAt: string;
  debtBreakdown?: Record<string, number>;
}

/**
 * Tarama durumuna göre görsel konfigürasyon.
 */
export const SCAN_STATUS_CONFIG: Record<
  ScanStatus,
  { label: string; colorClass: string; bgClass: string }
> = {
  [ScanStatus.IDLE]: {
    label: "Idle",
    colorClass: "text-hm-todo",
    bgClass: "bg-hm-todo-bg",
  },
  [ScanStatus.SCANNING]: {
    label: "Scanning...",
    colorClass: "text-hm-todo",
    bgClass: "bg-hm-todo-bg",
  },
  [ScanStatus.COMPLETED]: {
    label: "Completed",
    colorClass: "text-hm-success",
    bgClass: "bg-hm-success-bg",
  },
  [ScanStatus.FAILED]: {
    label: "Failed",
    colorClass: "text-hm-danger",
    bgClass: "bg-hm-danger-bg",
  },
};
