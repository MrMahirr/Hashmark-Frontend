import Link from "next/link";
import { getServerI18n } from "@/shared/i18n/server";
import { Logo } from "@/shared/ui/Logo";
import { Wrap } from "./Wrap";

export async function Footer() {
  const { t } = await getServerI18n();

  return (
    <footer className="mt-auto w-full border-t border-hm-border">
      <Wrap>
        <div className="flex flex-wrap items-center justify-between gap-4 pb-10 pt-8">
          <span className="flex items-center gap-3">
            <Logo scale={0.75} />
            <span className="font-mono text-[13px] text-hm-text-secondary">
              {t("landing.footer", { year: new Date().getFullYear() })}
            </span>
          </span>
          <Link
            href="/auth/login"
            className="inline-flex min-h-11 items-center px-1.5 text-[15px] font-medium text-hm-text-secondary no-underline hover:text-hm-text-primary"
          >
            {t("landing.login")}
          </Link>
        </div>
      </Wrap>
    </footer>
  );
}
