import { describe, expect, it } from "vitest";
import { createTranslator } from "@/shared/i18n";
import { DebtStatus, DebtType, type Debt } from "@/shared/types/debt.types";
import { buildIssueUrl } from "./issue-url";

const t = createTranslator("tr");

function debt(overrides: Partial<Debt> = {}): Debt {
  return {
    id: "1",
    type: DebtType.TODO,
    message: "refactor   this\nmethod",
    filePath: "src/A.java",
    lineNumber: 12,
    repoId: "5",
    repoName: "octo/hello",
    status: DebtStatus.ACTIVE,
    createdAt: "2026-01-01T00:00:00Z",
    resolvedAt: null,
    triageStatus: "OPEN",
    permalink: "https://github.com/octo/hello/blob/abc/src/A.java#L12",
    commitSha: "abc",
    assignee: null,
    priority: null,
    dueDate: null,
    issueRef: null,
    authorLogin: null,
    authorName: null,
    introducedAt: null,
    ...overrides,
  };
}

describe("buildIssueUrl", () => {
  it("başlık ve gövde önceden doldurulmuş yeni issue bağlantısı üretir", () => {
    const url = new URL(buildIssueUrl(debt(), t) as string);

    expect(url.origin + url.pathname).toBe("https://github.com/octo/hello/issues/new");
    expect(url.searchParams.get("title")).toBe("[TODO] refactor this method");
    expect(url.searchParams.get("body")).toContain("https://github.com/octo/hello/blob/abc/src/A.java#L12");
  });

  it("permalink yoksa varsayılan dal bağlantısına düşer", () => {
    const url = new URL(buildIssueUrl(debt({ permalink: null }), t) as string);

    expect(url.searchParams.get("body")).toContain("/blob/HEAD/src/A.java#L12");
  });

  it("başlığı kısaltır", () => {
    const url = new URL(buildIssueUrl(debt({ message: "x".repeat(500) }), t) as string);

    expect((url.searchParams.get("title") ?? "").length).toBeLessThanOrEqual(120);
  });

  it("yalnızca geçerli kullanıcı adlarını atanan olarak ekler", () => {
    expect(new URL(buildIssueUrl(debt({ assignee: "mahir-r" }), t) as string).searchParams.get("assignees")).toBe(
      "mahir-r"
    );
    expect(
      new URL(buildIssueUrl(debt({ assignee: "kötü kişi&x=1" }), t) as string).searchParams.get("assignees")
    ).toBeNull();
  });

  it("depo adı owner/repo biçiminde değilse bağlantı üretmez", () => {
    expect(buildIssueUrl(debt({ repoName: "Repo #5" }), t)).toBeNull();
  });
});
