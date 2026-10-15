import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { getServerI18n } from "@/shared/i18n/server";
import { getServerTheme } from "@/shared/theme/server";
import { themeAttribute } from "@/shared/theme/theme";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getServerI18n();
  return {
    title: t("meta.siteTitle"),
    description: t("meta.siteDescription"),
    keywords: [
      "technical debt",
      "code quality",
      "GitHub",
      "TODO",
      "FIXME",
      "HACK",
      "XXX",
      "developer tools",
    ],
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { locale, t } = await getServerI18n();
  const theme = await getServerTheme();

  return (
    <html
      lang={locale}
      data-theme={themeAttribute(theme)}
      className={`${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen bg-hm-bg font-sans text-hm-text-primary antialiased">
        <a href="#main-content" className="skip-link">
          {t("nav.skipToContent")}
        </a>
        <Providers locale={locale} theme={theme}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
