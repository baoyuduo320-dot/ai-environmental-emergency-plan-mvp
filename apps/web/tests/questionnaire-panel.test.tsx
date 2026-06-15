import { render, screen } from "@testing-library/react";

import { QuestionnairePanel } from "../components/questionnaire-panel";

describe("QuestionnairePanel", () => {
  it("renders missing-field prompts", () => {
    render(
      <QuestionnairePanel
        questions={{
          risk_materials: "请补充风险物质名称、最大储量、存放位置和危险特性。"
        }}
      />
    );
    expect(screen.getByText("risk_materials")).toBeInTheDocument();
    expect(
      screen.getByText("请补充风险物质名称、最大储量、存放位置和危险特性。")
    ).toBeInTheDocument();
  });
});
