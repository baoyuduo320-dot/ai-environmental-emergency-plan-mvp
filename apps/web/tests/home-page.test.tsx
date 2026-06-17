import { render, screen } from "@testing-library/react";

import HomePage from "../app/page";

describe("HomePage", () => {
  it("renders an immersive environmental hero with project entry", () => {
    render(<HomePage />);

    expect(screen.getByText("环境应急预案 AI 工作台")).toBeInTheDocument();
    expect(screen.getByText("守护企业环境安全")).toBeInTheDocument();
    expect(screen.getByText("山水场景")).toBeInTheDocument();
    expect(screen.getByText("应急资源")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "开始创建项目" })).toHaveAttribute(
      "href",
      "/projects/new"
    );
  });
});
