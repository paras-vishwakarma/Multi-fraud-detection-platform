from typing import List, Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from .service import process_message

router = APIRouter()


class TextScanRequest(BaseModel):
    text: str
    message_type: str = "email"


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


class ScanResponse(BaseModel):
    label: str
    confidence_score: float
    risk_level: str
    rag_analysis: RagAnalysis


@router.post("/scan", response_model=ScanResponse)
async def scan_sms_email(request: TextScanRequest):
    if not request.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty.")

    result = process_message(request.text, request.message_type)

    return ScanResponse(
        label=result["label"],
        confidence_score=result["confidence_score"],
        risk_level=result.get("risk_level", "SAFE"),
        rag_analysis=result["rag_analysis"]
    )
