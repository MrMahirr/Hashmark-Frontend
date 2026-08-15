"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Loader2 } from "lucide-react";

export function SessionExpiredPopup() {
  const sessionExpired = useAuthStore((state) => state.sessionExpired);
  const clearTokens = useAuthStore((state) => state.clearTokens);
  const router = useRouter();

  useEffect(() => {
    if (sessionExpired) {
      const timer = setTimeout(() => {
        router.replace("/auth/login");
        setTimeout(() => clearTokens(), 100); // Yönlendirme başladıktan hemen sonra temizle
      }, 3500); // 3.5 saniye sonra yönlendir

      return () => clearTimeout(timer);
    }
  }, [sessionExpired, clearTokens, router]);

  return (
    <AnimatePresence>
      {sessionExpired && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-hm-surface p-6 rounded-2xl shadow-2xl border border-hm-border max-w-sm w-full mx-4 flex flex-col items-center text-center"
          >
            <div className="w-12 h-12 rounded-full bg-hm-danger/10 flex items-center justify-center mb-4 text-hm-danger">
              <AlertTriangle size={24} />
            </div>
            <h2 className="text-lg font-semibold text-hm-text-primary mb-2">
              Oturum Süresi Doldu
            </h2>
            <p className="text-sm text-hm-text-secondary mb-6">
              Güvenliğiniz için oturumunuz sonlandırıldı. Giriş sayfasına yönlendiriliyorsunuz...
            </p>
            <div className="flex items-center justify-center gap-2 text-hm-blue text-sm font-medium">
              <Loader2 className="w-4 h-4 animate-spin" />
              Yönlendiriliyor...
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
