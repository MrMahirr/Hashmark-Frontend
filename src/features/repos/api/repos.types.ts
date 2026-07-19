/**
 * Interface Segregation Principle (ISP) & Single Responsibility Principle (SRP):
 * Yalnızca "Repos" modülüne ait API Request ve Response modelleri bu dosyada tutulur.
 * Backend'den gelen DTO (Data Transfer Object) nesneleri birebir bu şekilde temsil edilir.
 */

// ── Response Types ──

/** 
 * GET /repos
 * GET /repos/{id}
 * Backend DTO karşılığı: dev.hashmark.repo.dto.RepoDto
 */
export interface RepoResponse {
  id: number;
  userId: number;
  githubRepoId: string;
  fullName: string;
  isPrivate: boolean;
  lastScannedAt: string | null;
  createdAt: string;
}

// ── Request Types ──
// Şu an için Repos modülünde (sync ve delete gibi) özel bir JSON request body'si bulunmamaktadır.
// Eğer ileride POST/PUT endpointleri eklenirse request modelleri buraya dahil edilmelidir (OCP).
