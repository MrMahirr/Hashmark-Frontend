import { describe, expect, it } from "vitest";
import { distributePercentages } from "./percentages";

const sum = (values: number[]) => values.reduce((a, b) => a + b, 0);

describe("distributePercentages", () => {
  it("toplam her zaman 100 olur (Math.round 99/101 üretirdi)", () => {
    // 1/3 her biri → Math.round ile 33+33+33 = 99
    expect(sum(distributePercentages([1, 1, 1]))).toBe(100);
    // 2/3 ve 1/3'ün yuvarlaması: 67 + 33 = 100; 5 eşit parça: 20 * 5
    expect(sum(distributePercentages([1, 1, 1, 1, 1, 1, 1]))).toBe(100);
    expect(sum(distributePercentages([3, 3, 3, 1]))).toBe(100);
  });

  it("en büyük kalan yöntemiyle dağıtır", () => {
    expect(distributePercentages([1, 1, 1])).toEqual([34, 33, 33]);
    expect(distributePercentages([50, 30, 20])).toEqual([50, 30, 20]);
  });

  it("sıfır toplamda hepsi 0", () => {
    expect(distributePercentages([0, 0, 0])).toEqual([0, 0, 0]);
    expect(distributePercentages([])).toEqual([]);
  });

  it("sıfır sayımlı kalemler yüzde almaz", () => {
    const result = distributePercentages([2, 0, 1, 0]);
    expect(result[1]).toBe(0);
    expect(result[3]).toBe(0);
    expect(sum(result)).toBe(100);
  });

  it("negatif ve geçersiz değerleri sıfır sayar", () => {
    expect(distributePercentages([-5, Number.NaN, 10])).toEqual([0, 0, 100]);
  });

  it("rastgele girdilerde toplam daima 100", () => {
    for (let run = 0; run < 200; run++) {
      const counts = Array.from({ length: 7 }, () => Math.floor(Math.random() * 40));
      if (sum(counts) === 0) continue;
      expect(sum(distributePercentages(counts))).toBe(100);
    }
  });
});
