import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/api/query-keys";
import { getNotifications, markAsRead, markAllAsRead } from "../api/notification.api";
import type { NotificationResponse } from "../api/notification.types";

export function useNotifications() {
  return useQuery<NotificationResponse[], Error>({
    queryKey: queryKeys.notifications.all,
    queryFn: getNotifications,
    refetchInterval: 30000, // 30 saniyede bir poll
  });
}

export function useMarkAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
    },
  });
}

export function useMarkAllAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
    },
  });
}
