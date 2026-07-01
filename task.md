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

- [ ] Tasarım referansı alındı
- [ ] Widget'lar
  - [ ] `widgets/Sidebar.tsx`
  - [ ] `widgets/Navbar.tsx`
- [ ] `app/dashboard/layout.tsx` — Sidebar + Navbar layout
- [ ] Dashboard components
  - [ ] `features/dashboard/components/StatCard.tsx`
  - [ ] `features/dashboard/components/TrendChart.tsx` (Recharts)
  - [ ] `features/dashboard/components/LabelPieChart.tsx` (Recharts)
  - [ ] `features/dashboard/components/ModuleBarChart.tsx` (Recharts)
  - [ ] `features/dashboard/components/RecentDebts.tsx`
- [ ] `features/dashboard/mock/dashboard.mock.ts`
- [ ] `app/dashboard/page.tsx`
- [ ] Loading state
- [ ] Empty state
- [ ] Responsive kontrol
- [ ] Sayfa özeti verildi, onay alındı

---

## 5. Repo Listesi (`/dashboard/repos`)

- [ ] Tasarım referansı alındı
- [ ] `features/repos/components/RepoCard.tsx`
- [ ] `features/repos/components/RepoList.tsx`
- [ ] `features/repos/components/ScanProgress.tsx`
- [ ] `features/repos/components/RepoFilters.tsx`
- [ ] `features/repos/mock/repos.mock.ts`
- [ ] `app/dashboard/repos/page.tsx`
- [ ] Loading state
- [ ] Empty state (repo bağlanmamış)
- [ ] Responsive kontrol
- [ ] Sayfa özeti verildi, onay alındı

---

## 6. Repo Detay (`/dashboard/repos/[repoId]`)

- [ ] Tasarım referansı alındı
- [ ] `features/repos/components/RepoHeader.tsx`
- [ ] `features/repos/components/RepoDebtTable.tsx` (TanStack Table)
- [ ] `features/repos/components/RepoTrend.tsx` (Recharts)
- [ ] `features/repos/mock/repo-detail.mock.ts`
- [ ] `app/dashboard/repos/[repoId]/page.tsx`
- [ ] Loading state
- [ ] Empty state
- [ ] Responsive kontrol
- [ ] Sayfa özeti verildi, onay alındı

---

## 7. Tüm Borçlar (`/dashboard/debts`)

- [ ] Tasarım referansı alındı
- [ ] `features/debts/components/DebtTable.tsx` (TanStack Table)
- [ ] `features/debts/components/DebtFilters.tsx`
- [ ] `features/debts/components/DebtBadge.tsx`
- [ ] `features/debts/mock/debts.mock.ts`
- [ ] `app/dashboard/debts/page.tsx`
- [ ] Sayfalama (pagination)
- [ ] Loading state
- [ ] Empty state
- [ ] Responsive kontrol
- [ ] Sayfa özeti verildi, onay alındı

---

## 8. Ayarlar (`/dashboard/settings`)

- [ ] Tasarım referansı alındı
- [ ] `features/settings/` klasör oluşturma
- [ ] `features/settings/components/ProfileSection.tsx`
- [ ] `features/settings/components/NotificationSettings.tsx`
- [ ] `features/settings/components/ConnectedRepos.tsx`
- [ ] `features/settings/mock/settings.mock.ts`
- [ ] `app/dashboard/settings/page.tsx`
- [ ] Loading state
- [ ] Empty state
- [ ] Responsive kontrol
- [ ] Sayfa özeti verildi, onay alındı

---

## Faz 1 Final Doğrulama

- [ ] `npm run build` — tüm proje hatasız derleniyor
- [ ] Tüm route'lar arası navigasyon çalışıyor
- [ ] Mock data'lar izole (`features/{domain}/mock/` altında)
- [ ] FSD katman kurallarına uygunluk kontrolü
- [ ] Component isimlendirme PascalCase kontrolü
- [ ] Dosya/route isimlendirme kebab-case kontrolü
