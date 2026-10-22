import type { Metadata } from "next";
import { DebtReport } from "@/features/debts/components/DebtReport";
import { parseReportFilters } from "@/features/debts/utils/report-filters";
import { getServerI18n } from "@/shared/i18n/server";

interface ReportPageProps {
  /** Borç gezginindeki süzgeçler; `print=1` veri gelince yazdırma penceresini açar. */
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getServerI18n();
  return { title: t("report.metaTitle") };
}

export default async function ReportPage({ searchParams }: ReportPageProps) {
  const params = await searchParams;
  const filters = parseReportFilters(params);
  return <DebtReport key={JSON.stringify(filters)} filters={filters} autoPrint={params.print === "1"} />;
}
