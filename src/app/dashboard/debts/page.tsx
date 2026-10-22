import { DebtsPageContent } from "@/features/debts/components/DebtsPageContent";
import { parseDebtLinkFilters } from "@/features/debts/utils/debt-links";

interface DebtsPageProps {
  /** İçgörü kartlarından gelen süzgeçler (örn. `?olderThanDays=90&debtOnly=1`). */
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function DebtsPage({ searchParams }: DebtsPageProps) {
  const initialFilters = parseDebtLinkFilters(await searchParams);
  // Aynı sayfada başka bir içgörü bağlantısına gidilince durum sıfırlansın
  return <DebtsPageContent key={JSON.stringify(initialFilters)} initialFilters={initialFilters} />;
}
