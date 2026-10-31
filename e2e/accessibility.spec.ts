import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { pages } from "./routes";

// Check the settled page: mid-animation (e.g. the home hero fading in) axe
// measures contrast at partial opacity. Also covers the reduced-motion styles.
test.use({ reducedMotion: "reduce" });

for (const path of pages) {
  test(`${path} has no serious accessibility violations`, async ({ page }) => {
    await page.goto(path);
    const { violations } = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
    const serious = violations
      .filter((v) => v.impact === "serious" || v.impact === "critical")
      .map((v) => `${v.id}: ${v.help} (${v.nodes.map((n) => n.target.join(" ")).slice(0, 3).join(", ")})`);
    expect(serious).toEqual([]);
  });
}
