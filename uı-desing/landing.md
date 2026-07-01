
```html
<!DOCTYPE html>

<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Hashmark - Technical Debt Scanner</title>
<!-- Material Symbols -->
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
<!-- Google Fonts -->
<link href="https://fonts.googleapis.com" rel="preconnect"/>
<link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    "colors": {
                        "tertiary-fixed": "#ffdbcd",
                        "tertiary-fixed-dim": "#ffb596",
                        "error": "#ba1a1a",
                        "on-primary-fixed": "#00174b",
                        "surface-container-low": "#f3f4f5",
                        "on-primary-fixed-variant": "#003ea8",
                        "on-tertiary-fixed": "#360f00",
                        "inverse-on-surface": "#f0f1f2",
                        "primary-fixed": "#dbe1ff",
                        "on-error-container": "#93000a",
                        "surface-container-highest": "#e1e3e4",
                        "on-secondary-fixed": "#141b2b",
                        "surface-bright": "#f8f9fa",
                        "on-error": "#ffffff",
                        "outline-variant": "#c3c6d7",
                        "inverse-surface": "#2e3132",
                        "outline": "#737686",
                        "on-primary": "#ffffff",
                        "on-tertiary-container": "#ffede6",
                        "tertiary": "#943700",
                        "secondary-container": "#d9dff5",
                        "surface-container-lowest": "#ffffff",
                        "secondary-fixed": "#dce2f7",
                        "on-surface-variant": "#434655",
                        "on-secondary": "#ffffff",
                        "surface-dim": "#d9dadb",
                        "primary": "#004ac6",
                        "surface-container-high": "#e7e8e9",
                        "on-tertiary-fixed-variant": "#7d2d00",
                        "primary-fixed-dim": "#b4c5ff",
                        "on-surface": "#191c1d",
                        "tertiary-container": "#bc4800",
                        "on-secondary-fixed-variant": "#404758",
                        "secondary": "#575e70",
                        "surface-variant": "#e1e3e4",
                        "inverse-primary": "#b4c5ff",
                        "primary-container": "#2563eb",
                        "on-tertiary": "#ffffff",
                        "surface-container": "#edeeef",
                        "on-background": "#191c1d",
                        "on-primary-container": "#eeefff",
                        "error-container": "#ffdad6",
                        "secondary-fixed-dim": "#c0c6db",
                        "on-secondary-container": "#5c6274",
                        "surface": "#f8f9fa",
                        "surface-tint": "#0053db",
                        "background": "#f8f9fa"
                    },
                    "borderRadius": {
                        "DEFAULT": "0.25rem",
                        "lg": "0.5rem",
                        "xl": "0.75rem",
                        "full": "9999px"
                    },
                    "spacing": {
                        "card_padding": "12px",
                        "section_gap": "16px",
                        "page_padding": "24px",
                        "stack_sm": "4px",
                        "stack_md": "8px",
                        "gutter": "16px"
                    },
                    "fontFamily": {
                        "body-md": ["Inter"],
                        "code-md": ["JetBrains Mono"],
                        "headline-lg": ["Inter"],
                        "label-sm": ["Inter"],
                        "code-sm": ["JetBrains Mono"],
                        "body-md-medium": ["Inter"]
                    },
                    "fontSize": {
                        "body-md": ["13px", { "lineHeight": "20px", "fontWeight": "400" }],
                        "code-md": ["13px", { "lineHeight": "20px", "fontWeight": "400" }],
                        "headline-lg": ["22px", { "lineHeight": "28px", "letterSpacing": "-0.02em", "fontWeight": "500" }],
                        "label-sm": ["11px", { "lineHeight": "16px", "letterSpacing": "0.02em", "fontWeight": "500" }],
                        "code-sm": ["11px", { "lineHeight": "16px", "fontWeight": "400" }],
                        "body-md-medium": ["13px", { "lineHeight": "20px", "fontWeight": "500" }]
                    }
                }
            }
        }
    </script>
<style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        /* Custom syntax highlighting colors mapping to design system somewhat */
        .syntax-keyword { color: #5c6274; }
        .syntax-string { color: #bc4800; }
        .syntax-comment { color: #737686; }
    </style>
</head>
<body class="bg-background text-on-background min-h-screen flex flex-col font-body-md text-body-md antialiased">
<!-- TopNavBar -->
<header class="bg-surface-container-lowest border-b-[0.5px] border-surface-variant w-full top-0 sticky z-50">
<div class="flex justify-between items-center h-16 px-page_padding max-w-7xl mx-auto">
<!-- Brand -->
<div class="flex items-center gap-2">
<span class="font-code-md text-code-md font-medium text-outline">#</span>
<span class="font-headline-lg text-headline-lg font-medium text-on-surface">Hashmark</span>
</div>
<!-- Navigation Links (Hidden on mobile) -->
<nav class="hidden md:flex items-center gap-8">
<!-- Highlight first item as active intentionally for landing page context -->
<a class="font-body-md text-body-md text-primary border-b-2 border-primary py-5 hover:text-primary transition-colors cursor-pointer" href="#">Features</a>
<a class="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors cursor-pointer py-5" href="#">Pricing</a>
<a class="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors cursor-pointer py-5" href="#">Docs</a>
</nav>
<!-- Actions -->
<div class="flex items-center gap-4">
<button class="font-body-md-medium text-body-md-medium text-on-surface-variant hover:text-on-surface transition-colors">Sign In</button>
<button class="font-body-md-medium text-body-md-medium bg-on-surface text-on-primary px-4 py-2 rounded-DEFAULT hover:bg-on-secondary-fixed transition-colors flex items-center gap-2">
<span>Get Started</span>
</button>
</div>
</div>
</header>
<!-- Main Content Area -->
<main class="flex-grow max-w-[720px] w-full mx-auto px-page_padding pt-24 pb-32 flex flex-col gap-12">
<!-- Hero Section -->
<section class="flex flex-col items-start gap-6">
<div class="bg-surface-container border-[0.5px] border-surface-variant px-3 py-1 rounded-full w-max flex items-center gap-2">
<span class="font-label-sm text-label-sm text-on-surface-variant">Free · Open source</span>
</div>
<div class="flex flex-col gap-4">
<h1 class="font-headline-lg text-headline-lg text-on-surface max-w-[600px]">Your codebase has more debt than you think.</h1>
<p class="font-body-md text-body-md text-on-surface-variant max-w-[540px]">
                    Hashmark automatically scans your repositories for technical debt markers—TODOs, FIXMEs, and custom annotations—giving you a clear, quantifiable picture of what needs attention.
                </p>
</div>
<div class="flex items-center gap-4 pt-2">
<button class="font-body-md-medium text-body-md-medium bg-on-surface text-on-primary px-6 py-3 rounded-full hover:bg-on-secondary-fixed transition-colors flex items-center gap-2">
<svg aria-hidden="true" class="w-4 h-4 fill-current" viewbox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"></path></svg>
                    Connect GitHub
                </button>
</div>
</section>
<!-- Stats Row -->
<section class="flex flex-wrap items-center gap-x-8 gap-y-4 border-y-[0.5px] border-surface-variant py-6">
<div class="flex flex-col">
<span class="font-body-md-medium text-body-md-medium text-on-surface">2,400+</span>
<span class="font-label-sm text-label-sm text-on-surface-variant">annotations tracked</span>
</div>
<div class="flex flex-col">
<span class="font-body-md-medium text-body-md-medium text-on-surface">180</span>
<span class="font-label-sm text-label-sm text-on-surface-variant">repos scanned</span>
</div>
<div class="flex flex-col">
<span class="font-body-md-medium text-body-md-medium text-on-surface">Automated</span>
<span class="font-label-sm text-label-sm text-on-surface-variant">Weekly digests sent</span>
</div>
</section>
<!-- Code Snippet Demonstration -->
<section class="w-full flex flex-col gap-3">
<div class="flex justify-between items-center px-1">
<span class="font-label-sm text-label-sm text-outline">src/PaymentProcessor.java</span>
</div>
<div class="bg-[#1c1c1c] rounded-lg border-[0.5px] border-surface-variant p-4 overflow-x-auto">
<pre class="font-code-md text-code-md text-[#d4d4d4] leading-relaxed"><code class="language-java"><span class="syntax-keyword">public</span> <span class="syntax-keyword">class</span> PaymentProcessor {
    <span class="syntax-comment">//</span> <span class="inline-block px-1 rounded bg-tertiary-container/20 text-tertiary-container border-[0.5px] border-tertiary-container/30">TODO: Refactor to use new Stripe API v3</span>
    <span class="syntax-keyword">public</span> <span class="syntax-keyword">void</span> processPayment(Order order) {
        <span class="syntax-keyword">if</span> (order.getAmount() <= 0) {
            <span class="syntax-comment">//</span> <span class="inline-block px-1 rounded bg-error-container/20 text-error border-[0.5px] border-error-container/30">FIXME: Handle negative amounts properly</span>
            <span class="syntax-keyword">throw</span> <span class="syntax-keyword">new</span> RuntimeException(<span class="syntax-string">"Invalid amount"</span>);
        }
      
        <span class="syntax-comment">//</span> <span class="inline-block px-1 rounded bg-[#b45309]/20 text-[#f59e0b] border-[0.5px] border-[#b45309]/30">HACK: Temporary workaround for legacy users</span>
        <span class="syntax-keyword">if</span> (order.getUser().isLegacy()) {
            applyLegacyDiscount(order);
        }
      
        <span class="syntax-comment">//</span> <span class="inline-block px-1 rounded bg-primary-container/20 text-inverse-primary border-[0.5px] border-primary-container/30">XXX: This might fail concurrently</span>
        database.save(order);
    }
}</code></pre>
</div>
</section>
<!-- Features Grid -->
<section class="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
<!-- Feature 1 -->
<div class="bg-surface-container-lowest border-[0.5px] border-surface-variant rounded-lg p-card_padding flex flex-col gap-3">
<div class="bg-surface-container-high w-8 h-8 rounded flex items-center justify-center">
<span class="material-symbols-outlined text-[18px] text-on-surface">folder_open</span>
</div>
<div class="flex flex-col gap-1">
<h3 class="font-body-md-medium text-body-md-medium text-on-surface">Scan any repo</h3>
<p class="font-code-sm text-code-sm text-on-surface-variant leading-relaxed">Instantly analyze monorepos or microservices for hidden technical debt.</p>
</div>
</div>
<!-- Feature 2 -->
<div class="bg-surface-container-lowest border-[0.5px] border-surface-variant rounded-lg p-card_padding flex flex-col gap-3">
<div class="bg-surface-container-high w-8 h-8 rounded flex items-center justify-center">
<span class="material-symbols-outlined text-[18px] text-on-surface">trending_up</span>
</div>
<div class="flex flex-col gap-1">
<h3 class="font-body-md-medium text-body-md-medium text-on-surface">Track trends</h3>
<p class="font-code-sm text-code-sm text-on-surface-variant leading-relaxed">Visualize debt accumulation over time to keep engineering accountable.</p>
</div>
</div>
<!-- Feature 3 -->
<div class="bg-surface-container-lowest border-[0.5px] border-surface-variant rounded-lg p-card_padding flex flex-col gap-3">
<div class="bg-surface-container-high w-8 h-8 rounded flex items-center justify-center">
<span class="material-symbols-outlined text-[18px] text-on-surface">mail</span>
</div>
<div class="flex flex-col gap-1">
<h3 class="font-body-md-medium text-body-md-medium text-on-surface">Weekly digest</h3>
<p class="font-code-sm text-code-sm text-on-surface-variant leading-relaxed">Receive automated reports on resolved and newly introduced annotations.</p>
</div>
</div>
</section>
</main>
<!-- Footer -->
<footer class="w-full border-t-[0.5px] border-surface-variant py-8 mt-auto">
<div class="max-w-[720px] mx-auto px-page_padding flex justify-between items-center">
<span class="font-code-sm text-code-sm text-outline">© 2024 Hashmark. All rights reserved.</span>
<div class="flex items-center gap-1 opacity-50">
<span class="font-code-md text-code-md font-medium">#</span>
</div>
</div>
</footer>
</body></html>
```




