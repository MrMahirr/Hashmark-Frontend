# Frontend ↔ Backend API Bağlantı Planı

> **Proje:** Hashmark  
> **Tarih:** 2026-07-19  
> **Durum:** Planlama aşaması

---

## Mevcut Durum

### Backend API Endpoints (Spring Boot — port 8080, context-path YOK)

| Modül | Base Path | Method | Endpoint | Açıklama |
|-------|-----------|--------|----------|----------|
| Auth | `/auth` | GET | `/github` | GitHub OAuth URL döndür |
| Auth | `/auth` | GET | `/callback?code=xxx` | OAuth callback → JWT döndür |
| Auth | `/auth` | POST | `/refresh` | Access token yenile |
| Auth | `/auth` | POST | `/logout` | Çıkış yap |
| Repos | `/repos` | GET | `/` | Kullanıcının repolarını listele |
| Repos | `/repos` | POST | `/sync` | GitHub'dan repoları senkronize et |
| Repos | `/repos` | GET | `/{id}` | Tekil repo detayı |
| Repos | `/repos` | DELETE | `/{id}` | Repoyu sil |
| Scanner | `/scan` | POST | `/{repoId}` | Manuel tarama başlat |
| Scanner | `/scan` | GET | `/{repoId}/status` | Tarama durumunu sorgula |
| Debts | `/debts` | GET | `/?repoId=&label=&status=&page=&size=` | Borçları listele (filtreli/sayfalı) |
| Debts | `/debts` | GET | `/stats?repoId=` | Borç istatistikleri |
| Report | `/report` | GET | `/summary?repoId=` | Dashboard özet ve trend verisi |
| Report | `/report` | POST | `/send-test` | Test e-postası gönder |
| Settings | `/settings` | GET | `/` | Kullanıcı ayarlarını getir |
| Settings | `/settings` | PUT | `/` | Kullanıcı ayarlarını güncelle |

### Frontend Mevcut Altyapı

- ✅ axios instance (`shared/api/client.ts`)
- ✅ ApiMethod enum (`shared/api/methods.ts`)
- ✅ ApiEndpoint enum (`shared/api/endpoints.ts`)
- ✅ TanStack Query Provider (`app/providers.tsx`)
- ✅ Mock data dosyaları (dashboard, debts, repos, settings)
- ⚠️ Feature `api/` klasörleri boş
- ⚠️ Feature `hooks/` klasörleri boş
- ⚠️ Auth store boş
- ⚠️ `baseURL` → `/api` suffix'i var ama backend'de context-path yok

---

## Açık Sorular (Uygulamadan Önce Cevaplanması Gereken)

1. **baseURL düzeltmesi:** `http://localhost:8080/api` → `http://localhost:8080` olacak mı?
2. **Token Storage:** JWT token'lar `localStorage` mı, `httpOnly cookie` mi?
3. **Frontend type ↔ Backend DTO uyumsuzluğu:**
   - Frontend `Repo` → `id: string` / Backend `RepoDto` → `id: Long`
   - Frontend `Repo`'da `name`, `owner`, `language`, `debtCount` var — Backend'de yok
   - Seçenekler: (a) Frontend type'ları backend'e uyumla (b) Mapper yaz (c) Backend DTO genişlet
4. **Scanner modülü:** `features/repos/` altında mı, yoksa ayrı `features/scanner/` mı?
5. **Global error handling:** Toast/notification sistemi var mı? Hangi kütüphane?

---

# ADIM ADIM UYGULAMA PLANI

---

## ADIM 1 — `shared/api/client.ts` Güncelleme

**Dosya:** `src/shared/api/client.ts`  
**İşlem:** MODIFY

**Yapılacaklar:**
1. `baseURL`'den `/api` suffix'ini kaldır → `http://localhost:8080`
2. Request interceptor'ı aktif et (JWT token header'a ekleme)
3. Response interceptor'ı aktif et (401 → logout & redirect)

