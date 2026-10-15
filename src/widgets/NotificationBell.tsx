"use client";

import { useState, type ReactNode } from "react";
import { AlertTriangle, Bell, Check, Info, Loader2, XCircle } from "lucide-react";
import { Dialog } from "@/shared/components/Dialog";
import { useI18n } from "@/shared/i18n/I18nProvider";
import { useNotifications, useMarkAsRead, useMarkAllAsRead } from "@/features/notifications/hooks/useNotifications";
import { Button, IconButton } from "@/shared/ui/Button";
import { Chip, ChipGroup } from "@/shared/ui/Chip";
import { cn } from "@/shared/ui/cn";

type NotificationFilter = "all" | "unread";

const TYPE_ICON: Record<string, ReactNode> = {
  SUCCESS: <Check size={16} className="text-hm-success" />,
  WARNING: <AlertTriangle size={16} className="text-hm-warning" />,
  INFO: <Info size={16} className="text-hm-info" />,
  ERROR: <XCircle size={16} className="text-hm-danger" />,
};

/** Zil düğmesi (okunmamış sayısı rozetiyle) + sağdan açılan bildirim çekmecesi. */
export const NotificationBell = () => {
  const { t, formatDateTime } = useI18n();
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<NotificationFilter>("all");

  const { data: notifications = [], isLoading } = useNotifications();
  const markAsRead = useMarkAsRead();
  const markAll = useMarkAllAsRead();

  const unreadCount = notifications.filter((n) => !n.read).length;
  const visible = filter === "unread" ? notifications.filter((n) => !n.read) : notifications;

  const handleMarkAsRead = (id: number, read: boolean) => {
    if (!read && !markAsRead.isPending) markAsRead.mutate(id);
  };

  const handleMarkAll = () => {
    if (!markAll.isPending && unreadCount > 0) markAll.mutate();
  };

  return (
    <>
      <div className="relative">
        <IconButton
          onClick={() => setOpen(true)}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-label={unreadCount > 0 ? t("notifications.unread", { count: unreadCount }) : t("notifications.open")}
        >
          <Bell size={18} aria-hidden="true" />
        </IconButton>
        {unreadCount > 0 && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-[3px] -top-[3px] flex h-5 min-w-5 items-center justify-center rounded-[10px] bg-hm-text-primary px-[5px] font-mono text-[11px] font-bold text-hm-bg"
          >
            {unreadCount}
          </span>
        )}
      </div>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title={t("notifications.title")}
        placement="right"
        maxWidth={420}
      >
        <div className="flex h-full flex-col">
          <ChipGroup aria-label={t("notifications.title")} className="px-5 pb-4 pt-4">
            <Chip pressed={filter === "all"} onClick={() => setFilter("all")}>
              {t("notifications.tabAll")}
            </Chip>
            <Chip pressed={filter === "unread"} onClick={() => setFilter("unread")}>
              {t("notifications.tabUnread")} ({unreadCount})
            </Chip>
          </ChipGroup>

          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-8" role="status">
                <Loader2 className="h-5 w-5 animate-spin text-hm-acc" aria-hidden="true" />
                <span className="sr-only">{t("common.loading")}</span>
              </div>
            ) : visible.length > 0 ? (
              <ul>
                {visible.map((notif) => (
                  <li key={notif.id}>
                    <button
                      type="button"
                      onClick={() => handleMarkAsRead(notif.id, notif.read)}
                      aria-label={notif.read ? undefined : `${t("notifications.markRead")}: ${notif.title}`}
                      className="flex w-full cursor-pointer items-start gap-3.5 border-0 border-t border-solid border-hm-border bg-transparent px-5 py-4 text-left text-hm-text-primary hover:bg-[color-mix(in_srgb,var(--hm-text-primary)_6%,transparent)] focus-visible:-outline-offset-[3px]"
                    >
                      <span
                        aria-hidden="true"
                        className={cn(
                          "mt-[7px] h-2.5 w-2.5 flex-none rounded-full",
                          notif.read ? "border border-hm-border bg-transparent" : "bg-hm-acc",
                        )}
                      />
                      <span className="flex min-w-0 flex-col gap-1">
                        <span className={cn("flex items-center gap-2 text-base", notif.read ? "font-medium" : "font-bold")}>
                          <span aria-hidden="true">{TYPE_ICON[notif.type]}</span>
                          {notif.title}
                        </span>
                        <span className="text-sm leading-[1.45] text-hm-text-secondary">{notif.description}</span>
                        <span className="font-mono text-xs text-hm-text-secondary">
                          {formatDateTime(notif.createdAt)}
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="border-t border-hm-border px-5 py-12 text-center text-hm-text-secondary">
                {filter === "unread" ? t("notifications.emptyUnread") : t("notifications.empty")}
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-hm-border px-5 py-4">
            <Button variant="outline" onClick={handleMarkAll} disabled={markAll.isPending || unreadCount === 0}>
              {markAll.isPending ? t("notifications.processing") : t("notifications.markAll")}
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  );
};
