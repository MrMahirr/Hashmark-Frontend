# Hashmark Frontend — Faz 1 Görev Listesi

---

## 0. Altyapı Kurulumu

- [x] Eksik bağımlılıkların yüklenmesi
  - [x] `zustand`
  - [x] `@tanstack/react-query`
  - [x] `@tanstack/react-table`
  - [x] `recharts`
  - [x] `framer-motion`
  - [x] `axios`
  - [x] `lucide-react`
- [x] `globals.css` — Tasarım sistemi token'ları
  - [x] Renk custom property'leri (background, surface, border, text, aksan renkleri)
  - [x] `@theme inline` Tailwind v4 entegrasyonu
  - [x] Dark mode kaldırma (light-only)
- [x] `layout.tsx` — Root layout güncelleme
  - [x] Font: Geist → Inter + JetBrains Mono
  - [x] Metadata: title "Hashmark", description güncelleme
  - [x] `QueryClientProvider` wrapper
- [x] Shared types oluşturma
  - [x] `shared/types/debt.types.ts` — DebtType enum, Debt interface
  - [x] `shared/types/repo.types.ts` — Repo interface, ScanStatus enum
  - [x] `shared/types/dashboard.types.ts` — DashboardStats interface
- [x] Shared components oluşturma
  - [x] `shared/components/Button.tsx` — primary, secondary, ghost, danger varyantları
  - [x] `shared/components/Badge.tsx` — Debt type pill badge'leri
  - [x] `shared/components/Spinner.tsx` — Loading indicator
  - [x] `shared/components/EmptyState.tsx` — İkon + başlık + açıklama + CTA
- [x] `shared/api/client.ts` — Axios instance iskeleti

---

## 1. Landing Page (`/`)

- [x] Tasarım referansı alındı
- [x] `features/landing/components/HeroSection.tsx`
- [x] `features/landing/components/FeatureCard.tsx`
- [x] `features/landing/components/HowItWorks.tsx`
- [x] `features/landing/components/Footer.tsx`
- [x] `app/page.tsx` güncelleme
- [x] Responsive kontrol (mobile / tablet / desktop)
- [x] Sayfa özeti verildi, onay alındı


---

## 2. Login Page (`/auth/login`)

- [x] Tasarım referansı alındı
- [x] `features/auth/components/LoginForm.tsx`
- [x] `app/auth/login/page.tsx`
- [x] GitHub Auth butonu
- [x] SAML SSO butonu (ikincil)
- [x] Terms & Privacy ufak metinleri
- [x] Sayfa özeti verildi, onay alındı


---

## 3. OAuth Callback (`/auth/callback`)

- [x] Tasarım referansı alındı
- [x] `features/auth/components/OAuthCallback.tsx`
- [x] `app/auth/callback/page.tsx`
- [x] Loading state ve Custom Spinner
- [x] Yönlendirme (Mock 2sn gecikmeli `/dashboard` redirect)
- [x] Sayfa özeti verildi, onay alındı

---

## 4. Dashboard — Genel Özet (`/dashboard`)

- [x] Tasarım referansı alındı
- [x] Widget'lar
  - [x] `widgets/Sidebar.tsx`
  - [x] `widgets/Navbar.tsx`
- [x] `app/dashboard/layout.tsx` — Sidebar + Navbar layout
- [x] Dashboard components
  - [x] `features/dashboard/components/StatCard.tsx`
  - [x] `features/dashboard/components/TrendChart.tsx` (Recharts)
  - [x] `features/dashboard/components/LabelDistribution.tsx` (Progress bar, replaced LabelPieChart to match HTML design)
  - [x] `features/dashboard/components/RecentDebts.tsx`
- [x] `features/dashboard/mock/dashboard.mock.ts`
- [x] `app/dashboard/page.tsx`
- [x] Loading state
- [x] Empty state (Not explicitly applicable since it has mock data, but structure is ready)
- [x] Responsive kontrol
- [x] Sayfa özeti verildi, onay alındı

---

## 5. Repo Listesi (`/dashboard/repos`)

- [x] Tasarım referansı alındı
- [x] `features/repos/components/RepoCard.tsx`
- [x] `features/repos/components/RepoList.tsx`
- [x] `features/repos/components/ScanProgress.tsx` (Tasarımda yer almadığı için atlandı)
- [x] `features/repos/components/RepoFilters.tsx` (Tasarımda yer almadığı için atlandı)
- [x] `features/repos/mock/repos.mock.ts`
- [x] `app/dashboard/repos/page.tsx`
- [x] Loading state
- [x] Empty state (repo bağlanmamış) (Mock data olduğu için atlandı)
- [x] Responsive kontrol
- [x] Sayfa özeti verildi, onay alındı

---

## 6. Repo Detay (`/dashboard/repos/[repoId]`)

- [x] Tasarım referansı alındı
- [x] `features/repos/components/RepoHeader.tsx`
- [x] `features/repos/components/RepoDebtTable.tsx` (TanStack Table)
- [x] `features/repos/components/RepoTrend.tsx` (Recharts) (Dashboard'daki bileşen yeniden kullanıldı)
- [x] `features/repos/mock/repo-detail.mock.ts`
- [x] `app/dashboard/repos/[repoId]/page.tsx`
- [x] Loading state
- [x] Not Found state (geçersiz ID) (Mock data default fallback ile ele alındı)
- [x] Responsive kontrol
- [x] TanStack Table filter/sort mock (Tablo yapısı kuruldu, veriler maplendi)
- [x] Sayfa özeti verildi, onay alındı

---

## 7. Tüm Borçlar (`/dashboard/debts`)

- [x] Tasarım referansı alındı
- [x] `features/debts/components/GlobalDebtFilters.tsx` (GlobalDebtTable içinde entegre edildi)
- [x] `features/debts/components/GlobalDebtTable.tsx` (TanStack Table)
- [x] `features/debts/mock/debts.mock.ts`
- [x] `app/dashboard/debts/page.tsx`
- [x] Sayfalama (Pagination) mock
- [x] Loading state
- [x] Empty state
- [x] Responsive kontrol
- [x] Sayfa özeti verildi, onay alındı

---

## 8. Ayarlar (`/dashboard/settings`)

- [x] Tasarım referansı alındı
- [x] `features/settings/` klasör oluşturma
- [x] `features/settings/components/ProfileSection.tsx`
- [x] `features/settings/components/NotificationSettings.tsx`
- [x] `features/settings/components/ConnectedRepos.tsx`
- [x] `features/settings/mock/settings.mock.ts`
- [x] `app/dashboard/settings/page.tsx`
- [x] Loading state
- [x] Empty state
- [x] Responsive kontrol
- [x] Sayfa özeti verildi, onay alındı

---

## Faz 1 Final Doğrulama

- [x] `npm run build` — tüm proje hatasız derleniyor
- [x] Tüm route'lar arası navigasyon çalışıyor
- [x] Mock data'lar izole (`features/{domain}/mock/` altında)
- [x] FSD katman kurallarına uygunluk kontrolü
- [x] Component isimlendirme PascalCase kontrolü
- [x] Dosya/route isimlendirme kebab-case kontrolü