**Sonuç kodu:**
```ts
import axios from "axios";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080",
  timeout: 15_000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor — JWT token ekleme
apiClient.interceptors.request.use((config) => {
  // Auth store'dan token alınacak (Adım 5'te implement edilecek)
  const token = typeof window !== "undefined" 
    ? localStorage.getItem("accessToken") 
    : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor — 401 handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/auth/login";
      }
    }
    return Promise.reject(error);
  }
);
```

**Bağımlılık:** Yok (ilk adım)  
**Etkilenen dosyalar:** Tüm API çağrıları bu client'ı kullanıyor

---

## ADIM 2 — `shared/api/methods.ts` Güncelleme

**Dosya:** `src/shared/api/methods.ts`  
**İşlem:** MODIFY

**Yapılacaklar:**
- Backend controller base path'lerine uygun eksik modülleri ekle

**Sonuç kodu:**
```ts
export enum ApiMethod {
  AUTH = "/auth",
  REPOS = "/repos",
  DEBTS = "/debts",
  SCAN = "/scan",
  SETTINGS = "/settings",
  REPORT = "/report",
}
```

**Bağımlılık:** Yok  
**Etkilenen dosyalar:** Sonraki adımlardaki tüm API fonksiyonları

---

## ADIM 3 — `shared/api/endpoints.ts` Güncelleme

**Dosya:** `src/shared/api/endpoints.ts`  
**İşlem:** MODIFY

**Yapılacaklar:**
- Backend controller endpoint path'lerine uygun endpoint enum'ları ekle

**Sonuç kodu:**
```ts
export enum ApiEndpoint {
  // Auth
  GITHUB = "github",
  CALLBACK = "callback",
  REFRESH = "refresh",
  LOGOUT = "logout",
  // Repos
  SYNC = "sync",
  // Debts
  STATS = "stats",
  // Scanner
  STATUS = "status",
  // Report
  SUMMARY = "summary",
  SEND_TEST = "send-test",
}
```

**Bağımlılık:** Yok  
**Etkilenen dosyalar:** Sonraki adımlardaki tüm API fonksiyonları

---

## ADIM 4 — `shared/api/query-keys.ts` Oluşturma

**Dosya:** `src/shared/api/query-keys.ts`  
**İşlem:** NEW

**Yapılacaklar:**
- TanStack Query key factory pattern ile merkezi query key yönetimi

**Sonuç kodu:**
```ts
export const queryKeys = {
  repos: {
    all: ["repos"] as const,
    detail: (id: string) => ["repos", id] as const,
  },
  debts: {
    all: ["debts"] as const,
    filtered: (filters: Record<string, unknown>) => ["debts", filters] as const,
    stats: (repoId?: string) => ["debts", "stats", repoId] as const,
  },
  dashboard: {
    summary: (repoId?: string) => ["dashboard", "summary", repoId] as const,
  },
  scanner: {
    status: (repoId: string) => ["scanner", "status", repoId] as const,
  },
  settings: {
    current: ["settings"] as const,
  },
} as const;
```

**Bağımlılık:** Yok  
**Etkilenen dosyalar:** Tüm hook dosyaları bu key'leri kullanacak

---

## ADIM 5 — Auth Types Oluşturma

**Dosya:** `src/features/auth/api/auth.types.ts`  
**İşlem:** NEW

**Backend DTO karşılıkları:**
```ts
// ── Response Types ──

/** GET /auth/github → Map<String, String> */
export interface GitHubLoginUrlResponse {
  authUrl: string;
}

/** GET /auth/callback → LoginResponse */
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

/** POST /auth/refresh → Map<String, String> */
export interface RefreshResponse {
  accessToken: string;
}

// ── Request Types ──

/** POST /auth/refresh, POST /auth/logout → RefreshRequest */
export interface RefreshRequest {
  refreshToken: string;
}
```

**Bağımlılık:** Yok  
**Etkilenen dosyalar:** auth.api.ts, useAuth.ts, auth.store.ts

---

## ADIM 6 — Auth API Fonksiyonları Oluşturma

**Dosya:** `src/features/auth/api/auth.api.ts`  
**İşlem:** NEW

