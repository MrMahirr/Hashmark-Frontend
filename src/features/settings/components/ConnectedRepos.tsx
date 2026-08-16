"use client";

import {Button} from "@/shared/components/Button";
import {useMappedRepos, useSyncRepos, useDeleteRepo} from "@/features/repos/hooks/useRepos";
import {GitBranch, Unplug, Loader2} from "lucide-react";

export function ConnectedRepos() {
    const {data: repos, isLoading} = useMappedRepos();
    const syncMutation = useSyncRepos();
    const deleteMutation = useDeleteRepo();

    return (
        <section className="bg-hm-surface rounded-card border-[0.5px] border-solid border-hm-border p-5 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="font-medium text-sm text-hm-text-primary mb-1">
                        Bağlı Depolar
                    </h3>
                    <p className="text-sm text-hm-text-secondary">
                        Bağlı GitHub depolarınızı yönetin.
                    </p>
                </div>
                <Button
                    variant="secondary"
                    leftIcon={syncMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin"/> :
                        <GitBranch className="w-4 h-4"/>}
                    onClick={() => {
                        if (!syncMutation.isPending) syncMutation.mutate();
                    }}
                    disabled={syncMutation.isPending}
                >
                    {syncMutation.isPending ? "Senkronize ediliyor..." : "Depo Bağla"}
                </Button>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-8 text-hm-text-secondary gap-2 text-sm">
                    <Loader2 className="w-4 h-4 animate-spin text-hm-blue"/>
                    Depolar yükleniyor...
                </div>
            ) : repos && repos.length > 0 ? (
                <div className="space-y-3">
                    {repos.map((repo) => (
                        <div
                            key={repo.id}
                            className="flex items-center justify-between p-3 rounded-control border-[0.5px] border-solid border-hm-border bg-hm-bg"
                        >
                            <div className="flex items-center gap-3">
                                <GitBranch className="w-5 h-5 text-hm-text-secondary"/>
                                <div>
                                    <h4 className="text-sm font-medium text-hm-text-primary">
                                        {repo.fullName}
                                    </h4>
                                    <p className="text-xs text-hm-text-muted mt-0.5">
                                        Bağlandı: {repo.connectedAt || "yakın zamanda"}
                                    </p>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-hm-text-secondary hover:text-hm-danger hover:bg-hm-danger-bg cursor-pointer"
                                leftIcon={deleteMutation.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin"/> :
                                    <Unplug className="w-3.5 h-3.5"/>}
                                onClick={() => {
                                    if (!deleteMutation.isPending && repo.id) {
                                        deleteMutation.mutate(repo.id);
                                    }
                                }}
                                disabled={deleteMutation.isPending}
                            >
                                Bağlantıyı Kes
                            </Button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-6">
                    <p className="text-sm text-hm-text-secondary">
                        Henüz bağlı depo yok. Yukarıdaki "Depo Bağla" butonuna tıklayarak senkronize edin.
                    </p>
                </div>
            )}
        </section>
    );
}
