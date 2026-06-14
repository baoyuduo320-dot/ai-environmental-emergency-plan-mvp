from app.rules.loader import RuleLoader


def test_rule_loader_reads_required_sections(tmp_path):
    rules_dir = tmp_path / "rules"
    rules_dir.mkdir()
    (rules_dir / "required_sections.json").write_text(
        '{"sections": ["总则", "企业基本情况", "环境风险分析"]}',
        encoding="utf-8",
    )
    loader = RuleLoader(rules_dir)
    data = loader.load_json("required_sections.json")
    assert data["sections"][0] == "总则"


from app.validation.service import validate_document_payload


def test_validate_document_payload_flags_missing_section_and_placeholder():
    payload = {
        "sections": ["总则", "企业基本情况"],
        "content": "总则\n待补充",
    }
    issues = validate_document_payload(payload)
    assert "missing_section:环境风险分析" in issues
    assert "placeholder_token:待补充" in issues
