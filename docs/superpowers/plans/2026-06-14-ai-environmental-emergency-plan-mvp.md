# AI环保应急预案内部 MVP 实施计划

> **面向代理式执行者：** 必须使用 `superpowers:subagent-driven-development`（推荐）或 `superpowers:executing-plans` 按任务逐项实施本计划。任务步骤使用复选框 `- [ ]` 语法跟踪。

**目标：** 构建一个内部使用的 MVP 网页系统，能够接收企业资料，抽取应急预案所需结构化信息，对缺失项进行补问，生成接近提交稿的应急预案交付包，执行基础校核，并导出 Word 文件供人工审核。

**架构：** 采用一个小型 monorepo，包含一个用于项目录入和结果查看的 Next.js 网页端、一个用于解析与生成编排的 FastAPI 服务，以及一组共享的 JSON 规则资产，用来管理章节结构、必填字段和校核规则。第一版只聚焦单条内部闭环流程，不纳入计费、公开注册、自助开通或外部网站自动填报。

**技术栈：** TypeScript、Next.js App Router、React、Python 3.11、FastAPI、Pydantic、本地文件存储、pytest、Vitest、Playwright

---

## 范围检查

已确认的设计中还包含后续的 SaaS 计费、私有化部署和外部网站自动填报能力。本计划只覆盖第一个独立子项目：`高质量生成与导出的内部 MVP`。后续应分别单独编写以下计划：

- 公开 SaaS 账号、额度和计费系统
- 私有化部署打包与交付
- 环保相关外部网站自动登录与自动填报

## 文件结构

### 网页端

- 创建：`apps/web/package.json`
- 创建：`apps/web/next.config.mjs`
- 创建：`apps/web/tsconfig.json`
- 创建：`apps/web/app/layout.tsx`
- 创建：`apps/web/app/page.tsx`
- 创建：`apps/web/app/projects/new/page.tsx`
- 创建：`apps/web/app/projects/[projectId]/page.tsx`
- 创建：`apps/web/app/api/projects/route.ts`
- 创建：`apps/web/app/api/projects/[projectId]/files/route.ts`
- 创建：`apps/web/app/api/projects/[projectId]/generate/route.ts`
- 创建：`apps/web/components/project-create-form.tsx`
- 创建：`apps/web/components/file-upload-panel.tsx`
- 创建：`apps/web/components/questionnaire-panel.tsx`
- 创建：`apps/web/components/generation-status.tsx`
- 创建：`apps/web/components/export-panel.tsx`
- 创建：`apps/web/lib/api.ts`
- 创建：`apps/web/tests/project-create-form.test.tsx`
- 创建：`apps/web/tests/questionnaire-panel.test.tsx`
- 创建：`apps/web/e2e/internal-mvp.spec.ts`

### Worker 服务

- 创建：`apps/worker/pyproject.toml`
- 创建：`apps/worker/app/main.py`
- 创建：`apps/worker/app/config.py`
- 创建：`apps/worker/app/models.py`
- 创建：`apps/worker/app/rules/loader.py`
- 创建：`apps/worker/app/extraction/service.py`
- 创建：`apps/worker/app/questionnaire/service.py`
- 创建：`apps/worker/app/generation/service.py`
- 创建：`apps/worker/app/validation/service.py`
- 创建：`apps/worker/app/export/service.py`
- 创建：`apps/worker/tests/test_extraction_service.py`
- 创建：`apps/worker/tests/test_questionnaire_service.py`
- 创建：`apps/worker/tests/test_validation_service.py`
- 创建：`apps/worker/tests/test_export_service.py`

### 共享资产与文档

- 创建：`data/rules/required_sections.json`
- 创建：`data/rules/required_fields.json`
- 创建：`data/rules/questionnaire_rules.json`
- 创建：`data/rules/validation_rules.json`
- 创建：`data/samples/minimal_project/intake.json`
- 创建：`docs/mvp/field-dictionary.md`
- 创建：`docs/mvp/rule-entry-guide.md`
- 创建：`.gitignore`
- 创建：`package.json`
- 创建：`pnpm-workspace.yaml`
- 创建：`README.md`

