import { type ReactNode } from "react";
import { Panel } from "@/shared/ui/Panel";
import { Heading } from "@/shared/ui/Typography";

interface SettingsSectionProps {
  title: string;
  description?: string;
  id: string;
  /** Başlığın sağındaki denetim (ör. anahtar). */
  aside?: ReactNode;
  children?: ReactNode;
}

/** Ayarlar paneli: serif başlık, isteğe bağlı açıklama/yan denetim ve içerik. */
export function SettingsSection({ title, description, id, aside, children }: SettingsSectionProps) {
  return (
    <Panel aria-labelledby={`${id}-title`} className="flex flex-col gap-6 p-7">
      <div className="flex flex-wrap items-center justify-between gap-5">
        <div className="flex min-w-[240px] flex-1 flex-col gap-1.5">
          <Heading as="h2" id={`${id}-title`} className="text-[34px] leading-[1.05]">
            {title}
          </Heading>
          {description && (
            <p id={`${id}-desc`} className="m-0 text-base leading-normal text-hm-text-secondary">
              {description}
            </p>
          )}
        </div>
        {aside}
      </div>
      {children}
    </Panel>
  );
}

/** Alan etiketi (mono, büyük harf). */
export function FieldLabel({ children, id }: { children: ReactNode; id?: string }) {
  return (
    <span id={id} className="font-mono text-xs uppercase tracking-[0.08em] text-hm-text-secondary">
      {children}
    </span>
  );
}
