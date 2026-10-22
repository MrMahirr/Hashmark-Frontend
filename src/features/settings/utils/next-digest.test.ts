import { describe, expect, it } from "vitest";
import { nextDigestAt, timeZoneOptions, weekdayLabel } from "./next-digest";

describe("nextDigestAt", () => {
  // 2026-10-19 Pazartesi 12:30 UTC (İstanbul 15:30)
  const monday = new Date("2026-10-19T12:30:00Z");

  it("haftalık: bugünün saati geçtiyse bir sonraki haftaya", () => {
    const next = nextDigestAt({ frequency: "WEEKLY", day: "MONDAY", hour: 9, timeZone: "Europe/Istanbul" }, monday);
    expect(next?.toISOString()).toBe("2026-10-26T06:00:00.000Z");
  });

  it("haftalık: hafta içindeki ilk gün ve saat", () => {
    const next = nextDigestAt({ frequency: "WEEKLY", day: "FRIDAY", hour: 8, timeZone: "Europe/Istanbul" }, monday);
    expect(next?.toISOString()).toBe("2026-10-23T05:00:00.000Z");
  });

  it("günlük: aynı gün saat henüz gelmediyse bugün, kullanıcının saat diliminde", () => {
    const next = nextDigestAt({ frequency: "DAILY", day: "MONDAY", hour: 18, timeZone: "Europe/Istanbul" }, monday);
    expect(next?.toISOString()).toBe("2026-10-19T15:00:00.000Z");
    const ny = nextDigestAt({ frequency: "DAILY", day: "MONDAY", hour: 8, timeZone: "America/New_York" }, monday);
    expect(ny?.toISOString()).toBe("2026-10-20T12:00:00.000Z");
  });

  it("aylık: ayın 1'i", () => {
    const next = nextDigestAt({ frequency: "MONTHLY", day: "MONDAY", hour: 8, timeZone: "Europe/Istanbul" }, monday);
    expect(next?.toISOString()).toBe("2026-11-01T05:00:00.000Z");
  });

  it("geçersiz saat diliminde null", () => {
    expect(nextDigestAt({ frequency: "DAILY", day: "MONDAY", hour: 8, timeZone: "Mars/Olympus" }, monday)).toBeNull();
  });
});

describe("timeZoneOptions", () => {
  it("listede olmayan mevcut değeri başa ekler", () => {
    const zones = timeZoneOptions("Etc/Unknown");
    expect(zones[0]).toBe("Etc/Unknown");
    expect(zones).toContain("Europe/Istanbul");
  });
});

describe("weekdayLabel", () => {
  it("yerel kısa gün adını döner", () => {
    expect(weekdayLabel("MONDAY", "en")).toBe("Mon");
    expect(weekdayLabel("SUNDAY", "en")).toBe("Sun");
  });
});