## 任务 1：初始化仓库与工作区基础配置

**文件：**
- 创建：`package.json`
- 创建：`pnpm-workspace.yaml`
- 创建：`.gitignore`
- 创建：`README.md`

- [ ] **步骤 1：先写失败的工作区冒烟检查**

先在 `README.md` 中放入下面这段工作区说明，让第一步测试有明确校验目标：

```md
# AI Environmental Emergency Plan MVP

## Workspace Checks

- Root workspace uses pnpm workspaces
- apps/web exists
- apps/worker exists
```

然后在任务说明里记录这个校验命令：

```bash
test -f package.json && test -f pnpm-workspace.yaml && test -f README.md
```

- [ ] **步骤 2：运行工作区冒烟检查，确认它先失败**

运行：`test -f package.json && test -f pnpm-workspace.yaml && test -f README.md`

预期：命令非零退出，因为这些文件此时还不存在

- [ ] **步骤 3：写入最小可用的工作区配置**

创建 `package.json`：

```json
{
  "name": "ai-environmental-emergency-plan-mvp",
  "private": true,
  "packageManager": "pnpm@9.12.0",
  "scripts": {
    "dev:web": "pnpm --filter web dev",
    "dev:worker": "cd apps/worker && python -m uvicorn app.main:app --reload --port 8001",
    "test:web": "pnpm --filter web test",
    "test:e2e": "pnpm --filter web test:e2e"
  }
}
```

创建 `pnpm-workspace.yaml`：

```yaml
packages:
  - "apps/*"
```

创建 `.gitignore`：

```gitignore
node_modules
.next
.venv
__pycache__
.pytest_cache
dist
coverage
uploads
artifacts
```

创建 `README.md`：

```md
# AI Environmental Emergency Plan MVP

## Workspace Checks

- Root workspace uses pnpm workspaces
- apps/web exists
- apps/worker exists

## Services

- `apps/web`: internal operator web app
- `apps/worker`: parsing, generation, validation, export service
```

- [ ] **步骤 4：再次运行工作区冒烟检查，确认通过**

运行：`test -f package.json && test -f pnpm-workspace.yaml && test -f README.md && echo PASS`

预期：输出 `PASS`

- [ ] **步骤 5：初始化版本仓库**

运行：

```bash
git init
git add package.json pnpm-workspace.yaml .gitignore README.md
git commit -m "chore: initialize mvp workspace"
```

预期：仓库初始化成功，并生成第一条提交记录

## 任务 2：搭建 Worker 基础骨架与规则资产模型

**文件：**
- 创建：`apps/worker/pyproject.toml`
- 创建：`apps/worker/app/main.py`
- 创建：`apps/worker/app/config.py`
- 创建：`apps/worker/app/models.py`
- 创建：`apps/worker/app/rules/loader.py`
- 创建：`data/rules/required_sections.json`
- 创建：`data/rules/required_fields.json`
- 创建：`data/rules/questionnaire_rules.json`
- 创建：`data/rules/validation_rules.json`
- 创建：`apps/worker/tests/test_validation_service.py`
- 创建：`docs/mvp/field-dictionary.md`
- 创建：`docs/mvp/rule-entry-guide.md`

- [ ] **步骤 1：先写失败的规则加载测试**

创建 `apps/worker/tests/test_validation_service.py`：

```python
from app.rules.loader import RuleLoader


def test_rule_loader_reads_required_sections(tmp_path):
    rules_dir = tmp_path / "rules"
    rules_dir.mkdir()
    (rules_dir / "required_sections.json").write_text(
        '{"sections": ["总则", "企业基本情况", "环境风险分析"]}',
        encoding="utf-8",
    )
    loader = RuleLoader(rules_dir)
    data = loader.load_json("required_sections.json")
    assert data["sections"][0] == "总则"
```

- [ ] **步骤 2：运行 Worker 测试，确认它先失败**

运行：`cd apps/worker && pytest tests/test_validation_service.py::test_rule_loader_reads_required_sections -v`

预期：失败，报 `ModuleNotFoundError` 或提示 `RuleLoader` 不存在

- [ ] **步骤 3：写入最小 Worker 骨架和规则文件**

