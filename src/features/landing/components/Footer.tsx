export function Footer() {
  return (
    <footer className="w-full border-t-thin border-hm-border py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <span className="font-mono text-[11px] text-hm-text-muted">
          © {new Date().getFullYear()} Hashmark. Tüm hakları saklıdır.
        </span>
        <div className="flex items-center gap-1 opacity-50">
          <span className="font-mono text-[13px] font-medium text-hm-text-muted">#</span>
        </div>
      </div>
    </footer>
  );
}