---
name: Hashmark
colors:
  surface: '#f8f9fa'
  surface-dim: '#d9dadb'
  surface-bright: '#f8f9fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f5'
  surface-container: '#edeeef'
  surface-container-high: '#e7e8e9'
  surface-container-highest: '#e1e3e4'
  on-surface: '#191c1d'
  on-surface-variant: '#434655'
  inverse-surface: '#2e3132'
  inverse-on-surface: '#f0f1f2'
  outline: '#737686'
  outline-variant: '#c3c6d7'
  surface-tint: '#0053db'
  primary: '#004ac6'
  on-primary: '#ffffff'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#b4c5ff'
  secondary: '#575e70'
  on-secondary: '#ffffff'
  secondary-container: '#d9dff5'
  on-secondary-container: '#5c6274'
  tertiary: '#943700'
  on-tertiary: '#ffffff'
  tertiary-container: '#bc4800'
  on-tertiary-container: '#ffede6'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#dce2f7'
  secondary-fixed-dim: '#c0c6db'
  on-secondary-fixed: '#141b2b'
  on-secondary-fixed-variant: '#404758'
  tertiary-fixed: '#ffdbcd'
  tertiary-fixed-dim: '#ffb596'
  on-tertiary-fixed: '#360f00'
  on-tertiary-fixed-variant: '#7d2d00'
  background: '#f8f9fa'
  on-background: '#191c1d'
  surface-variant: '#e1e3e4'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 22px
    fontWeight: '500'
    lineHeight: 28px
    letterSpacing: -0.02em
  body-md:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
  body-md-medium:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 20px
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  code-md:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
  code-sm:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '400'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  page_padding: 24px
  section_gap: 16px
  card_padding: 12px
  gutter: 16px
  stack_sm: 4px
  stack_md: 8px