**Sonuç kodu:**
```ts
import { apiClient } from "@/shared/api/client";
import { ApiMethod } from "@/shared/api/methods";
import { ApiEndpoint } from "@/shared/api/endpoints";
import type {
  GitHubLoginUrlResponse,
  LoginResponse,
  RefreshRequest,
  RefreshResponse,
} from "./auth.types";

/** GitHub OAuth URL'ini döndürür */
export async function getGitHubLoginUrl(): Promise<GitHubLoginUrlResponse> {
  const response = await apiClient.get<GitHubLoginUrlResponse>(
    `${ApiMethod.AUTH}/${ApiEndpoint.GITHUB}`,
  );
  return response.data;
}

/** OAuth callback code ile JWT token alır */
export async function handleAuthCallback(
  code: string,
): Promise<LoginResponse> {
  const response = await apiClient.get<LoginResponse>(
    `${ApiMethod.AUTH}/${ApiEndpoint.CALLBACK}`,
    { params: { code } },
  );
  return response.data;
}

/** Refresh token ile yeni access token alır */
export async function refreshAccessToken(
  payload: RefreshRequest,
): Promise<RefreshResponse> {
  const response = await apiClient.post<RefreshResponse>(
    `${ApiMethod.AUTH}/${ApiEndpoint.REFRESH}`,
    payload,
  );
  return response.data;
}

/** Çıkış yapar */
export async function logout(
  payload: RefreshRequest,
): Promise<void> {
  await apiClient.post(
    `${ApiMethod.AUTH}/${ApiEndpoint.LOGOUT}`,
    payload,
  );
}
```

**Bağımlılık:** Adım 1, 2, 3, 5  
**Etkilenen dosyalar:** useAuth.ts, auth.store.ts

---

## ADIM 7 — Auth Store Oluşturma (Zustand)

**Dosya:** `src/features/auth/store/auth.store.ts`  
**İşlem:** NEW

**Sonuç kodu:**
```ts
import { create } from "zustand";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
}

interface AuthActions {
  setTokens: (accessToken: string, refreshToken: string) => void;
  clearTokens: () => void;
}

export const useAuthStore = create<AuthState & AuthActions>((set) => ({
  accessToken: typeof window !== "undefined" 
    ? localStorage.getItem("accessToken") 
    : null,
  refreshToken: typeof window !== "undefined" 
    ? localStorage.getItem("refreshToken") 
    : null,
  isAuthenticated: typeof window !== "undefined" 
    ? !!localStorage.getItem("accessToken") 
    : false,

  setTokens: (accessToken, refreshToken) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    set({ accessToken, refreshToken, isAuthenticated: true });
  },

  clearTokens: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    set({ accessToken: null, refreshToken: null, isAuthenticated: false });
  },
}));
```

**Bağımlılık:** Adım 5  
**Etkilenen dosyalar:** client.ts interceptor, useAuth.ts

---

## ADIM 8 — Auth Hook'ları Oluşturma

**Dosya:** `src/features/auth/hooks/useAuth.ts`  
**İşlem:** NEW

**Sonuç kodu:**
```ts
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  getGitHubLoginUrl,
  handleAuthCallback,
  logout,
} from "../api/auth.api";
import { useAuthStore } from "../store/auth.store";

/** GitHub login sayfasına yönlendirir */
export function useGitHubLogin() {
  return useMutation({
    mutationFn: getGitHubLoginUrl,
    onSuccess: (data) => {
      window.location.href = data.authUrl;
    },
  });
}

/** OAuth callback code'unu işler */
export function useAuthCallback() {
  const { setTokens } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: (code: string) => handleAuthCallback(code),
    onSuccess: (data) => {
      setTokens(data.accessToken, data.refreshToken);
      router.push("/dashboard");
    },
  });
}

/** Çıkış yapar */
export function useLogout() {
  const { refreshToken, clearTokens } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: () => logout({ refreshToken: refreshToken ?? "" }),
    onSuccess: () => {
      clearTokens();
      router.push("/auth/login");
    },
    onError: () => {
      // Hata olsa bile token'ları temizle
      clearTokens();
      router.push("/auth/login");
    },
  });
}
```

