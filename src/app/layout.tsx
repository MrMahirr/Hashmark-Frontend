import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

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

export const metadata: Metadata = {
  title: "Hashmark — Track Your Technical Debt",
  description:
    "Hashmark scans your GitHub repositories to detect TODO, FIXME, HACK, and XXX annotations, visualizes technical debt over time, and sends weekly summary reports.",
  keywords: [
    "technical debt",
    "code quality",
    "GitHub",
    "TODO",
    "FIXME",
    "developer tools",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen bg-hm-bg font-sans text-hm-text-primary antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
