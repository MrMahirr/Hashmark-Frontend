import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useI18n } from "@/shared/i18n/I18nProvider";
import { useToastStore } from "@/shared/store/toast.store";
import {
  createChannel,
  deleteChannel,
  getChannels,
  testChannel,
  updateChannel,
  type CreateChannelRequest,
  type UpdateChannelRequest,
} from "../api/channels.api";

const KEY = ["settings", "channels"] as const;

/** Slack / Discord / Teams kanalları. */
export function useChannels() {
  return useQuery({ queryKey: KEY, queryFn: getChannels });
}

export function useCreateChannel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateChannelRequest) => createChannel(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEY }),
  });
}

export function useUpdateChannel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateChannelRequest }) => updateChannel(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEY }),
  });
}

export function useDeleteChannel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteChannel(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEY }),
  });
}

/** Deneme mesajı; sonuç (ve kanalın son durumu) bildirimle gösterilir. */
export function useTestChannel() {
  const queryClient = useQueryClient();
  const addToast = useToastStore((state) => state.addToast);
  const { t } = useI18n();
  return useMutation({
    mutationFn: (id: number) => testChannel(id),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: KEY });
      if (result.ok) {
        addToast({ title: t("settings.channels.testSent"), type: "success" });
      } else {
        addToast({ title: t("settings.channels.testFailed"), description: result.error ?? undefined, type: "error" });
      }
    },
    onError: (err: Error) => addToast({ title: t("settings.channels.testFailed"), description: err.message, type: "error" }),
  });
}
