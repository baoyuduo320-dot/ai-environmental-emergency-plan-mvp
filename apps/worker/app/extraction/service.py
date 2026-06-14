import re


LABELS = {
    "company_name": r"企业名称[:：]\s*(.+)",
    "region": r"所在地区[:：]\s*(.+)",
    "industry": r"所属行业[:：]\s*(.+)",
}


def extract_project_facts(text: str) -> dict[str, str]:
    facts: dict[str, str] = {}
    for field_name, pattern in LABELS.items():
        match = re.search(pattern, text)
        if match:
            facts[field_name] = match.group(1).strip()
    return facts
