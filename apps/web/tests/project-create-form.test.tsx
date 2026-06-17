import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";

import { ProjectCreateForm } from "../components/project-create-form";

const pushMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock
  })
}));

describe("ProjectCreateForm", () => {
  beforeEach(() => {
    pushMock.mockReset();
    vi.restoreAllMocks();
  });

  it("renders required project fields", () => {
    render(<ProjectCreateForm />);
    expect(screen.getByLabelText("企业名称")).toBeInTheDocument();
    expect(screen.getByLabelText("所属行业")).toBeInTheDocument();
    expect(screen.getByLabelText("所在地区")).toBeInTheDocument();
    expect(screen.getByLabelText("企业规模")).toBeInTheDocument();
    expect(screen.getByLabelText("环境风险等级")).toBeInTheDocument();
    expect(screen.getByLabelText("是否涉及危化品")).toBeInTheDocument();
    expect(screen.queryByLabelText("服务模式")).not.toBeInTheDocument();
    expect(screen.queryByText("标准版")).not.toBeInTheDocument();
    expect(screen.queryByText("专业版")).not.toBeInTheDocument();
    expect(screen.queryByText("套餐预留")).not.toBeInTheDocument();
    expect(screen.getByText("环境应急预案智能编制")).toBeInTheDocument();
    expect(screen.getByText("持续学习企业风险特征")).toBeInTheDocument();
    expect(screen.getAllByText("形成项目知识库").length).toBeGreaterThan(0);
    expect(screen.getByText("基础信息")).toBeInTheDocument();
    expect(screen.getByText("风险与用途")).toBeInTheDocument();
  });

  it("creates project and navigates to upload workflow", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ projectId: "demo-project-001" })
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<ProjectCreateForm />);
    fireEvent.change(screen.getByLabelText("企业名称"), {
      target: { value: "苏州示例化工有限公司" }
    });
    fireEvent.change(screen.getByLabelText("所属行业"), {
      target: { value: "精细化工" }
    });
    fireEvent.change(screen.getByLabelText("所在地区"), {
      target: { value: "苏州市工业园区" }
    });

    fireEvent.click(screen.getByRole("button", { name: "创建项目" }));

    await waitFor(() =>
      expect(fetchMock).toHaveBeenCalledWith(
        "/api/projects",
        expect.objectContaining({
          method: "POST",
          body: expect.stringContaining("苏州示例化工有限公司")
        })
      )
    );
    expect(pushMock).toHaveBeenCalledWith(
      expect.stringContaining("/projects/demo-project-001?companyName=")
    );
    expect(decodeURIComponent(pushMock.mock.calls[0][0])).toContain(
      "companyName=苏州示例化工有限公司"
    );
    expect(decodeURIComponent(pushMock.mock.calls[0][0])).toContain(
      "industry=精细化工"
    );
  });
});
