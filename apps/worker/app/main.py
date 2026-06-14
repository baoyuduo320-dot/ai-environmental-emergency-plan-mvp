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
