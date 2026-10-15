"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, useState } from "react";
import { ToastContainer } from "@/shared/components/ToastContainer";
import { queryConfig } from "@/shared/config/query.config";
import { I18nProvider } from "@/shared/i18n/I18nProvider";
import type { Locale } from "@/shared/i18n/locales";
import { ThemeProvider } from "@/shared/theme/ThemeProvider";
import type { Theme } from "@/shared/theme/theme";

interface ProvidersProps {
  children: ReactNode;
  locale: Locale;
  theme: Theme;
}

export function Providers({ children, locale, theme }: ProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: queryConfig.staleTime,
            gcTime: queryConfig.gcTime,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <I18nProvider locale={locale}>
      <ThemeProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          {children}
          <ToastContainer />
        </QueryClientProvider>
      </ThemeProvider>
    </I18nProvider>
  );
}
