import Link from "next/link";
import { LanguageToggle, ThemeToggle } from "@/shared/components/AppearanceToggles";
import { getServerI18n } from "@/shared/i18n/server";
import { Logo } from "@/shared/ui/Logo";
import { Ruler } from "@/shared/ui/Ruler";
import { Wrap } from "./Wrap";

const NAV_LINK =
  "inline-flex min-h-11 items-center px-1.5 text-[15px] font-medium text-hm-text-secondary no-underline hover:text-hm-text-primary";

/** Landing üst çubuğu + altındaki cetvel çizgisi. */
export async function TopNavBar() {
  const { t } = await getServerI18n();

  return (
    <>
      <Wrap>
        <header className="flex flex-wrap items-center justify-between gap-4 py-5">
          <Link href="/" className="flex items-center gap-3.5 no-underline">
            <Logo />
            <span className="font-serif text-[32px] tracking-[-0.01em] text-hm-text-primary">hashmark</span>
          </Link>

          <nav className="flex flex-wrap items-center gap-2.5">
            <span className="mr-3 hidden gap-2.5 sm:flex">
              <a className={NAV_LINK} href="#ozellikler">
                {t("landing.nav.features")}
              </a>
              <a className={NAV_LINK} href="#isaretler">
                {t("landing.nav.markers")}
              </a>
            </span>
            <LanguageToggle />
            <ThemeToggle />
            <Link
              href="/auth/login"
              className="inline-flex min-h-11 items-center rounded-pill border border-hm-border px-[18px] text-[15px] font-semibold text-hm-text-primary no-underline hover:border-hm-text-primary"
            >
              {t("landing.login")}
            </Link>
          </nav>
        </header>
      </Wrap>
      <Ruler />
    </>
  );
}