**Bağımlılık:** Adım 6, 7  
**Etkilenen dosyalar:** LoginForm.tsx, OAuthCallback.tsx

---

## ADIM 9 — Auth Component'larını Güncelleme

### 9a — LoginForm.tsx
**Dosya:** `src/features/auth/components/LoginForm.tsx`  
**İşlem:** MODIFY

**Değişiklik:**
- Button'a `onClick` handler ekle → `useGitHubLogin()` hook'unu çağır

```diff
+ import { useGitHubLogin } from "../hooks/useAuth";

  export function LoginForm() {
+   const { mutate: loginWithGitHub, isPending } = useGitHubLogin();
    
    return (
      ...
-       <button className="...">
+       <button 
+         className="..." 
+         onClick={() => loginWithGitHub()}
+         disabled={isPending}
+       >
          <GithubIcon />
-         GitHub ile Devam Et
+         {isPending ? "Yönlendiriliyor..." : "GitHub ile Devam Et"}
        </button>
      ...
    );
  }
```

### 9b — OAuthCallback.tsx
**Dosya:** `src/features/auth/components/OAuthCallback.tsx`  
**İşlem:** MODIFY

**Değişiklik:**
- Mock timeout → `useAuthCallback()` hook'u
- URL'den `code` parametresini al

```diff
+ import { useSearchParams } from "next/navigation";
+ import { useAuthCallback } from "../hooks/useAuth";

  export function OAuthCallback() {
-   const router = useRouter();
+   const searchParams = useSearchParams();
+   const { mutate: handleCallback, isError } = useAuthCallback();

    useEffect(() => {
-     const timer = setTimeout(() => {
-       router.push("/dashboard");
-     }, 2000);
-     return () => clearTimeout(timer);
-   }, [router]);
+     const code = searchParams.get("code");
+     if (code) {
+       handleCallback(code);
+     }
+   }, [searchParams, handleCallback]);
```

**Bağımlılık:** Adım 8  
**Etkilenen dosyalar:** Sadece bu dosyalar

---

## ADIM 10 — Repos Types Oluşturma

**Dosya:** `src/features/repos/api/repos.types.ts`  
**İşlem:** NEW

**Backend `RepoDto` karşılığı:**
```ts
/** Backend RepoDto → GET /repos, GET /repos/{id} */
export interface RepoResponse {
  id: number;
  userId: number;
  githubRepoId: string;
  fullName: string;
  isPrivate: boolean;
  lastScannedAt: string | null;
  createdAt: string;
}
```

**Bağımlılık:** Yok  
**Etkilenen dosyalar:** repos.api.ts, useRepos.ts

---

## ADIM 11 — Repos API Fonksiyonları Oluşturma

**Dosya:** `src/features/repos/api/repos.api.ts`  
**İşlem:** NEW

**Sonuç kodu:**
```ts
import { apiClient } from "@/shared/api/client";
import { ApiMethod } from "@/shared/api/methods";
import { ApiEndpoint } from "@/shared/api/endpoints";
import type { RepoResponse } from "./repos.types";

/** Kullanıcının repolarını listeler */
export async function getRepos(): Promise<RepoResponse[]> {
  const response = await apiClient.get<RepoResponse[]>(
    ApiMethod.REPOS,
  );
  return response.data;
}

/** Tekil repo detayını getirir */
export async function getRepo(
  repoId: string,
): Promise<RepoResponse> {
  const response = await apiClient.get<RepoResponse>(
    `${ApiMethod.REPOS}/${repoId}`,
  );
  return response.data;
}

/** GitHub'dan repoları senkronize eder */
export async function syncRepos(): Promise<void> {
  await apiClient.post(
    `${ApiMethod.REPOS}/${ApiEndpoint.SYNC}`,
  );
}

/** Repoyu siler */
export async function deleteRepo(
  repoId: string,
): Promise<void> {
  await apiClient.delete(
    `${ApiMethod.REPOS}/${repoId}`,
  );
}
```

**Bağımlılık:** Adım 1, 2, 3, 10  
**Etkilenen dosyalar:** useRepos.ts

---

## ADIM 12 — Repos Hook'ları Oluşturma

