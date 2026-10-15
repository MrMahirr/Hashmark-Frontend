import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, type RenderOptions } from "@testing-library/react";
import type { ReactElement, ReactNode } from "react";

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 }, mutations: { retry: false } },
  });
}

/** QueryClientProvider ile sarılmış render (I18n varsayılan tr bağlamıyla çalışır). */
export function renderWithQuery(ui: ReactElement, options?: Omit<RenderOptions, "wrapper">) {
  const client = createQueryClient();
  function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
  }
  return { client, ...render(ui, { wrapper: Wrapper, ...options }) };
}

/** Bir DOM alt ağacında axe-core çalıştırıp ihlalleri okunur biçimde döner. */
export async function axeViolations(container: Element): Promise<string[]> {
  const axe = (await import("axe-core")).default;
  const results = await axe.run(container, {
    // jsdom'da yerleşim/renk hesaplanamadığı için kontrast kuralı devre dışı
    rules: { "color-contrast": { enabled: false }, region: { enabled: false } },
  });
  return results.violations.map((v) => `${v.id}: ${v.help} (${v.nodes.map((n) => n.target.join(" ")).join(", ")})`);
}
