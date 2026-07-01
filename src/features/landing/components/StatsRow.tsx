export function StatsRow() {
  return (
    <section className="flex flex-wrap items-center gap-x-12 gap-y-6 border-y-thin border-hm-border py-8">
      <div className="flex flex-col gap-1">
        <span className="text-lg font-semibold text-hm-text-primary">2,400+</span>
        <span className="text-[12px] font-medium text-hm-text-secondary">takip edilen anotasyon</span>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-lg font-semibold text-hm-text-primary">180</span>
        <span className="text-[12px] font-medium text-hm-text-secondary">taranan repo</span>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-lg font-semibold text-hm-text-primary">Otomatik</span>
        <span className="text-[12px] font-medium text-hm-text-secondary">Haftalık özet raporları</span>
      </div>
    </section>
  );
}
