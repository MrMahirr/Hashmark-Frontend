import Link from "next/link";
import { Button } from "@/shared/components";

export function TopNavBar() {
  return (
    <header className="bg-hm-surface border-b-thin border-hm-border w-full top-0 sticky z-50">
      <div className="flex justify-between items-center h-16 px-6 max-w-7xl mx-auto">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <span className="font-mono text-[13px] font-medium text-hm-text-muted">#</span>
          <span className="text-[22px] font-medium text-hm-text-primary tracking-tight">Hashmark</span>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 h-full">
          <Link
            href="#"
            className="text-[13px] text-hm-blue border-b-2 border-hm-blue h-full flex items-center hover:text-hm-blue-hover transition-colors"
          >
            Özellikler
          </Link>
          <Link
            href="#"
            className="text-[13px] text-hm-text-secondary hover:text-hm-blue transition-colors"
          >
            Fiyatlandırma
          </Link>
          <Link
            href="#"
            className="text-[13px] text-hm-text-secondary hover:text-hm-blue transition-colors"
          >
            Dokümantasyon
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Link href="/auth/login">
            <Button
              className="bg-hm-text-primary text-hm-surface hover:bg-hm-text-primary/90 rounded-pill px-5 transition-all duration-200 hover:scale-105 active:scale-95"
              size="sm"
            >
              Giriş Yap
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
