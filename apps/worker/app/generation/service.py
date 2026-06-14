from app.extraction.service import extract_project_facts
from app.export.service import render_export_payload
from app.questionnaire.service import build_missing_questions
from app.validation.service import validate_document_payload


def generate_plan_package(project_id: str, source_text: str) -> dict[str, object]:
    facts = extract_project_facts(source_text)
    questions = build_missing_questions(facts)
    sections = {
        "总则": f"{facts.get('company_name', '企业')}突发环境事件应急预案总则。",
        "企业基本情况": f"企业位于{facts.get('region', '待确认地区')}，所属行业为{facts.get('industry', '待确认行业')}。",
    }
    export_payload = render_export_payload(
        project_name=facts.get("company_name", project_id),
        sections=sections,
    )
    issues = validate_document_payload(
        {
            "sections": list(sections.keys()),
            "content": export_payload["body"],
        }
    )
    return {
        "facts": facts,
        "questions": questions,
        "sections": sections,
        "export_payload": export_payload,
        "issues": issues,
    }
