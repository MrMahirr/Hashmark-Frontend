import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import RootError from "./error";
import DashboardError from "./dashboard/error";
import GlobalError from "./global-error";
import NotFound from "./not-found";

vi.mock("next/link", () => ({
  default: ({ href, children, ...rest }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

describe("hata sayfaları", () => {
  it("kök hata sınırı: mesaj, hata kodu ve tekrar dene", async () => {
    const retry = vi.fn();
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    const error = Object.assign(new Error("secret internal detail"), { digest: "abc123" });

    render(<RootError error={error} unstable_retry={retry} />);

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("Bir şeyler ters gitti")).toBeInTheDocument();
    expect(screen.getByText(/abc123/)).toBeInTheDocument();
    expect(screen.queryByText(/secret internal detail/)).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Tekrar dene" }));
    expect(retry).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("link", { name: "Ana sayfa" })).toHaveAttribute("href", "/");
  });

  it("panel hata sınırı panele dönüş bağlantısı verir ve hatayı loglar", () => {
    const logger = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const error = new Error("boom");

    render(<DashboardError error={error} unstable_retry={() => undefined} />);

    expect(screen.getByRole("link", { name: "Panele dön" })).toHaveAttribute("href", "/dashboard");
    expect(logger).toHaveBeenCalledWith(error);
  });

  it("global hata sınırı yeniden deneme tetikler", async () => {
    const retry = vi.fn();
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    // <html> bir div içinde render edilemeyeceği için uyarıları sustur
    vi.spyOn(console, "warn").mockImplementation(() => undefined);

    render(<GlobalError error={new Error("fatal")} unstable_retry={retry} />, {
      container: document.documentElement,
    });

    await userEvent.click(screen.getByRole("button", { name: "Tekrar dene" }));
    expect(retry).toHaveBeenCalledTimes(1);
  });

  it("404 sayfası yönlendirme bağlantılarını gösterir", () => {
    render(<NotFound />);

    expect(screen.getByText("Sayfa bulunamadı")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Panele git" })).toHaveAttribute("href", "/dashboard");
  });
});
