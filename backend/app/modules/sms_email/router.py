from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from .service import process_message

# This variable definition is what FastAPI was missing
router = APIRouter()

class TextScanRequest(BaseModel):
    text: str
    message_type: str = "email"

class ScanResponse(BaseModel):
    label: str
    confidence_score: float

@router.post("/scan", response_model=ScanResponse)
async def scan_sms_email(request: TextScanRequest):
    if not request.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty.")
        
    result = process_message(request.text)
    
    return ScanResponse(
        label=result["label"],
        confidence_score=result["confidence_score"]
    )