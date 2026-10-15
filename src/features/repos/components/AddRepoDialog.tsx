"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Loader2, RefreshCw, Search } from "lucide-react";
import { Dialog } from "@/shared/components/Dialog";
import { useI18n } from "@/shared/i18n/I18nProvider";
import { Button } from "@/shared/ui/Button";
import { Field } from "@/shared/ui/Field";
import { useRepoCandidates, useSyncRepos, useTrackRepo } from "../hooks/useRepos";

interface AddRepoDialogProps {
  open: boolean;
  onClose: () => void;
}

/**
 * GitHub'daki depolardan taranacakları seçme penceresi.
 * Açılışta (aday yoksa) GitHub'dan senkronlar; "Ekle" depoyu izlemeye alır.
 */
export function AddRepoDialog({ open, onClose }: AddRepoDialogProps) {
  const { t } = useI18n();
  const [query, setQuery] = useState("");
  const [addingId, setAddingId] = useState<string | null>(null);
  const autoSynced = useRef(false);

  const candidates = useRepoCandidates(open);
  const sync = useSyncRepos();
  const track = useTrackRepo();

  // İlk açılışta GitHub'dan yenile (aday listesi boşsa)
  useEffect(() => {
    if (!open) {
      autoSynced.current = false;
      return;
    }
    if (candidates.isSuccess && candidates.data.length === 0 && !autoSynced.current && !sync.isPending) {
      autoSynced.current = true;
      sync.mutate(undefined, { onSuccess: () => candidates.refetch() });
    }
  }, [open, candidates, sync]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = candidates.data ?? [];
    return q ? list.filter((repo) => repo.fullName.toLowerCase().includes(q)) : list;
  }, [candidates.data, query]);

  const busy = candidates.isLoading || sync.isPending;

  return (
    <Dialog open={open} onClose={onClose} title={t("repos.add.title")} maxWidth={560}>
      <div className="flex flex-col gap-4 p-6">
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <Field
              type="search"
              aria-label={t("repos.add.search")}
              placeholder={t("repos.add.placeholder")}
              icon={<Search size={18} />}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <Button
            variant="outline"
            className="min-h-12"
            onClick={() => sync.mutate(undefined, { onSuccess: () => candidates.refetch() })}
            isLoading={sync.isPending}
            leftIcon={<RefreshCw size={16} aria-hidden="true" />}
          >
            {t("repos.add.refresh")}
          </Button>
        </div>

        <div className="max-h-[360px] overflow-y-auto rounded-control border border-hm-border">
          {busy && visible.length === 0 ? (
            <div role="status" className="flex items-center justify-center gap-2 px-4 py-8 text-sm text-hm-text-secondary">
              <Loader2 size={16} className="animate-spin text-hm-acc" aria-hidden="true" />
              {t("repos.add.loading")}
            </div>
          ) : visible.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-hm-text-secondary">
              {query.trim() ? t("repos.add.noMatch") : t("repos.add.empty")}
            </div>
          ) : (
            <ul className="m-0 list-none p-0">
              {visible.map((repo) => (
                <li
                  key={repo.id}
                  className="flex items-center justify-between gap-3 border-t border-hm-border px-4 py-2.5 first:border-t-0"
                >
                  <span className="min-w-0 truncate font-mono text-sm font-bold" title={repo.fullName}>
                    {repo.fullName}
                  </span>
                  <Button
                    variant="outline"
                    aria-label={`${t("repos.add.action")}: ${repo.fullName}`}
                    isLoading={addingId === String(repo.id) && track.isPending}
                    disabled={track.isPending}
                    onClick={() => {
                      setAddingId(String(repo.id));
                      track.mutate(String(repo.id), { onSuccess: () => candidates.refetch() });
                    }}
                  >
                    {t("repos.add.action")}
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <p className="m-0 font-mono text-xs text-hm-text-secondary">{t("repos.add.hint")}</p>
      </div>
    </Dialog>
  );
}