**Dosya:** `src/features/repos/hooks/useRepos.ts`  
**İşlem:** NEW

**Sonuç kodu:**
```ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/api/query-keys";
import { getRepos, getRepo, syncRepos, deleteRepo } from "../api/repos.api";

/** Tüm repoları listeler */
export function useRepos() {
  return useQuery({
    queryKey: queryKeys.repos.all,
    queryFn: getRepos,
  });
}

/** Tekil repo detayı */
export function useRepo(repoId: string) {
  return useQuery({
    queryKey: queryKeys.repos.detail(repoId),
    queryFn: () => getRepo(repoId),
    enabled: !!repoId,
  });
}

/** GitHub'dan repo senkronizasyonu */
export function useSyncRepos() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: syncRepos,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.repos.all });
    },
  });
}

/** Repo silme */
export function useDeleteRepo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (repoId: string) => deleteRepo(repoId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.repos.all });
    },
  });
}
```

**Bağımlılık:** Adım 4, 11  
**Etkilenen dosyalar:** RepoCard.tsx, RepoList.tsx, repo sayfa component'ları

---

## ADIM 13 — Scanner Types Oluşturma

**Dosya:** `src/features/repos/api/scanner.types.ts`  
**İşlem:** NEW

**Backend DTO karşılıkları:**
```ts
/** POST /scan/{repoId} → ScanStartResponse */
export interface ScanStartResponse {
  repoId: number;
  jobId: number;
  status: string;
}

/** GET /scan/{repoId}/status → ScanJob */
export interface ScanStatusResponse {
  id: number;
  repoId: number;
  status: string;
  startedAt: string;
  finishedAt: string | null;
  debtFound: number | null;
  createdAt: string;
}
```

**Bağımlılık:** Yok  
**Etkilenen dosyalar:** scanner.api.ts, useScanner.ts

---

## ADIM 14 — Scanner API Fonksiyonları Oluşturma

**Dosya:** `src/features/repos/api/scanner.api.ts`  
**İşlem:** NEW

**Sonuç kodu:**
```ts
import { apiClient } from "@/shared/api/client";
import { ApiMethod } from "@/shared/api/methods";
import { ApiEndpoint } from "@/shared/api/endpoints";
import type { ScanStartResponse, ScanStatusResponse } from "./scanner.types";

/** Manuel tarama başlatır */
export async function startScan(
  repoId: string,
): Promise<ScanStartResponse> {
  const response = await apiClient.post<ScanStartResponse>(
    `${ApiMethod.SCAN}/${repoId}`,
  );
  return response.data;
}

/** Tarama durumunu sorgular */
export async function getScanStatus(
  repoId: string,
): Promise<ScanStatusResponse> {
  const response = await apiClient.get<ScanStatusResponse>(
    `${ApiMethod.SCAN}/${repoId}/${ApiEndpoint.STATUS}`,
  );
  return response.data;
}
```

**Bağımlılık:** Adım 1, 2, 3, 13  
**Etkilenen dosyalar:** useScanner.ts

---

## ADIM 15 — Scanner Hook'ları Oluşturma

**Dosya:** `src/features/repos/hooks/useScanner.ts`  
**İşlem:** NEW

**Sonuç kodu:**
```ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/api/query-keys";
import { startScan, getScanStatus } from "../api/scanner.api";

/** Manuel tarama başlatma */
export function useStartScan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (repoId: string) => startScan(repoId),
    onSuccess: (_data, repoId) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.scanner.status(repoId),
      });
    },
  });
}

/** Tarama durumu polling */
export function useScanStatus(repoId: string, enabled = false) {
  return useQuery({
    queryKey: queryKeys.scanner.status(repoId),
    queryFn: () => getScanStatus(repoId),
    enabled: !!repoId && enabled,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      // Tarama devam ediyorsa 3 saniyede bir kontrol et
      if (status === "RUNNING" || status === "PENDING") {
        return 3000;
      }
      return false;
    },
  });
}
```

**Bağımlılık:** Adım 4, 14  
**Etkilenen dosyalar:** ScanProgress.tsx, repo detay component'ları

