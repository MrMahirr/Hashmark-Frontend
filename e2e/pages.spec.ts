import { expect, test } from "@playwright/test";
import { runAxe } from "./a11y";
import { mockApi, signIn, signOut } from "./mock-api";

const PUBLIC_PAGES = [
  { name: "landing", path: "/" },
  { name: "login", path: "/auth/login" },
];
const APP_PAGES = [
  { name: "dashboard", path: "/dashboard" },
  { name: "repos", path: "/dashboard/repos" },
  { name: "repo-detail", path: "/dashboard/repos/1" },
  { name: "debts", path: "/dashboard/debts" },
  { name: "settings", path: "/dashboard/settings" },
  { name: "profile", path: "/dashboard/profile" },
];
const THEMES = ["dark", "light"] as const;

async function settle(page: import("@playwright/test").Page) {
  await page.waitForLoadState("networkidle");
  await page.evaluate(() => document.fonts.ready);
}

for (const theme of THEMES) {
  for (const target of PUBLIC_PAGES) {
    test(`${target.name} · ${theme}: yerleşim, yazı tipleri, erişilebilirlik`, async ({ page, context }, info) => {
      await signOut(context, { theme });
      await page.goto(target.path);
      await settle(page);

      // Tema, sunucu tarafından <html data-theme> ile uygulanır
      await expect(page.locator("html")).toHaveAttribute("data-theme", theme);

      // Yatay taşma yok (özellikle 390 px)
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow, "yatay kaydırma").toBeLessThanOrEqual(1);

      // Başlık Instrument Serif ile çiziliyor
      const family = await page.locator("h1").first().evaluate((el) => getComputedStyle(el).fontFamily);
      expect(family).toMatch(/Instrument Serif/i);

      await page.screenshot({
        path: `e2e/screenshots/${target.name}-${theme}-${info.project.name}.png`,
        fullPage: true,
      });

      const issues = await runAxe(page);
      expect(issues, JSON.stringify(issues, null, 2)).toEqual([]);
    });
  }
}

for (const theme of THEMES) {
  for (const target of APP_PAGES) {
    test(`${target.name} · ${theme}: yerleşim, yazı tipleri, erişilebilirlik`, async ({ page, context }, info) => {
      await signIn(context, { theme });
      await mockApi(context);
      await page.goto(target.path);
      await settle(page);

      await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
      await expect(page.locator("h1").first()).toBeVisible();

      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow, "yatay kaydırma").toBeLessThanOrEqual(1);

      const family = await page.locator("h1").first().evaluate((el) => getComputedStyle(el).fontFamily);
      expect(family).toMatch(/Instrument Serif/i);

      await page.screenshot({
        path: `e2e/screenshots/${target.name}-${theme}-${info.project.name}.png`,
        fullPage: true,
      });

      const issues = await runAxe(page);
      expect(issues, JSON.stringify(issues, null, 2)).toEqual([]);
    });
  }
}
