import { describe, expect, it } from "vitest";
import { nextDigestDate, weekdayLabel } from "./next-digest";

describe("nextDigestDate", () => {
  it("aynı gündeyse bir sonraki haftayı verir", () => {
    // 2026-10-19 Pazartesi
    const next = nextDigestDate("MONDAY", new Date(2026, 9, 19));
    expect(next.getFullYear()).toBe(2026);
    expect(next.getMonth()).toBe(9);
    expect(next.getDate()).toBe(26);
  });

  it("hafta içinde ilerideki günü bulur", () => {
    // 2026-10-19 Pazartesi -> Cuma 23 Ekim
    expect(nextDigestDate("FRIDAY", new Date(2026, 9, 19)).getDate()).toBe(23);
    // Pazar -> 25 Ekim
    expect(nextDigestDate("SUNDAY", new Date(2026, 9, 19)).getDate()).toBe(25);
  });

  it("ay sonunu aşar", () => {
    // 2026-10-30 Cuma -> Salı 3 Kasım
    const next = nextDigestDate("TUESDAY", new Date(2026, 9, 30));
    expect(next.getMonth()).toBe(10);
    expect(next.getDate()).toBe(3);
  });
});

describe("weekdayLabel", () => {
  it("yerel kısa gün adını döner", () => {
    expect(weekdayLabel("MONDAY", "en")).toBe("Mon");
    expect(weekdayLabel("SUNDAY", "en")).toBe("Sun");
  });
});
