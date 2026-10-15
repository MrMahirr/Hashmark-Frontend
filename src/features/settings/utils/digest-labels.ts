import { DebtType } from "@/shared/types/debt.types";

export const ALL_DIGEST_LABELS: readonly string[] = Object.values(DebtType);

/** Sunucu "boş = hepsi" der; arayüzde her etiket açıkça seçili gösterilir. */
export function labelsFromServer(labels: readonly string[] | undefined): Set<string> {
  return new Set(labels && labels.length > 0 ? labels : ALL_DIGEST_LABELS);
}

/** Hepsi seçiliyse sunucuya boş dizi (= tüm etiketler) gönderilir. */
export function labelsToServer(selected: ReadonlySet<string>): string[] {
  return selected.size === ALL_DIGEST_LABELS.length ? [] : ALL_DIGEST_LABELS.filter((l) => selected.has(l));
}

const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/;

/** Boş geçerlidir (GitHub e-postası kullanılır). */
export function isValidDigestEmail(value: string): boolean {
  const trimmed = value.trim();
  return trimmed === "" || (trimmed.length <= 255 && EMAIL_PATTERN.test(trimmed));
}
