import { FolderOpen, TrendingUp, Mail } from "lucide-react";

export function FeaturesGrid() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
      {/* Feature 1 */}
      <div className="bg-hm-surface border-[0.5px] border-hm-border rounded-card p-5 flex flex-col gap-4">
        <div className="bg-hm-border-light w-10 h-10 rounded-control flex items-center justify-center">
          <FolderOpen className="w-5 h-5 text-hm-text-primary" />
        </div>
        <div className="flex flex-col gap-1.5">
          <h3 className="text-[14px] font-medium text-hm-text-primary">
            Herhangi bir repoyu tarayın
          </h3>
          <p className="font-mono text-[12px] text-hm-text-secondary leading-relaxed">
            Gizli teknik borçları tespit etmek için monorepo veya mikroservisleri anında analiz edin.
          </p>
        </div>
      </div>

      {/* Feature 2 */}
      <div className="bg-hm-surface border-[0.5px] border-hm-border rounded-card p-5 flex flex-col gap-4">
        <div className="bg-hm-border-light w-10 h-10 rounded-control flex items-center justify-center">
          <TrendingUp className="w-5 h-5 text-hm-text-primary" />
        </div>
        <div className="flex flex-col gap-1.5">
          <h3 className="text-[14px] font-medium text-hm-text-primary">
            Trendleri takip edin
          </h3>
          <p className="font-mono text-[12px] text-hm-text-secondary leading-relaxed">
            Mühendislik ekibini sorumlu tutmak için zaman içindeki borç birikimini görselleştirin.
          </p>
        </div>
      </div>

      {/* Feature 3 */}
      <div className="bg-hm-surface border-[0.5px] border-hm-border rounded-card p-5 flex flex-col gap-4">
        <div className="bg-hm-border-light w-10 h-10 rounded-control flex items-center justify-center">
          <Mail className="w-5 h-5 text-hm-text-primary" />
        </div>
        <div className="flex flex-col gap-1.5">
          <h3 className="text-[14px] font-medium text-hm-text-primary">
            Haftalık özet rapor
          </h3>
          <p className="font-mono text-[12px] text-hm-text-secondary leading-relaxed">
            Çözülen ve yeni eklenen anotasyonlar hakkında otomatik raporlar alın.
          </p>
        </div>
      </div>
    </section>
  );
}
