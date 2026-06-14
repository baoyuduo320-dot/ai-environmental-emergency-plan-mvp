from app.export.service import render_export_payload


def test_render_export_payload_contains_cover_and_sections():
    payload = render_export_payload(
        project_name="苏州示例化工有限公司",
        sections={
            "总则": "总则内容",
            "企业基本情况": "企业基本情况内容",
        },
    )
    assert payload["cover_title"] == "突发环境事件应急预案"
    assert "总则内容" in payload["body"]
