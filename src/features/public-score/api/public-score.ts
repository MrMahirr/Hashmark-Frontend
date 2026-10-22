/**
 * GET /public/score/{token} — sahibin açtığı herkese açık "debt score" sayfasının verisi.
 * Backend karşılığı: dev.hashmark.badge.PublicScore (borç içeriği, dosya, yazar, sır, maliyet içermez).
 */
export interface PublicScore {
  repoName: string;
  privateRepo: boolean;
  lastScannedAt: string | null;
  /** Taranmamışsa null */
  grade: "A" | "B" | "C" | "D" | "F" | null;
  score: number;
  openDebts: number;
  staleCount: number;
  rotScore: number;
  averageAgeDays: number;
  /** Borç etiketi → açık sayı */
  labels: Record<string, number>;
  ageBuckets: Array<{ key: string; minDays: number; maxDays: number | null; count: number }>;
  trend: Array<{ weekStart: string; total: number }>;
}

export type PublicScoreResult =
  | { status: "ok"; data: PublicScore }
  | { status: "not-found" }
  | { status: "error" };

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";
/** Sunucudaki `BadgeService.TOKEN` ile aynı: 32 bayt base64url. */
const TOKEN = /^[A-Za-z0-9_-]{43}$/;

/**
 * Sunucu tarafında çeker (5 dk önbellek, sunucu da 5 dk önbellek başlığı verir). Biçimi bozuk anahtar API'ye
 * gitmeden "bulunamadı" sayılır; ağ hatası "error" olur (sayfa kırılmaz).
 */
export async function fetchPublicScore(token: string, signal?: AbortSignal): Promise<PublicScoreResult> {
  if (!TOKEN.test(token)) return { status: "not-found" };
  try {
    const response = await fetch(`${API_BASE}/public/score/${token}`, {
      next: { revalidate: 300 },
      signal: signal ?? AbortSignal.timeout(3000),
    });
    if (response.status === 404) return { status: "not-found" };
    if (!response.ok) return { status: "error" };
    const data = (await response.json()) as PublicScore;
    if (typeof data?.repoName !== "string" || typeof data.openDebts !== "number") return { status: "error" };
    return { status: "ok", data };
  } catch {
    return { status: "error" };
  }
}
