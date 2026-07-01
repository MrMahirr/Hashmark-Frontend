# Hashmark Frontend — Faz 1: UI İmplementasyon Planı

## Proje Özeti

GitHub repolarındaki teknik borç anotasyonlarını (`TODO`, `FIXME`, `HACK`, `XXX`) tarayan ve görselleştiren **Hashmark** platformunun frontend'i, **mock data** ile sayfa sayfa implemente edilecek. Backend'e dokunulmayacak.

## Mevcut Durum

- **Next.js 16.2.9** (App Router) + **Tailwind CSS v4** + **PostCSS** kurulu
- FSD klasör iskeleti hazır: `app/`, `features/`, `shared/`, `widgets/`
- Route yapısı iskelet olarak oluşturulmuş (boş klasörler)
- `shared/api/endpoints.ts` ve `methods.ts` enum dosyaları mevcut
- `layout.tsx` ve `page.tsx` default Next.js boilerplate durumunda
- Henüz hiçbir component, hook, type veya mock data yok

---

## Notlar

> **Tailwind CSS v4 kullanımı:** Projede Tailwind v4 kurulu. `@theme inline` ile design token tanımları, `@import "tailwindcss"` syntax'ı kullanılacak.

> **Eksik bağımlılıklar:** Şu paketler yüklenecek:
> - `zustand` — auth & global state
> - `@tanstack/react-query` — server state (Faz 2 için ama altyapı Faz 1'de kurulacak)
> - `@tanstack/react-table` — tablo (Debts sayfası)
> - `recharts` — grafik (Dashboard)
> - `framer-motion` — animasyon
> - `axios` — HTTP client (Faz 2 ama `client.ts` iskeleti Faz 1'de)
> - `lucide-react` — ikonlar (tasarıma göre)

> **Tasarım referansları:** Her sayfa için Stitch tasarım çıktıları (ekran görüntüleri) sayfa başlamadan önce sağlanacak. Tasarım olmadan sayfa implementasyonuna geçilmeyecek.

> **İkon seti:** Şimdilik `lucide-react` planlandı, tasarıma göre değişebilir.

---

## Faz 1 Genel Strateji

Her sayfa için şu döngü uygulanacak:
1. Tasarım referansı alınır
2. Sayfa için gerekli type'lar `shared/types/` altına yazılır
3. Mock data `features/{domain}/mock/` altında izole tutulur
4. Component'ler `features/{domain}/components/` altına FSD kuralına uygun yazılır
5. Sayfa dosyası `app/` altında component'leri birleştirir
6. Loading state, empty state, responsive davranış implemente edilir
7. Özet verilir, onay alınır, sonraki sayfaya geçilir

---

## 0. Altyapı Kurulumu (Tüm Sayfalar Öncesi)

İlk sayfa başlamadan önce yapılacak temel kurulumlar:

### `package.json`
- Eksik bağımlılıkların yüklenmesi: `zustand`, `@tanstack/react-query`, `@tanstack/react-table`, `recharts`, `framer-motion`, `axios`, `lucide-react`

### `globals.css`
- Tasarım sistemindeki renk token'ları CSS custom property olarak tanımlanacak
- `@theme inline` bloğu ile Tailwind v4 token'ları entegre edilecek
- Tipografi: Inter (UI) + JetBrains Mono (kod/sayılar) font tanımları
- Dark mode desteği kaldırılacak (Light / Minimal tasarım)

### `layout.tsx`
- Font'lar Geist → Inter + JetBrains Mono olarak değişecek
- Metadata: title "Hashmark", description güncelleme
- `QueryClientProvider` wrapper (Faz 2 hazırlığı)

### Yeni dosyalar:
- `src/shared/types/debt.types.ts` — DebtType enum, Debt interface
- `src/shared/types/repo.types.ts` — Repo interface, ScanStatus enum
- `src/shared/types/dashboard.types.ts` — DashboardStats interface
- `src/shared/components/Button.tsx` — primary, secondary, ghost, danger varyantları
- `src/shared/components/Badge.tsx` — Debt type pill badge'leri
- `src/shared/components/Spinner.tsx` — Loading indicator
- `src/shared/components/EmptyState.tsx` — İkon + başlık + açıklama + CTA
- `src/shared/api/client.ts` — Axios instance iskeleti

---

## 1. Landing Page (`/`)

**Route:** `src/app/page.tsx`

- Hero section: Hashmark'ın ne yaptığını anlatan başlık + alt başlık
- "GitHub ile Giriş Yap" CTA butonu
- Feature highlight kartları (3-4 adet)
- Nasıl çalışır adımları
- Footer

### Oluşturulacak dosyalar:
- `src/features/landing/components/HeroSection.tsx`
- `src/features/landing/components/FeatureCard.tsx`
- `src/features/landing/components/HowItWorks.tsx`
- `src/features/landing/components/Footer.tsx`
- `src/app/page.tsx` — güncellenecek

---

## 2. Login Page (`/auth/login`)

**Route:** `src/app/auth/login/page.tsx`

- Minimal login kartı, GitHub OAuth butonu
- Logo + kısa açıklama

### Oluşturulacak dosyalar:
- `src/features/auth/components/LoginCard.tsx`
- `src/app/auth/login/page.tsx`

---

## 3. OAuth Callback (`/auth/callback`)

**Route:** `src/app/auth/callback/page.tsx`

- Loading spinner + "Giriş yapılıyor..." mesajı
- Başarılı → dashboard'a redirect (mock)
- Hata → error mesajı + tekrar dene butonu

### Oluşturulacak dosyalar:
- `src/features/auth/components/CallbackHandler.tsx`
- `src/features/auth/store/auth.store.ts` — Zustand store iskeleti
- `src/app/auth/callback/page.tsx`

---

## 4. Dashboard — Genel Özet (`/dashboard`)

**Route:** `src/app/dashboard/page.tsx`

- Stat kartları (toplam borç, çözülmüş, aktif repo sayısı vb.)
- Trend grafiği (Recharts line chart — zaman serisi)
- Label dağılımı (pie chart)
- Modül bazlı bar chart
- Son eklenen borçlar listesi

### Oluşturulacak dosyalar:
- `src/features/dashboard/components/StatCard.tsx`
- `src/features/dashboard/components/TrendChart.tsx`
- `src/features/dashboard/components/LabelPieChart.tsx`
- `src/features/dashboard/components/ModuleBarChart.tsx`
- `src/features/dashboard/components/RecentDebts.tsx`
- `src/features/dashboard/mock/dashboard.mock.ts`
- `src/app/dashboard/layout.tsx` — Sidebar + Navbar içeren dashboard layout
- `src/app/dashboard/page.tsx`

### Widget'lar (dashboard layout için):
- `src/widgets/Navbar.tsx`
- `src/widgets/Sidebar.tsx`

---

## 5. Repo Listesi (`/dashboard/repos`)

**Route:** `src/app/dashboard/repos/page.tsx`

- Repo kartları grid'i
- Her kart: repo adı, dil, son tarama tarihi, borç sayısı, tarama başlat butonu
- Arama/filtreleme
- Boş state (henüz repo bağlanmamış)

### Oluşturulacak dosyalar:
- `src/features/repos/components/RepoCard.tsx`
- `src/features/repos/components/RepoList.tsx`
- `src/features/repos/components/ScanProgress.tsx`
- `src/features/repos/components/RepoFilters.tsx`
- `src/features/repos/mock/repos.mock.ts`
- `src/app/dashboard/repos/page.tsx`

---

## 6. Repo Detay (`/dashboard/repos/[repoId]`)

**Route:** `src/app/dashboard/repos/[repoId]/page.tsx`

- Repo bilgi header'ı
- O repoya ait borçlar tablosu (TanStack Table)
- Repo bazlı trend grafik
- Label dağılımı
- Tarama geçmişi

### Oluşturulacak dosyalar:
- `src/features/repos/components/RepoHeader.tsx`
- `src/features/repos/components/RepoDebtTable.tsx`
- `src/features/repos/components/RepoTrend.tsx`
- `src/features/repos/mock/repo-detail.mock.ts`
- `src/app/dashboard/repos/[repoId]/page.tsx`

---

## 7. Tüm Borçlar (`/dashboard/debts`)

**Route:** `src/app/dashboard/debts/page.tsx`

- Filtrelenebilir borç tablosu (TanStack Table)
- Filtreler: tip (TODO/FIXME/HACK/XXX), repo, tarih aralığı, durum (aktif/çözülmüş)
- Sayfalama
- Toplu işlem butonları

### Oluşturulacak dosyalar:
- `src/features/debts/components/DebtTable.tsx`
- `src/features/debts/components/DebtFilters.tsx`
- `src/features/debts/components/DebtBadge.tsx`
- `src/features/debts/mock/debts.mock.ts`
- `src/app/dashboard/debts/page.tsx`

---

## 8. Ayarlar (`/dashboard/settings`)

**Route:** `src/app/dashboard/settings/page.tsx`

- Profil bilgileri
- Bağlı repolar yönetimi
- E-posta bildirim tercihleri (haftalık özet)
- Tema/dil ayarları (opsiyonel)

### Oluşturulacak dosyalar:
- `src/features/settings/components/ProfileSection.tsx`
- `src/features/settings/components/NotificationSettings.tsx`
- `src/features/settings/components/ConnectedRepos.tsx`
- `src/features/settings/mock/settings.mock.ts`
- `src/app/dashboard/settings/page.tsx`

> Not: `features/settings/` klasörü henüz mevcut değil, oluşturulacak.

---

## Dosya İsimlendirme Kuralları

| Kategori | Kural | Örnek |
|---|---|---|
| Component | PascalCase | `StatCard.tsx` |
| Route/dosya | kebab-case | `auth/login/page.tsx` |
| Mock data | kebab-case | `dashboard.mock.ts` |
| Type dosyası | kebab-case | `debt.types.ts` |
| Hook | camelCase, `use` prefix | `useRepos.ts` |
| Store | kebab-case | `auth.store.ts` |

---

## Doğrulama Planı

### Her Sayfa Sonrası
- `npm run dev` ile tarayıcıda görsel doğrulama
- Responsive kontrol (mobile, tablet, desktop)
- Loading / empty state görünümleri kontrol
- TypeScript derleme hatası yok (`npm run build` son sayfada)

### Faz 1 Sonunda
- `npm run build` — tüm proje derleniyor mu?
- Tüm route'lar arası navigasyon çalışıyor mu?
- Mock data'lar izole mi? (`features/{domain}/mock/` altında mı?)
- FSD katman kurallarına uyuluyor mu?
