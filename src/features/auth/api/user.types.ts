export interface UserProfileResponse {
  name: string | null;
  email: string | null;
  githubLogin: string | null;
  avatarUrl: string | null;
  /** GitHub erişim jetonu kayıtlı mı; false = bağlantı kesilmiş */
  githubConnected?: boolean;
  createdAt: string;
  /** Onay kapısı açık ve geçerli sürüme onay yok → /consent'e yönlendir (plan 5.10) */
  consentRequired?: boolean;
  consentVersion?: number | null;
  consentAcceptedAt?: string | null;
}
