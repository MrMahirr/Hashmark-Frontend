"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, Check, Info, AlertTriangle, XCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNotifications, useMarkAsRead, useMarkAllAsRead } from "@/features/notifications/hooks/useNotifications";

export const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Dışarıya tıklandığında menüyü kapat
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const { data: notifications = [], isLoading } = useNotifications();
  const markAsReadMutation = useMarkAsRead();
  const markAllAsReadMutation = useMarkAllAsRead();

  const handleMarkAsRead = (id: number, read: boolean) => {
    if (!read && !markAsReadMutation.isPending) {
      markAsReadMutation.mutate(id);
    }
  };

  const handleMarkAllAsRead = () => {
    if (!markAllAsReadMutation.isPending && notifications.some(n => !n.read)) {
      markAllAsReadMutation.mutate();
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("tr-TR", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className={`p-2 rounded-full transition-colors relative ${
          isOpen ? "bg-hm-bg text-hm-text-primary" : "text-hm-text-secondary hover:text-hm-text-primary hover:bg-hm-bg"
        }`}
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <motion.span 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-1.5 right-1.5 w-2 h-2 bg-hm-danger rounded-full ring-2 ring-hm-surface"
          />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute right-0 mt-3 w-80 bg-hm-surface border-[0.5px] border-hm-border rounded-xl shadow-lg z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b-[0.5px] border-hm-border bg-hm-bg/50">
              <h3 className="text-sm font-medium text-hm-text-primary">Bildirimler</h3>
              <button 
                onClick={handleMarkAllAsRead}
                disabled={markAllAsReadMutation.isPending || unreadCount === 0}
                className="text-[11px] font-medium text-hm-blue hover:text-hm-blue/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {markAllAsReadMutation.isPending ? "İşleniyor..." : "Tümünü okundu işaretle"}
              </button>
            </div>

            {/* List */}
            <div className="max-h-[320px] overflow-y-auto">
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="w-5 h-5 animate-spin text-hm-blue" />
                </div>
              ) : notifications.length > 0 ? (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => handleMarkAsRead(notif.id, notif.read)}
                    className={`px-4 py-3 border-b-[0.5px] border-hm-border last:border-b-0 hover:bg-hm-bg transition-colors cursor-pointer flex gap-3 ${
                      !notif.read ? "bg-hm-blue/5" : ""
                    }`}
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      {notif.type === "SUCCESS" && <Check size={16} className="text-hm-success" />}
                      {notif.type === "WARNING" && <AlertTriangle size={16} className="text-hm-warning" />}
                      {notif.type === "INFO" && <Info size={16} className="text-hm-blue" />}
                      {notif.type === "ERROR" && <XCircle size={16} className="text-hm-danger" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${!notif.read ? "font-medium text-hm-text-primary" : "text-hm-text-secondary"}`}>
                        {notif.title}
                      </p>
                      <p className="text-xs text-hm-text-muted mt-0.5 line-clamp-2">
                        {notif.description}
                      </p>
                      <p className="text-[10px] text-hm-text-muted mt-1.5 font-medium">
                        {formatTime(notif.createdAt)}
                      </p>
                    </div>
                    {!notif.read && (
                      <div className="flex-shrink-0 flex items-center">
                        <div className="w-1.5 h-1.5 bg-hm-blue rounded-full"></div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="px-4 py-8 text-center text-sm text-hm-text-secondary">
                  Henüz bir bildiriminiz yok.
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t-[0.5px] border-hm-border p-2 bg-hm-bg/50">
              <button className="w-full py-1.5 text-xs font-medium text-hm-text-secondary hover:text-hm-text-primary transition-colors text-center rounded-lg hover:bg-hm-border/40">
                Tüm bildirimleri gör
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
