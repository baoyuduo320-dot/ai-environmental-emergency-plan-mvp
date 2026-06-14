from app.config import RULES_DIR
from app.rules.loader import RuleLoader


def validate_document_payload(payload: dict[str, object]) -> list[str]:
    loader = RuleLoader(RULES_DIR)
    required_sections = loader.load_json("required_sections.json")["sections"]
    placeholder_tokens = loader.load_json("validation_rules.json")["placeholder_tokens"]
    issues: list[str] = []
    for section in required_sections:
        if section not in payload.get("sections", []):
            issues.append(f"missing_section:{section}")
    content = str(payload.get("content", ""))
    for token in placeholder_tokens:
        if token in content:
            issues.append(f"placeholder_token:{token}")
    return issues
