import { apiClient } from "@/shared/api/client";
import { ApiMethod } from "@/shared/api/methods";
import { ApiEndpoint } from "@/shared/api/endpoints";
import type { NotificationResponse } from "./notification.types";

export async function getNotifications(): Promise<NotificationResponse[]> {
  const response = await apiClient.get<NotificationResponse[]>(
    `${ApiMethod.NOTIFICATIONS}`
  );
  return response.data;
}

export async function markAsRead(id: number): Promise<void> {
  await apiClient.put(`${ApiMethod.NOTIFICATIONS}/${id}/${ApiEndpoint.READ}`);
}

export async function markAllAsRead(): Promise<void> {
  await apiClient.put(`${ApiMethod.NOTIFICATIONS}/${ApiEndpoint.READ_ALL}`);
}
