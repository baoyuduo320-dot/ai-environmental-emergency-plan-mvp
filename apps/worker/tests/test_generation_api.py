from fastapi.testclient import TestClient

from app.main import app


def test_generate_endpoint_returns_questions_and_issues():
    client = TestClient(app)
    response = client.post(
        "/generate",
        json={
            "project_id": "demo-project-001",
            "source_text": "企业名称：苏州示例化工有限公司\n所在地区：苏州市工业园区\n所属行业：精细化工",
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["facts"]["company_name"] == "苏州示例化工有限公司"
    assert "risk_materials" in data["questions"]
    assert "missing_section:环境风险分析" in data["issues"]
