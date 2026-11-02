import { expect, test } from "@playwright/test";

test("product images open in a viewer, not a new tab", async ({ page, context }) => {
  await page.goto("/portfolio/wheelset/");
  await page.getByRole("link", { name: "Wheelset 1" }).click();

  const viewer = page.getByRole("dialog", { name: "Image viewer" });
  await expect(viewer).toBeVisible();
  await expect(viewer.getByRole("img", { name: "Wheelset 1" })).toBeVisible();
  await expect(viewer).toContainText("1 / 4");
  expect(context.pages()).toHaveLength(1);
  await expect(page).toHaveURL(/\/portfolio\/wheelset\/$/);

  await viewer.getByRole("button", { name: "Next image" }).click();
  await expect(viewer).toContainText("Wheelset 2");
  await page.keyboard.press("ArrowRight");
  await expect(viewer).toContainText("3 / 4");

  await page.keyboard.press("Escape");
  await expect(viewer).toBeHidden();
});

test("the viewer steps through every image on the page and wraps around", async ({ page }) => {
  await page.goto("/portfolio/electrical-electronics/");
  await page.getByRole("link", { name: "Power Diode 1" }).click();

  const viewer = page.getByRole("dialog", { name: "Image viewer" });
  await expect(viewer).toContainText("1 / 10");
  await viewer.getByRole("button", { name: "Previous image" }).click();
  await expect(viewer).toContainText("Heating, Ventilating and Air Conditioning (HVAC) 2");
  await expect(viewer).toContainText("10 / 10");
  await viewer.getByRole("button", { name: "Next image" }).click();
  await expect(viewer).toContainText("Power Diode 1");

  await viewer.getByRole("button", { name: "Close" }).click();
  await expect(viewer).toBeHidden();
});

test("swiping changes the image and a click beside it closes the viewer", async ({ page }) => {
  await page.goto("/portfolio/wheelset/");
  await page.getByRole("link", { name: "Wheelset 1" }).click();
  const viewer = page.getByRole("dialog", { name: "Image viewer" });
  const image = viewer.getByRole("img");
  await expect(image).toBeVisible();

  const box = (await image.boundingBox())!;
  await page.mouse.move(box.x + box.width * 0.8, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * 0.2, box.y + box.height / 2, { steps: 5 });
  await page.mouse.up();
  await expect(viewer).toContainText("2 / 4");

  // The first click after a swipe must still close it.
  await page.mouse.click(4, (page.viewportSize()?.height ?? 800) / 2);
  await expect(viewer).toBeHidden();
});
