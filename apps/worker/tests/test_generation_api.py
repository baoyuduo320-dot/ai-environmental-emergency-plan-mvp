from fastapi.testclient import TestClient

from app.main import app


def test_generate_endpoint_returns_questions_and_issues():
    client = TestClient(app)
    response = client.post(
        "/generate",
        json={
            "project_id": "demo-project-001",
            "source_text": (
                "企业名称：苏州示例化工有限公司\n"
                "预案名称：苏州示例化工有限公司突发环境事件应急预案\n"
                "实施日期：2026年6月15日\n"
                "机构代码：91320500MA12345678\n"
                "法定代表人：张三\n"
                "联系人：李四\n"
                "联系电话：13800000000\n"
                "地址：苏州市工业园区示范路88号\n"
                "经纬度：东经120°00′00″，北纬31°00′00″\n"
                "所在地区：苏州市工业园区\n"
                "所属行业：精细化工\n"
                "风险级别：一般"
            ),
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["facts"]["company_name"] == "苏州示例化工有限公司"
    assert data["facts"]["plan_name"] == "苏州示例化工有限公司突发环境事件应急预案"
    assert data["facts"]["plan_issue_date"] == "2026年6月15日"
    assert data["facts"]["organization_code"] == "91320500MA12345678"
    assert data["facts"]["legal_representative"] == "张三"
    assert data["facts"]["contact_person"] == "李四"
    assert data["facts"]["contact_phone"] == "13800000000"
    assert data["facts"]["address"] == "苏州市工业园区示范路88号"
    assert data["facts"]["longitude_latitude"] == "东经120°00′00″，北纬31°00′00″"
    assert data["facts"]["risk_level"] == "一般"
    assert "risk_materials" in data["questions"]
    assert data["issues"] == []
    assert len(data["sections"]) == 12
    assert "环境风险识别与等级确定" in data["sections"]
    assert "组织机构和职责" in data["sections"]
    assert "苏州示例化工有限公司当前环境风险级别为一般" in data["sections"]["环境风险识别与等级确定"]
    assert "filing_form" in data["preface_payload"]
    assert "机构代码：91320500MA12345678" in data["preface_payload"]["filing_form"]
    assert "联系人：李四" in data["preface_payload"]["filing_form"]
    assert "release_order" in data["preface_payload"]
    assert "filing_directory" in data["preface_payload"]
    assert "compilation_notes" in data["preface_payload"]
    assert "attachments_payload" in data
    assert "法定代表人：张三" in data["preface_payload"]["filing_form"]
    assert "签署人：张三" in data["preface_payload"]["release_order"]
    assert "形成了可供进一步论证完善的阶段性成果" in data["preface_payload"]["compilation_notes"]
    assert "已完成评审" not in data["preface_payload"]["compilation_notes"]
    assert "应急通讯录" in data["attachments_payload"]["communication_list"]
    assert "应急物资与装备清单" in data["attachments_payload"]["materials_list"]
    assert "培训与演练" in data["export_payload"]["body"]
    assert "封面" in data["export_payload"]["full_preview"]
    assert "正文目录" in data["export_payload"]["full_preview"]
    assert "编制说明" in data["export_payload"]["full_preview"]


def test_generate_endpoint_applies_hospital_industry_profile():
    client = TestClient(app)
    response = client.post(
        "/generate",
        json={
            "project_id": "hospital-project-001",
            "source_text": (
                "企业名称：宿州市埇桥区康复医院\n"
                "预案名称：宿州市埇桥区康复医院突发环境事件应急预案\n"
                "实施日期：2026年6月16日\n"
                "法定代表人：王主任\n"
                "联系人：赵医生\n"
                "联系电话：13900000000\n"
                "地址：宿州市埇桥区汴河路66号\n"
                "经纬度：东经117°00′00″，北纬33°00′00″\n"
                "所在地区：宿州市埇桥区\n"
                "所属行业：康复医院\n"
                "风险级别：一般"
            ),
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["facts"]["organization_type"] == "hospital"
    assert data["facts"]["industry_profile"] == "hospital"
    assert "医疗废水处理设施" in data["sections"]["环境风险识别与等级确定"]
    assert "医疗废物泄漏收集" in data["sections"]["应急响应"]
    assert "医院各部门：" in data["preface_payload"]["release_order"]
    assert "医疗废水处理设施、医疗废物暂存间" in data["preface_payload"]["compilation_notes"]


def test_export_word_endpoint_returns_docx_file():
    client = TestClient(app)
    response = client.post(
        "/export-word",
        json={
            "project_id": "demo-project-001",
            "source_text": (
                "企业名称：苏州示例化工有限公司\n"
                "预案名称：苏州示例化工有限公司突发环境事件应急预案\n"
                "实施日期：2026年6月15日\n"
                "法定代表人：张三\n"
                "联系人：李四\n"
                "联系电话：13800000000\n"
                "地址：苏州市工业园区示范路88号\n"
                "经纬度：东经120°00′00″，北纬31°00′00″\n"
                "所在地区：苏州市工业园区\n"
                "所属行业：精细化工\n"
                "风险级别：一般"
            ),
        },
    )
    assert response.status_code == 200
    assert (
        response.headers["content-type"]
        == "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    )
    assert "attachment;" in response.headers["content-disposition"]
    assert response.content.startswith(b"PK")


def test_extract_text_endpoint_returns_combined_text():
    client = TestClient(app)
    document = (
        "%PDF-1.4\n"
        "1 0 obj\n<< /Length 35 >>\nstream\n"
        "BT\n"
        "(企业名称：测试公司) Tj\n"
        "ET\n"
        "endstream\n"
        "endobj\n"
        "%%EOF"
    ).encode("utf-8")
    response = client.post(
        "/extract-text",
        files=[("files", ("sample.pdf", document, "application/pdf"))],
    )
    assert response.status_code == 200
    data = response.json()
    assert "企业名称：测试公司" in data["extracted_text"]
    assert data["files"][0]["filename"] == "sample.pdf"
