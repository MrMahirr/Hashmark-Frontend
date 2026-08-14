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
