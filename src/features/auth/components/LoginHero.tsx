"use client";

import Link from "next/link";
import { useI18n } from "@/shared/i18n/I18nProvider";
import { Heading } from "@/shared/ui/Typography";
import { Highlight } from "@/shared/ui/Highlight";
import { Logo } from "@/shared/ui/Logo";
import { TagBadge, tagColor } from "@/shared/ui/TagBadge";
import type { CSSProperties } from "react";

const NOTES = [
  { tag: "TODO", key: "auth.login.note.todo" },
  { tag: "FIXME", key: "auth.login.note.fixme" },
  { tag: "HACK", key: "auth.login.note.hack" },
  { tag: "XXX", key: "auth.login.note.xxx" },
] as const;

/** Giriş ekranının sol paneli: logo, vurgulu başlık ve dört örnek not. */
export function LoginHero() {
  const { t } = useI18n();

  return (
    <section className="flex min-w-0 flex-[1_1_560px] flex-col justify-between gap-14 border-r border-hm-border bg-hm-surface px-4 py-7 sm:px-14 sm:py-12">
      <Link href="/" className="flex items-center gap-3.5 no-underline">
        <Logo />
        <span className="font-serif text-[32px] text-hm-text-primary">hashmark</span>
      </Link>

      <div className="flex flex-col gap-10">
        <Heading as="h1" className="text-[46px] tracking-[-0.02em] sm:text-[76px]">
          {t("auth.login.headA")}
          <Highlight>{t("auth.login.headHl")}</Highlight>
          {t("auth.login.headB")}
        </Heading>

        <ul className="m-0 flex max-w-[520px] list-none flex-col overflow-hidden rounded-2xl border border-hm-border bg-hm-bg p-0 font-mono text-[13.5px] leading-7">
          {NOTES.map(({ tag, key }) => (
            <li
              key={tag}
              style={{ "--c": tagColor(tag) } as CSSProperties}
              className="flex flex-wrap items-center gap-3 bg-[color-mix(in_srgb,var(--c)_12%,transparent)] px-[18px] py-1.5"
            >
              <TagBadge tag={tag} size="sm" flat />
              <span>{t(key)}</span>
            </li>
          ))}
        </ul>
      </div>

      <span className="font-mono text-[13px] text-hm-text-secondary">{t("auth.login.copy")}</span>
    </section>
  );
}
