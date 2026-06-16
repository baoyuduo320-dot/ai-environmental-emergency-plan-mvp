from app.extraction.service import extract_project_facts


def test_extract_project_facts_reads_known_labels():
    text = """
    企业名称：苏州示例化工有限公司
    预案名称：苏州示例化工有限公司突发环境事件应急预案
    实施日期：2026年6月15日
    机构代码：91320500MA12345678
    法定代表人：张三
    联系人：李四
    联系电话：13800000000
    地址：苏州市工业园区示范路88号
    经纬度：东经120°00′00″，北纬31°00′00″
    所在地区：苏州市工业园区
    所属行业：精细化工
    风险级别：一般
    """
    facts = extract_project_facts(text)
    assert facts["company_name"] == "苏州示例化工有限公司"
    assert facts["plan_name"] == "苏州示例化工有限公司突发环境事件应急预案"
    assert facts["plan_issue_date"] == "2026年6月15日"
    assert facts["organization_code"] == "91320500MA12345678"
    assert facts["legal_representative"] == "张三"
    assert facts["contact_person"] == "李四"
    assert facts["contact_phone"] == "13800000000"
    assert facts["address"] == "苏州市工业园区示范路88号"
    assert facts["longitude_latitude"] == "东经120°00′00″，北纬31°00′00″"
    assert facts["region"] == "苏州市工业园区"
    assert facts["industry"] == "精细化工"
    assert facts["risk_level"] == "一般"
