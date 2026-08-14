"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../store/auth.store";

/**
 * SRP (Single Responsibility Principle):
 * Bu hook'un tek sorumluluğu, kullanıcının kimlik doğrulamasını kontrol etmek
 * ve yetkisiz erişimlerde login sayfasına yönlendirmektir.
 *
 * Korunan sayfa layout'larında (örn. DashboardLayout) kullanılır.
 * Auth durumu çözülene kadar `isReady: false` döner,
 * böylece korunan içerik yetkisiz kullanıcılara asla gösterilmez.
 *
 * Hydration uyumsuzluğunu önlemek için component mount olduktan sonra
 * auth kontrolü yapar. SSR sırasında hiçbir zaman redirect tetiklemez.
 */
export function useAuthGuard(): { isReady: boolean } {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const router = useRouter();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (hasMounted && !isAuthenticated) {
      router.replace("/auth/login");
    }
  }, [hasMounted, isAuthenticated, router]);

  // Mount olmadan önce veya auth yoksa hazır değil
  return { isReady: hasMounted && isAuthenticated };
}
