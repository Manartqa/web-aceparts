import { expect, test } from "@playwright/test";
import { pages } from "./routes";

for (const path of pages) {
  test(`${path} renders`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));

    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle(/A\.C\.E\. Parts Co\., Ltd\./);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", new RegExp(`${path}$`));
    expect(errors).toEqual([]);
  });
}

test("unknown page returns 404", async ({ page }) => {
  const response = await page.goto("/no-such-page/");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Page not found");
});

// Dynamic routes stream their shell before notFound() runs, so the status is
// 200; the page must still show the 404 content and tell crawlers not to index it.
test("unknown product slug shows the 404 page with noindex", async ({ page }) => {
  await page.goto("/portfolio/does-not-exist/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Page not found");
  await expect(page.locator('meta[name="robots"]').first()).toHaveAttribute("content", /noindex/);
});

test.describe("old WordPress URLs", () => {
  const redirects: [string, string][] = [
    ["/portfolio-category/products/", "/products/"],
    ["/hello-world/", "/"],
    ["/category/design/", "/"],
    ["/tag/art/", "/"],
    ["/ot_header_builders/header-2-dark/", "/"],
  ];

  for (const [from, to] of redirects) {
    test(`${from} redirects permanently to ${to}`, async ({ request }) => {
      const response = await request.get(from, { maxRedirects: 0 });
      expect(response.status()).toBe(308);
      expect(new URL(response.headers().location, "http://x").pathname).toBe(to);
    });
  }
});

test("sitemap.xml lists every page and robots.txt points to it", async ({ request }) => {
  const sitemap = await (await request.get("/sitemap.xml")).text();
  const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
  expect(locs.sort()).toEqual([...pages].sort());

  const robots = await (await request.get("/robots.txt")).text();
  expect(robots).toContain("Sitemap: ");
  expect(robots).toContain("/sitemap.xml");
});