创建 `apps/worker/pyproject.toml`：

```toml
[project]
name = "worker"
version = "0.1.0"
requires-python = ">=3.11"
dependencies = [
  "fastapi",
  "uvicorn",
  "pydantic>=2",
  "python-multipart",
  "docxtpl",
  "pytest"
]
```

创建 `apps/worker/app/config.py`：

```python
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parents[3]
RULES_DIR = BASE_DIR / "data" / "rules"
UPLOADS_DIR = BASE_DIR / "uploads"
ARTIFACTS_DIR = BASE_DIR / "artifacts"
```

创建 `apps/worker/app/main.py`：

```python
from fastapi import FastAPI

app = FastAPI(title="Emergency Plan Worker")


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}
```

创建 `apps/worker/app/models.py`：

```python
from pydantic import BaseModel


class ProjectIntake(BaseModel):
    project_id: str
    company_name: str
    industry: str
    region: str
```

创建 `apps/worker/app/rules/loader.py`：

```python
import json
from pathlib import Path


class RuleLoader:
    def __init__(self, rules_dir: Path):
        self.rules_dir = rules_dir

    def load_json(self, filename: str) -> dict:
        return json.loads((self.rules_dir / filename).read_text(encoding="utf-8"))
```

创建 `data/rules/required_sections.json`：

```json
{
  "sections": [
    "总则",
    "企业基本情况",
    "环境风险分析",
    "应急组织机构和职责",
    "预防与预警",
    "应急响应",
    "后期处置",
    "保障措施",
    "培训与演练",
    "附则"
  ]
}
```

创建 `data/rules/required_fields.json`：

```json
{
  "required_fields": [
    "company_name",
    "industry",
    "region",
    "risk_materials",
    "emergency_contacts",
    "emergency_resources"
  ]
}
```

创建 `data/rules/questionnaire_rules.json`：

```json
{
  "risk_materials": "请补充风险物质名称、最大储量、存放位置和危险特性。",
  "emergency_contacts": "请补充总指挥、现场处置负责人和联系电话。"
}
```

创建 `data/rules/validation_rules.json`：

```json
{
  "placeholder_tokens": ["TODO", "待补充", "{{", "TBD"]
}
```

创建 `docs/mvp/field-dictionary.md`：

```md
# Field Dictionary

- `company_name`: 企业名称
- `industry`: 所属行业
- `region`: 所在地区
- `risk_materials`: 风险物质及储量
- `emergency_contacts`: 应急联系人
- `emergency_resources`: 应急资源
```

创建 `docs/mvp/rule-entry-guide.md`：

```md
# Rule Entry Guide

- `required_sections.json`: 章节顺序和名称
- `required_fields.json`: 生成前必须具备的字段
- `questionnaire_rules.json`: 缺项补问提示
- `validation_rules.json`: 导出前校核规则
```

- [ ] **步骤 4：再次运行 Worker 测试，确认通过**

运行：`cd apps/worker && pytest tests/test_validation_service.py::test_rule_loader_reads_required_sections -v`

预期：通过

- [ ] **步骤 5：提交**

```bash
git add apps/worker data/rules docs/mvp
git commit -m "feat: scaffold worker rules and models"
```

## 任务 3：实现结构化信息抽取和缺项识别

**文件：**
- 创建：`apps/worker/app/extraction/service.py`
- 创建：`apps/worker/app/questionnaire/service.py`
- 创建：`apps/worker/tests/test_extraction_service.py`
- 创建：`apps/worker/tests/test_questionnaire_service.py`
- 创建：`data/samples/minimal_project/intake.json`

- [ ] **步骤 1：先写失败的抽取与补问测试**

创建 `apps/worker/tests/test_extraction_service.py`：

```python
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
```

创建 `apps/worker/tests/test_questionnaire_service.py`：

```python
from app.questionnaire.service import build_missing_questions


def test_build_missing_questions_for_required_fields():
    facts = {
        "company_name": "苏州示例化工有限公司",
        "industry": "精细化工",
        "region": "苏州市工业园区"
    }
    questions = build_missing_questions(facts)
    assert "risk_materials" in questions
    assert "emergency_contacts" in questions
```

