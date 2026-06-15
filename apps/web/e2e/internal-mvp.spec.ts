import { expect, test } from "@playwright/test";

test("operator can reach the project creation page", async ({ page }) => {
  await page.goto("http://127.0.0.1:3000");
  await page.getByRole("link", { name: "创建项目" }).click();
  await expect(page.getByLabel("企业名称")).toBeVisible();
});
