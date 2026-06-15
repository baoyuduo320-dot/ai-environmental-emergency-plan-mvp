import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";

import { ProjectGenerationWorkflow } from "../components/project-generation-workflow";

describe("ProjectGenerationWorkflow", () => {
  it("renders worker-backed generation result", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        facts: {
          company_name: "苏州示例化工有限公司"
        },
        questions: {
          risk_materials: "请补充风险物质名称、最大储量、存放位置和危险特性。"
        },
        issues: ["missing_section:环境风险分析"],
        export_payload: {
          cover_title: "突发环境事件应急预案",
          body: "总则\n总则内容"
        }
      })
    });

    vi.stubGlobal("fetch", fetchMock);

    render(<ProjectGenerationWorkflow projectId="demo-project-001" />);
    fireEvent.click(screen.getByRole("button", { name: "开始生成" }));

    await waitFor(() =>
      expect(screen.getByText("待补充信息")).toBeInTheDocument()
    );

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/projects/demo-project-001/generate",
      expect.objectContaining({
        method: "POST"
      })
    );
    expect(screen.getByText("missing_section:环境风险分析")).toBeInTheDocument();
    expect(screen.getByText("突发环境事件应急预案")).toBeInTheDocument();
  });
});
