import { expect, test } from "@playwright/test";
import { mockApi, signIn } from "./mock-api";

test.describe("etkileşimli akışlar", () => {
  test.beforeEach(async ({ context }) => {
    await signIn(context, { theme: "dark" });
  });

  test("bildirim çekmecesi: açılır, Okunmamış sekmesi süzer, Esc kapatır", async ({ page, context }) => {
    await mockApi(context);
    await page.goto("/dashboard");

    await page.getByRole("button", { name: /okunmamış bildirim/ }).click();
    const drawer = page.getByRole("dialog", { name: "Bildirimler" });
    await expect(drawer).toBeVisible();
    await expect(drawer.getByText("Borç yeniden açıldı")).toBeVisible();

    await drawer.getByRole("button", { name: /^Okunmamış/ }).click();
    await expect(drawer.getByText("Borç yeniden açıldı")).toHaveCount(0);
    await expect(drawer.getByText("Tarama tamamlandı")).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(drawer).toBeHidden();
  });

  test("depo ekle: adaylar listelenir, Ekle izlemeye alır", async ({ page, context }) => {
    const calls = await mockApi(context);
    await page.goto("/dashboard/repos");

    await page.getByRole("button", { name: "Depo Ekle" }).first().click();
    const dialog = page.getByRole("dialog", { name: "Depo Ekle" });
    await expect(dialog.getByText("yunus/blog")).toBeVisible();

    await dialog.getByPlaceholder("sahip/depo ara…").fill("dot");
    await expect(dialog.getByText("yunus/blog")).toHaveCount(0);

    await dialog.getByRole("button", { name: "Ekle: yunus/dotfiles" }).click();
    await expect.poll(() => calls.post.some((c) => c.url === "/repos/22/track")).toBe(true);
  });

  test("depo kaldırma onay ister ve DELETE gönderir", async ({ page, context }) => {
    const calls = await mockApi(context);
    await page.goto("/dashboard/repos");

    await page.getByRole("button", { name: "Kaldır" }).first().click();
    const dialog = page.getByRole("alertdialog");
    await expect(dialog).toBeVisible();
    expect(calls.delete).toHaveLength(0);

    await dialog.getByRole("button", { name: "Kaldır" }).click();
    await expect.poll(() => calls.delete).toContain("/repos/1");
  });

  test("borç ayrıntısı: Çözüldü olarak işaretle RESOLVED gönderir", async ({ page, context }) => {
    const calls = await mockApi(context);
    await page.goto("/dashboard/debts");

    await page.getByRole("button", { name: /Ayrıntıları aç/ }).first().click();
    const dialog = page.getByRole("dialog", { name: "Borç Ayrıntısı" });
    await expect(dialog.locator("pre")).toBeVisible();

    await dialog.getByRole("button", { name: "Çözüldü olarak işaretle" }).click();
    await expect.poll(() => calls.patch.some((c) => (c.body as { status?: string })?.status === "RESOLVED")).toBe(true);
  });

  test("ayarlar: etiket + e-posta ile kaydet doğru yükü gönderir", async ({ page, context }) => {
    const calls = await mockApi(context);
    await page.goto("/dashboard/settings");

    await page.getByRole("group", { name: "Gönderim günü" }).getByRole("button").nth(4).click();
    await page.getByRole("group", { name: "Dahil edilecek etiketler" }).getByRole("button", { name: "NOTE" }).click();
    await page.getByLabel("E-posta adresi").fill("ekip@ornek.com");
    await page.getByRole("button", { name: "Kaydet" }).click();

    await expect.poll(() => calls.put.find((c) => c.url === "/settings")?.body).toMatchObject({
      emailNotify: true,
      notifyDay: "FRIDAY",
      digestEmail: "ekip@ornek.com",
    });
    const body = calls.put.find((c) => c.url === "/settings")?.body as { digestLabels: string[] };
    expect(body.digestLabels).not.toContain("NOTE");
    expect(body.digestLabels).toContain("TODO");
  });

  test("tema düğmesi koyu ↔ açık değiştirir ve çerezi yazar", async ({ page, context }) => {
    await mockApi(context);
    await page.goto("/dashboard");

    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await page.getByRole("button", { name: /^Tema:/ }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    const cookies = await context.cookies();
    expect(cookies.find((c) => c.name === "hm_theme")?.value).toBe("light");
  });

  test("dil değiştirme sayfa metnini günceller", async ({ page, context }) => {
    await mockApi(context);
    await page.goto("/dashboard");

    await page.getByRole("group", { name: "Dil" }).getByRole("button", { name: "EN" }).click();
    await expect(page.getByRole("heading", { level: 1, name: "Overview" })).toBeVisible();
  });

  test("odak halkası klavye ile görünür (3 px)", async ({ page, context }) => {
    await mockApi(context);
    await page.goto("/dashboard");

    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    const outline = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement;
      const style = getComputedStyle(el);
      return { width: style.outlineWidth, style: style.outlineStyle };
    });
    expect(outline.style).toBe("solid");
    expect(outline.width).toBe("3px");
  });
});
