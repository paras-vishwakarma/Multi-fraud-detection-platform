import io
import os
import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image

from app.rag import analyze_document_with_rag

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "models", "resnet18_document.pth")

# Initialize ResNet-18 architecture
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = models.resnet18(weights=None)
model.fc = nn.Linear(model.fc.in_features, 2)

if os.path.exists(MODEL_PATH):
    try:
        model.load_state_dict(torch.load(MODEL_PATH, map_location=device))
        model.to(device)
        model.eval()
        print(f"[DocumentService] Loaded ResNet-18 weights from {MODEL_PATH}")
    except Exception as e:
        print(f"[DocumentService] Error loading ResNet-18 weights: {e}")
        model = None
else:
    model = None

# Preprocessing pipeline
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])


def extract_ocr_text(image: Image.Image) -> str:
    """Extracts textual content via OCR if available."""
    tesseract_path = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
    if not os.path.exists(tesseract_path):
        return ""

    try:
        import pytesseract
        pytesseract.pytesseract.tesseract_cmd = tesseract_path
        return pytesseract.image_to_string(image).strip()
    except Exception as e:
        return ""


def process_document(image_bytes: bytes) -> dict:
    """
    Performs visual analysis and OCR text parsing to detect document tampering,
    augmented with RAG cybersecurity knowledge base evidence.
    """
    try:
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    except Exception:
        return {"error": "Invalid image format"}

    ocr_text = extract_ocr_text(image)

    if model is not None:
        try:
            tensor = transform(image).unsqueeze(0).to(device)
            with torch.no_grad():
                outputs = model(tensor)
                probs = torch.softmax(outputs, dim=1)[0]
                fraud_score = float(probs[1].item())
        except Exception as e:
            print(f"[DocumentService] Inference error: {e}")
            fraud_score = 0.55
    else:
        # Fallback heuristic inspection:
        # Check aspect ratio variance, resolution, and OCR text flags
        width, height = image.size
        ratio = max(width, height) / (min(width, height) or 1)
        has_abnormal_ratio = ratio > 2.8 or ratio < 1.1

        text_lower = ocr_text.lower()
        has_tamper_words = any(w in text_lower for w in ['sample', 'specimen', 'void', 'lorem ipsum', 'draft'])

        if has_tamper_words:
            fraud_score = 0.88
        elif has_abnormal_ratio and not ocr_text:
            fraud_score = 0.65
        else:
            fraud_score = 0.20

    label = "Potentially Fraudulent" if fraud_score >= 0.50 else "Legitimate"

    # Augment with RAG Document Forgery Knowledge Base
    rag_result = analyze_document_with_rag(
        ocr_text=ocr_text,
        label=label,
        confidence_score=fraud_score,
        metadata={"width": image.width, "height": image.height}
    )

    return {
        "label": label,
        "confidence_score": round(fraud_score, 4),
        "text_extracted": bool(ocr_text),
        "ocr_preview": ocr_text[:150] if ocr_text else "No machine-readable text detected",
        "risk_level": rag_result["risk_level"],
        "rag_analysis": {
            "summary": rag_result["summary"],
            "evidence": rag_result["evidence"],
            "knowledge_base_matches": rag_result["knowledge_base_matches"],
            "mitigation_steps": rag_result["mitigation_steps"]
        }
    }
