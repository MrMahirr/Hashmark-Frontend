import { describe, expect, it } from "vitest";
import { ALL_DIGEST_LABELS, isValidDigestEmail, labelsFromServer, labelsToServer } from "./digest-labels";

describe("digest-labels", () => {
  it("boş sunucu değeri tüm etiketleri seçili gösterir", () => {
    expect(labelsFromServer([]).size).toBe(ALL_DIGEST_LABELS.length);
    expect(labelsFromServer(undefined).size).toBe(ALL_DIGEST_LABELS.length);
    expect([...labelsFromServer(["TODO", "HACK"])]).toEqual(["TODO", "HACK"]);
  });

  it("hepsi seçiliyse boş dizi gönderir; aksi hâlde sıralı alt küme", () => {
    expect(labelsToServer(new Set(ALL_DIGEST_LABELS))).toEqual([]);
    expect(labelsToServer(new Set(["HACK", "TODO"]))).toEqual(["TODO", "HACK"]);
  });

  it("e-posta doğrulaması: boş geçerli, biçim hatalı geçersiz", () => {
    expect(isValidDigestEmail("")).toBe(true);
    expect(isValidDigestEmail(" a@b.co ")).toBe(true);
    expect(isValidDigestEmail("a@b")).toBe(false);
    expect(isValidDigestEmail("yok")).toBe(false);
  });
});
