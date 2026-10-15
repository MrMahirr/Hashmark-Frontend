import type { BrowserContext, Route } from "@playwright/test";

const API = "http://localhost:8080";

export interface MockCalls {
  patch: Array<{ url: string; body: unknown }>;
  put: Array<{ url: string; body: unknown }>;
  post: Array<{ url: string; body: unknown }>;
  delete: string[];
}

const NOW = "2026-10-15T10:00:00Z";

const REPO_ONE = {
  id: 1,
  userId: 1,
  githubRepoId: "g1",
  fullName: "yunus/hashmark",
  isPrivate: false,
  lastScannedAt: NOW,
  createdAt: NOW,
  debtCount: 12,
  trackedBranch: null,
  tracked: true,
  debtBreakdown: { TODO: 5, FIXME: 3, HACK: 2, NOTE: 2 },
};

function debt(i: number, overrides: Record<string, unknown> = {}) {
  const labels = ["TODO", "FIXME", "HACK", "XXX", "NOTE", "DOC", "INFO"];
  return {
    id: i,
    repoId: 1,
    repoFullName: "yunus/hashmark",
    filePath: `src/main/java/dev/hashmark/File${i}.java`,
    lineNo: 10 + i,
    label: labels[i % labels.length],
    content: `Örnek not ${i}: bu kısım yeniden düzenlenmeli`,
    detectedAt: NOW,
    resolvedAt: null,
    manuallyResolved: false,
    permalink: `https://github.com/yunus/hashmark/blob/abc/File${i}.java#L${10 + i}`,
    triageStatus: "OPEN",
    assignee: null,
    authorLogin: "yunus",
    ...overrides,
  };
}

