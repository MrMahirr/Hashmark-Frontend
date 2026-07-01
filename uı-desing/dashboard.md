<!DOCTYPE html>

<html class="h-full bg-background antialiased" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Dashboard - Hashmark</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com" rel="preconnect"/>
<link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&amp;family=JetBrains+Mono:wght@400;500&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
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
                        "body-md": ["13px", {"lineHeight": "20px", "fontWeight": "400"}],
                        "code-md": ["13px", {"lineHeight": "20px", "fontWeight": "400"}],
                        "headline-lg": ["22px", {"lineHeight": "28px", "letterSpacing": "-0.02em", "fontWeight": "500"}],
                        "label-sm": ["11px", {"lineHeight": "16px", "letterSpacing": "0.02em", "fontWeight": "500"}],
                        "code-sm": ["11px", {"lineHeight": "16px", "fontWeight": "400"}],
                        "body-md-medium": ["13px", {"lineHeight": "20px", "fontWeight": "500"}]
                    }
                }
            }
        }
    </script>
<style>
        .chart-area {
            clip-path: polygon(0 100%, 0 80%, 10% 75%, 20% 85%, 30% 60%, 40% 65%, 50% 40%, 60% 50%, 70% 30%, 80% 45%, 90% 20%, 100% 35%, 100% 100%);
        }
        .chart-line {
            clip-path: polygon(0 80%, 10% 75%, 20% 85%, 30% 60%, 40% 65%, 50% 40%, 60% 50%, 70% 30%, 80% 45%, 90% 20%, 100% 35%, 100% 100%, 100% 37%, 90% 22%, 80% 47%, 70% 32%, 60% 52%, 50% 42%, 40% 67%, 30% 62%, 20% 87%, 10% 77%, 0 82%);
        }
    </style>
</head>
<body class="h-full flex overflow-hidden">
<!-- SideNavBar -->
<aside class="h-full w-[220px] fixed left-0 top-0 bg-surface-container-lowest border-r border-outline-variant flex flex-col py-page_padding px-4 z-10 hidden md:flex">
<!-- Brand -->
<div class="flex flex-col mb-8 px-2">
<span class="font-code-md text-headline-lg font-medium text-on-surface"># Hashmark</span>
<span class="font-body-md text-body-md text-on-surface-variant">Technical Debt Scanner</span>
</div>
<!-- Navigation -->
<nav class="flex-1 space-y-1">
<a class="flex items-center gap-stack_md px-card_padding py-2 rounded-lg text-primary font-body-md-medium bg-surface-container-low transition-colors" href="#">
<span class="material-symbols-outlined" data-icon="dashboard" style="font-variation-settings: 'FILL' 1;">dashboard</span>
<span>Overview</span>
</a>
<a class="flex items-center gap-stack_md px-card_padding py-2 rounded-lg text-on-surface-variant font-body-md text-body-md hover:bg-surface-container-low transition-colors" href="#">
<span class="material-symbols-outlined" data-icon="folder">folder</span>
<span>Repos</span>
</a>
<a class="flex items-center gap-stack_md px-card_padding py-2 rounded-lg text-on-surface-variant font-body-md text-body-md hover:bg-surface-container-low transition-colors" href="#">
<span class="material-symbols-outlined" data-icon="list_alt">list_alt</span>
<span>All debts</span>
</a>
<a class="flex items-center gap-stack_md px-card_padding py-2 rounded-lg text-on-surface-variant font-body-md text-body-md hover:bg-surface-container-low transition-colors" href="#">
<span class="material-symbols-outlined" data-icon="settings">settings</span>
<span>Settings</span>
</a>
</nav>
<!-- Footer Profile -->
<div class="mt-auto pt-4 border-t border-outline-variant">
<a class="flex items-center gap-stack_md px-card_padding py-2 rounded-lg text-on-surface-variant font-body-md text-body-md hover:bg-surface-container-low transition-colors" href="#">
<img alt="Hashmark Logo" class="w-6 h-6 rounded-full object-cover border border-outline-variant" data-alt="A small, professional headshot of a software developer in a modern office setting. The lighting is crisp, white, and high-key. The mood is focused and clinical, reflecting a clean corporate aesthetic with subtle gray and blue tones in the background." src="https://lh3.googleusercontent.com/aida-public/AB6AXuD7ECnkq-KLdwyn2KgzfqMBOUSCIO-o4IvZss-JoTZVyw8XSpHFCTGDZuT7yOyzg1kmyJORmdGWC3hs80Ezl2wLrEvEVQVgIxDIvWtyJlRkMSIShGyBVSF9aYmkFP0L9RcMkqBajEx6fnu1ub2SfxWlBcF_5qj6HZUvvewY1sOYXfVSlVfadNHiR8m-oTntk05Vuch2I5CvgDh5YJNwbkssctOSqp_RWXISjVOlGy0Jgwyxw5Z9OXiDOaBHxuC42mU13IP0Fe36yQ"/>
<span>Profile</span>
</a>
</div>
</aside>
<!-- Main Content Canvas -->
<main class="flex-1 flex flex-col h-full overflow-y-auto md:ml-[220px] bg-background">
<!-- Header -->
<header class="flex justify-between items-center px-page_padding py-6">
<h1 class="font-body-md-medium text-[16px] text-on-surface leading-snug">Overview</h1>
<button class="bg-on-surface text-on-primary font-body-md-medium text-body-md px-4 py-2 rounded border-[0.5px] border-outline-variant hover:bg-on-surface-variant transition-colors flex items-center gap-2">
<span class="material-symbols-outlined text-[18px]">search</span>
                Scan all
            </button>
