import { beforeEach, describe, expect, it, vi } from "vitest";

const client = vi.hoisted(() => ({ get: vi.fn(), patch: vi.fn() }));
vi.mock("@/shared/api/client", () => ({ apiClient: client }));

import { buildDebtParams, exportDebts, getDebtContext, getDebts, triageDebt } from "./debts.api";

describe("buildDebtParams", () => {
  it("boş, null ve undefined değerleri atar; 0 sayfayı korur", () => {
    expect(
      buildDebtParams({ repoId: "", label: "TODO", q: undefined, status: "open", page: 0, size: 20 })
    ).toEqual({ label: "TODO", status: "open", page: 0, size: 20 });
  });

  it("filtre yoksa boş nesne döner", () => {
    expect(buildDebtParams()).toEqual({});
  });
});

describe("debts.api", () => {
  beforeEach(() => {
    client.get.mockReset();
    client.patch.mockReset();
  });

  it("getDebts yalnızca anlamlı parametreleri gönderir", async () => {
    client.get.mockResolvedValue({ data: { content: [] } });

    await getDebts({ q: "cache", repoId: "", page: 2 });

    expect(client.get).toHaveBeenCalledWith("/debts", { params: { q: "cache", page: 2 } });
  });

  it("triageDebt PATCH ile gövdeyi gönderir", async () => {
    client.patch.mockResolvedValue({ data: { id: 5 } });

    await triageDebt("5", { status: "IGNORED", assignee: "" });

    expect(client.patch).toHaveBeenCalledWith("/debts/5", { status: "IGNORED", assignee: "" });
  });

  it("getDebtContext yarıçapı iletir", async () => {
    client.get.mockResolvedValue({ data: { lines: [] } });

    await getDebtContext("9", 8);

    expect(client.get).toHaveBeenCalledWith("/debts/9/context", { params: { radius: 8 } });
  });

  it("exportDebts sayfalamayı atar, formatı ekler ve dosya adını başlıktan okur", async () => {
    const blob = new Blob(["a,b"]);
    client.get.mockResolvedValue({
      data: blob,
      headers: { "content-disposition": 'attachment; filename="hashmark-debts.sarif"' },
    });

    const file = await exportDebts({ status: "open", q: "x", page: 3, size: 100 }, "sarif");

    expect(client.get).toHaveBeenCalledWith("/debts/export", {
      params: { status: "open", q: "x", format: "sarif" },
      responseType: "blob",
    });
    expect(file.filename).toBe("hashmark-debts.sarif");
    expect(file.blob).toBe(blob);
  });

  it("başlık yoksa varsayılan dosya adını üretir", async () => {
    client.get.mockResolvedValue({ data: new Blob([]), headers: {} });

    const file = await exportDebts({}, "csv");

    expect(file.filename).toBe("hashmark-debts.csv");
  });
});