---

## ADIM 16 — Debts Types Oluşturma

**Dosya:** `src/features/debts/api/debts.types.ts`  
**İşlem:** NEW

**Backend DTO karşılıkları:**
```ts
// ── Request Types ──

export interface DebtFilterParams {
  repoId?: number;
  label?: string;
  status?: string;
  page?: number;
  size?: number;
}

// ── Response Types ──

/** Backend DebtDto karşılığı */
export interface DebtResponse {
  id: number;
  repoId: number;
  repoFullName: string;
  filePath: string;
  lineNo: number;
  label: string;
  content: string;
  detectedAt: string;
  resolvedAt: string | null;
}

/** Backend PageResponse<T> karşılığı */
export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

/** Backend DebtStatsDto karşılığı */
export interface DebtStatsResponse {
  total: number;
  addedThisWeek: number;
  resolvedThisWeek: number;
}
```

**Bağımlılık:** Yok  
**Etkilenen dosyalar:** debts.api.ts, useDebts.ts

---

## ADIM 17 — Debts API Fonksiyonları Oluşturma

**Dosya:** `src/features/debts/api/debts.api.ts`  
**İşlem:** NEW

**Sonuç kodu:**
```ts
import { apiClient } from "@/shared/api/client";
import { ApiMethod } from "@/shared/api/methods";
import { ApiEndpoint } from "@/shared/api/endpoints";
import type {
  DebtFilterParams,
  DebtResponse,
  DebtStatsResponse,
  PageResponse,
} from "./debts.types";

/** Borçları filtreli ve sayfalı listeler */
export async function getDebts(
  filters: DebtFilterParams,
): Promise<PageResponse<DebtResponse>> {
  const response = await apiClient.get<PageResponse<DebtResponse>>(
    ApiMethod.DEBTS,
    { params: filters },
  );
  return response.data;
}

/** Borç istatistiklerini getirir */
export async function getDebtStats(
  repoId?: string,
): Promise<DebtStatsResponse> {
  const response = await apiClient.get<DebtStatsResponse>(
    `${ApiMethod.DEBTS}/${ApiEndpoint.STATS}`,
    { params: repoId ? { repoId } : undefined },
  );
  return response.data;
}
```

**Bağımlılık:** Adım 1, 2, 3, 16  
**Etkilenen dosyalar:** useDebts.ts

---

## ADIM 18 — Debts Hook'ları Oluşturma

**Dosya:** `src/features/debts/hooks/useDebts.ts`  
**İşlem:** NEW

**Sonuç kodu:**
```ts
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { queryKeys } from "@/shared/api/query-keys";
import { getDebts, getDebtStats } from "../api/debts.api";
import type { DebtFilterParams } from "../api/debts.types";

/** Borçları filtreli ve sayfalı listeler */
export function useDebts(filters: DebtFilterParams) {
  return useQuery({
    queryKey: queryKeys.debts.filtered(filters),
    queryFn: () => getDebts(filters),
    placeholderData: keepPreviousData, // Sayfa geçişlerinde loading yok
  });
}

/** Borç istatistikleri */
export function useDebtStats(repoId?: string) {
  return useQuery({
    queryKey: queryKeys.debts.stats(repoId),
    queryFn: () => getDebtStats(repoId),
  });
}
```

**Bağımlılık:** Adım 4, 17  
**Etkilenen dosyalar:** DebtTable.tsx, DebtFilters.tsx, debts sayfa component'ları

---

## ADIM 19 — Report (Dashboard) Types Oluşturma

**Dosya:** `src/features/dashboard/api/report.types.ts`  
**İşlem:** NEW

**Backend DTO karşılıkları:**
```ts
/** Backend TrendDataPoint karşılığı */
export interface TrendDataPointResponse {
  weekStart: string;
  totalDebts: number;
  newDebts: number;
  resolvedDebts: number;
}

/** Backend LabelStats karşılığı */
export interface LabelStatsResponse {
  todoCount: number;
  fixmeCount: number;
  hackCount: number;
  xxxCount: number;
}

/** Backend ModuleDebtInfo karşılığı */
export interface ModuleDebtInfoResponse {
  modulePath: string;
  debtCount: number;
}

/** Backend SummaryResponse karşılığı — GET /report/summary */
export interface SummaryResponse {
  trendData: TrendDataPointResponse[];
  labelStats: LabelStatsResponse;
  topModules: ModuleDebtInfoResponse[];
}
```

