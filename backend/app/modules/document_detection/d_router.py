from fastapi import APIRouter, File, UploadFile, HTTPException
from pydantic import BaseModel
from .d_service import process_document

router = APIRouter()

class DocumentScanResponse(BaseModel):
    label: str
    confidence_score: float
    text_extracted: bool
    ocr_preview: str

@router.post("/scan", response_model=DocumentScanResponse)
async def scan_document(file: UploadFile = File(...)):
    if file.content_type not in ["image/jpeg", "image/png", "image/jpg"]:
        raise HTTPException(
            status_code=400, 
            detail="Unsupported format. Only JPG and PNG are supported."
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
        ocr_preview=result["ocr_preview"]
    )