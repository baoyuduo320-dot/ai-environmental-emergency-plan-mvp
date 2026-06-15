import { expect, test } from "@playwright/test";

test("operator can generate plan content from worker-backed flow", async ({
  page
}) => {
  await page.goto("http://127.0.0.1:3000/projects/demo-project-001");
  await expect(page.getByLabel("原始资料文本")).toBeVisible();
  await page.getByRole("button", { name: "开始生成" }).click();
  await expect(page.getByText("待补充信息")).toBeVisible();
  await expect(page.getByText("missing_section:环境风险分析")).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "突发环境事件应急预案" })
  ).toBeVisible();
});
