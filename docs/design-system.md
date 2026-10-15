# Hashmark tasarım sistemi (v2 — "Teknik borcun cetveli")

Kaynak: `hashmark-desing/` mockup'ları. Belirteçler `src/app/globals.css`, ilkel bileşenler `src/shared/ui/`.

## Belirteçler

Varsayılan tema **koyu**; açık tema `<html data-theme="light">`, öznitelik yoksa sistem tercihi.

| Belirteç | Koyu | Açık | Kullanım |
|---|---|---|---|
| `--hm-bg` | `#0D1110` | `#EEF0EA` | sayfa zemini |
| `--hm-surface` | `#141A18` | `#F9FAF7` | panel / kenar çubuğu |
| `--hm-border` | `#26312D` | `#D2D8CF` | 1 px çizgiler |
| `--hm-text-primary` | `#E9EEE8` | `#111514` | metin; aktif öğe zemini (ters pill) |
| `--hm-text-secondary` | `#9AA9A2` | `#525C55` | ikincil metin |
| `--hm-acc` | `#CDF24A` | `#326500` | bağlantı, odak halkası, vurgu |
| `--hm-btn` / `--hm-btn-fg` | `#CDF24A` / `#0D1110` | `#111514` / `#EEF0EA` | birincil düğme |
| `--hm-shadow` | `#33423C` | `#CDF24A` | ofset gölge |
| `--hm-hl` / `--hm-hl-fg` | `#CDF24A` / `#0D1110` | `#CDF24A` / `#111514` | vurgu bandı, CTA bloğu |
| `--hm-todo … --hm-info` | bkz. `globals.css` | | etiket renkleri |

Etiket/durum zeminleri (`--hm-*-bg`) çalışma anında `color-mix(in srgb, var(--hm-x) 12%, transparent)` ile üretilir.

Yarıçaplar: kontrol 12, kart/panel 18, landing paneli 22, CTA 28, pill 9999. Dokunma hedefi **en az 44 px**. Odak: 3 px `--hm-acc`, 2 px offset.

Yazı tipleri: **Instrument Serif** (`font-serif`, başlıklar), **Hanken Grotesk** (`font-sans`, gövde), **JetBrains Mono** (`font-mono`, etiket/yol/sayı/tarih). `next/font` ile self-host, `latin` + `latin-ext` (Türkçe).

## Bileşenler (`@/shared/ui`)

| Bileşen | Not |
|---|---|
| `Logo`, `Highlight`, `Ruler` | marka işareti, −1.2° vurgu bandı, cetvel çizgisi |
| `Heading`, `Mono` | serif başlık / mono metin |
| `Button` (`primary` `outline` `ghost` `danger` `onAccent`), `ButtonLink`, `IconButton` | `md` 44 px, `lg` 56 px; `buttonClass()` sunucuda da kullanılabilir (`button-styles.ts`) |
| `Chip`, `ChipGroup`, `Segmented` | `aria-pressed`; seçili = ters renk |
| `Switch` | 64×36, `role="switch"` |
| `Field` | 48 px, sol ikon, `hint`/`error` (`aria-invalid` + `aria-describedby`) |
| `Panel` | `app` 18 / `landing` 22 / `cta` 28 |
| `TagBadge`, `tagColor()` | 1 px kenarlık + %12 ton |
| `SideLink`, `Avatar`, `StatCard`, `DataRow`/`DataRowHeader` | |
| `LoadingState`, `ErrorState` | sayfa durumları |

Ortak uygulama bileşenleri `shared/components`: `Dialog` (yerel `<dialog>`; `placement`, `maxWidth`, `role`), `ConfirmDialog` (`alertdialog`), `EmptyState`, `ToastContainer`, `AppearanceToggles`.

## Kurallar

- Renk için yalnızca belirteç kullanın (`bg-hm-*`, `text-hm-*`); ham hex yazmayın.
- Etiket rengi için `tagColor(tag)` / `--c` + `color-mix`; `*-bg` sınıflarını yeni kodda kullanmayın.
- Etkileşimli öğelere `FOCUS_RING` (`cn.ts`) uygulayın; 44 px altına inmeyin.
- Sunucu bileşeninden çağrılacak yardımcıları `"use client"` dosyasına koymayın.

## Açık tema kontrast ayarı

Mockup'taki açık tema renkleri gerçek tarayıcıda axe-core ile ölçüldüğünde WCAG AA (4.5:1) altında kaldı; şu değerler biraz koyulaştırıldı:
`--hm-acc #326500`, `--hm-text-secondary #525C55`, FIXME/danger `#A22E0D`, NOTE `#0D645D`, TODO `#1C56AE`, HACK/warning `#7C5000`, XXX `#7136BB`, INFO `#00607E`, success `#2D6600`.

## Testler

- Birim: `npm test` (vitest + jsdom + axe).
- Uçtan uca: `npm run build && npm run test:e2e` — Playwright, 8 sayfa × koyu/açık × 1360/390 px; gerçek tarayıcıda axe (kontrast dahil), yatay taşma, yazı tipi ve etkileşim akışları. API tarayıcı düzeyinde taklit edilir (`e2e/mock-api.ts`). Ekran görüntüleri `e2e/screenshots/` altına yazılır.
