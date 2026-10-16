import { beforeEach, describe, expect, it } from "vitest";
import { consumeOAuthState, rememberOAuthState } from "./oauth-state";

describe("oauth-state", () => {
  beforeEach(() => sessionStorage.clear());

  it("başlatılan girişteki state ile eşleşen dönüşü kabul eder ve tek kullanımlıktır", () => {
    rememberOAuthState("https://github.com/login/oauth/authorize?client_id=x&state=abc123");
    expect(consumeOAuthState("abc123")).toBe(true);
    expect(consumeOAuthState("abc123")).toBe(false);
  });

  it("farklı veya eksik state'i reddeder", () => {
    rememberOAuthState("https://github.com/login/oauth/authorize?state=abc123");
    expect(consumeOAuthState("evil")).toBe(false);
    rememberOAuthState("https://github.com/login/oauth/authorize?state=abc123");
    expect(consumeOAuthState(null)).toBe(false);
  });

  it("bu tarayıcıda giriş başlatılmadıysa reddeder", () => {
    expect(consumeOAuthState("abc123")).toBe(false);
  });
});
