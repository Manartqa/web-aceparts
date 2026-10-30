import { expect, test } from "@playwright/test";

// These tests never send real email: they stop at validation, or trip the
// honeypot, which the server drops before sending. Submits happen within a
// second of loading, which also covers "fast submits still get validated".

test.beforeEach(async ({ page }) => {
  await page.goto("/contact-us/");
});

test("empty submit shows an error on each required field", async ({ page }) => {
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(page.getByRole("status")).toHaveText("Please check the highlighted fields.");
  await expect(page.getByText("Please enter your name.")).toBeVisible();
  await expect(page.getByText("Please enter your email.")).toBeVisible();
  await expect(page.getByText("Please enter a subject.")).toBeVisible();
  await expect(page.getByLabel("Your name")).toHaveAttribute("aria-invalid", "true");
});

test("invalid email is rejected and typed values are kept", async ({ page }) => {
  await page.getByLabel("Your name").fill("Test Visitor");
  await page.getByLabel("Your email").fill("not-an-email");
  await page.getByLabel("Subject").fill("Validation");
  await page.getByRole("button", { name: "Send message" }).click();

  await expect(page.getByText("Please enter a valid email address.")).toBeVisible();
  await expect(page.getByLabel("Your name")).toHaveValue("Test Visitor");
  await expect(page.getByLabel("Subject")).toHaveValue("Validation");
});

test("honeypot submissions look successful but are dropped", async ({ page }) => {
  await page.getByLabel("Your name").fill("Bot");
  await page.getByLabel("Your email").fill("bot@example.com");
  await page.getByLabel("Subject").fill("Spam");
  await page.locator('input[name="website"]').evaluate((el: HTMLInputElement) => {
    el.value = "http://spam.example";
  });
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(page.getByRole("status")).toContainText("Thank you");
});
