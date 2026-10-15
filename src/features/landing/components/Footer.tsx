import { getServerI18n } from "@/shared/i18n/server";

export async function Footer() {
  const { t } = await getServerI18n();

  return (
    <footer className="w-full border-t-thin border-hm-border py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <span className="font-mono text-[11px] text-hm-text-secondary">
          {t("landing.footer", { year: new Date().getFullYear() })}
        </span>
        <div aria-hidden="true" className="flex items-center gap-1 opacity-50">
          <span className="font-mono text-[13px] font-medium text-hm-text-muted">#</span>
        </div>
      </div>
    </footer>
  );
}
