import { beforeEach, describe, expect, it } from "vitest";
import { SESSION_COOKIE } from "@/shared/auth/session";
import { useAuthStore } from "./auth.store";

const hasSessionCookie = () => document.cookie.split(";").some((c) => c.trim().startsWith(`${SESSION_COOKIE}=1`));

describe("auth store", () => {
  beforeEach(() => {
    useAuthStore.getState().clearTokens();
  });

  it("setTokens depolama, çerez ve durumu günceller", () => {
    useAuthStore.getState().setTokens("access-1", "refresh-1");

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.accessToken).toBe("access-1");
    expect(localStorage.getItem("accessToken")).toBe("access-1");
    expect(localStorage.getItem("refreshToken")).toBe("refresh-1");
    expect(hasSessionCookie()).toBe(true);
  });

  it("setAccessToken yalnızca access token'ı değiştirir", () => {
    useAuthStore.getState().setTokens("access-1", "refresh-1");

    useAuthStore.getState().setAccessToken("access-2");

    const state = useAuthStore.getState();
    expect(state.accessToken).toBe("access-2");
    expect(state.refreshToken).toBe("refresh-1");
    expect(localStorage.getItem("accessToken")).toBe("access-2");
    expect(localStorage.getItem("refreshToken")).toBe("refresh-1");
  });

  it("clearTokens her şeyi temizler", () => {
    useAuthStore.getState().setTokens("a", "r");
    useAuthStore.getState().setSessionExpired(true);

    useAuthStore.getState().clearTokens();

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.accessToken).toBeNull();
    expect(state.sessionExpired).toBe(false);
    expect(localStorage.getItem("accessToken")).toBeNull();
    expect(hasSessionCookie()).toBe(false);
  });

  it("yeni giriş süresi dolmuş işaretini kaldırır", () => {
    useAuthStore.getState().setSessionExpired(true);

    useAuthStore.getState().setTokens("a", "r");

    expect(useAuthStore.getState().sessionExpired).toBe(false);
  });
});
