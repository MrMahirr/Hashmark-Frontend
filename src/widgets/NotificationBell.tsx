"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Bell, Check, Info, AlertTriangle, XCircle, Loader2 } from "lucide-react";
import { useI18n } from "@/shared/i18n/I18nProvider";
import { useNotifications, useMarkAsRead, useMarkAllAsRead } from "@/features/notifications/hooks/useNotifications";

export const NotificationBell = () => {
  const { t, formatDateTime } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  // Dışarı tıklanınca ve Esc ile kapat; Esc'de odak zile döner
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const { data: notifications = [], isLoading } = useNotifications();
  const markAsReadMutation = useMarkAsRead();
  const markAllAsReadMutation = useMarkAllAsRead();

  const handleMarkAsRead = (id: number, read: boolean) => {
    if (!read && !markAsReadMutation.isPending) {
      markAsReadMutation.mutate(id);
    }
  };

  const handleMarkAllAsRead = () => {
    if (!markAllAsReadMutation.isPending && notifications.some((n) => !n.read)) {
      markAllAsReadMutation.mutate();
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="relative" ref={containerRef}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-controls={isOpen ? panelId : undefined}
        aria-label={
          unreadCount > 0 ? t("notifications.unread", { count: unreadCount }) : t("notifications.open")
        }
        className={`p-2 rounded-full transition-colors relative ${
          isOpen ? "bg-hm-bg text-hm-text-primary" : "text-hm-text-secondary hover:text-hm-text-primary hover:bg-hm-bg"
        }`}
      >
        <Bell size={18} aria-hidden="true" />
        {unreadCount > 0 && (
          <span
            aria-hidden="true"
            className="absolute top-1.5 right-1.5 w-2 h-2 bg-hm-danger rounded-full ring-2 ring-hm-surface"
          />
        )}
      </button>

      {isOpen && (
        <div
          id={panelId}
          role="region"
          aria-label={t("notifications.title")}
          className="hm-anim-fade-in absolute right-0 mt-3 w-80 max-w-[calc(100vw-2rem)] bg-hm-surface border-[0.5px] border-hm-border rounded-xl shadow-lg z-50 overflow-hidden"
        >
          <div className="flex items-center justify-between px-4 py-3 border-b-[0.5px] border-hm-border bg-hm-bg/50">
            <h3 className="text-sm font-medium text-hm-text-primary">{t("notifications.title")}</h3>
            <button
              type="button"
              onClick={handleMarkAllAsRead}
              disabled={markAllAsReadMutation.isPending || unreadCount === 0}
              className="text-[11px] font-medium text-hm-blue hover:text-hm-blue/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {markAllAsReadMutation.isPending ? t("notifications.processing") : t("notifications.markAll")}
            </button>
          </div>

          <div className="max-h-[320px] overflow-y-auto">
            {isLoading ? (
              <div className="flex justify-center items-center py-8" role="status">
                <Loader2 className="w-5 h-5 animate-spin text-hm-blue" aria-hidden="true" />
                <span className="sr-only">{t("common.loading")}</span>
              </div>
            ) : notifications.length > 0 ? (
              <ul>
                {notifications.map((notif) => (
                  <li key={notif.id} className="border-b-[0.5px] border-hm-border last:border-b-0">
                    <button
                      type="button"
                      onClick={() => handleMarkAsRead(notif.id, notif.read)}
                      aria-label={notif.read ? undefined : `${t("notifications.markRead")}: ${notif.title}`}
                      className={`w-full text-left px-4 py-3 hover:bg-hm-bg transition-colors flex gap-3 ${
                        !notif.read ? "bg-hm-blue/5" : ""
                      }`}
                    >
                      <span className="flex-shrink-0 mt-0.5" aria-hidden="true">
                        {notif.type === "SUCCESS" && <Check size={16} className="text-hm-success" />}
                        {notif.type === "WARNING" && <AlertTriangle size={16} className="text-hm-warning" />}
                        {notif.type === "INFO" && <Info size={16} className="text-hm-blue" />}
                        {notif.type === "ERROR" && <XCircle size={16} className="text-hm-danger" />}
                      </span>
                      <span className="flex-1 min-w-0">
                        <span
                          className={`block text-sm ${
                            !notif.read ? "font-medium text-hm-text-primary" : "text-hm-text-secondary"
                          }`}
                        >
                          {notif.title}
                        </span>
                        <span className="block text-xs text-hm-text-secondary mt-0.5 line-clamp-2">
                          {notif.description}
                        </span>
                        <span className="block text-[10px] text-hm-text-secondary mt-1.5 font-medium">
                          {formatDateTime(notif.createdAt)}
                        </span>
                      </span>
                      {!notif.read && (
                        <span className="flex-shrink-0 flex items-center" aria-hidden="true">
                          <span className="w-1.5 h-1.5 bg-hm-blue rounded-full"></span>
                        </span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-4 py-8 text-center text-sm text-hm-text-secondary">{t("notifications.empty")}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
