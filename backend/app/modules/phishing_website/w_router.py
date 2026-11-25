from typing import List, Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from .w_service import check_url

router = APIRouter()


class UrlScanRequest(BaseModel):
    url: str


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
async def scan_website(request: UrlScanRequest):
    if not request.url.strip():
        raise HTTPException(status_code=400, detail="URL cannot be empty.")

    result = check_url(request.url)

    return ScanResponse(
        label=result["label"],
        confidence_score=result["confidence_score"],
        risk_level=result.get("risk_level", "SAFE"),
        rag_analysis=result["rag_analysis"]
    )
