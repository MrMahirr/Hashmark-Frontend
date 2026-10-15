import { describe, expect, it } from "vitest";
import { isScanActive, scanPollInterval, SCAN_POLL_INTERVAL_MS } from "./scan-status";

describe("scan status polling", () => {
  it("PENDING ve RUNNING aktiftir (backend durumları)", () => {
    expect(isScanActive("PENDING")).toBe(true);
    expect(isScanActive("RUNNING")).toBe(true);
  });

  it("DONE, FAILED ve bilinmeyen durumda polling durur", () => {
    expect(isScanActive("DONE")).toBe(false);
    expect(isScanActive("FAILED")).toBe(false);
    expect(isScanActive(undefined)).toBe(false);
    expect(scanPollInterval("DONE")).toBe(false);
    expect(scanPollInterval(undefined)).toBe(false);
  });

  it("aktif durumda sabit aralık döner", () => {
    expect(scanPollInterval("RUNNING")).toBe(SCAN_POLL_INTERVAL_MS);
  });
});