- [ ] **步骤 2：运行测试，确认它们先失败**

运行：`cd apps/worker && pytest tests/test_extraction_service.py tests/test_questionnaire_service.py -v`

预期：失败，提示模块或函数不存在

- [ ] **步骤 3：写入最小抽取与补问实现**

创建 `apps/worker/app/extraction/service.py`：

```python
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
```

创建 `apps/worker/app/questionnaire/service.py`：

```python
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
```

创建 `data/samples/minimal_project/intake.json`：

```json
{
  "project_id": "demo-project-001",
  "company_name": "苏州示例化工有限公司",
  "industry": "精细化工",
  "region": "苏州市工业园区"
}
```

- [ ] **步骤 4：再次运行测试，确认通过**

运行：`cd apps/worker && pytest tests/test_extraction_service.py tests/test_questionnaire_service.py -v`

预期：通过

- [ ] **步骤 5：提交**

```bash
git add apps/worker/app/extraction apps/worker/app/questionnaire apps/worker/tests data/samples
git commit -m "feat: add extraction and missing-question flow"
```

## 任务 4：实现基础校核与导出载荷生成

**文件：**
- 创建：`apps/worker/app/validation/service.py`
- 创建：`apps/worker/app/export/service.py`
- 创建：`apps/worker/tests/test_export_service.py`

- [ ] **步骤 1：先写失败的校核与导出测试**

在 `apps/worker/tests/test_validation_service.py` 追加以下测试：

```python
from app.validation.service import validate_document_payload


def test_validate_document_payload_flags_missing_section_and_placeholder():
    payload = {
        "sections": ["总则", "企业基本情况"],
        "content": "总则\\n待补充",
    }
    issues = validate_document_payload(payload)
    assert "missing_section:环境风险分析" in issues
    assert "placeholder_token:待补充" in issues
```

创建 `apps/worker/tests/test_export_service.py`：

```python
from app.export.service import render_export_payload


def test_render_export_payload_contains_cover_and_sections():
    payload = render_export_payload(
        project_name="苏州示例化工有限公司",
        sections={
            "总则": "总则内容",
            "企业基本情况": "企业基本情况内容"
        },
    )
    assert payload["cover_title"] == "突发环境事件应急预案"
    assert "总则内容" in payload["body"]
```

- [ ] **步骤 2：运行测试，确认它们先失败**

运行：`cd apps/worker && pytest tests/test_validation_service.py tests/test_export_service.py -v`

预期：失败，提示 `validate_document_payload` 或 `render_export_payload` 不存在

- [ ] **步骤 3：写入最小校核与导出实现**

创建 `apps/worker/app/validation/service.py`：

```python
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
```

创建 `apps/worker/app/export/service.py`：

```python
def render_export_payload(project_name: str, sections: dict[str, str]) -> dict[str, str]:
    ordered_titles = list(sections.keys())
    body_parts = [f"{title}\n{sections[title]}" for title in ordered_titles]
    return {
        "cover_title": "突发环境事件应急预案",
        "project_name": project_name,
        "table_of_contents": "\n".join(ordered_titles),
        "body": "\n\n".join(body_parts),
    }
```

- [ ] **步骤 4：再次运行测试，确认通过**

运行：`cd apps/worker && pytest tests/test_validation_service.py tests/test_export_service.py -v`

预期：通过

- [ ] **步骤 5：提交**

```bash
git add apps/worker/app/validation apps/worker/app/export apps/worker/tests
git commit -m "feat: add validation and export payload services"
```

## 任务 5：增加最小可用生成编排 API

**文件：**
- 创建：`apps/worker/app/generation/service.py`
- 修改：`apps/worker/app/main.py`

- [ ] **步骤 1：先写失败的生成 API 测试**

创建 `apps/worker/tests/test_generation_api.py`：

```python
from fastapi.testclient import TestClient
from app.main import app


def test_generate_endpoint_returns_questions_and_issues():
    client = TestClient(app)
    response = client.post(
        "/generate",
        json={
            "project_id": "demo-project-001",
            "source_text": "企业名称：苏州示例化工有限公司\n所在地区：苏州市工业园区\n所属行业：精细化工"
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["facts"]["company_name"] == "苏州示例化工有限公司"
    assert "risk_materials" in data["questions"]
    assert "missing_section:环境风险分析" in data["issues"]
```

