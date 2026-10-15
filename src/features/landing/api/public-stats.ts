/** GET /public/stats — kimlik doğrulaması gerektirmeyen toplam sayaçlar. */
export interface PublicStats {
  trackedMarkers: number;
  repositories: number;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

/**
 * Sunucu tarafında sayaçları çeker (5 dk önbellek). Başarısız olursa `null` döner;
 * çağıran örnek veriye düşer (landing hiçbir zaman API'ye bağımlı olarak kırılmaz).
 */
export async function fetchPublicStats(signal?: AbortSignal): Promise<PublicStats | null> {
  try {
    const response = await fetch(`${API_BASE}/public/stats`, {
      next: { revalidate: 300 },
      signal: signal ?? AbortSignal.timeout(2500),
    });
    if (!response.ok) return null;
    const data = (await response.json()) as Partial<PublicStats>;
    if (typeof data.trackedMarkers !== "number" || typeof data.repositories !== "number") return null;
    return { trackedMarkers: data.trackedMarkers, repositories: data.repositories };
  } catch {
    return null;
  }
}
