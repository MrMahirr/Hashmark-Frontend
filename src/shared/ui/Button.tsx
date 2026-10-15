"use client";

import Link from "next/link";
import { type AnchorHTMLAttributes, type ButtonHTMLAttributes, type ReactNode, forwardRef } from "react";
import { Loader2 } from "lucide-react";
import { FOCUS_RING, cn } from "./cn";
import { buttonClass, type ButtonSize, type ButtonVariant } from "./button-styles";

export { buttonClass };
export type { ButtonSize, ButtonVariant };

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", isLoading = false, leftIcon, rightIcon, children, className, disabled, type = "button", ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || isLoading}
      className={buttonClass(variant, size, className)}
      {...props}
    >
      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : leftIcon}
      {children}
      {!isLoading && rightIcon}
    </button>
  );
});

interface ButtonLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  href: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

/** Düğme görünümlü bağlantı (`next/link`). */
export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  leftIcon,
  rightIcon,
  children,
  className,
  ...props
}: ButtonLinkProps) {
  return (
    <Link href={href} className={buttonClass(variant, size, className)} {...props}>
      {leftIcon}
      {children}
      {rightIcon}
    </Link>
  );
}

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Görünür metin olmadığı için zorunlu. */
  "aria-label": string;
  /** Koyu dolgulu (hesap menüsü baş harfleri gibi). */
  filled?: boolean;
}

/** 44 px yuvarlak ikon düğmesi. */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { filled = false, className, type = "button", children, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        "inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border",
        filled
          ? "border-hm-text-primary bg-hm-text-primary text-hm-bg"
          : "border-hm-border bg-hm-surface text-hm-text-primary hover:border-hm-text-primary",
        FOCUS_RING,
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
});
