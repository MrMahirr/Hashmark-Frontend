"use client";

import { Sidebar } from "@/widgets/Sidebar";
import { useAuthGuard } from "@/features/auth/hooks/useAuthGuard";
import { SessionExpiredPopup } from "@/features/auth/components/SessionExpiredPopup";
import { useConsentRedirect } from "@/features/consent/hooks/useConsentRedirect";
import { PrivateRepoAckDialog } from "@/features/consent/components/PrivateRepoAckDialog";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isReady } = useAuthGuard();
  const { blocked } = useConsentRedirect(isReady);

  // Auth durumu çözülene kadar veya yetkisiz kullanıcılar için boş ekran göster
  // (useAuthGuard zaten login sayfasına yönlendiriyor)
  if (!isReady || blocked) {
    return null;
  }

  return (
    <div className="h-full flex overflow-hidden relative">
      <Sidebar />
      <main
        id="main-content"
        tabIndex={-1}
        className="flex-1 flex flex-col h-full overflow-y-auto md:ml-[240px] bg-hm-bg focus:outline-none"
      >
        {children}
      </main>
      <SessionExpiredPopup />
      <PrivateRepoAckDialog />
    </div>
  );
}
