import json
from pathlib import Path


class RuleLoader:
    def __init__(self, rules_dir: Path):
        self.rules_dir = rules_dir

    def load_json(self, filename: str) -> dict:
        return json.loads((self.rules_dir / filename).read_text(encoding="utf-8"))
