from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from .w_service import check_url

router = APIRouter()


class UrlScanRequest(BaseModel):
    url: str


class ScanResponse(BaseModel):
    label: str
    confidence_score: float


@router.post("/scan", response_model=ScanResponse)
async def scan_website(request: UrlScanRequest):
    if not request.url.strip():
        raise HTTPException(status_code=400, detail="URL cannot be empty.")

    result = check_url(request.url)

    return ScanResponse(
        label=result["label"],
        confidence_score=result["confidence_score"]
    )