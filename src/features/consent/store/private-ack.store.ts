import { create } from "zustand";

/**
 * Özel depo ek onayı bekleyen tarama (plan 5.10). Tarama 403 PRIVATE_REPO_ACK_REQUIRED dönünce depo kimliği
 * buraya yazılır; panel düzenindeki PrivateRepoAckDialog uyarıyı gösterir, onaylanırsa taramayı yeniden başlatır.
 */
interface PrivateAckState {
  repoId: string | null;
  request: (repoId: string) => void;
  clear: () => void;
}

export const usePrivateAckStore = create<PrivateAckState>((set) => ({
  repoId: null,
  request: (repoId) => set({ repoId }),
  clear: () => set({ repoId: null }),
}));
