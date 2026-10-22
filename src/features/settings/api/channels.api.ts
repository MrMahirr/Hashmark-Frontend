import { apiClient } from "@/shared/api/client";
import { ApiMethod } from "@/shared/api/methods";

/** Sohbet kanalı türü (gelen webhook). */
export type ChannelKind = "SLACK" | "DISCORD" | "TEAMS";

/**
 * GET /settings/channels — adres yerine yalnızca maskeli ipucu döner.
 * Backend karşılığı: dev.hashmark.channel.NotificationChannelService.ChannelDto
 */
export interface ChannelResponse {
  id: number;
  kind: ChannelKind;
  urlHint: string;
  sendDigest: boolean;
  sendAlerts: boolean;
  /** OK | FAILED | null (henüz gönderilmedi) */
  lastStatus: "OK" | "FAILED" | null;
  lastError: string | null;
  lastSentAt: string | null;
}

export interface CreateChannelRequest {
  kind: ChannelKind;
  url: string;
  sendDigest: boolean;
  sendAlerts: boolean;
}

export interface UpdateChannelRequest {
  sendDigest?: boolean;
  sendAlerts?: boolean;
}

export interface ChannelTestResult {
  ok: boolean;
  error: string | null;
}

const BASE = `${ApiMethod.SETTINGS}/channels`;

export async function getChannels(): Promise<ChannelResponse[]> {
  return (await apiClient.get<ChannelResponse[]>(BASE)).data;
}

export async function createChannel(payload: CreateChannelRequest): Promise<ChannelResponse> {
  return (await apiClient.post<ChannelResponse>(BASE, payload)).data;
}

export async function updateChannel(id: number, payload: UpdateChannelRequest): Promise<ChannelResponse> {
  return (await apiClient.patch<ChannelResponse>(`${BASE}/${id}`, payload)).data;
}

export async function deleteChannel(id: number): Promise<void> {
  await apiClient.delete(`${BASE}/${id}`);
}

export async function testChannel(id: number): Promise<ChannelTestResult> {
  return (await apiClient.post<ChannelTestResult>(`${BASE}/${id}/test`)).data;
}
