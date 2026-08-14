"use client";

import { Button } from "@/shared/components/Button";
import { useUserProfile } from "@/features/auth/hooks/useUserProfile";
import { useLogout } from "@/features/auth/hooks/useAuth";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export function ProfileSection() {
  const { data: profile, isLoading } = useUserProfile();
  const logoutMutation = useLogout();
  const router = useRouter();

  if (isLoading) {
    return (
      <section className="bg-hm-surface rounded-card border-[0.5px] border-solid border-hm-border p-5 flex items-center justify-center">
        <Loader2 className="w-5 h-5 animate-spin text-hm-blue" />
      </section>
    );
  }

  if (!profile) return null;

  return (
    <section className="bg-hm-surface rounded-card border-[0.5px] border-solid border-hm-border p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div 
        className="flex items-center gap-4 cursor-pointer hover:opacity-80 transition-opacity"
        onClick={() => router.push("/dashboard/profile")}
      >
        {profile.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={profile.avatarUrl}
            alt={profile.name ?? "User"}
            className="w-12 h-12 rounded-full object-cover border-[0.5px] border-solid border-hm-border"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-hm-bg border-[0.5px] border-solid border-hm-border flex items-center justify-center">
            <span className="font-medium text-xl text-hm-text-primary">
              {profile.name?.charAt(0) ?? profile.githubLogin?.charAt(0) ?? "U"}
            </span>
          </div>
        )}
        <div>
          <h3 className="font-medium text-sm text-hm-text-primary">
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
        {logoutMutation.isPending ? "Çıkış yapılıyor..." : "Sign out"}
      </Button>
    </section>
  );
}
