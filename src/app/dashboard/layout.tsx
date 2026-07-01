import { Sidebar } from "@/widgets/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full flex overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col h-full overflow-y-auto md:ml-[220px] bg-hm-bg">
        {children}
      </main>
    </div>
  );
}
