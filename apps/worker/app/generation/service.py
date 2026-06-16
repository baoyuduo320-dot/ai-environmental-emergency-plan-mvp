from app.config import RULES_DIR
from app.extraction.service import extract_project_facts
from app.export.service import (
    render_compilation_notes,
    render_export_payload,
    render_filing_directory,
    render_filing_form,
    render_release_order,
)
from app.questionnaire.service import build_missing_questions
from app.rules.loader import RuleLoader
from app.validation.service import validate_document_payload


DEFAULT_FACTS = {
    "company_name": "企业",
    "plan_name": "企业突发环境事件应急预案",
    "plan_issue_date": "近期实施",
    "region": "项目所在地",
    "industry": "所属行业",
    "address": "企业地址",
    "contact_person": "项目联系人",
    "contact_phone": "联系电话",
    "risk_level": "经评估确定的风险等级",
    "risk_sources": "主要环境风险源及所在位置",
    "risk_materials": "风险物质名称、最大储量、存放位置和危险特性",
    "environmental_receptors": "周边居民点、地表水体及其他敏感目标",
    "emergency_org_structure": "综合协调、现场处置、监测预警、物资保障、信息报送等工作组设置",
    "emergency_contacts": "总指挥、现场负责人和值班联络电话",
    "warning_mechanism": "预警分级、触发条件和发布流程",
    "response_process": "首报、续报、终报和联动处置流程",
    "onsite_disposal": "泄漏、火灾爆炸、异常排放等场景的现场处置措施",
    "post_disposal": "污染清理、环境修复、监测评估和事故总结",
    "emergency_resources": "应急物资、监测设备、车辆和外部支援资源",
    "pollutant_discharge": "主要排放环节、治理设施和事故状态下的截流措施",
    "training_plan": "岗位培训、专项培训和年度复训安排",
    "drill_plan": "桌面推演、专项演练和综合演练安排",
}


def infer_industry_profile(facts: dict[str, str]) -> dict[str, str]:
    loader = RuleLoader(RULES_DIR)
    profiles = loader.load_json("industry_profiles.json")["profiles"]
    industry_text = " ".join(
        filter(
            None,
            [
                facts.get("industry", ""),
                facts.get("company_name", ""),
                facts.get("plan_name", ""),
            ],
        )
    )
    for profile in profiles:
        if any(keyword in industry_text for keyword in profile["match_keywords"]):
            return profile
    return {}


def build_generation_context(facts: dict[str, str]) -> dict[str, str]:
    profile = infer_industry_profile(facts)
    profile_defaults = {
        key: value
        for key, value in profile.items()
        if key not in {"key", "match_keywords", "organization_type"}
    }
    context = {**DEFAULT_FACTS, **profile_defaults, **facts}
    context.setdefault("plan_name", f"{context['company_name']}突发环境事件应急预案")
    return context


def build_sections(context: dict[str, str]) -> dict[str, str]:
    loader = RuleLoader(RULES_DIR)
    templates = loader.load_json("section_templates.json")["ordered_sections"]
    sections: dict[str, str] = {}
    for section in templates:
        sections[section["title"]] = section["template"].format(**context)
    return sections


def build_attachments(context: dict[str, str]) -> dict[str, str]:
    contact_person = context.get("contact_person", "项目联系人")
    contact_phone = context.get("contact_phone", "联系电话")
    emergency_contacts = context.get(
        "emergency_contacts",
        "总指挥、现场负责人和值班联络电话",
    )
    emergency_resources = context.get(
        "emergency_resources",
        "应急物资、监测设备、车辆和外部支援资源",
    )
    appendix_catalog = "\n".join(
        [
            "1. 应急通讯录",
            "2. 应急物资与装备清单",
            "3. 厂区平面布置及风险源分布图",
            "4. 疏散路线与应急处置流程图",
        ]
    )
    communication_list = "\n".join(
        [
            "应急通讯录",
            f"单位联系人：{contact_person}",
            f"联系电话：{contact_phone}",
            f"关键岗位：{emergency_contacts}",
        ]
    )
    materials_list = "\n".join(
        [
            "应急物资与装备清单",
            f"主要资源：{emergency_resources}",
            "建议补充字段：数量、存放位置、责任人、检查频次。",
        ]
    )
    return {
        "appendix_catalog": appendix_catalog,
        "communication_list": communication_list,
        "materials_list": materials_list,
        "communication_rows": [
            {
                "role": "单位联系人",
                "name": contact_person,
                "phone": contact_phone,
            },
            {
                "role": "关键岗位",
                "name": "总指挥及现场负责人",
                "phone": emergency_contacts,
            },
        ],
        "materials_rows": [
            {
                "item": "主要应急资源",
                "quantity": "待核实",
                "location": "现场物资点",
                "owner": "项目负责人",
                "notes": emergency_resources,
            }
        ],
    }


def generate_plan_package(project_id: str, source_text: str) -> dict[str, object]:
    facts = extract_project_facts(source_text)
    profile = infer_industry_profile(facts)
    if profile.get("organization_type") and not facts.get("organization_type"):
        facts["organization_type"] = profile["organization_type"]
    if profile.get("key") and not facts.get("industry_profile"):
        facts["industry_profile"] = profile["key"]
    facts.setdefault("plan_name", f"{facts.get('company_name', '企业')}突发环境事件应急预案")
    facts.setdefault("plan_issue_date", "补充实施日期后生效")
    context = build_generation_context(facts)
    questions = build_missing_questions(facts)
    sections = build_sections(context)
    attachments_payload = build_attachments(context)
    preface_payload = {
        "filing_form": render_filing_form(facts),
        "release_order": render_release_order(facts),
        "filing_directory": render_filing_directory(),
        "compilation_notes": render_compilation_notes(context),
    }
    export_payload = render_export_payload(
        project_name=facts.get("company_name", project_id),
        sections=sections,
        preface_payload=preface_payload,
        plan_issue_date=context.get("plan_issue_date", ""),
        attachments_payload=attachments_payload,
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
        "attachments_payload": attachments_payload,
        "preface_payload": preface_payload,
        "export_payload": export_payload,
        "issues": issues,
    }
