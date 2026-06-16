const QUESTION_LABELS: Record<string, string> = {
  plan_name: "预案名称",
  plan_version: "预案版本号",
  plan_issue_date: "实施日期",
  compiler_org: "编制单位",
  legal_representative: "法定代表人",
  contact_person: "联系人",
  contact_phone: "联系电话",
  address: "地址",
  longitude_latitude: "经纬度",
  risk_level: "风险级别",
  risk_sources: "环境风险源",
  risk_materials: "风险物质",
  environmental_receptors: "周边环境风险受体",
  pollutant_discharge: "污染物排放与治理措施",
  emergency_org_structure: "应急组织体系",
  emergency_contacts: "应急联系人",
  emergency_resources: "应急资源",
  warning_mechanism: "预警机制",
  response_process: "信息报告与应急响应流程",
  onsite_disposal: "现场处置措施",
  post_disposal: "后期处置",
  training_plan: "培训计划",
  drill_plan: "演练计划"
};

export function QuestionnairePanel({
  questions,
  answers,
  onAnswerChange,
  onRegenerate,
  regenerating
}: {
  questions: Record<string, string>;
  answers: Record<string, string>;
  onAnswerChange: (key: string, value: string) => void;
  onRegenerate: () => void;
  regenerating: boolean;
}) {
  const entries = Object.entries(questions);

  return (
    <section>
      <h2>待补充信息</h2>
      <ul>
        {entries.map(([key, value]) => (
          <li key={key}>
            <strong>{QUESTION_LABELS[key] ?? key}</strong>
            <p>{value}</p>
            <textarea
              aria-label={`${QUESTION_LABELS[key] ?? key}-补充内容`}
              rows={3}
              value={answers[key] ?? ""}
              onChange={(event) => onAnswerChange(key, event.target.value)}
            />
          </li>
        ))}
      </ul>
      {entries.length ? (
        <button type="button" onClick={onRegenerate} disabled={regenerating}>
          {regenerating ? "重新生成中..." : "合并补充内容并重新生成"}
        </button>
      ) : null}
    </section>
  );
}
