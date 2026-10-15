import { defineConfig, devices } from "@playwright/test";

/**
 * Uçtan uca (görsel + erişilebilirlik) testler. API, `e2e/mock-api.ts` ile tarayıcı düzeyinde taklit edilir;
 * gerçek backend/veritabanı gerekmez.
 *
 *   npm run build && npm run test:e2e   (standalone çıktıyı 3100 portunda başlatır)
 */
const PORT = Number(process.env.E2E_PORT ?? 3100);

export default defineConfig({
  testDir: "./e2e",
  outputDir: "./e2e/.artifacts",
  fullyParallel: true,
  retries: 0,
  reporter: [["list"]],
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    trace: "retain-on-failure",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1360, height: 900 } } },
    { name: "mobile", use: { ...devices["Desktop Chrome"], viewport: { width: 390, height: 844 } } },
  ],
  webServer: {
    command: `node e2e/start-server.mjs`,
    env: { PORT: String(PORT) },
    url: `http://127.0.0.1:${PORT}`,
    reuseExistingServer: true,
    timeout: 120_000,
  },
  timeout: 60_000,
});
