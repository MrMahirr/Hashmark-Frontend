import type { Metadata } from "next";
import { ConsentGate } from "@/features/consent/components/ConsentGate";
import { getServerI18n } from "@/shared/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getServerI18n();
  return { title: t("consent.title") };
}

export default function ConsentPage() {
  return <ConsentGate />;
}
