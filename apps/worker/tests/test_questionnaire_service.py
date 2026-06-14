from app.questionnaire.service import build_missing_questions


def test_build_missing_questions_for_required_fields():
    facts = {
        "company_name": "苏州示例化工有限公司",
        "industry": "精细化工",
        "region": "苏州市工业园区",
    }
    questions = build_missing_questions(facts)
    assert "risk_materials" in questions
    assert "emergency_contacts" in questions
