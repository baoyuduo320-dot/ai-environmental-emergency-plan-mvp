from typing import Optional

from fastapi import FastAPI, File, UploadFile
from fastapi.responses import Response
from pydantic import BaseModel

from app.export.service import build_word_document_bytes
from app.file_extract.service import extract_text_from_upload
from app.generation.service import generate_plan_package

app = FastAPI(title="Emergency Plan Worker")


class GenerateRequest(BaseModel):
    project_id: str
    source_text: str
    attachments_payload: Optional[dict[str, object]] = None


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/generate")
def generate(request: GenerateRequest) -> dict[str, object]:
    return generate_plan_package(
        project_id=request.project_id,
        source_text=request.source_text,
    )


@app.post("/export-word")
def export_word(request: GenerateRequest) -> Response:
    package = generate_plan_package(
        project_id=request.project_id,
        source_text=request.source_text,
    )
    export_payload = package["export_payload"]
    if request.attachments_payload:
        export_payload["appendix_catalog"] = str(
            request.attachments_payload.get("appendix_catalog", "")
        )
        export_payload["communication_list"] = str(
            request.attachments_payload.get("communication_list", "")
        )
        export_payload["materials_list"] = str(
            request.attachments_payload.get("materials_list", "")
        )
    document_bytes = build_word_document_bytes(export_payload)
    filename = f"{request.project_id}-emergency-plan-review.docx"
    return Response(
        content=document_bytes,
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"'
        },
    )


@app.post("/extract-text")
async def extract_text(files: list[UploadFile] = File(...)) -> dict[str, object]:
    extracted_items: list[dict[str, object]] = []
    all_warnings: list[str] = []
    text_parts: list[str] = []

    for upload in files:
        content = await upload.read()
        result = extract_text_from_upload(upload.filename or "uploaded-file", content)
        extracted_items.append(
            {
                "filename": upload.filename or "uploaded-file",
                "text": result["text"],
                "warnings": result["warnings"],
            }
        )
        if result["text"]:
            text_parts.append(str(result["text"]))
        all_warnings.extend(str(warning) for warning in result["warnings"])

    return {
        "extracted_text": "\n\n".join(part for part in text_parts if part.strip()),
        "files": extracted_items,
        "warnings": all_warnings,
    }