**Bağımlılık:** Yok  
**Etkilenen dosyalar:** report.api.ts, useDashboard.ts

---

## ADIM 20 — Report API Fonksiyonları Oluşturma

**Dosya:** `src/features/dashboard/api/report.api.ts`  
**İşlem:** NEW

**Sonuç kodu:**
```ts
import { apiClient } from "@/shared/api/client";
import { ApiMethod } from "@/shared/api/methods";
import { ApiEndpoint } from "@/shared/api/endpoints";
import type { SummaryResponse } from "./report.types";

/** Dashboard özet ve trend verisini getirir */
export async function getSummary(
  repoId?: string,
): Promise<SummaryResponse> {
  const response = await apiClient.get<SummaryResponse>(
    `${ApiMethod.REPORT}/${ApiEndpoint.SUMMARY}`,
    { params: repoId ? { repoId } : undefined },
  );
  return response.data;
}

/** Test e-postası gönderir */
export async function sendTestEmail(): Promise<void> {
  await apiClient.post(
    `${ApiMethod.REPORT}/${ApiEndpoint.SEND_TEST}`,
  );
}
```

**Bağımlılık:** Adım 1, 2, 3, 19  
**Etkilenen dosyalar:** useDashboard.ts

---

## ADIM 21 — Dashboard Hook'ları Oluşturma

**Dosya:** `src/features/dashboard/hooks/useDashboard.ts`  
**İşlem:** NEW

**Sonuç kodu:**
```ts
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryKeys } from "@/shared/api/query-keys";
import { getSummary, sendTestEmail } from "../api/report.api";

/** Dashboard özet verisi */
export function useSummary(repoId?: string) {
  return useQuery({
    queryKey: queryKeys.dashboard.summary(repoId),
    queryFn: () => getSummary(repoId),
  });
}

/** Test e-postası gönderme */
export function useSendTestEmail() {
  return useMutation({
    mutationFn: sendTestEmail,
  });
}
```

**Bağımlılık:** Adım 4, 20  
**Etkilenen dosyalar:** StatCard.tsx, TrendChart.tsx, dashboard sayfa component'ları

---

## ADIM 22 — Settings Types Oluşturma

**Dosya:** `src/features/settings/api/settings.types.ts`  
**İşlem:** NEW

**Backend DTO karşılıkları:**
```ts
/** Backend UserSettingsDto karşılığı — GET /settings, PUT /settings */
export interface UserSettingsResponse {
  emailNotify: boolean;
  notifyDay: string;
}

/** PUT /settings request body */
export interface UpdateSettingsPayload {
  emailNotify: boolean;
  notifyDay: string;
}
```

**Bağımlılık:** Yok  
**Etkilenen dosyalar:** settings.api.ts, useSettings.ts

---

## ADIM 23 — Settings API Fonksiyonları Oluşturma

**Dosya:** `src/features/settings/api/settings.api.ts`  
**İşlem:** NEW

**Sonuç kodu:**
```ts
import { apiClient } from "@/shared/api/client";
import { ApiMethod } from "@/shared/api/methods";
import type {
  UserSettingsResponse,
  UpdateSettingsPayload,
} from "./settings.types";

/** Kullanıcı ayarlarını getirir */
export async function getSettings(): Promise<UserSettingsResponse> {
  const response = await apiClient.get<UserSettingsResponse>(
    ApiMethod.SETTINGS,
  );
  return response.data;
}

/** Kullanıcı ayarlarını günceller */
export async function updateSettings(
  payload: UpdateSettingsPayload,
): Promise<UserSettingsResponse> {
  const response = await apiClient.put<UserSettingsResponse>(
    ApiMethod.SETTINGS,
    payload,
  );
  return response.data;
}
```

