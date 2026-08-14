"use client";

import { Sidebar } from "@/widgets/Sidebar";
import { useAuthGuard } from "@/features/auth/hooks/useAuthGuard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isReady } = useAuthGuard();

  // Auth durumu çözülene kadar veya yetkisiz kullanıcılar için boş ekran göster
  // (useAuthGuard zaten login sayfasına yönlendiriyor)
  if (!isReady) {
    return null;
  }

  return (
    <div className="h-full flex overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col h-full overflow-y-auto md:ml-[220px] bg-hm-bg">
        {children}
      </main>
    </div>
  );
}
