export interface UserProfileResponse {
  name: string | null;
  email: string | null;
  githubLogin: string | null;
  avatarUrl: string | null;
  /** GitHub erişim jetonu kayıtlı mı; false = bağlantı kesilmiş */
  githubConnected?: boolean;
  createdAt: string;
}