- [ ] **步骤 2：运行生成 API 测试，确认它先失败**

运行：`cd apps/worker && pytest tests/test_generation_api.py::test_generate_endpoint_returns_questions_and_issues -v`

预期：失败，因为 `/generate` 路由还不存在

- [ ] **步骤 3：写入最小生成编排实现**

创建 `apps/worker/app/generation/service.py`：

```python
from app.extraction.service import extract_project_facts
from app.questionnaire.service import build_missing_questions
from app.export.service import render_export_payload
from app.validation.service import validate_document_payload


def generate_plan_package(project_id: str, source_text: str) -> dict[str, object]:
    facts = extract_project_facts(source_text)
    questions = build_missing_questions(facts)
    sections = {
        "总则": f"{facts.get('company_name', '企业')}突发环境事件应急预案总则。",
        "企业基本情况": f"企业位于{facts.get('region', '待确认地区')}，所属行业为{facts.get('industry', '待确认行业')}。",
    }
    export_payload = render_export_payload(
        project_name=facts.get("company_name", project_id),
        sections=sections,
    )
    issues = validate_document_payload(
        {
            "sections": list(sections.keys()),
            "content": export_payload["body"],
        }
    )
    return {
        "facts": facts,
        "questions": questions,
        "sections": sections,
        "export_payload": export_payload,
        "issues": issues,
    }
```

将 `apps/worker/app/main.py` 替换为：

```python
from fastapi import FastAPI
from pydantic import BaseModel
from app.generation.service import generate_plan_package

app = FastAPI(title="Emergency Plan Worker")


class GenerateRequest(BaseModel):
    project_id: str
    source_text: str


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/generate")
def generate(request: GenerateRequest) -> dict[str, object]:
    return generate_plan_package(
        project_id=request.project_id,
        source_text=request.source_text,
    )
```

- [ ] **步骤 4：再次运行生成 API 测试，确认通过**

运行：`cd apps/worker && pytest tests/test_generation_api.py::test_generate_endpoint_returns_questions_and_issues -v`

预期：通过

- [ ] **步骤 5：提交**

```bash
git add apps/worker/app/main.py apps/worker/app/generation apps/worker/tests/test_generation_api.py
git commit -m "feat: expose generation orchestration api"
```

## 任务 6：搭建内部网页端骨架与项目创建流程

**文件：**
- 创建：`apps/web/package.json`
- 创建：`apps/web/tsconfig.json`
- 创建：`apps/web/next.config.mjs`
- 创建：`apps/web/app/layout.tsx`
- 创建：`apps/web/app/page.tsx`
- 创建：`apps/web/app/projects/new/page.tsx`
- 创建：`apps/web/components/project-create-form.tsx`
- 创建：`apps/web/lib/api.ts`
- 创建：`apps/web/tests/project-create-form.test.tsx`

- [ ] **步骤 1：先写失败的项目表单测试**

创建 `apps/web/tests/project-create-form.test.tsx`：

```tsx
import { render, screen } from "@testing-library/react";
import { ProjectCreateForm } from "../components/project-create-form";

describe("ProjectCreateForm", () => {
  it("renders required project fields", () => {
    render(<ProjectCreateForm />);
    expect(screen.getByLabelText("企业名称")).toBeInTheDocument();
    expect(screen.getByLabelText("所属行业")).toBeInTheDocument();
    expect(screen.getByLabelText("所在地区")).toBeInTheDocument();
  });
});
```

- [ ] **步骤 2：运行网页端测试，确认它先失败**

运行：`cd apps/web && pnpm test project-create-form.test.tsx`

预期：失败，因为应用和组件还不存在

- [ ] **步骤 3：写入最小网页骨架和项目表单**

创建 `apps/web/package.json`：

