from typing import List, Optional
from fastapi import APIRouter, File, UploadFile, HTTPException
from pydantic import BaseModel
from .d_service import process_document

router = APIRouter()


class EvidenceItem(BaseModel):
    category: str
    detail: str
    severity: str


class KnowledgeBaseMatch(BaseModel):
    id: str
    title: str
    attack_vector: str
    mitre_technique: Optional[str] = "N/A"
    description: str
    recommended_actions: List[str]


class RagAnalysis(BaseModel):
    summary: str
    evidence: List[EvidenceItem]
    knowledge_base_matches: List[KnowledgeBaseMatch]
    mitigation_steps: List[str]


class DocumentScanResponse(BaseModel):
    label: str
    confidence_score: float
    text_extracted: bool
    ocr_preview: str
    risk_level: str
    rag_analysis: RagAnalysis


@router.post("/scan", response_model=DocumentScanResponse)
async def scan_document(file: UploadFile = File(...)):
    valid_content_types = [
        "image/jpeg", "image/png", "image/jpg", "image/webp", "image/bmp",
        "image/tiff", "application/octet-stream"
    ]
    filename_lower = (file.filename or "").lower()
    valid_extensions = (".jpg", ".jpeg", ".png", ".webp", ".bmp", ".tif", ".tiff")

    if file.content_type not in valid_content_types and not filename_lower.endswith(valid_extensions):
        raise HTTPException(
            status_code=400,
            detail="Unsupported format. Please upload an image document (JPG, PNG, WEBP, or TIFF)."
        )

    contents = await file.read()
    if len(contents) == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    result = process_document(contents)
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])

    return DocumentScanResponse(
        label=result["label"],
        confidence_score=result["confidence_score"],
        text_extracted=result["text_extracted"],
        ocr_preview=result["ocr_preview"],
        risk_level=result.get("risk_level", "SAFE"),
        rag_analysis=result["rag_analysis"]
    )
