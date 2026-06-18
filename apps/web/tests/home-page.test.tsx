import { render, screen } from "@testing-library/react";

import HomePage from "../app/page";

describe("HomePage", () => {
  it("renders the confirmed AI environmental assistant landing page", () => {
    render(<HomePage />);

    expect(screen.getAllByText("AI 环保助手").length).toBeGreaterThan(0);
    expect(
      screen.getByRole("heading", { name: /让\s*报告编制\s*更智能/ })
    ).toBeInTheDocument();
    expect(screen.getByText("AI 驱动 · 专业高效")).toBeInTheDocument();
    expect(screen.getByText("15+")).toBeInTheDocument();
    expect(screen.getByText("报告类型覆盖")).toBeInTheDocument();
    expect(screen.getByText("<5 分钟")).toBeInTheDocument();
    expect(screen.getByText("国标合规")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "一站式环保报告生成" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "环境应急预案" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "环评报告" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "验收监测报告" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "三步完成，报告立等可取" })
    ).toBeInTheDocument();
    expect(screen.getByText("突发环境事件应急预案")).toBeInTheDocument();
    expect(screen.getByText("竣工环保验收报告")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "立即生成报告" })).toHaveAttribute(
      "href",
      "/projects/new"
    );
    expect(screen.getByRole("link", { name: "免费开始使用" })).toHaveAttribute(
      "href",
      "/projects/new"
    );
  });
});
