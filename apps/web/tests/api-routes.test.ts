import { describe, expect, it, vi } from "vitest";

import { POST as createProject } from "../app/api/projects/route";
import { POST as uploadFiles } from "../app/api/projects/[projectId]/files/route";
import { POST as generateReport } from "../app/api/projects/[projectId]/generate/route";

describe("project API route fallbacks", () => {
  it("creates a unique project id instead of always returning the demo project", async () => {
    const response = await createProject(new Request("http://local", {
      method: "POST",
      body: JSON.stringify({
        companyName: "绿色测试企业有限公司",
        industry: "环保设备制造",
        region: "江苏省苏州市"
      })
    }));

    expect(response.ok).toBe(true);
    const payload = await response.json();
    expect(payload.projectId).toMatch(/^project-/);
    expect(payload.projectId).not.toBe("demo-project-001");
    expect(payload.companyName).toBe("绿色测试企业有限公司");
  });

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

  it("passes an abort signal to worker requests so Render cold starts can be bounded", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        facts: {},
        questions: {},
        issues: [],
        attachments_payload: {
          appendix_catalog: "",
          communication_list: "",
          materials_list: "",
          communication_rows: [],
          materials_rows: []
        },
        preface_payload: {
          filing_form: "",
          release_order: "",
          filing_directory: "",
          compilation_notes: ""
        },
        export_payload: {
          cover_title: "",
          body: "",
          full_preview: ""
        }
      })
    });
    vi.stubGlobal("fetch", fetchMock);

    await generateReport(new Request("http://local", {
      method: "POST",
      body: JSON.stringify({
        project_id: "demo-project-001",
        source_text: "企业名称：冷启动测试公司"
      })
    }), {
      params: Promise.resolve({ projectId: "demo-project-001" })
    });

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/generate"),
      expect.objectContaining({
        signal: expect.any(AbortSignal)
      })
    );
  });
});