**Bağımlılık:** Adım 1, 2, 22  
**Etkilenen dosyalar:** useSettings.ts

---

## ADIM 24 — Settings Hook'ları Oluşturma

**Dosya:** `src/features/settings/hooks/useSettings.ts`  
**İşlem:** NEW

**Sonuç kodu:**
```ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/api/query-keys";
import { getSettings, updateSettings } from "../api/settings.api";
import type { UpdateSettingsPayload } from "../api/settings.types";

/** Mevcut kullanıcı ayarları */
export function useSettings() {
  return useQuery({
    queryKey: queryKeys.settings.current,
    queryFn: getSettings,
  });
}

/** Ayarları güncelleme */
export function useUpdateSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateSettingsPayload) => updateSettings(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.settings.current });
    },
  });
}
```

**Bağımlılık:** Adım 4, 23  
**Etkilenen dosyalar:** Settings sayfa component'ları

---

## ADIM 25 — client.ts Interceptor'ı Auth Store ile Entegre Et

**Dosya:** `src/shared/api/client.ts`  
**İşlem:** MODIFY (Adım 1'e ek)

**Değişiklik:**
- `localStorage` yerine `useAuthStore` kullan (interceptor'da Zustand store'u doğrudan kullanılabilir):

```ts
import { useAuthStore } from "@/features/auth/store/auth.store";

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().clearTokens();
      if (typeof window !== "undefined") {
        window.location.href = "/auth/login";
      }
    }
    return Promise.reject(error);
  }
);
```

**Bağımlılık:** Adım 7  
**Etkilenen dosyalar:** Tüm authenticated API çağrıları

---

## Özet — Oluşturulacak/Güncellenecek Dosyalar

| # | Dosya | İşlem | Modül |
|---|-------|-------|-------|
| 1 | `src/shared/api/client.ts` | MODIFY | Shared |
| 2 | `src/shared/api/methods.ts` | MODIFY | Shared |
| 3 | `src/shared/api/endpoints.ts` | MODIFY | Shared |
| 4 | `src/shared/api/query-keys.ts` | NEW | Shared |
| 5 | `src/features/auth/api/auth.types.ts` | NEW | Auth |
| 6 | `src/features/auth/api/auth.api.ts` | NEW | Auth |
| 7 | `src/features/auth/store/auth.store.ts` | NEW | Auth |
| 8 | `src/features/auth/hooks/useAuth.ts` | NEW | Auth |
| 9a | `src/features/auth/components/LoginForm.tsx` | MODIFY | Auth |
| 9b | `src/features/auth/components/OAuthCallback.tsx` | MODIFY | Auth |
| 10 | `src/features/repos/api/repos.types.ts` | NEW | Repos |
| 11 | `src/features/repos/api/repos.api.ts` | NEW | Repos |
| 12 | `src/features/repos/hooks/useRepos.ts` | NEW | Repos |
| 13 | `src/features/repos/api/scanner.types.ts` | NEW | Scanner |
| 14 | `src/features/repos/api/scanner.api.ts` | NEW | Scanner |
| 15 | `src/features/repos/hooks/useScanner.ts` | NEW | Scanner |
| 16 | `src/features/debts/api/debts.types.ts` | NEW | Debts |
| 17 | `src/features/debts/api/debts.api.ts` | NEW | Debts |
| 18 | `src/features/debts/hooks/useDebts.ts` | NEW | Debts |
| 19 | `src/features/dashboard/api/report.types.ts` | NEW | Dashboard |
| 20 | `src/features/dashboard/api/report.api.ts` | NEW | Dashboard |
| 21 | `src/features/dashboard/hooks/useDashboard.ts` | NEW | Dashboard |
| 22 | `src/features/settings/api/settings.types.ts` | NEW | Settings |
| 23 | `src/features/settings/api/settings.api.ts` | NEW | Settings |
| 24 | `src/features/settings/hooks/useSettings.ts` | NEW | Settings |
| 25 | `src/shared/api/client.ts` | MODIFY | Shared (final) |

**Toplam:** 4 dosya güncelleme + 17 yeni dosya = **21 dosya işlemi**
