import Link from "next/link";
import { Button } from "@/shared/components";
import { LanguageToggle, ThemeToggle } from "@/shared/components/AppearanceToggles";
import { getServerI18n } from "@/shared/i18n/server";

export async function TopNavBar() {
  const { t } = await getServerI18n();

  return (
    <header className="bg-hm-surface border-b-thin border-hm-border w-full top-0 sticky z-50">
      <div className="flex justify-between items-center h-16 px-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <span aria-hidden="true" className="font-mono text-[13px] font-medium text-hm-text-muted">
            #
          </span>
          <span className="text-[22px] font-medium text-hm-text-primary tracking-tight">Hashmark</span>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <LanguageToggle />
          <ThemeToggle />
          <Link href="/auth/login">
            <Button
              className="bg-hm-text-primary text-hm-surface hover:bg-hm-text-primary/90 rounded-full px-5 transition-all duration-200 hover:scale-105 active:scale-95"
              size="sm"
            >
              {t("landing.login")}
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