</header>
<div class="px-page_padding pb-page_padding flex flex-col gap-section_gap max-w-7xl">
<!-- Stat Cards Row -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-section_gap">
<!-- Total Debts -->
<div class="bg-surface-container-lowest border-[0.5px] border-outline-variant rounded-lg p-card_padding flex flex-col justify-between h-[100px]">
<span class="font-body-md text-body-md text-on-surface-variant">Total debts</span>
<div class="flex items-baseline gap-2">
<span class="font-headline-lg text-headline-lg text-on-surface">284</span>
</div>
</div>
<!-- Added this week -->
<div class="bg-surface-container-lowest border-[0.5px] border-outline-variant rounded-lg p-card_padding flex flex-col justify-between h-[100px]">
<span class="font-body-md text-body-md text-on-surface-variant">Added this week</span>
<div class="flex items-baseline gap-2">
<span class="font-headline-lg text-headline-lg text-on-surface">+18</span>
<span class="font-label-sm text-label-sm text-error bg-error-container px-1.5 py-0.5 rounded">High</span>
</div>
</div>
<!-- Resolved -->
<div class="bg-surface-container-lowest border-[0.5px] border-outline-variant rounded-lg p-card_padding flex flex-col justify-between h-[100px]">
<span class="font-body-md text-body-md text-on-surface-variant">Resolved</span>
<div class="flex items-baseline gap-2">
<span class="font-headline-lg text-headline-lg text-on-surface">7</span>
<span class="font-label-sm text-label-sm text-[#059669] bg-[#d1fae5] px-1.5 py-0.5 rounded">Good</span>
</div>
</div>
<!-- Repos -->
<div class="bg-surface-container-lowest border-[0.5px] border-outline-variant rounded-lg p-card_padding flex flex-col justify-between h-[100px]">
<span class="font-body-md text-body-md text-on-surface-variant">Repos</span>
<div class="flex items-baseline gap-2">
<span class="font-headline-lg text-headline-lg text-on-surface">5</span>
</div>
</div>
</div>
<!-- Charts Row -->
<div class="grid grid-cols-1 lg:grid-cols-3 gap-section_gap">
<!-- Debt over time (Left 2/3) -->
<div class="lg:col-span-2 bg-surface-container-lowest border-[0.5px] border-outline-variant rounded-lg p-card_padding flex flex-col min-h-[300px]">
<h2 class="font-body-md-medium text-body-md text-on-surface mb-6">Debt over time</h2>
<div class="flex-1 relative w-full h-full border-l border-b border-surface-variant mt-auto">
<!-- Y Axis labels mock -->
<div class="absolute -left-6 top-0 bottom-0 flex flex-col justify-between text-on-surface-variant font-label-sm text-label-sm">
<span>300</span>
<span>250</span>
<span>200</span>
</div>
<!-- Area Chart Visualization -->
<div class="absolute inset-0 w-full h-full">
<div class="w-full h-full bg-primary-fixed-dim/30 chart-area absolute bottom-0 left-0"></div>
<div class="w-full h-full bg-primary chart-line absolute bottom-0 left-0"></div>
</div>
<!-- X Axis labels mock -->
<div class="absolute -bottom-6 left-0 right-0 flex justify-between text-on-surface-variant font-label-sm text-label-sm">
<span>Mon</span>
<span>Tue</span>
<span>Wed</span>
<span>Thu</span>
<span>Fri</span>
<span>Sat</span>
<span>Sun</span>
</div>
</div>
</div>
<!-- By Label (Right 1/3) -->
<div class="bg-surface-container-lowest border-[0.5px] border-outline-variant rounded-lg p-card_padding flex flex-col min-h-[300px]">
<h2 class="font-body-md-medium text-body-md text-on-surface mb-6">By label</h2>
<div class="flex-1 flex flex-col gap-4 justify-center">
<!-- TODO -->
<div class="flex items-center gap-3">
<span class="font-code-sm text-code-sm text-on-surface-variant w-12">TODO</span>
<div class="flex-1 h-2 bg-surface-variant rounded-full overflow-hidden">
<div class="h-full bg-on-surface w-[60%]"></div>
</div>
<span class="font-body-md text-body-md text-on-surface w-8 text-right">142</span>
</div>
<!-- FIXME -->
<div class="flex items-center gap-3">
<span class="font-code-sm text-code-sm text-on-surface-variant w-12">FIXME</span>
<div class="flex-1 h-2 bg-surface-variant rounded-full overflow-hidden">
<div class="h-full bg-primary w-[35%]"></div>
</div>
<span class="font-body-md text-body-md text-on-surface w-8 text-right">86</span>
</div>
<!-- HACK -->
<div class="flex items-center gap-3">
<span class="font-code-sm text-code-sm text-on-surface-variant w-12">HACK</span>
<div class="flex-1 h-2 bg-surface-variant rounded-full overflow-hidden">
<div class="h-full bg-error w-[15%]"></div>
</div>
<span class="font-body-md text-body-md text-on-surface w-8 text-right">41</span>
</div>
<!-- XXX -->
<div class="flex items-center gap-3">
<span class="font-code-sm text-code-sm text-on-surface-variant w-12">XXX</span>
<div class="flex-1 h-2 bg-surface-variant rounded-full overflow-hidden">
<div class="h-full bg-tertiary w-[5%]"></div>
</div>
<span class="font-body-md text-body-md text-on-surface w-8 text-right">15</span>
</div>
</div>
</div>
</div>
<!-- Table: Recent Debts -->
<div class="bg-surface-container-lowest border-[0.5px] border-outline-variant rounded-lg overflow-hidden">
<div class="p-card_padding border-b-[0.5px] border-outline-variant bg-surface-container-lowest">
<h2 class="font-body-md-medium text-body-md text-on-surface">Recent debts</h2>
</div>
<div class="w-full overflow-x-auto">
<table class="w-full text-left border-collapse">
<thead>
<tr class="bg-surface-container-low border-b-[0.5px] border-outline-variant font-body-md-medium text-body-md text-on-surface-variant">
<th class="py-2 px-card_padding font-medium">Label</th>
<th class="py-2 px-card_padding font-medium">File path</th>
<th class="py-2 px-card_padding font-medium">Note</th>
<th class="py-2 px-card_padding font-medium text-right">Date</th>
</tr>
</thead>
<tbody class="font-body-md text-body-md text-on-surface">
<tr class="bg-surface-container-lowest border-b-[0.5px] border-outline-variant hover:bg-surface-bright transition-colors">
<td class="py-3 px-card_padding">
<span class="font-code-sm text-code-sm bg-surface-container-high px-2 py-1 rounded text-on-surface">TODO</span>
</td>
<td class="py-3 px-card_padding font-code-md text-code-md text-on-surface-variant">src/components/Navigation.tsx:42</td>
<td class="py-3 px-card_padding truncate max-w-[200px]">Refactor this routing logic later</td>
<td class="py-3 px-card_padding text-right text-on-surface-variant">2h ago</td>
</tr>
<tr class="bg-surface-container-low border-b-[0.5px] border-outline-variant hover:bg-surface-bright transition-colors">
<td class="py-3 px-card_padding">
<span class="font-code-sm text-code-sm bg-primary-container text-on-primary px-2 py-1 rounded">FIXME</span>
</td>
<td class="py-3 px-card_padding font-code-md text-code-md text-on-surface-variant">api/handlers/auth.go:118</td>
<td class="py-3 px-card_padding truncate max-w-[200px]">Potential race condition here</td>
<td class="py-3 px-card_padding text-right text-on-surface-variant">5h ago</td>
</tr>
<tr class="bg-surface-container-lowest border-b-[0.5px] border-outline-variant hover:bg-surface-bright transition-colors">
<td class="py-3 px-card_padding">
<span class="font-code-sm text-code-sm bg-error-container text-on-error-container px-2 py-1 rounded">HACK</span>
</td>
<td class="py-3 px-card_padding font-code-md text-code-md text-on-surface-variant">utils/formatters.js:22</td>
<td class="py-3 px-card_padding truncate max-w-[200px]">Temporary workaround for IE11</td>
<td class="py-3 px-card_padding text-right text-on-surface-variant">1d ago</td>
</tr>
</tbody>
</table>
</div>
</div>
</div>
</main>
</body></html>