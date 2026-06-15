import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    facts: {
      company_name: "苏州示例化工有限公司",
      industry: "精细化工",
      region: "苏州市工业园区"
    },
    questions: {
      risk_materials: "请补充风险物质名称、最大储量、存放位置和危险特性。"
    },
    issues: ["missing_section:环境风险分析"],
    export_payload: {
      cover_title: "突发环境事件应急预案",
      body: "总则\n总则内容"
    }
  });
}
