/**
 * React Query zamanlama ayarlarının tek kaynağı.
 * Değerler `NEXT_PUBLIC_QUERY_STALE_MS` ve `NEXT_PUBLIC_QUERY_GC_MS` ile
 * (milisaniye) derleme zamanında değiştirilebilir; geçersiz değerlerde varsayılan kullanılır.
 */

function readMillis(raw: string | undefined, fallback: number): number {
  if (!raw) return fallback;
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
}

const ONE_MINUTE = 60 * 1000;

export const queryConfig = {
  /** Verinin "taze" sayıldığı süre (tüm sorgular için varsayılan). */
  staleTime: readMillis(process.env.NEXT_PUBLIC_QUERY_STALE_MS, ONE_MINUTE),
  /** Kullanılmayan sorgunun bellekte tutulduğu süre. */
  gcTime: readMillis(process.env.NEXT_PUBLIC_QUERY_GC_MS, 5 * ONE_MINUTE),
  /** Rapor özeti ağır bir sorgu olduğu için daha uzun taze kalır. */
  reportStaleTime: Math.max(
    readMillis(process.env.NEXT_PUBLIC_QUERY_STALE_MS, ONE_MINUTE),
    5 * ONE_MINUTE
  ),
} as const;
