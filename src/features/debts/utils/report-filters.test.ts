import { describe, expect, it } from "vitest";
import { buildReportHref, parseReportFilters } from "./report-filters";

describe("report-filters", () => {
  it("gezgin süzgeçlerini rapor bağlantısına yazar ve geri okur", () => {
    const href = buildReportHref(
      { repoId: "3", label: "FIXME", status: "open", q: "cache", author: "mahir", olderThanDays: 90, page: 4, size: 50 },
      { print: true },
    );
    expect(href).toBe("/dashboard/report?repoId=3&label=FIXME&status=open&q=cache&author=mahir&olderThanDays=90&print=1");

    const params = Object.fromEntries(new URL(href, "http://x").searchParams);
    expect(parseReportFilters(params)).toEqual({
      repoId: "3",
      label: "FIXME",
      status: "open",
      q: "cache",
      author: "mahir",
      olderThanDays: 90,
    });
  });

  it("geçersiz değerleri atar, aramayı kısaltır", () => {
    const filters = parseReportFilters({
      label: "drop table",
      status: "deleted",
      author: "<script>",
      q: "x".repeat(300),
    });
    expect(filters.label).toBeUndefined();
    expect(filters.status).toBeUndefined();
    expect(filters.author).toBeUndefined();
    expect(filters.q).toHaveLength(200);
    expect(buildReportHref({})).toBe("/dashboard/report");
  });
});
