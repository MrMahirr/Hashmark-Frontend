/**
 * Interface Segregation Principle (ISP) & Single Responsibility Principle (SRP):
 * Sadece "Auth" modülüne ait request ve response modelleri bu dosyada tutulur.
 * Diğer modüller bu tiplerden etkilenmez, böylece backend DTO'ları (Data Transfer Objects) ile 
 * frontend type'ları arasında yalıtılmış ve tutarlı bir yapı sağlanır.
 */

// ── Response Types ──

/** 
 * GET /auth/github
 * Backend DTO karşılığı: Map<String, String> (authUrl içerir)
 */
export interface GitHubLoginUrlResponse {
  authUrl: string;
}

/** 
 * GET /auth/callback
 * Backend DTO karşılığı: dev.hashmark.auth.dto.LoginResponse
 */
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

/** 
 * POST /auth/refresh
 * Backend DTO karşılığı: Map<String, String> (accessToken içerir)
 */
export interface RefreshResponse {
  accessToken: string;
}

// ── Request Types ──

/** 
 * POST /auth/refresh
 * POST /auth/logout
 * Backend DTO karşılığı: dev.hashmark.auth.dto.RefreshRequest
 */
export interface RefreshRequest {
  refreshToken: string;
}
