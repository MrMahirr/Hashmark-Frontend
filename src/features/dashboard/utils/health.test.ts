import { describe, expect, it } from "vitest";
import { calculateHealth } from "./health";

describe("calculateHealth", () => {
  it.each([
    [0, 100, "A"],
    [10, 85, "A"],
    [11, 84, "B"],
    [30, 55, "B"],
    [31, 54, "C"],
    [50, 25, "C"],
    [51, 24, "D"],
    [80, 0, "D"],
    [81, 0, "F"],
    [500, 0, "F"],
  ])("%i borç → skor %i, not %s", (debts, score, grade) => {
    expect(calculateHealth(debts)).toEqual({ score, grade });
  });

  it("geçersiz girdilerde A ve 100 döner", () => {
    expect(calculateHealth(Number.NaN)).toEqual({ score: 100, grade: "A" });
    expect(calculateHealth(-4)).toEqual({ score: 100, grade: "A" });
  });
});
