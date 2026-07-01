"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function OAuthCallback() {
  const router = useRouter();

  useEffect(() => {
    // Faz 2: Burada gerçek API çağrısı yapılıp token alınacak.
    // Şimdilik sadece 2 saniye bekleyip dashboard'a yönlendiriyoruz.
    const timer = setTimeout(() => {
      router.push("/dashboard");
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main className="flex flex-col items-center justify-center space-y-8 p-6 text-center min-h-screen bg-hm-bg">
      {/* Monogram */}
      <div className="font-mono text-[36px] font-medium text-hm-text-primary leading-none">
        #
      </div>

      {/* Spinner (Custom CSS-like via Tailwind) */}
      <div 
        className="w-8 h-8 rounded-full border-[1.5px] border-hm-border border-t-hm-text-primary animate-spin"
      />

      {/* Text Content */}
      <div className="flex flex-col gap-1 mt-4">
        <h1 className="text-[14px] font-medium text-hm-text-primary">
          GitHub hesabınız bağlanıyor...
        </h1>
        <p className="text-[12px] text-hm-text-secondary">
          Kısa bir süre içinde yönlendirileceksiniz.
        </p>
      </div>
    </main>
  );
}
