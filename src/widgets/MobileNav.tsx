"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { Dialog } from "@/shared/components/Dialog";
import { useI18n } from "@/shared/i18n/I18nProvider";
import { IconButton } from "@/shared/ui/Button";
import { SidebarContent } from "./Sidebar";

/** Küçük ekranlarda kenar çubuğunun yerini alan hamburger menü + çekmece. */
export function MobileNav() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);

  return (
    <>
      <IconButton
        onClick={() => setOpen(true)}
        aria-label={t("nav.openMenu")}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="md:hidden"
      >
        <Menu size={20} aria-hidden="true" />
      </IconButton>

      <Dialog open={open} onClose={() => setOpen(false)} title={t("nav.main")} placement="left">
        <div className="flex h-full flex-col gap-8 px-4 py-4">
          <SidebarContent onNavigate={() => setOpen(false)} />
        </div>
      </Dialog>
    </>
  );
}
