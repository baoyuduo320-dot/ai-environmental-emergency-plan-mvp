import { render, screen } from "@testing-library/react";

import { ProjectCreateForm } from "../components/project-create-form";

describe("ProjectCreateForm", () => {
  it("renders required project fields", () => {
    render(<ProjectCreateForm />);
    expect(screen.getByLabelText("企业名称")).toBeInTheDocument();
    expect(screen.getByLabelText("所属行业")).toBeInTheDocument();
    expect(screen.getByLabelText("所在地区")).toBeInTheDocument();
    expect(screen.getByLabelText("企业规模")).toBeInTheDocument();
    expect(screen.getByLabelText("环境风险等级")).toBeInTheDocument();
    expect(screen.getByLabelText("是否涉及危化品")).toBeInTheDocument();
    expect(screen.getByLabelText("服务模式")).toBeInTheDocument();
    expect(screen.getByText("标准版")).toBeInTheDocument();
    expect(screen.getByText("专业版")).toBeInTheDocument();
    expect(screen.getByText("环保应急预案")).toBeInTheDocument();
    expect(screen.getByText("守住环境风险底线")).toBeInTheDocument();
    expect(screen.getByText("基础信息")).toBeInTheDocument();
    expect(screen.getByText("风险与用途")).toBeInTheDocument();
  });
});
