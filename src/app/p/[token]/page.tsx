import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TopNavBar } from "@/features/landing/components/TopNavBar";
import { Footer } from "@/features/landing/components/Footer";
import { Wrap } from "@/features/landing/components/Wrap";
import { fetchPublicScore } from "@/features/public-score/api/public-score";
import { PublicScoreView } from "@/features/public-score/components/PublicScoreView";
import { getServerI18n } from "@/shared/i18n/server";
import { Panel } from "@/shared/ui/Panel";

interface PublicScorePageProps {
  params: Promise<{ token: string }>;
}

export async function generateMetadata({ params }: PublicScorePageProps): Promise<Metadata> {
  const { token } = await params;
  const { t } = await getServerI18n();
  const result = await fetchPublicScore(token);
  if (result.status !== "ok") {
    return { title: t("publicScore.metaTitleFallback"), robots: { index: false } };
  }
  const { repoName, grade, score, openDebts, privateRepo } = result.data;
  const title = grade
    ? t("publicScore.metaTitle", { repo: repoName, grade, score })
    : t("publicScore.metaTitleFallback");
  const description = t("publicScore.metaDescription", { repo: repoName, open: openDebts });
  return {
    title,
    description,
    // Özel deponun adı sahibin isteğiyle görünür ama arama motorlarına verilmez
    robots: { index: !privateRepo, follow: false },
    openGraph: { title, description, type: "website" },
  };
}

export default async function PublicScorePage({ params }: PublicScorePageProps) {
  const { token } = await params;
  const { t, locale } = await getServerI18n();
  const result = await fetchPublicScore(token);
  if (result.status === "not-found") {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col">
      <TopNavBar />
      <main id="main-content" className="flex-grow py-10">
        <Wrap>
          {result.status === "ok" ? (
            <PublicScoreView data={result.data} t={t} locale={locale} />
          ) : (
            <Panel role="alert" className="p-6 text-sm text-hm-text-secondary">
              {t("publicScore.error")}
            </Panel>
          )}
        </Wrap>
      </main>
      <Footer />
    </div>
  );
}
