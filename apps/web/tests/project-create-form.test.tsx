import { render, screen } from "@testing-library/react";

import { ProjectCreateForm } from "../components/project-create-form";

describe("ProjectCreateForm", () => {
  it("renders required project fields", () => {
    render(<ProjectCreateForm />);
    expect(screen.getByLabelText("企业名称")).toBeInTheDocument();
    expect(screen.getByLabelText("所属行业")).toBeInTheDocument();
    expect(screen.getByLabelText("所在地区")).toBeInTheDocument();
  });
});
