import { render, screen } from "@testing-library/react";

import HomePage from "../app/page";

describe("HomePage", () => {
  it("renders a clean environmental login-style entry with project workflow", () => {
    render(<HomePage />);

    expect(screen.getByText("环境应急预案智能编制")).toBeInTheDocument();
    expect(screen.getByText("环保风险治理工作台")).toBeInTheDocument();
    expect(screen.getByText("上传历史预案")).toBeInTheDocument();
    expect(screen.getByText("提取风险信息")).toBeInTheDocument();
    expect(screen.getByText("生成预案报告")).toBeInTheDocument();
    expect(screen.queryByText("山水场景")).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "开始创建项目" })).toHaveAttribute(
      "href",
      "/projects/new"
    );
  });
});
