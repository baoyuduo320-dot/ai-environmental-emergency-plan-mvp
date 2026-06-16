import re


LABELS = {
    "company_name": r"企业名称[:：]\s*(.+)",
    "plan_name": r"预案名称[:：]\s*(.+)",
    "plan_issue_date": r"(?:实施日期|签署日期|发布日期)[:：]\s*(.+)",
    "organization_code": r"(?:机构代码|统一社会信用代码)[:：]\s*([A-Za-z0-9]+)",
    "legal_representative": r"法定代表人[:：]\s*(.+)",
    "contact_person": r"联系人[:：]\s*(.+)",
    "contact_phone": r"(?:联系人电话|联系电话)[:：]\s*(.+)",
    "address": r"地址[:：]\s*(.+)",
    "longitude_latitude": r"(?:经纬度|地址及（经纬度）|地址及\(经纬度\))[:：]?\s*(.+)",
    "region": r"所在地区[:：]\s*(.+)",
    "industry": r"所属行业[:：]\s*(.+)",
    "risk_level": r"风险级别[:：]\s*(.+)",
}


def extract_project_facts(text: str) -> dict[str, str]:
    facts: dict[str, str] = {}
    for field_name, pattern in LABELS.items():
        match = re.search(pattern, text)
        if match:
            facts[field_name] = match.group(1).strip()
    return facts
