import Link from "next/link";
import type { Metadata } from "next";
import { ErrorFallback, fallbackLinkClass } from "@/shared/components/ErrorFallback";
import { getServerI18n } from "@/shared/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getServerI18n();
  return { title: t("error.notFound.metaTitle") };
}

export default async function NotFound() {
  const { t } = await getServerI18n();

  return (
    <ErrorFallback
      fullScreen
      title={t("error.notFound.title")}
      description={t("error.notFound.description")}
      actions={
        <>
          <Link href="/dashboard" className={fallbackLinkClass}>
            {t("error.notFound.dashboard")}
          </Link>
          <Link href="/" className={fallbackLinkClass}>
            {t("common.homepage")}
          </Link>
        </>
      }
    />
  );
}