---
## Brand & Style

The design system is built for speed, clarity, and precision in technical environments. It draws heavily from **Minimalism** and **Modern Corporate** aesthetics, prioritizing utility over decoration. The brand personality is clinical yet approachable—inspired by high-performance developer tools like Linear and Vercel.

The visual narrative is defined by "The Grid and the Hash." Every element aligns to a strict layout, punctuated by the restrained `#` monogram. The emotional response should be one of extreme organization and cognitive ease, achieved through generous whitespace, a light-mode primary palette, and ultra-fine hairlines.

## Colors

The palette is rooted in a "Paper and Ink" philosophy. The background uses a slightly off-white gray (`#F9FAFB`) to reduce eye strain, while active panels and cards are pure white to create a subtle lift.

- **Primary Accent:** Blue (`#2563EB`) is used sparingly for primary actions and active states.
- **Typography:** Uses high-contrast Slate for maximum legibility. Primary text is nearly black, while secondary and muted tiers provide hierarchy.
- **Semantic Badges:** Specific code-tag colors (TODO, FIXME, etc.) use high-chroma, low-luminance text on desaturated backgrounds for instant recognition without breaking the minimal aesthetic.

## Typography

Typography is the cornerstone of this design system. We use **Inter** for all UI elements to ensure a neutral, systematic feel. **JetBrains Mono** is reserved for code snippets, IDs, and tabular data where character alignment is critical.

