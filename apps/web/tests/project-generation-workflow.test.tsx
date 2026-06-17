import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";

import { ProjectGenerationWorkflow } from "../components/project-generation-workflow";

describe("ProjectGenerationWorkflow", () => {
  it("uploads files, confirms extraction, supports补问回填、附件表格 and word export", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          extracted_text: "企业名称：上传测试公司\n所属行业：精细化工",
          warnings: [],
          files: [
            {
              filename: "sample.docx",
              text: "企业名称：上传测试公司\n所属行业：精细化工",
              warnings: []
            }
          ]
        })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          facts: {
            company_name: "上传测试公司",
            plan_issue_date: "2026年6月15日"
          },
          questions: {
            risk_materials: "请补充风险物质名称、最大储量、存放位置和危险特性。"
          },
          issues: [],
          attachments_payload: {
            appendix_catalog: "1. 应急通讯录\n2. 应急物资与装备清单",
            communication_list: "应急通讯录\n单位联系人：李四",
            materials_list: "应急物资与装备清单\n主要资源：吸附材料",
            communication_rows: [
              { role: "单位联系人", name: "李四", phone: "13800000000" }
            ],
            materials_rows: [
              {
                item: "吸附材料",
                quantity: "待核实",
                location: "现场物资点",
                owner: "项目负责人",
                notes: "主要资源"
              }
            ]
          },
          preface_payload: {
            filing_form:
              "企业事业单位突发环境事件应急预案备案表\n单位名称：上传测试公司\n机构代码：91320500MA12345678\n法定代表人：张三\n联系人：李四\n联系人电话：13800000000",
            release_order:
              "公司各部门：\n本公司依据《企业事业单位突发环境事件应急预案备案管理办法（试行）》等要求。\n我批准，《上传测试公司突发环境事件应急预案》自2026年6月15日生效实施。\n签署人：张三",
            filing_directory:
              "1. 突发环境事件应急预案备案表\n2. 环境应急预案及编制说明",
            compilation_notes:
              "编制说明\n一、编制概述\n现阶段已完成基础资料梳理、文本框架搭建和主要内容编写，形成了可供进一步论证完善的阶段性成果。"
          },
          export_payload: {
            cover_title: "突发环境事件应急预案",
            body: "总则\n总则内容\n\n培训与演练\n培训与演练内容",
            full_preview:
              "封面\n\n突发环境事件应急预案\n\n上传测试公司\n\n企业事业单位突发环境事件应急预案备案表\n单位名称：上传测试公司\n\n1. 突发环境事件应急预案备案表\n2. 环境应急预案及编制说明\n\n公司各部门：\n本公司依据《企业事业单位突发环境事件应急预案备案管理办法（试行）》等要求。\n\n编制说明\n一、编制概述\n现阶段已完成基础资料梳理、文本框架搭建和主要内容编写，形成了可供进一步论证完善的阶段性成果。\n\n正文目录\n\n1. 总则\n2. 培训与演练\n\n1. 总则\n总则内容"
          }
        })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          facts: {
            company_name: "上传测试公司",
            plan_issue_date: "2026年6月15日",
            risk_materials: "甲醇 1 吨，危化品库"
          },
          questions: {},
          issues: [],
          attachments_payload: {
            appendix_catalog: "1. 应急通讯录\n2. 应急物资与装备清单",
            communication_list: "应急通讯录\n单位联系人：李四",
            materials_list: "应急物资与装备清单\n主要资源：吸附材料",
            communication_rows: [
              { role: "单位联系人", name: "李四", phone: "13800000000" }
            ],
            materials_rows: [
              {
                item: "吸附材料",
                quantity: "待核实",
                location: "现场物资点",
                owner: "项目负责人",
                notes: "主要资源"
              }
            ]
          },
          preface_payload: {
            filing_form:
              "企业事业单位突发环境事件应急预案备案表\n单位名称：上传测试公司",
            release_order: "公司各部门：\n发布令内容",
            filing_directory: "1. 突发环境事件应急预案备案表",
            compilation_notes: "编制说明\n一、编制概述\n更新后内容"
          },
          export_payload: {
            cover_title: "突发环境事件应急预案",
            body: "总则\n更新后正文",
            full_preview: "封面\n\n突发环境事件应急预案\n\n更新后整稿"
          }
        })
      })
      .mockResolvedValueOnce({
        ok: true,
        blob: async () =>
          new Blob(["word-bytes"], {
            type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          }),
        headers: new Headers({
          "content-disposition":
            'attachment; filename="demo-project-001-emergency-plan-review.docx"'
        })
      });

    vi.stubGlobal("fetch", fetchMock);
    const createObjectURLMock = vi.fn(() => "blob:demo");
    const revokeObjectURLMock = vi.fn();
    Object.defineProperty(URL, "createObjectURL", {
      writable: true,
      value: createObjectURLMock
    });
    Object.defineProperty(URL, "revokeObjectURL", {
      writable: true,
      value: revokeObjectURLMock
    });
    const clickSpy = vi
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(() => {});
    const createdAnchors: HTMLAnchorElement[] = [];
    const createElementSpy = vi
      .spyOn(document, "createElement")
      .mockImplementation((tagName: string) => {
        const element = document.createElementNS(
          "http://www.w3.org/1999/xhtml",
          tagName
        ) as HTMLElement;
        if (tagName === "a") {
          createdAnchors.push(element as HTMLAnchorElement);
        }
        return element;
      });

    render(<ProjectGenerationWorkflow projectId="demo-project-001" />);
    expect(screen.getByText("上传历史预案")).toBeInTheDocument();
    expect(screen.getByText("持续学习")).toBeInTheDocument();
    expect(screen.getByText(/每次上传、补充和重新生成都会沉淀为项目知识/)).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("资料上传"), {
      target: {
        files: [
          new File(["企业名称：上传测试公司"], "sample.docx", {
            type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          })
        ]
      }
    });

    await waitFor(() =>
      expect(fetchMock).toHaveBeenCalledWith(
        "/api/projects/demo-project-001/files",
        expect.objectContaining({
          method: "POST"
        })
      )
    );
    expect(screen.getByText("抽取结果确认")).toBeInTheDocument();
    expect(screen.getByText("已完成 1 个文件的文本抽取，请确认后生成。")).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("抽取结果文本"), {
      target: { value: "企业名称：上传测试公司\n所属行业：精细化工\n风险级别：一般" }
    });

    fireEvent.click(screen.getByRole("button", { name: "确认抽取结果并生成" }));

    await waitFor(() =>
      expect(screen.getByDisplayValue(/企业名称：上传测试公司/)).toBeInTheDocument()
    );
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/projects/demo-project-001/generate",
      expect.objectContaining({
        method: "POST"
      })
    );
    expect(screen.getByText("抽取文本已确认并完成首次生成。")).toBeInTheDocument();
    expect(screen.getByText("待补充信息")).toBeInTheDocument();

    expect(screen.getByText("前置材料")).toBeInTheDocument();
    expect(screen.getByText("附件模块")).toBeInTheDocument();
    expect(screen.getByText("应急通讯录")).toBeInTheDocument();
    expect(screen.getByDisplayValue("李四")).toBeInTheDocument();
    expect(screen.getByDisplayValue("吸附材料")).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("物资备注-1"), {
      target: { value: "已更新导出备注" }
    });
    expect(screen.getByText("备案表")).toBeInTheDocument();
    expect(screen.getByText("发布令")).toBeInTheDocument();
    expect(screen.getByText("编制说明")).toBeInTheDocument();
    expect(screen.getByText("突发环境事件应急预案")).toBeInTheDocument();
    expect(screen.getByText("校核结果")).toBeInTheDocument();
    expect(
      screen.getByText("当前版本未发现结构缺项或占位符问题。")
    ).toBeInTheDocument();
    expect(screen.getByText("单页整稿预览")).toBeInTheDocument();
    expect(screen.getByText("正文提取")).toBeInTheDocument();
    expect(screen.getByText(/正文目录/)).toBeInTheDocument();
    expect(
      screen.getAllByText(/形成了可供进一步论证完善的阶段性成果/).length
    ).toBeGreaterThan(0);
    expect(screen.getByText(/培训与演练内容/)).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("风险物质-补充内容"), {
      target: { value: "甲醇 1 吨，危化品库" }
    });
    fireEvent.click(
      screen.getByRole("button", { name: "合并补充内容并重新生成" })
    );

    await waitFor(() =>
      expect(fetchMock).toHaveBeenCalledWith(
        "/api/projects/demo-project-001/generate",
        expect.objectContaining({
          method: "POST",
          body: expect.stringContaining("风险物质：甲醇 1 吨，危化品库")
        })
      )
    );
    expect(screen.getByText(/更新后正文/)).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("物资备注-1"), {
      target: { value: "已更新导出备注" }
    });
    await waitFor(() =>
      expect(screen.getByDisplayValue("已更新导出备注")).toBeInTheDocument()
    );

    fireEvent.click(screen.getByRole("button", { name: "导出 Word" }));

    await waitFor(() => {
      const exportCall = fetchMock.mock.calls.find(
        ([url]) => url === "/api/projects/demo-project-001/export-word"
      );
      expect(exportCall).toBeTruthy();
      expect(exportCall?.[1]).toMatchObject({
        method: "POST"
      });
      expect(String(exportCall?.[1]?.body)).toContain("已更新导出备注");
    });
    expect(createObjectURLMock).toHaveBeenCalled();
    expect(clickSpy).toHaveBeenCalled();
    expect(revokeObjectURLMock).toHaveBeenCalled();
    expect(createdAnchors[createdAnchors.length - 1]?.download).toBe(
      "上传测试公司-突发环境应急预案-2026年6月15日.docx"
    );
    createElementSpy.mockRestore();
  });
});
