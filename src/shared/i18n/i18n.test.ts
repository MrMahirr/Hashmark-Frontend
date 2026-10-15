import { describe, expect, it } from "vitest";
import { createTranslator, format, formatDate, formatDateTime, messages, readLocaleFromCookie } from "./index";
import { LOCALE_COOKIE } from "./locales";

const placeholders = (value: string) => (value.match(/\{\w+\}/g) ?? []).sort();

describe("sözlükler", () => {
  it("TR ve EN aynı anahtar kümesine sahip", () => {
    expect(Object.keys(messages.en).sort()).toEqual(Object.keys(messages.tr).sort());
  });

  it("her anahtarda yer tutucular iki dilde aynı", () => {
    for (const key of Object.keys(messages.tr) as Array<keyof typeof messages.tr>) {
      expect(placeholders(messages.en[key]), `yer tutucu uyuşmazlığı: ${key}`).toEqual(
        placeholders(messages.tr[key])
      );
    }
  });

  it("boş çeviri yok", () => {
    for (const locale of ["tr", "en"] as const) {
      for (const [key, value] of Object.entries(messages[locale])) {
        expect(value.trim().length, `${locale}:${key}`).toBeGreaterThan(0);
      }
    }
  });
});

describe("format / createTranslator", () => {
  it("yer tutucuları doldurur ve eksik parametreyi olduğu gibi bırakır", () => {
    expect(format("{a} ve {b}", { a: 1 })).toBe("1 ve {b}");
    expect(format("sade")).toBe("sade");
  });

  it("seçili dile göre çevirir", () => {
    expect(createTranslator("tr")("debts.selected", { count: 3 })).toBe("3 seçili");
    expect(createTranslator("en")("debts.selected", { count: 3 })).toBe("3 selected");
  });

  it("bilinmeyen anahtarda anahtarın kendisini döndürür", () => {
    const t = createTranslator("en") as unknown as (key: string) => string;
    expect(t("does.not.exist")).toBe("does.not.exist");
  });
});

describe("tarih biçimleme", () => {
  it("geçersiz ve boş değerlerde yedek metin döner", () => {
    expect(formatDate(null, "tr", "—")).toBe("—");
    expect(formatDate("bozuk", "en", "n/a")).toBe("n/a");
    expect(formatDateTime(undefined, "tr", "yok")).toBe("yok");
  });

  it("dile göre farklı biçim üretir", () => {
    const iso = "2026-03-04T12:00:00Z";
    expect(formatDate(iso, "tr")).not.toBe(formatDate(iso, "en"));
  });
});

describe("dil çerezi", () => {
  it("geçerli değeri okur, geçersizde varsayılana döner", () => {
    expect(readLocaleFromCookie(`a=1; ${LOCALE_COOKIE}=en; b=2`)).toBe("en");
    expect(readLocaleFromCookie(`${LOCALE_COOKIE}=de`)).toBe("tr");
    expect(readLocaleFromCookie("")).toBe("tr");
  });
});
