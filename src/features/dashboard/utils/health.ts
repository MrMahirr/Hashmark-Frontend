export type HealthGrade = "A" | "B" | "C" | "D" | "F";

export interface HealthSummary {
  /** 0–100 arası sağlık skoru */
  score: number;
  grade: HealthGrade;
}

/**
 * Sağlık skoru ve harf notu.
 * Yalnızca gerçek borç etiketleri (TODO, FIXME, HACK, XXX) sayılır; NOTE, DOC ve INFO penalize edilmez.
 *
 * @param penalizableDebts cezalandırılan açık borç sayısı
 */
export function calculateHealth(penalizableDebts: number): HealthSummary {
  const count = Number.isFinite(penalizableDebts) ? Math.max(0, penalizableDebts) : 0;
  const score = Math.max(0, Math.min(100, 100 - Math.floor(count * 1.5)));

  let grade: HealthGrade = "A";
  if (count > 80) grade = "F";
  else if (count > 50) grade = "D";
  else if (count > 30) grade = "C";
  else if (count > 10) grade = "B";

  return { score, grade };
}
