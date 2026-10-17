"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserProfile } from "@/features/auth/hooks/useUserProfile";

/**
 * Onay kapısı (plan 5.10): profil `consentRequired` derse panel içeriği gösterilmeden /consent'e gidilir.
 * Kapı backend'de kapalıysa `consentRequired` hep false'tur ve hiçbir şey değişmez.
 */
export function useConsentRedirect(enabled: boolean): { blocked: boolean } {
  const router = useRouter();
  const { data } = useUserProfile(enabled);
  const blocked = enabled && data?.consentRequired === true;

  useEffect(() => {
    if (blocked) {
      router.replace("/consent");
    }
  }, [blocked, router]);

  return { blocked };
}
