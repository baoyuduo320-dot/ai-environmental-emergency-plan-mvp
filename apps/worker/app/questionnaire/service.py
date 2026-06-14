from app.config import RULES_DIR
from app.rules.loader import RuleLoader


def build_missing_questions(facts: dict[str, object]) -> dict[str, str]:
    loader = RuleLoader(RULES_DIR)
    required_fields = loader.load_json("required_fields.json")["required_fields"]
    prompts = loader.load_json("questionnaire_rules.json")
    missing: dict[str, str] = {}
    for field_name in required_fields:
        if not facts.get(field_name):
            missing[field_name] = prompts.get(field_name, f"请补充 {field_name}")
    return missing
