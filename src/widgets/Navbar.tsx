"use client";

import { LanguageToggle, ThemeToggle } from "@/shared/components/AppearanceToggles";
import { Heading } from "@/shared/ui/Typography";
import { ScanAllButton } from "@/features/scanner/components/ScanAllButton";
import { AccountMenu } from "./AccountMenu";
import { MobileNav } from "./MobileNav";
import { NotificationBell } from "./NotificationBell";

interface NavbarProps {
  title: string | React.ReactNode;
  action?: React.ReactNode;
}

/** Sayfa üst çubuğu: serif H1 + TR/EN, tema, "Tümünü Tara", bildirim zili, hesap menüsü. */
export const Navbar = ({ title, action }: NavbarProps) => {
  return (
    <header className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-4 border-b border-hm-border bg-hm-bg px-4 py-3.5 sm:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <MobileNav />
        <Heading as="h1" className="truncate text-[28px] sm:text-4xl">
          {title}
        </Heading>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        <LanguageToggle />
        <ThemeToggle />
        {action !== undefined ? action : <ScanAllButton />}
        <NotificationBell />
        <AccountMenu />
      </div>
    </header>
  );
};
