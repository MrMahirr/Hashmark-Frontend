import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import { SESSION_COOKIE } from "@/shared/auth/session";
import { config, proxy } from "./proxy";

function request(path: string, cookie?: string): NextRequest {
  return new NextRequest(`http://localhost:3000${path}`, {
    headers: cookie ? { cookie } : undefined,
  });
}

describe("proxy (dashboard guard)", () => {
  it("oturum çerezi yoksa login'e yönlendirir", () => {
    const response = proxy(request("/dashboard/debts?x=1"));

    expect(response.status).toBe(307);
    const location = new URL(response.headers.get("location") ?? "");
    expect(location.pathname).toBe("/auth/login");
    expect(location.search).toBe("");
  });

  it("oturum çerezi varsa isteği geçirir", () => {
    const response = proxy(request("/dashboard", `${SESSION_COOKIE}=1`));

    expect(response.headers.get("location")).toBeNull();
    expect(response.headers.get("x-middleware-next")).toBe("1");
  });

  it("yalnızca /dashboard altında ve /consent'te çalışır", () => {
    expect(config.matcher).toEqual(["/dashboard/:path*", "/consent"]);
  });
});
