"use client";

import { useUserProfile } from "@/features/auth/hooks/useUserProfile";
import { useLogout } from "@/features/auth/hooks/useAuth";
import { Button } from "@/shared/components/Button";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

export function ProfileContent() {
  const { data: profile, isLoading, isError } = useUserProfile();
  const logoutMutation = useLogout();
  
  // Hydration hatasını önlemek için client-side mount kontrolü
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-hm-text-secondary gap-2 text-sm">
        <Loader2 className="w-5 h-5 animate-spin text-hm-blue" />
        Profil bilgileri yükleniyor...
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="bg-hm-danger-bg text-hm-danger border-[0.5px] border-hm-danger/20 rounded-lg p-4 text-sm mt-4">
        Profil bilgileri yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.
      </div>
    );
  }

  const joinDate = new Date(profile.createdAt).toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-6 mt-4">
      <section className="bg-hm-surface rounded-card border-[0.5px] border-solid border-hm-border p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            {profile.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.avatarUrl}
                alt={profile.name ?? "User"}
                className="w-16 h-16 rounded-full object-cover border border-hm-border shadow-sm"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-hm-bg border-[0.5px] border-solid border-hm-border flex items-center justify-center">
                <span className="font-medium text-2xl text-hm-text-primary">
                  {profile.name?.charAt(0) ?? profile.githubLogin?.charAt(0) ?? "U"}
                </span>
              </div>
            )}
            <div>
              <h3 className="font-semibold text-lg text-hm-text-primary">
                {profile.name ?? profile.githubLogin}
              </h3>
              <p className="text-sm text-hm-text-secondary mt-0.5">
                {profile.email ?? "No email provided"}
              </p>
            </div>
          </div>
          
          <Button
            variant="danger"
            onClick={() => {
              if (!logoutMutation.isPending) {
                logoutMutation.mutate();
              }
            }}
            disabled={logoutMutation.isPending}
            leftIcon={logoutMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : undefined}
          >
            {logoutMutation.isPending ? "Çıkış Yapılıyor..." : "Çıkış Yap"}
          </Button>
        </div>
      </section>

      <section className="bg-hm-surface rounded-card border-[0.5px] border-solid border-hm-border overflow-hidden">
        <div className="border-b-[0.5px] border-hm-border px-6 py-4">
          <h3 className="font-medium text-sm text-hm-text-primary">
            Hesap Detayları
          </h3>
        </div>
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-1 md:gap-4 border-b-[0.5px] border-hm-border/50 pb-4">
            <div className="text-sm font-medium text-hm-text-secondary">GitHub Kullanıcı Adı</div>
            <div className="text-sm text-hm-text-primary md:col-span-2 font-mono">
              @{profile.githubLogin}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-1 md:gap-4 border-b-[0.5px] border-hm-border/50 pb-4">
            <div className="text-sm font-medium text-hm-text-secondary">E-posta</div>
            <div className="text-sm text-hm-text-primary md:col-span-2">
              {profile.email ?? "E-posta bulunamadı"}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-1 md:gap-4">
            <div className="text-sm font-medium text-hm-text-secondary">Katılım Tarihi</div>
            <div className="text-sm text-hm-text-primary md:col-span-2">
              {joinDate}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
