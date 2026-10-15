import Link from "next/link";
import { type ReactNode } from "react";
import { FOCUS_RING, cn } from "./cn";

interface SideLinkProps {
  href: string;
  active?: boolean;
  icon?: ReactNode;
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}

/** Kenar çubuğu bağlantısı: 44 px, aktif = ters renk pill (`aria-current="page"`). */
export function SideLink({ href, active = false, icon, children, onClick, className }: SideLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex min-h-11 items-center gap-3 rounded-control px-3.5 text-[15px] font-semibold no-underline",
        active
          ? "bg-hm-text-primary text-hm-bg"
          : "text-hm-text-secondary hover:bg-[color-mix(in_srgb,var(--hm-text-primary)_8%,transparent)] hover:text-hm-text-primary",
        FOCUS_RING,
        className,
      )}
    >
      {icon}
      {children}
    </Link>
  );
}
