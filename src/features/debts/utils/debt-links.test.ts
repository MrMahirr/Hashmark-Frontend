import { describe, expect, it } from "vitest";
import { buildDebtsHref, parseDebtLinkFilters } from "./debt-links";
import { debtAgeDays, isStale } from "./debt-age";

describe("debt-links", () => {
  it("süzgeçleri URL'ye yazar ve geri okur", () => {
    const href = buildDebtsHref({ repoId: "7", olderThanDays: 90, debtOnly: true, secret: true, priority: "CRITICAL" });
    expect(href).toBe("/dashboard/debts?repoId=7&olderThanDays=90&priority=CRITICAL&secret=1&debtOnly=1");

    const params = Object.fromEntries(new URL(href, "http://x").searchParams);
    expect(parseDebtLinkFilters(params)).toEqual({
      repoId: "7",
      olderThanDays: 90,
      priority: "CRITICAL",
      secret: true,
      debtOnly: true,
    });
  });

  it("dosya/klasör yolu taşınır, baştaki/sondaki eğik çizgi atılır", () => {
    expect(buildDebtsHref({ path: "src/a b" })).toBe("/dashboard/debts?path=src%2Fa+b");
    expect(parseDebtLinkFilters({ path: "/src/api/" })).toEqual({ path: "src/api" });
    expect(parseDebtLinkFilters({ path: "/" })).toEqual({});
    expect(parseDebtLinkFilters({ path: "x".repeat(501) })).toEqual({});
  });

  it("süzgeç yoksa düz bağlantı", () => {
    expect(buildDebtsHref()).toBe("/dashboard/debts");
  });

  it("geçersiz URL değerlerini yok sayar", () => {
    expect(
      parseDebtLinkFilters({ repoId: "1 OR 1=1", olderThanDays: "-5", priority: "urgent", secret: "yes" }),
    ).toEqual({});
    expect(parseDebtLinkFilters({ olderThanDays: "999999", priority: "high", debtOnly: ["true", "0"] })).toEqual({
      olderThanDays: 36_500,
      priority: "HIGH",
      debtOnly: true,
    });
  });
});

describe("debt-age", () => {
  const now = Date.parse("2026-10-22T12:00:00Z");

  it("yaş blame tarihinden, yoksa ilk görülmeden hesaplanır", () => {
    expect(debtAgeDays({ introducedAt: "2026-07-24T12:00:00Z", createdAt: "2026-10-20T00:00:00Z" }, now)).toBe(90);
    expect(debtAgeDays({ introducedAt: null, createdAt: "2026-10-12T12:00:00Z" }, now)).toBe(10);
    expect(debtAgeDays({ createdAt: "bozuk" }, now)).toBeNull();
  });

  it("90 gün ve üstü çürüyen sayılır", () => {
    expect(isStale({ introducedAt: "2026-07-24T12:00:00Z" }, now)).toBe(true);
    expect(isStale({ introducedAt: "2026-07-25T12:00:00Z" }, now)).toBe(false);
  });
});
