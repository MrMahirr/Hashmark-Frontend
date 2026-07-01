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
}

/**
 * Tarama durumuna göre görsel konfigürasyon.
 */
export const SCAN_STATUS_CONFIG: Record<
  ScanStatus,
  { label: string; pillClass: string }
> = {
  [ScanStatus.IDLE]: {
    label: "Idle",
    pillClass: "pill-todo",
  },
  [ScanStatus.SCANNING]: {
    label: "Scanning...",
    pillClass: "pill-todo",
  },
  [ScanStatus.COMPLETED]: {
    label: "Completed",
    pillClass: "pill-success",
  },
  [ScanStatus.FAILED]: {
    label: "Failed",
    pillClass: "pill-danger",
  },
};
