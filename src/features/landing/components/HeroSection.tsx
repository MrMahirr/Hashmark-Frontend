import { getServerI18n } from "@/shared/i18n/server";
import { ButtonLink } from "@/shared/ui/Button";
import { Heading } from "@/shared/ui/Typography";
import { Highlight } from "@/shared/ui/Highlight";
import { CodeSnippetDemo } from "./CodeSnippetDemo";
import { Wrap } from "./Wrap";

const GithubIcon = () => (
  <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.37-3.87-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.69 1.25 3.35.96.1-.74.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.62 1.59.23 2.76.11 3.05.74.81 1.18 1.83 1.18 3.09 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.79.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
  </svg>
);

/** Hero: rozet, vurgulu H1, açıklama, GitHub CTA'sı ve kod paneli. */
export async function HeroSection() {
  const { t } = await getServerI18n();

  return (
    <Wrap>
      <section id="top" className="flex flex-wrap items-center gap-14 pb-24 pt-[72px]">
        <div className="flex min-w-0 flex-[1_1_520px] flex-col items-start gap-8">
          <span className="inline-flex items-center gap-2.5 rounded-pill border border-hm-border bg-hm-surface px-4 py-2 font-mono text-[13px] uppercase tracking-[0.08em]">
            <span aria-hidden="true" className="h-2 w-2 rounded-full bg-hm-acc" />
            {t("landing.badge")}
          </span>
          <Heading as="h1" className="text-[54px] leading-[0.98] tracking-[-0.02em] sm:text-[92px]">
            {t("landing.hero.a")}
            <Highlight>{t("landing.hero.hl")}</Highlight>
            {t("landing.hero.c")}
          </Heading>
          <p className="m-0 max-w-[540px] text-pretty text-xl leading-[1.55] text-hm-text-secondary">
            {t("landing.hero.text")}
          </p>
          <ButtonLink href="/auth/login" size="lg" leftIcon={<GithubIcon />}>
            {t("landing.connectGithub")}
          </ButtonLink>
        </div>

        <CodeSnippetDemo />
      </section>
    </Wrap>
  );
}
