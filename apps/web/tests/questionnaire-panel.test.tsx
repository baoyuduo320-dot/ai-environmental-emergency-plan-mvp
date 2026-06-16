import { fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";

import { QuestionnairePanel } from "../components/questionnaire-panel";

describe("QuestionnairePanel", () => {
  it("renders missing-field prompts", () => {
    const onAnswerChange = vi.fn();
    const onRegenerate = vi.fn();
    render(
      <QuestionnairePanel
        questions={{
          risk_materials: "请补充风险物质名称、最大储量、存放位置和危险特性。"
        }}
        answers={{ risk_materials: "乙醇 2 吨，原料库" }}
        onAnswerChange={onAnswerChange}
        onRegenerate={onRegenerate}
        regenerating={false}
      />
    );
    expect(screen.getByText("风险物质")).toBeInTheDocument();
    expect(
      screen.getByText("请补充风险物质名称、最大储量、存放位置和危险特性。")
    ).toBeInTheDocument();
    expect(screen.getByDisplayValue("乙醇 2 吨，原料库")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("风险物质-补充内容"), {
      target: { value: "甲醇 1 吨，危化品库" }
    });
    expect(onAnswerChange).toHaveBeenCalledWith(
      "risk_materials",
      "甲醇 1 吨，危化品库"
    );

    fireEvent.click(screen.getByRole("button", { name: "合并补充内容并重新生成" }));
    expect(onRegenerate).toHaveBeenCalled();
  });
});
