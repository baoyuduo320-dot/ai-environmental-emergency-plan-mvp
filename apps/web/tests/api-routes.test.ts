import { describe, expect, it, vi } from "vitest";

import { POST as uploadFiles } from "../app/api/projects/[projectId]/files/route";
import { POST as generateReport } from "../app/api/projects/[projectId]/generate/route";

describe("project API route fallbacks", () => {
  it("returns extracted text when the worker file extraction service is unavailable", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("worker down")));
    const formData = new FormData();
    const file = new File(
      ["企业名称：离线测试公司\n所属行业：精细化工"],
      "old-plan.docx",
      {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      }
    );
    Object.defineProperty(file, "text", {
      value: async () => "企业名称：离线测试公司\n所属行业：精细化工"
    });
    formData.append("files", file);

    const response = await uploadFiles({
      formData: async () => formData
    } as Request, {
      params: Promise.resolve({ projectId: "demo-project-001" })
    });

    expect(response.ok).toBe(true);
    const payload = await response.json();
    expect(payload.extracted_text).toContain("企业名称：离线测试公司");
    expect(payload.files[0].filename).toBe("old-plan.docx");
  });

  it("returns a report payload when the worker generation service is unavailable", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("worker down")));

    const response = await generateReport(new Request("http://local", {
      method: "POST",
      body: JSON.stringify({
        project_id: "demo-project-001",
        source_text: "企业名称：离线测试公司\n所属行业：精细化工\n风险级别：一般"
      })
    }), {
      params: Promise.resolve({ projectId: "demo-project-001" })
    });

    expect(response.ok).toBe(true);
    const payload = await response.json();
    expect(payload.facts.company_name).toBe("离线测试公司");
    expect(payload.preface_payload.filing_form).toContain("离线测试公司");
    expect(payload.export_payload.full_preview).toContain("突发环境事件应急预案");
  });
});
