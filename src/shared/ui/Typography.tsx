import { createElement, type ElementType, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "./cn";

type HeadingTag = "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";

interface HeadingProps extends HTMLAttributes<HTMLElement> {
  as?: HeadingTag;
  children: ReactNode;
}

/**
 * Başlık yazı tipi (Instrument Serif). Boyutu çağıran verir (`text-[36px]` vb.):
 * panel başlıkları 36/34/32, H1 92/60/44, KPI değeri 56, depo toplamı 72.
 */
export function Heading({ as = "h2", className, children, ...rest }: HeadingProps) {
  return createElement(
    as,
    { ...rest, className: cn("m-0 font-serif font-normal leading-none tracking-[-0.01em]", className) },
    children,
  );
}

interface MonoProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  children: ReactNode;
}

/** Veri yazı tipi (JetBrains Mono): etiketler, yollar, sayılar, tarihler. */
export function Mono({ as: Tag = "span", className, children, ...rest }: MonoProps) {
  return (
    <Tag {...rest} className={cn("font-mono", className)}>
      {children}
    </Tag>
  );
}
