import { apiClient } from "@/shared/api/client";
import { ApiMethod } from "@/shared/api/methods";
import { ApiEndpoint } from "@/shared/api/endpoints";
import type { UserProfileResponse } from "./user.types";

export async function getUserProfile(): Promise<UserProfileResponse> {
  const response = await apiClient.get<UserProfileResponse>(
    `${ApiMethod.USER}/${ApiEndpoint.ME}`
  );
  return response.data;
}

/**
 * GitHub bağlantısını keser (erişim jetonu silinir).
 * @param deleteData true ise depo ve borç kayıtları da silinir.
 */
export async function disconnectGithub(deleteData: boolean): Promise<void> {
  await apiClient.delete(`${ApiMethod.USER}/github-connection`, { params: { deleteData } });
}