/** Tüm uçları taklit eder; yazma çağrılarını `calls` içinde toplar. */
export async function mockApi(context: BrowserContext): Promise<MockCalls> {
  const calls: MockCalls = { patch: [], put: [], post: [], delete: [] };
  const candidates = [
    { id: 21, fullName: "yunus/blog", isPrivate: false, tracked: false },
    { id: 22, fullName: "yunus/dotfiles", isPrivate: true, tracked: false },
  ];
  let settings = { emailNotify: true, notifyDay: "MONDAY", digestLabels: [] as string[], digestEmail: "" };
  const debts = Array.from({ length: 8 }, (_, i) => debt(i + 1));

  await context.route(`${API}/**`, async (route: Route) => {
    const request = route.request();
    const url = new URL(request.url());
    const path = url.pathname.replace(/^\/v1/, "");
    const method = request.method();
    const body = request.postData() ? JSON.parse(request.postData() as string) : undefined;
    const json = (data: unknown, status = 200) =>
      route.fulfill({
        status,
        contentType: "application/json",
        headers: { "access-control-allow-origin": "*", "access-control-allow-headers": "*", "access-control-allow-methods": "*" },
        body: JSON.stringify(data),
      });

    if (method === "OPTIONS") return json({});
    if (method === "PATCH") calls.patch.push({ url: path, body });
    if (method === "PUT") calls.put.push({ url: path, body });
    if (method === "POST") calls.post.push({ url: path, body });
    if (method === "DELETE") calls.delete.push(path);

    if (path === "/user/me")
      return json({ name: "Yunus Emre Mahir", email: "yunus@example.com", githubLogin: "yunus", avatarUrl: null, githubConnected: true, createdAt: NOW });
    if (path === "/repos" && method === "GET") return json([REPO_ONE]);
    if (path === "/repos/candidates") return json(candidates);
    if (path === "/repos/sync") return json({});
    if (/^\/repos\/\d+\/track$/.test(path)) {
      const id = Number(path.split("/")[2]);
      const found = candidates.find((c) => c.id === id);
      if (found) candidates.splice(candidates.indexOf(found), 1);
      return json({ ...REPO_ONE, id, fullName: found?.fullName ?? "x/y", debtCount: 0, debtBreakdown: {} });
    }
    if (/^\/repos\/\d+$/.test(path)) return json(REPO_ONE);
    if (path === "/report/summary")
      return json({
        trendData: [
          { weekStart: "2026-09-21", totalDebts: 9, newDebts: 3, resolvedDebts: 1 },
          { weekStart: "2026-09-28", totalDebts: 11, newDebts: 4, resolvedDebts: 2 },
          { weekStart: "2026-10-05", totalDebts: 12, newDebts: 2, resolvedDebts: 1 },
        ],
        labelStats: { todoCount: 5, fixmeCount: 3, hackCount: 2, xxxCount: 0, noteCount: 2, docCount: 0, infoCount: 0 },
        topModules: [{ modulePath: "src/main", debtCount: 9 }, { modulePath: "src/test", debtCount: 3 }],
      });
    if (path === "/debts/stats") return json({ total: 12, addedThisWeek: 2, resolvedThisWeek: 1 });
    if (/^\/debts\/\d+\/context$/.test(path))
      return json({ filePath: "src/A.java", commitSha: "abc", startLine: 8, highlightLine: 10, totalLines: 40, tooLarge: false,
        lines: ["class A {", "  void run() {", "    // TODO: bunu düzelt", "    work();", "  }"] });
    if (/^\/debts\/\d+$/.test(path) && method === "PATCH") {
      const id = Number(path.split("/")[2]);
      const target = debts.find((d) => d.id === id) ?? debts[0];
      const status = (body as { status?: string }).status;
      if (status === "RESOLVED") Object.assign(target, { resolvedAt: NOW, manuallyResolved: true });
      if (status === "OPEN") Object.assign(target, { resolvedAt: null, manuallyResolved: false });
      return json(target);
    }
    if (path === "/debts")
      return json({ content: debts, page: 0, size: 20, totalElements: debts.length, totalPages: 1 });
    if (path === "/notifications" && method === "GET")
      return json([
        { id: 1, title: "Tarama tamamlandı", description: "yunus/hashmark: 12 açık, +2 yeni", type: "SUCCESS", read: false, createdAt: NOW },
        { id: 2, title: "Borç yeniden açıldı", description: "1 kayıt kodda hâlâ duruyor", type: "WARNING", read: true, createdAt: NOW },
      ]);
    if (path.startsWith("/notifications")) return json({});
    if (path === "/settings" && method === "GET") return json(settings);
    if (path === "/settings" && method === "PUT") {
      settings = { ...settings, ...(body as object) } as typeof settings;
      return json(settings);
    }
    if (path === "/report/send-test") return json({ configured: false, sent: false });
    if (/^\/scan\/\d+\/status$/.test(path))
      return json({ id: 1, repoId: 1, status: "DONE", branch: null, commitSha: "abc", attempts: 1, startedAt: NOW, finishedAt: NOW,
        debtFound: 12, filesScanned: 240, filesSkipped: 0, filesFailed: 0, message: null, createdAt: NOW });
    if (/^\/scan\/\d+$/.test(path)) return json({ repoId: 1, jobId: 1, status: "PENDING" });
    return json({}, 404);
  });

  return calls;
}

/** Oturum çerezi + (isteğe bağlı) tema ve dil çerezleri ile giriş yapmış kullanıcı. */
export async function signIn(
  context: BrowserContext,
  options: { theme?: "dark" | "light"; locale?: "tr" | "en" } = {},
) {
  const url = "http://127.0.0.1:" + (process.env.E2E_PORT ?? 3100);
  await context.addCookies([
    { name: "hm_session", value: "1", url },
    { name: "hm_theme", value: options.theme ?? "dark", url },
    { name: "hm_lang", value: options.locale ?? "tr", url },
  ]);
  await context.addInitScript(() => {
    localStorage.setItem("accessToken", "test-access");
    localStorage.setItem("refreshToken", "test-refresh");
  });
}

export async function signOut(context: BrowserContext, options: { theme?: "dark" | "light"; locale?: "tr" | "en" } = {}) {
  const url = "http://127.0.0.1:" + (process.env.E2E_PORT ?? 3100);
  await context.addCookies([
    { name: "hm_theme", value: options.theme ?? "dark", url },
    { name: "hm_lang", value: options.locale ?? "tr", url },
  ]);
}
