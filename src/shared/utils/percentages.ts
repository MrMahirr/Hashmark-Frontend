/**
 * Sayıları toplamı tam 100 olacak şekilde yüzdelere dağıtır (en büyük kalan yöntemi).
 * `Math.round` ile hesaplanan yüzdelerin toplamı 99 veya 101 çıkabilir; bu fonksiyon çıkmaz.
 *
 * @returns girdiyle aynı uzunlukta tam sayı dizisi; toplam sıfırsa hepsi 0.
 */
export function distributePercentages(counts: number[]): number[] {
  const safe = counts.map((c) => (Number.isFinite(c) && c > 0 ? c : 0));
  const total = safe.reduce((sum, c) => sum + c, 0);
  if (total === 0) {
    return safe.map(() => 0);
  }

  const raw = safe.map((c) => (c / total) * 100);
  const floors = raw.map((value) => Math.floor(value));
  let remainder = 100 - floors.reduce((sum, value) => sum + value, 0);

  // Kesirli kısmı en büyük olanlara birer puan ver (eşitlikte önce gelen)
  const order = raw
    .map((value, index) => ({ index, fraction: value - Math.floor(value) }))
    .sort((a, b) => b.fraction - a.fraction || a.index - b.index);

  for (const { index } of order) {
    if (remainder <= 0) break;
    floors[index] += 1;
    remainder -= 1;
  }
  return floors;
}
