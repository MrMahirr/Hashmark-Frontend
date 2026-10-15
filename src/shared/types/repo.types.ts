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
  /** Taranan dal; null = varsayılan dal */
  trackedBranch: string | null;
  debtBreakdown?: Record<string, number>;
}
