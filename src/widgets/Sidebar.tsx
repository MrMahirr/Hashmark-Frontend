"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Folder, List, Settings } from "lucide-react";
import { useUserProfile } from "@/features/auth/hooks/useUserProfile";

export const Sidebar = () => {
  const pathname = usePathname();
  const { data: profile } = useUserProfile();

  const navItems = [
    { name: "Genel Bakış", href: "/dashboard", icon: LayoutDashboard },
    { name: "Depolar", href: "/dashboard/repos", icon: Folder },
    { name: "Tüm Borçlar", href: "/dashboard/debts", icon: List },
    { name: "Ayarlar", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <aside className="h-full w-[220px] fixed left-0 top-0 bg-hm-surface border-r-[0.5px] border-hm-border flex flex-col py-6 px-4 z-10 hidden md:flex">
      {/* Brand */}
      <div className="flex flex-col mb-8 px-2">
        <span className="font-mono text-xl font-medium text-hm-text-primary">
          # Hashmark
        </span>
        <span className="font-sans text-sm text-hm-text-secondary mt-1">
          Teknik Borç Tarayıcı
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors font-sans text-sm ${
                isActive
                  ? "text-hm-blue font-medium bg-hm-bg"
                  : "text-hm-text-secondary hover:bg-hm-bg"
              }`}
            >
              <Icon size={18} className={isActive ? "text-hm-blue" : ""} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Profile */}
      <div className="mt-auto pt-4 border-t-[0.5px] border-hm-border">
        <Link
          href="/dashboard/profile"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-hm-text-secondary font-sans text-sm hover:bg-hm-bg transition-colors"
        >
          {profile?.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              alt={profile.name ?? "Profil"}
              className="w-6 h-6 rounded-full object-cover border-[0.5px] border-hm-border"
              src={profile.avatarUrl}
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-hm-bg border-[0.5px] border-hm-border flex items-center justify-center text-[10px] font-medium text-hm-text-primary">
              {profile?.name?.charAt(0) ?? profile?.githubLogin?.charAt(0) ?? "U"}
            </div>
          )}
          <span className="truncate max-w-[120px]">{profile?.name ?? profile?.githubLogin ?? "Profil"}</span>
        </Link>
      </div>
    </aside>
  );
};
