import { expect, test } from "@playwright/test";

test("desktop menu dropdown opens a product page", async ({ page, isMobile }) => {
  test.skip(isMobile, "desktop navigation only");
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "Main" });
  await nav.getByRole("link", { name: "Products" }).hover();
  await nav.getByRole("link", { name: "Wheelset" }).click();
  await expect(page).toHaveURL(/\/portfolio\/wheelset\/$/);
  // Role queries skip the previous page, which Next keeps mounted but hidden.
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Wheelset");
});

test("mobile menu opens and navigates", async ({ page, isMobile }) => {
  test.skip(!isMobile, "mobile navigation only");
  await page.goto("/");
  await page.getByRole("button", { name: "Open menu" }).click();
  const menu = page.getByRole("navigation", { name: "Mobile" });
  await expect(menu).toBeVisible();
  await menu.getByRole("link", { name: "Contact Us" }).click();
  await expect(page).toHaveURL(/\/contact-us\/$/);
  await expect(menu).toBeHidden();
});

test("product pager and breadcrumb link between pages", async ({ page }) => {
  await page.goto("/portfolio/bogie-frames/");
  await page.getByRole("link", { name: /Next product/ }).click();
  await expect(page).toHaveURL(/\/portfolio\/wheelset\/$/);

  await page.getByRole("navigation", { name: "Breadcrumb" }).getByRole("link", { name: "Products" }).click();
  await expect(page).toHaveURL(/\/products\/$/);
});

test("pages have no horizontal scroll", async ({ page }) => {
  for (const path of ["/", "/portfolio/electrical-electronics/", "/contact-us/"]) {
    await page.goto(path);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow, path).toBeLessThanOrEqual(0);
  }
});
