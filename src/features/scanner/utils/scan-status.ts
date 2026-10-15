import { queryConfig } from "@/shared/config/query.config";
import type { ScanJobStatus } from "../api/scanner.types";

/** Tarama bitene kadar durum kontrol aralığı (ms); `NEXT_PUBLIC_SCAN_POLL_MS` ile ayarlanır. */
export const SCAN_POLL_INTERVAL_MS = queryConfig.scanPollInterval;

/** Kuyrukta veya çalışıyorsa true: durum tekrar sorgulanmalı. */
export function isScanActive(status: ScanJobStatus | undefined): boolean {
  return status === "PENDING" || status === "RUNNING";
}

/** React Query `refetchInterval` değeri: aktifse aralık, değilse false (polling durur). */
export function scanPollInterval(status: ScanJobStatus | undefined): number | false {
  return isScanActive(status) ? SCAN_POLL_INTERVAL_MS : false;
}
