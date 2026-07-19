"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useAuthCallback } from "../hooks/useAuth";

function OAuthCallbackContent() {
  const searchParams = useSearchParams();
  const { mutate: handleCallback, isError } = useAuthCallback();

  useEffect(() => {
    // URL üzerinden ?code= parametresini alıyoruz
    const code = searchParams.get("code");
    if (code) {
      handleCallback(code);
    }
  }, [searchParams, handleCallback]);

  return (
    <main className="flex flex-col items-center justify-center space-y-8 p-6 text-center min-h-screen bg-hm-bg">
      {/* Monogram */}
      <div className="font-mono text-[36px] font-medium text-hm-text-primary leading-none">
        #
      </div>

      {/* Spinner */}
      <div 
        className="w-8 h-8 rounded-full border-[1.5px] border-hm-border border-t-hm-text-primary animate-spin"
      />

      {/* Text Content */}
      <div className="flex flex-col gap-1 mt-4">
        <h1 className="text-[14px] font-medium text-hm-text-primary">
          {isError ? "Bağlantı hatası oluştu!" : "GitHub hesabınız bağlanıyor..."}
        </h1>
        <p className="text-[12px] text-hm-text-secondary">
          {isError ? "İşlem sırasında bir hata oluştu, lütfen giriş sayfasına dönün." : "Kısa bir süre içinde yönlendirileceksiniz."}
        </p>
      </div>
    </main>
  );
}

// useSearchParams kullandığımız için Next.js client-side Suspense Boundary'sine ihtiyaç duyar (Best Practice)
export function OAuthCallback() {
  return (
    <Suspense>
      <OAuthCallbackContent />
    </Suspense>
  );
}
