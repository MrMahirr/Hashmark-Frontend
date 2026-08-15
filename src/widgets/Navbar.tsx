"use client";

import { Search } from "lucide-react";
import { useUserProfile } from "@/features/auth/hooks/useUserProfile";
import { NotificationBell } from "./NotificationBell";
import Link from "next/link";

interface NavbarProps {
  title: string | React.ReactNode;
  action?: React.ReactNode;
}

export const Navbar = ({ title, action }: NavbarProps) => {
  const { data: profile } = useUserProfile();
  return (
    <header className="flex justify-between items-center px-6 py-4 bg-hm-surface border-b-[0.5px] border-hm-border sticky top-0 z-20">
      <div className="flex items-center gap-4">
        <h1 className="font-sans text-lg font-semibold text-hm-text-primary leading-snug">
          {title}
        </h1>
      </div>
      
      <div className="flex items-center gap-3">
        {action !== undefined ? (
          action
        ) : (
          <button className="bg-hm-text-primary text-hm-surface font-sans text-sm font-medium px-4 py-2 rounded-lg border-[0.5px] border-hm-border hover:bg-hm-text-primary/90 transition-colors flex items-center gap-2 shadow-sm">
            <Search size={16} />
            Scan all
          </button>
        )}
        
        <div className="h-6 w-[1px] bg-hm-border mx-2"></div>
        
        <NotificationBell />

        <Link href="/dashboard/profile">
          {profile?.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              alt={profile.name ?? "Profile"}
              className="w-8 h-8 rounded-full object-cover border-[0.5px] border-hm-border ml-1 cursor-pointer hover:ring-2 hover:ring-hm-border transition-all"
              src={profile.avatarUrl}
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-hm-bg border-[0.5px] border-hm-border ml-1 cursor-pointer hover:ring-2 hover:ring-hm-border transition-all flex items-center justify-center">
              <span className="font-medium text-sm text-hm-text-primary">
                {profile?.name?.charAt(0) ?? profile?.githubLogin?.charAt(0) ?? "U"}
              </span>
            </div>
          )}
        </Link>
      </div>
    </header>
  );
};
