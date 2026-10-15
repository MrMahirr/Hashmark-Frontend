"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useGitHubLogin } from "../hooks/useAuth";
import { useAuthStore } from "../store/auth.store";
import { useI18n } from "@/shared/i18n/I18nProvider";
import { LanguageToggle, ThemeToggle } from "@/shared/components/AppearanceToggles";
import { Button } from "@/shared/ui/Button";
import { Heading } from "@/shared/ui/Typography";

const GithubIcon = () => (
  <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.37-3.87-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.69 1.25 3.35.96.1-.74.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.62 1.59.23 2.76.11 3.05.74.81 1.18 1.83 1.18 3.09 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.79.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
  </svg>
);

/** Giriş ekranının sağ paneli: dil/tema, başlık ve "GitHub ile devam et". */
export function LoginForm() {
  const { t } = useI18n();
  // İş mantığı (API katmanı) ile arayüz katmanı Adapter (hook) yardımıyla haberleşir (SRP)
  const { mutate: loginWithGitHub, isPending } = useGitHubLogin();

  // Zaten oturumu olan kullanıcı (ör. proxy çerezi eksik kaldıysa) tekrar giriş yapmadan panele geçer
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const router = useRouter();
  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, router]);

  return (
    <section className="flex min-w-0 flex-[1_1_480px] flex-col px-4 py-7 sm:px-14 sm:py-12">
      <div className="flex flex-wrap items-center justify-end gap-2.5">
        <LanguageToggle />
        <ThemeToggle />
      </div>

      <div className="flex flex-1 items-center justify-center py-10">
        <div className="flex w-full max-w-[420px] flex-col gap-7">
          <span className="self-start rounded-pill border border-hm-border bg-hm-surface px-4 py-2 font-mono text-[13px] uppercase tracking-[0.08em] text-hm-text-primary">
            {t("auth.login.badge")}
          </span>
          <Heading as="h2" className="text-[60px] tracking-[-0.015em]">
            {t("auth.login.title")}
          </Heading>
          <p className="m-0 text-lg leading-[1.55] text-hm-text-secondary">{t("auth.login.subtitle")}</p>

          <Button
            size="lg"
            className="w-full"
            onClick={() => loginWithGitHub()}
            disabled={isPending}
            leftIcon={<GithubIcon />}
          >
            {isPending ? t("auth.login.redirecting") : t("auth.login.continue")}
          </Button>

          <Link
            href="/"
            className="inline-flex min-h-11 items-center text-[15px] font-medium text-hm-text-secondary no-underline hover:text-hm-text-primary"
          >
            ← {t("auth.login.back")}
          </Link>

          <p className="m-0 text-xs text-hm-text-secondary">
            {t("auth.login.termsPrefix")}{" "}
            <Link href="#" className="underline underline-offset-2 hover:text-hm-text-primary">
              {t("auth.login.terms")}
            </Link>{" "}
            {t("auth.login.and")}{" "}
            <Link href="#" className="underline underline-offset-2 hover:text-hm-text-primary">
              {t("auth.login.privacy")}
            </Link>
            {t("auth.login.termsSuffix") === "." ? "." : ` ${t("auth.login.termsSuffix")}`}
          </p>
        </div>
      </div>
    </section>
  );
}
