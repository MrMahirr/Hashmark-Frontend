import { type ReactNode } from "react";
import { type LucideIcon, Inbox } from "lucide-react";
import { Button } from "./Button";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  children?: ReactNode;
}

/**
 * Boş durum gösterimi. Veri olmadığında kullanılır.
 * Opsiyonel ikon, açıklama ve CTA butonu içerir.
 */
export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  actionLabel,
  onAction,
  children,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-hm-bg">
        <Icon className="h-7 w-7 text-hm-text-muted" strokeWidth={1.5} />
      </div>

      <h3 className="mb-1 text-base font-medium text-hm-text-primary">
        {title}
      </h3>

      {description && (
        <p className="mb-6 max-w-sm text-sm text-hm-text-secondary">
          {description}
        </p>
      )}

      {actionLabel && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}

      {children}
    </div>
  );
}
