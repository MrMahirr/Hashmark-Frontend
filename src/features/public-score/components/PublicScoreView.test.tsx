import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createTranslator } from "@/shared/i18n";
import { axeViolations } from "@/test/helpers";
import { fetchPublicScore, type PublicScore } from "../api/public-score";
import { PublicScoreView } from "./PublicScoreView";

vi.mock("next/link", () => ({
  default: ({ href, children, ...rest }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

const DATA: PublicScore = {
  repoName: "octo/app",
  privateRepo: false,
  lastScannedAt: "2026-10-20T10:00:00",
  grade: "B",
  score: 76,
  openDebts: 14,
  staleCount: 5,
  rotScore: 42,
  averageAgeDays: 130,
  labels: { TODO: 9, FIXME: 5, HACK: 0, XXX: 0 },
  ageBuckets: [
    { key: "0-30", minDays: 0, maxDays: 30, count: 6 },
    { key: "90-180", minDays: 90, maxDays: 180, count: 5 },
  ],
  trend: [
    { weekStart: "2026-09-28", total: 18 },
    { weekStart: "2026-10-05", total: 16 },
    { weekStart: "2026-10-12", total: 14 },
  ],
};

describe("PublicScoreView", () => {
  const t = createTranslator("tr");

  it("not, sayılar, dağılımlar ve trendi gösterir; içerik/sır alanı yok", async () => {
    const { container } = render(<PublicScoreView data={DATA} t={t} locale="tr" />);

    expect(screen.getByRole("heading", { level: 1, name: "octo/app" })).toBeInTheDocument();
    expect(screen.getByLabelText("Not B")).toHaveTextContent("B");
    expect(screen.getByText("76/100")).toBeInTheDocument();
    expect(screen.getByText("Açık borç").parentElement).toHaveTextContent("14");
    expect(screen.getByText("FIXME")).toBeInTheDocument();
    expect(screen.queryByText("HACK")).not.toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Son 8 haftada açık borç sayısı" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Ücretsiz başla" })).toHaveAttribute("href", "/auth/login");
    expect(container.textContent).not.toMatch(/sır|secret/i);
    expect(await axeViolations(container)).toEqual([]);
  });

  it("taranmamış depoda yalnızca bilgi ve çağrı", () => {
    render(<PublicScoreView data={{ ...DATA, grade: null, lastScannedAt: null }} t={t} locale="tr" />);

    expect(screen.getByText("Bu depo henüz taranmadı.")).toBeInTheDocument();
    expect(screen.queryByText("76/100")).not.toBeInTheDocument();
  });
});

describe("fetchPublicScore", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("bozuk anahtarı API'ye göndermez; 404 ve ağ hatasını ayırır", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    expect(await fetchPublicScore("../../etc")).toEqual({ status: "not-found" });
    expect(fetchMock).not.toHaveBeenCalled();

    const token = "a".repeat(43);
    fetchMock.mockResolvedValueOnce(new Response(null, { status: 404 }));
    expect(await fetchPublicScore(token)).toEqual({ status: "not-found" });
    fetchMock.mockRejectedValueOnce(new Error("offline"));
    expect(await fetchPublicScore(token)).toEqual({ status: "error" });
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify(DATA), { status: 200 }));
    expect(await fetchPublicScore(token)).toEqual({ status: "ok", data: DATA });
    expect(fetchMock.mock.calls[2][0]).toMatch(new RegExp(`/public/score/${token}$`));
  });
});
