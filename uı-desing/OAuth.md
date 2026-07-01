<!DOCTYPE html>

<html lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>OAuth Callback - Hashmark</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
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
                        "body-md": ["13px", { "lineHeight": "20px", "fontWeight": "400" }],
                        "code-md": ["13px", { "lineHeight": "20px", "fontWeight": "400" }],
                        "headline-lg": ["22px", { "lineHeight": "28px", "letterSpacing": "-0.02em", "fontWeight": "500" }],
                        "label-sm": ["11px", { "lineHeight": "16px", "letterSpacing": "0.02em", "fontWeight": "500" }],
                        "code-sm": ["11px", { "lineHeight": "16px", "fontWeight": "400" }],
                        "body-md-medium": ["13px", { "lineHeight": "20px", "fontWeight": "500" }]
                    }
                },
            },
        }
    </script>
<style>
        .spinner {
            border: 1.5px solid #E5E7EB;
            border-top: 1.5px solid #111827;
            border-radius: 50%;
            width: 32px;
            height: 32px;
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    </style>
</head>
<body class="bg-background min-h-screen flex items-center justify-center font-body-md text-on-background selection:bg-primary-container selection:text-on-primary">
<!-- Suppressed TopNavBar and SideNavBar for transactional screen -->
<main class="flex flex-col items-center justify-center space-y-8 p-page_padding text-center">
<!-- Monogram -->
<div class="font-code-md text-headline-lg font-medium text-on-surface" style="font-size: 36px; line-height: 1;">
            #
        </div>
<!-- Spinner -->
<div class="spinner"></div>
<!-- Text Content -->
<div class="flex flex-col space-y-stack_sm mt-section_gap">
<h1 class="font-body-md-medium text-on-surface" style="font-size: 14px;">Connecting your GitHub account...</h1>
<p class="font-body-md text-on-surface-variant" style="font-size: 12px;">You'll be redirected in a moment.</p>
</div>
</main>
</body></html>