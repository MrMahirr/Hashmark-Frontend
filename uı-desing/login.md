<!DOCTYPE html>

<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Hashmark - Login</title>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com" rel="preconnect"/>
<link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&amp;family=JetBrains+Mono:wght@400;500;600;700&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
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
                      "body-md": [
                              "Inter"
                      ],
                      "code-md": [
                              "JetBrains Mono"
                      ],
                      "headline-lg": [
                              "Inter"
                      ],
                      "label-sm": [
                              "Inter"
                      ],
                      "code-sm": [
                              "JetBrains Mono"
                      ],
                      "body-md-medium": [
                              "Inter"
                      ]
              },
              "fontSize": {
                      "body-md": [
                              "13px",
                              {
                                      "lineHeight": "20px",
                                      "fontWeight": "400"
                              }
                      ],
                      "code-md": [
                              "13px",
                              {
                                      "lineHeight": "20px",
                                      "fontWeight": "400"
                              }
                      ],
                      "headline-lg": [
                              "22px",
                              {
                                      "lineHeight": "28px",
                                      "letterSpacing": "-0.02em",
                                      "fontWeight": "500"
                              }
                      ],
                      "label-sm": [
                              "11px",
                              {
                                      "lineHeight": "16px",
                                      "letterSpacing": "0.02em",
                                      "fontWeight": "500"
                              }
                      ],
                      "code-sm": [
                              "11px",
                              {
                                      "lineHeight": "16px",
                                      "fontWeight": "400"
                              }
                      ],
                      "body-md-medium": [
                              "13px",
                              {
                                      "lineHeight": "20px",
                                      "fontWeight": "500"
                              }
                      ]
              }
      },
          },
        }
      </script>
</head>
<body class="bg-background min-h-screen flex items-center justify-center p-page_padding font-body-md text-on-background">
<!-- Card Container -->
<div class="bg-surface-container-lowest w-full max-w-[400px] rounded-xl border border-outline-variant/50 p-12">
<!-- Brand / Header -->
<div class="flex flex-col items-center mb-section_gap gap-stack_sm">
<div class="flex items-center gap-2 mb-4">
<span class="font-code-md text-[32px] font-medium leading-none text-on-surface">#</span>
<span class="font-body-md text-[15px] font-medium text-on-surface">Hashmark</span>
</div>
<h1 class="font-body-md text-[20px] font-medium text-on-surface">Sign in</h1>
<p class="font-body-md text-body-md text-on-surface-variant text-center mt-1">Connect your GitHub account to start tracking debt.</p>
</div>
<!-- Action Area -->
<div class="mt-8 flex flex-col gap-4">
<button class="w-full h-[44px] bg-[#24292F] hover:bg-[#24292F]/90 text-on-primary font-body-md-medium text-[14px] rounded-lg flex items-center justify-center gap-3 transition-colors">
<svg aria-hidden="true" class="w-5 h-5 fill-current" viewbox="0 0 24 24">
<path clip-rule="evenodd" d="M12 2C6.477 2 2 6.463 2 11.97c0 4.404 2.865 8.14 6.839 9.458.5.092.682-.216.682-.48 0-.236-.008-.864-.013-1.695-2.782.602-3.369-1.337-3.369-1.337-.454-1.151-1.11-1.458-1.11-1.458-.908-.618.069-.606.069-.606 1.003.07 1.531 1.027 1.531 1.027.892 1.524 2.341 1.084 2.91.828.092-.643.35-1.083.636-1.332-2.22-.251-4.555-1.107-4.555-4.927 0-1.088.39-1.979 1.029-2.675-.103-.252-.446-1.266.098-2.638 0 0 .84-.268 2.75 1.022A9.606 9.606 0 0112 6.82c.85.004 1.705.114 2.504.336 1.909-1.29 2.747-1.022 2.747-1.022.546 1.372.202 2.386.1 2.638.64.696 1.028 1.587 1.028 2.675 0 3.83-2.339 4.673-4.566 4.92.359.307.678.915.678 1.846 0 1.332-.012 2.407-.012 2.734 0 .267.18.577.688.48C19.137 20.107 22 16.373 22 11.969 22 6.463 17.522 2 12 2z" fill-rule="evenodd"></path>
</svg>
                Continue with GitHub
            </button>
<div class="relative flex items-center py-4">
<div class="flex-grow border-t border-outline-variant/50"></div>
<span class="flex-shrink-0 mx-4 font-body-md text-[12px] text-on-surface-variant">or</span>
<div class="flex-grow border-t border-outline-variant/50"></div>
</div>
<button class="w-full h-[44px] bg-transparent border border-outline-variant/50 hover:bg-surface-container-low text-on-surface font-body-md-medium text-[14px] rounded-lg transition-colors">
                Sign in with SAML SSO
            </button>
</div>
<!-- Fine Print -->
<div class="mt-8 text-center">
<p class="font-label-sm text-label-sm text-on-surface-variant/70">
                By signing in, you agree to our <a class="hover:text-on-surface transition-colors" href="#">Terms of Service</a> and <a class="hover:text-on-surface transition-colors" href="#">Privacy Policy</a>.
            </p>
</div>
</div>
</body></html>