import { NextResponse } from "next/server";

const DEFAULT_WORKER_URL = "http://127.0.0.1:8001";

function readSourceField(sourceText: string, label: string) {
  const escapedLabel = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = sourceText.match(new RegExp(`(^|\\n)${escapedLabel}[:：]([^\\n]*)`));
  return match?.[2]?.trim() ?? "";
}

function buildFallbackGeneration(projectId: string, sourceText: string) {
  const companyName = readSourceField(sourceText, "企业名称") || "未命名企业";
  const industry = readSourceField(sourceText, "所属行业") || "待补充";
  const region = readSourceField(sourceText, "所在地区") || "待补充";
  const riskLevel = readSourceField(sourceText, "风险级别") || "待系统判定";
  const planDate = readSourceField(sourceText, "实施日期") || "待确认";
  const contactPerson = readSourceField(sourceText, "联系人") || "待补充";
  const contactPhone = readSourceField(sourceText, "联系电话") || "待补充";

  const body = [
    "1. 总则",
    `${companyName}位于${region}，所属行业为${industry}。本预案用于指导企业突发环境事件的预防、预警、响应和后期处置。`,
    "",
    "2. 企业环境风险概况",
    `当前环境风险等级为${riskLevel}。后续应结合历史预案、环评资料、危险物质清单和现场平面布置进一步完善风险源识别。`,
    "",
    "3. 应急组织与职责",
    "企业应建立应急指挥、现场处置、通讯联络、物资保障和后勤保障等工作组，并明确负责人、联系方式和替补人员。",
    "",
    "4. 预警与响应",
    "发生异常排放、泄漏、火灾爆炸次生污染等情形时，应立即开展现场确认、信息报告、污染控制和人员防护。",
    "",
    "5. 培训与演练",
    "建议每年至少组织一次综合演练，并根据演练问题持续修订项目知识库和预案文本。"
  ].join("\n");

  const filingForm = [
    "企业事业单位突发环境事件应急预案备案表",
    `单位名称：${companyName}`,
    `所属行业：${industry}`,
    `所在地区：${region}`,
    `环境风险等级：${riskLevel}`,
    `联系人：${contactPerson}`,
    `联系电话：${contactPhone}`
  ].join("\n");

  return {
    facts: {
      company_name: companyName,
      industry,
      region,
      risk_level: riskLevel,
      plan_issue_date: planDate
    },
    questions: {
      risk_materials: "请补充主要风险物质名称、最大储量、存放位置和危险特性。",
      emergency_resources: "请补充现场应急物资、装备数量、存放位置和责任人。"
    },
    issues: [],
    attachments_payload: {
      appendix_catalog: "1. 应急通讯录\n2. 应急物资与装备清单",
      communication_list: `应急通讯录\n单位联系人：${contactPerson} ${contactPhone}`,
      materials_list: "应急物资与装备清单\n主要资源：待补充",
      communication_rows: [
        { role: "单位联系人", name: contactPerson, phone: contactPhone }
      ],
      materials_rows: [
        {
          item: "待补充",
          quantity: "待核实",
          location: "待补充",
          owner: "项目负责人",
          notes: "请根据现场实际完善"
        }
      ]
    },
    preface_payload: {
      filing_form: filingForm,
      release_order: `公司各部门：\n《${companyName}突发环境事件应急预案》已形成草稿，请结合现场资料校核后发布实施。`,
      filing_directory: "1. 突发环境事件应急预案备案表\n2. 环境应急预案及编制说明",
      compilation_notes:
        "编制说明\n一、编制概述\n本稿基于当前录入资料生成。后续上传历史预案、环评资料和应急资源清单后，系统将继续沉淀项目知识并优化文本。"
    },
    export_payload: {
      cover_title: "突发环境事件应急预案",
      project_name: projectId,
      table_of_contents: "1. 总则\n2. 企业环境风险概况\n3. 应急组织与职责\n4. 预警与响应\n5. 培训与演练",
      body,
      full_preview: [
        "封面",
        "",
        "突发环境事件应急预案",
        "",
        companyName,
        "",
        filingForm,
        "",
        "正文目录",
        "",
        "1. 总则\n2. 企业环境风险概况\n3. 应急组织与职责\n4. 预警与响应\n5. 培训与演练",
        "",
        body
      ].join("\n")
    }
  };
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const body = await request.json();
  const { projectId } = await params;
  const sourceText = body.source_text ?? "";
  try {
    const workerResponse = await fetch(
      `${process.env.WORKER_BASE_URL ?? DEFAULT_WORKER_URL}/generate`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          project_id: body.project_id ?? projectId,
          source_text: sourceText
        })
      }
    );

    if (workerResponse.ok) {
      return NextResponse.json(await workerResponse.json());
    }
  } catch {
    // Fall back to a local report skeleton for MVP deployments without worker.
  }

  return NextResponse.json(
    buildFallbackGeneration(body.project_id ?? projectId, sourceText),
    {
      headers: {
        "X-Fallback-Reason": "worker-generation-unavailable"
      }
    }
  );
}
