import { getServerI18n } from "@/shared/i18n/server";
import { ButtonLink } from "@/shared/ui/Button";
import { Heading } from "@/shared/ui/Typography";
import { Wrap } from "./Wrap";

/** Limon CTA bloğu (28 px yarıçap). Zemin her iki temada da vurgu bandı rengidir. */
export async function CtaBlock() {
  const { t } = await getServerI18n();

  return (
    <Wrap className="pb-[120px]">
      <section className="flex flex-wrap items-center justify-between gap-10 rounded-cta bg-hm-hl px-6 py-14 text-hm-hl-fg sm:px-14 sm:py-[72px]">
        <div className="flex flex-[1_1_420px] flex-col gap-5">
          <span className="font-mono text-[13px] font-bold uppercase tracking-[0.08em]">{t("landing.badge")}</span>
          <Heading as="h2" className="text-balance text-[40px] leading-[1.02] tracking-[-0.015em] sm:text-[60px]">
            {t("landing.cta.title")}
          </Heading>
        </div>
        <ButtonLink href="/auth/login" size="lg" variant="onAccent">
          {t("landing.connectGithub")}
        </ButtonLink>
      </section>
    </Wrap>
  );
}
