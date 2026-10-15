/** Koşullu sınıf birleştirici: yanlış/boş değerleri atar. */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/** Tüm etkileşimli ilkellerin ortak odak halkası (3 px `--acc`, 2 px offset). */
export const FOCUS_RING =
  "focus-visible:outline-[3px] focus-visible:outline-solid focus-visible:outline-hm-acc focus-visible:outline-offset-2";
