"use client";

import { useAuthGuard } from "@/features/auth/hooks/useAuthGuard";
import { ConsentPageContent } from "./ConsentPageContent";

/** /consent yalnızca oturum açmış kullanıcıya gösterilir (metnin kendisi /privacy'de herkese açık). */
export function ConsentGate() {
  const { isReady } = useAuthGuard();
  return isReady ? <ConsentPageContent /> : null;
}
