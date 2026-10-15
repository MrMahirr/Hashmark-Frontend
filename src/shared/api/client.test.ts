import axios, {
  AxiosError,
  type AxiosAdapter,
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { setupInterceptors, type AuthProvider } from "./client";

type Handler = (config: InternalAxiosRequestConfig) => { status: number; data?: unknown };

function respond(config: InternalAxiosRequestConfig, status: number, data: unknown): AxiosResponse {
  return { data, status, statusText: String(status), headers: {}, config };
}

/** Ağa çıkmadan, verilen işleyiciyle yanıt üreten axios örneği. */
function fakeClient(handler: Handler): { client: AxiosInstance; calls: InternalAxiosRequestConfig[] } {
  const calls: InternalAxiosRequestConfig[] = [];
  const adapter: AxiosAdapter = async (config) => {
    calls.push(config);
    const { status, data } = handler(config);
    const response = respond(config, status, data);
    if (status >= 400) {
      throw new AxiosError(`HTTP ${status}`, String(status), config, null, response);
    }
    return response;
  };
  return { client: axios.create({ baseURL: "http://api.test", adapter }), calls };
}

describe("setupInterceptors", () => {
  let token: string | null;
  let refreshToken: string | null;
  let provider: AuthProvider;

  beforeEach(() => {
    token = "old-access";
    refreshToken = "refresh-1";
    provider = {
      getToken: () => token,
      getRefreshToken: () => refreshToken,
      onTokenRefreshed: vi.fn((t: string) => {
        token = t;
      }),
      onUnauthorized: vi.fn(),
    };
  });

  it("isteğe Bearer token ekler", async () => {
    const { client, calls } = fakeClient(() => ({ status: 200, data: { ok: true } }));
    setupInterceptors(client, provider, { refreshClient: fakeClient(() => ({ status: 500 })).client });

    await client.get("/debts");

    expect(calls[0].headers.Authorization).toBe("Bearer old-access");
  });

  it("401'de sessizce yeniler ve isteği yeni token ile tekrarlar", async () => {
    const { client, calls } = fakeClient((config) =>
      config.headers.Authorization === "Bearer new-access"
        ? { status: 200, data: { items: [1] } }
        : { status: 401 }
    );
    const refresh = fakeClient(() => ({ status: 200, data: { accessToken: "new-access" } }));
    setupInterceptors(client, provider, { refreshClient: refresh.client });

    const response = await client.get("/debts");

    expect(response.data).toEqual({ items: [1] });
    expect(calls).toHaveLength(2);
    expect(refresh.calls).toHaveLength(1);
    expect(JSON.parse(refresh.calls[0].data)).toEqual({ refreshToken: "refresh-1" });
    expect(provider.onTokenRefreshed).toHaveBeenCalledWith("new-access");
    expect(provider.onUnauthorized).not.toHaveBeenCalled();
  });

  it("eşzamanlı 401'ler tek bir refresh isteğini paylaşır", async () => {
    const { client } = fakeClient((config) =>
      config.headers.Authorization === "Bearer new-access" ? { status: 200, data: "ok" } : { status: 401 }
    );
    const refresh = fakeClient(() => ({ status: 200, data: { accessToken: "new-access" } }));
    setupInterceptors(client, provider, { refreshClient: refresh.client });

    const results = await Promise.all([client.get("/a"), client.get("/b"), client.get("/c")]);

    expect(results.map((r) => r.data)).toEqual(["ok", "ok", "ok"]);
    expect(refresh.calls).toHaveLength(1);
  });

  it("refresh başarısızsa oturumu düşürür ve hatayı iletir", async () => {
    const { client } = fakeClient(() => ({ status: 401 }));
    const refresh = fakeClient(() => ({ status: 401 }));
    setupInterceptors(client, provider, { refreshClient: refresh.client });

    await expect(client.get("/debts")).rejects.toMatchObject({ response: { status: 401 } });

    expect(provider.onUnauthorized).toHaveBeenCalled();
    expect(provider.onTokenRefreshed).not.toHaveBeenCalled();
  });

  it("refresh token yoksa istek atmadan oturumu düşürür", async () => {
    refreshToken = null;
    const { client } = fakeClient(() => ({ status: 401 }));
    const refresh = fakeClient(() => ({ status: 200, data: { accessToken: "x" } }));
    setupInterceptors(client, provider, { refreshClient: refresh.client });

    await expect(client.get("/debts")).rejects.toBeTruthy();

    expect(refresh.calls).toHaveLength(0);
    expect(provider.onUnauthorized).toHaveBeenCalled();
  });

  it("yenilemeden sonra yine 401 gelirse sonsuz döngüye girmez", async () => {
    const { client, calls } = fakeClient(() => ({ status: 401 }));
    const refresh = fakeClient(() => ({ status: 200, data: { accessToken: "new-access" } }));
    setupInterceptors(client, provider, { refreshClient: refresh.client });

    await expect(client.get("/debts")).rejects.toBeTruthy();

    expect(calls).toHaveLength(2); // orijinal + tek tekrar
    expect(refresh.calls).toHaveLength(1);
    expect(provider.onUnauthorized).toHaveBeenCalled();
  });

  it("403 oturumu düşürmez", async () => {
    const { client } = fakeClient(() => ({ status: 403 }));
    const refresh = fakeClient(() => ({ status: 200, data: { accessToken: "x" } }));
    setupInterceptors(client, provider, { refreshClient: refresh.client });

    await expect(client.get("/debts/1")).rejects.toMatchObject({ response: { status: 403 } });

    expect(provider.onUnauthorized).not.toHaveBeenCalled();
    expect(refresh.calls).toHaveLength(0);
  });

  it("kimlik uçlarındaki 401 için yenileme denemez", async () => {
    const { client } = fakeClient(() => ({ status: 401 }));
    const refresh = fakeClient(() => ({ status: 200, data: { accessToken: "x" } }));
    setupInterceptors(client, provider, { refreshClient: refresh.client });

    await expect(client.get("/auth/callback")).rejects.toBeTruthy();

    expect(refresh.calls).toHaveLength(0);
    expect(provider.onUnauthorized).toHaveBeenCalled();
  });

  it("yenileme sonrası tekrarlanan istek 500 verirse oturumu düşürmez", async () => {
    const { client } = fakeClient((config) =>
      config.headers.Authorization === "Bearer new-access" ? { status: 500 } : { status: 401 }
    );
    const refresh = fakeClient(() => ({ status: 200, data: { accessToken: "new-access" } }));
    setupInterceptors(client, provider, { refreshClient: refresh.client });

    await expect(client.get("/debts")).rejects.toMatchObject({ response: { status: 500 } });

    expect(provider.onUnauthorized).not.toHaveBeenCalled();
    expect(provider.onTokenRefreshed).toHaveBeenCalled();
  });
});