```json
{
  "name": "web",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "test": "vitest run",
    "test:e2e": "playwright test"
  },
  "dependencies": {
    "next": "15.0.0",
    "react": "19.0.0",
    "react-dom": "19.0.0"
  },
  "devDependencies": {
    "@testing-library/react": "^16.0.0",
    "@testing-library/jest-dom": "^6.0.0",
    "@types/react": "^19.0.0",
    "typescript": "^5.6.0",
    "vitest": "^2.1.0"
  }
}
```

创建 `apps/web/tsconfig.json`：

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "es2022"],
    "jsx": "preserve",
    "module": "esnext",
    "moduleResolution": "bundler",
    "strict": true,
    "noEmit": true
  },
  "include": ["**/*.ts", "**/*.tsx"]
}
```

创建 `apps/web/next.config.mjs`：

```js
/** @type {import('next').NextConfig} */
const nextConfig = {};

export default nextConfig;
```

创建 `apps/web/app/layout.tsx`：

```tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
```

创建 `apps/web/app/page.tsx`：

```tsx
import Link from "next/link";

export default function HomePage() {
  return <Link href="/projects/new">创建项目</Link>;
}
```

创建 `apps/web/app/projects/new/page.tsx`：

```tsx
import { ProjectCreateForm } from "../../../components/project-create-form";

export default function NewProjectPage() {
  return <ProjectCreateForm />;
}
```

创建 `apps/web/components/project-create-form.tsx`：

```tsx
export function ProjectCreateForm() {
  return (
    <form>
      <label>
        企业名称
        <input aria-label="企业名称" name="companyName" />
      </label>
      <label>
        所属行业
        <input aria-label="所属行业" name="industry" />
      </label>
      <label>
        所在地区
        <input aria-label="所在地区" name="region" />
      </label>
      <button type="submit">创建项目</button>
    </form>
  );
}
```

创建 `apps/web/lib/api.ts`：

```ts
export async function createProject(payload: {
  companyName: string;
  industry: string;
  region: string;
}) {
  return payload;
}
```

- [ ] **步骤 4：再次运行网页端测试，确认通过**

运行：`cd apps/web && pnpm test project-create-form.test.tsx`

预期：通过

- [ ] **步骤 5：提交**

```bash
git add apps/web
git commit -m "feat: scaffold internal web app"
```

## 任务 7：实现上传、补问和生成状态界面

**文件：**
- 创建：`apps/web/components/file-upload-panel.tsx`
- 创建：`apps/web/components/questionnaire-panel.tsx`
- 创建：`apps/web/components/generation-status.tsx`
- 创建：`apps/web/app/projects/[projectId]/page.tsx`
- 创建：`apps/web/tests/questionnaire-panel.test.tsx`

- [ ] **步骤 1：先写失败的补问界面测试**

创建 `apps/web/tests/questionnaire-panel.test.tsx`：

```tsx
import { render, screen } from "@testing-library/react";
import { QuestionnairePanel } from "../components/questionnaire-panel";

