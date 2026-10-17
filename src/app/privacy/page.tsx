import type { Metadata } from "next";
import { PrivacyPageContent } from "@/features/consent/components/PrivacyPageContent";
import { getServerI18n } from "@/shared/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getServerI18n();
  return { title: t("privacy.title") };
}

export default function PrivacyPage() {
  return <PrivacyPageContent />;
}
