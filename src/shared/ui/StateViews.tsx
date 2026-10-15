import { AlertCircle, Loader2, RefreshCw } from "lucide-react";
import { Button } from "./Button";
import { Heading } from "./Typography";
import { Panel } from "./Panel";

/** Sayfa/bölüm yüklenirken ortalanmış dönen simge + metin. */
export function LoadingState({ label, className = "min-h-[500px]" }: { label: string; className?: string }) {
  return (
    <div role="status" className={`flex w-full flex-col items-center justify-center gap-3 ${className}`}>
      <Loader2 className="h-8 w-8 animate-spin text-hm-acc" aria-hidden="true" />
      <p className="m-0 animate-pulse text-sm text-hm-text-secondary">{label}</p>
    </div>
  );
}

interface ErrorStateProps {
  title: string;
  description: string;
  retryLabel: string;
  onRetry: () => void;
}

/** Hata paneli: danger tonlu simge, `role="alert"` metni ve "Yeniden dene" düğmesi. */
export function ErrorState({ title, description, retryLabel, onRetry }: ErrorStateProps) {
  return (
    <Panel className="my-8 flex flex-col items-center justify-center gap-4 p-8 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-hm-danger-bg text-hm-danger">
        <AlertCircle className="h-6 w-6" aria-hidden="true" />
      </div>
      <div role="alert">
        <Heading as="h2" className="text-[28px]">
          {title}
        </Heading>
        <p className="mx-auto mb-0 mt-2 max-w-md text-sm text-hm-text-secondary">{description}</p>
      </div>
      <Button variant="outline" leftIcon={<RefreshCw className="h-4 w-4" aria-hidden="true" />} onClick={onRetry}>
        {retryLabel}
      </Button>
    </Panel>
  );
}
