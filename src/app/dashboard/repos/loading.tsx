import { FullPageSpinner } from "@/shared/components/Spinner";
import { getServerI18n } from "@/shared/i18n/server";

export default async function ReposLoading() {
  const { t } = await getServerI18n();
  return <FullPageSpinner label={t("repos.loading")} />;
}
