from app.extraction.service import extract_project_facts


def test_extract_project_facts_reads_known_labels():
    text = """
    企业名称：苏州示例化工有限公司
    所在地区：苏州市工业园区
    所属行业：精细化工
    """
    facts = extract_project_facts(text)
    assert facts["company_name"] == "苏州示例化工有限公司"
    assert facts["region"] == "苏州市工业园区"
    assert facts["industry"] == "精细化工"