- **Scale:** Sizes are kept small to maximize information density.
- **Weights:** Use only Regular (400) and Medium (500). Avoid Bold to maintain the "lightweight" feel.
- **Labels:** Small labels (`11px`) should be set in Medium weight and occasionally in uppercase with slight tracking to differentiate from body text.

## Layout & Spacing

The design system utilizes a **Fixed Grid** approach for internal content containers and a fluid model for the outer workspace.

- **Grid:** A 12-column grid is standard for dashboard views, but the spacing rhythm is driven by the `8px` base unit.
- **Density:** High density is preferred. Use `12px` padding for internal card elements and `16px` between logical sections.
- **Breakpoints:**
  - *Desktop (1280px+):* 24px margins.
  - *Tablet (768px-1279px):* 16px margins, sidebars collapse to icons.
  - *Mobile (<767px):* 12px margins, single column reflow.

## Elevation & Depth

This design system intentionally rejects shadows and blurs. Depth is achieved exclusively through **Tonal Layering** and **Hairline Outlines**.

- **Level 0 (Background):** `#F9FAFB` (Base workspace).
- **Level 1 (Subtle):** `#F3F4F6` (Sidebars, table headers, striped rows).
- **Level 2 (Panel):** `#FFFFFF` (Cards, modals, popovers).
- **Outlines:** All elevated elements must have a `0.5px` border of `#E5E7EB`. This creates a crisp, architectural feel reminiscent of technical drawings.

## Shapes

The shape language is "Soft Geometric." We avoid the clinical coldness of sharp 0px corners but stay away from the playfulness of pill shapes.

- **Controls:** Buttons, inputs, and badges use an `8px` radius.
- **Containers:** Cards and main panel containers use a `12px` radius.
- **Nested Elements:** When a control is inside a card, ensure the corner radii feel concentric by maintaining the 4px difference.

## Components

Consistent implementation of components ensures the design system feels like a single, cohesive tool.

- **Buttons:**
  - *Default:* Transparent background, `0.5px` border (`#D1D5DB`), Text (`#111827`).
  - *Primary:* Solid `#111827` background, White text.
  - *Ghost:* No border, no background, Blue or Gray text.
- **Input Fields:** Pure white background, `0.5px` border. On focus, the border changes to Blue `#2563EB` with no outer glow. Use JetBrains Mono for input text if it's a technical key.
- **Cards:** White background, `12px` radius, `0.5px` border. No shadow.
- **Badges:** Small `11px` text, `8px` radius. Use the semantic colors defined in the Color section.
- **Lists & Tables:** Use `#F3F4F6` for headers. Rows should be separated by `0.5px` lines or subtle zebra striping.
- **The Hash (#):** Always rendered in JetBrains Mono, Medium weight. It should appear as a prefix for IDs, tags, or as a small watermark in the bottom corner of panels.