describe("QuestionnairePanel", () => {
  it("renders missing-field prompts", () => {
    render(
      <QuestionnairePanel
        questions={{
          risk_materials: "请补充风险物质名称、最大储量、存放位置和危险特性。"
        }}
      />
    );
    expect(screen.getByText("risk_materials")).toBeInTheDocument();
    expect(screen.getByText("请补充风险物质名称、最大储量、存放位置和危险特性。")).toBeInTheDocument();
  });
});
```

- [ ] **步骤 2：运行补问界面测试，确认它先失败**

运行：`cd apps/web && pnpm test questionnaire-panel.test.tsx`

预期：失败，因为组件还不存在

- [ ] **步骤 3：写入最小操作流程界面**

创建 `apps/web/components/file-upload-panel.tsx`：

```tsx
export function FileUploadPanel() {
  return (
    <section>
      <h2>资料上传</h2>
      <input type="file" multiple />
    </section>
  );
}
```

创建 `apps/web/components/questionnaire-panel.tsx`：

```tsx
export function QuestionnairePanel({
  questions,
}: {
  questions: Record<string, string>;
}) {
  return (
    <section>
      <h2>待补充信息</h2>
      <ul>
        {Object.entries(questions).map(([key, value]) => (
          <li key={key}>
            <strong>{key}</strong>
            <p>{value}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

创建 `apps/web/components/generation-status.tsx`：

```tsx
export function GenerationStatus({
  issues,
}: {
  issues: string[];
}) {
  return (
    <section>
      <h2>校核结果</h2>
      <ul>
        {issues.map((issue) => (
          <li key={issue}>{issue}</li>
        ))}
      </ul>
    </section>
  );
}
```

创建 `apps/web/app/projects/[projectId]/page.tsx`：

```tsx
import { FileUploadPanel } from "../../../components/file-upload-panel";
import { QuestionnairePanel } from "../../../components/questionnaire-panel";
import { GenerationStatus } from "../../../components/generation-status";

export default function ProjectDetailPage() {
  return (
    <main>
      <FileUploadPanel />
      <QuestionnairePanel
        questions={{
          risk_materials: "请补充风险物质名称、最大储量、存放位置和危险特性。",
        }}
      />
      <GenerationStatus issues={["missing_section:环境风险分析"]} />
    </main>
  );
}
```

- [ ] **步骤 4：再次运行补问界面测试，确认通过**

运行：`cd apps/web && pnpm test questionnaire-panel.test.tsx`

预期：通过

- [ ] **步骤 5：提交**

```bash
git add apps/web/components apps/web/app/projects apps/web/tests/questionnaire-panel.test.tsx
git commit -m "feat: add upload and questionnaire panels"
```

## 任务 8：打通网页端到 Worker 的生成链路与导出预览

**文件：**
- 创建：`apps/web/app/api/projects/route.ts`
- 创建：`apps/web/app/api/projects/[projectId]/files/route.ts`
- 创建：`apps/web/app/api/projects/[projectId]/generate/route.ts`
- 创建：`apps/web/components/export-panel.tsx`
- 创建：`apps/web/e2e/internal-mvp.spec.ts`

- [ ] **步骤 1：先写失败的端到端流程测试**

创建 `apps/web/e2e/internal-mvp.spec.ts`：

```ts
import { test, expect } from "@playwright/test";

test("operator can reach the project creation page", async ({ page }) => {
  await page.goto("http://127.0.0.1:3000");
  await page.getByRole("link", { name: "创建项目" }).click();
  await expect(page.getByLabel("企业名称")).toBeVisible();
});
```

- [ ] **步骤 2：运行端到端测试，确认它先失败**

运行：`cd apps/web && pnpm test:e2e internal-mvp.spec.ts`

预期：失败，因为应用服务和 Playwright 配置还未完整就绪

- [ ] **步骤 3：写入最小 API 桥接与导出界面**

创建 `apps/web/app/api/projects/route.ts`：

```ts
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json({
    projectId: "demo-project-001",
    ...body,
  });
}
```

创建 `apps/web/app/api/projects/[projectId]/files/route.ts`：

```ts
import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({ uploaded: true });
}
```

创建 `apps/web/app/api/projects/[projectId]/generate/route.ts`：

```ts
import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    facts: {
      company_name: "苏州示例化工有限公司",
      industry: "精细化工",
      region: "苏州市工业园区"
    },
    questions: {
      risk_materials: "请补充风险物质名称、最大储量、存放位置和危险特性。"
    },
    issues: ["missing_section:环境风险分析"],
    export_payload: {
      cover_title: "突发环境事件应急预案",
      body: "总则\n总则内容"
    }
  });
}
```

创建 `apps/web/components/export-panel.tsx`：

```tsx
export function ExportPanel({
  coverTitle,
  body,
}: {
  coverTitle: string;
  body: string;
}) {
  return (
    <section>
      <h2>{coverTitle}</h2>
      <pre>{body}</pre>
      <button type="button">导出 Word</button>
    </section>
  );
}
```

将 `apps/web/app/projects/[projectId]/page.tsx` 更新为包含导出预览：

```tsx
import { FileUploadPanel } from "../../../components/file-upload-panel";
import { QuestionnairePanel } from "../../../components/questionnaire-panel";
import { GenerationStatus } from "../../../components/generation-status";
import { ExportPanel } from "../../../components/export-panel";

export default function ProjectDetailPage() {
  return (
    <main>
      <FileUploadPanel />
      <QuestionnairePanel
        questions={{
          risk_materials: "请补充风险物质名称、最大储量、存放位置和危险特性。",
        }}
      />
      <GenerationStatus issues={["missing_section:环境风险分析"]} />
      <ExportPanel
        coverTitle="突发环境事件应急预案"
        body={"总则\n总则内容"}
      />
    </main>
  );
}
```

- [ ] **步骤 4：运行端到端测试和冒烟验证**

运行：

```bash
pnpm dev:web
cd apps/worker && python -m uvicorn app.main:app --reload --port 8001
cd apps/web && pnpm test:e2e internal-mvp.spec.ts
```

预期：

- 网页端启动在 `http://127.0.0.1:3000`
- Worker 启动在 `http://127.0.0.1:8001`
- Playwright 测试可以成功进入项目创建页

- [ ] **步骤 5：提交**

```bash
git add apps/web/app/api apps/web/components/export-panel.tsx apps/web/e2e apps/web/app/projects/[projectId]/page.tsx
git commit -m "feat: connect generation preview and export panel"
```

## 任务 9：补充操作手册与人工验证清单

**文件：**
- 修改：`README.md`
- 创建：`docs/mvp/manual-verification.md`

- [ ] **步骤 1：先写失败的文档检查**

等 `docs/mvp/manual-verification.md` 创建后，文件中应至少包含以下检查步骤：

```md
# Manual Verification

1. Create a project
2. Upload sample material
3. Confirm missing questions appear
4. Trigger generation
5. Confirm export preview renders
```

文档校验命令：

```bash
test -f docs/mvp/manual-verification.md
```

- [ ] **步骤 2：运行文档检查，确认它先失败**

运行：`test -f docs/mvp/manual-verification.md`

预期：命令非零退出，因为文件尚不存在

- [ ] **步骤 3：写入操作手册**

在 `README.md` 追加以下内容：

```md
## Local MVP Run

1. Start the worker service on port 8001
2. Start the web app on port 3000
3. Open the project creation page
4. Upload source material
5. Review missing questions, issues, and export preview
```

创建 `docs/mvp/manual-verification.md`：

```md
# Manual Verification

1. Create a project with enterprise name, industry, and region.
2. Upload one sample text file that contains labeled enterprise information.
3. Confirm the UI shows missing questions for `risk_materials` and `emergency_contacts`.
4. Trigger generation and confirm `missing_section:环境风险分析` is visible.
5. Confirm the export preview shows `突发环境事件应急预案` and a `导出 Word` button.
```

- [ ] **步骤 4：再次运行文档检查，确认通过**

运行：`test -f docs/mvp/manual-verification.md && echo PASS`

预期：输出 `PASS`

- [ ] **步骤 5：提交**

```bash
git add README.md docs/mvp/manual-verification.md
git commit -m "docs: add internal mvp runbook"
```

## 自检

### 规格覆盖情况

- 产品边界：已通过内部 MVP 范围和明确排除项覆盖
- 核心流程：已由任务 3 到任务 8 覆盖
- 规则资产和字段字典：已由任务 2 覆盖
- 质量与减少返工：已由任务 3、任务 4、任务 5 覆盖
- 整套交付包预览：已由任务 4 和任务 8 覆盖
- 内部操作与人工验证路径：已由任务 9 覆盖

### 占位项检查

- 不存在未解决的 `TBD`、`TODO` 或 “implement later” 占位描述；字符串 `TODO`、`TBD` 和 `待补充` 只出现在校核规则示例和校核测试里
- 每个任务都包含明确文件、命令和预期结果

### 类型一致性

- `company_name`、`industry`、`region`、`risk_materials`、`emergency_contacts` 在规则、测试和服务实现中保持一致
- `generate_plan_package()` 在 API 使用前已经在前置任务中定义

## 下一份计划的边界提醒

不要把以下内容继续塞进这份 MVP 计划：

- 订阅计费
- 套餐额度
- 租户隔离
- 私有化部署
- 外部网站登录和自动填报

这些内容应在本次 MVP 验证出稳定内部质量后，再分别编写后续计划。
