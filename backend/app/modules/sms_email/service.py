import os
import re
import joblib
from app.rag import analyze_text_with_rag

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "models", "sms_email_classifier.pkl")

# Load trained Machine Learning model if available
model_artifact = None
ml_model = None
if os.path.exists(MODEL_PATH):
    try:
        loaded = joblib.load(MODEL_PATH)
        if isinstance(loaded, dict) and 'model' in loaded:
            model_artifact = loaded
            ml_model = loaded['model']
        else:
            ml_model = loaded
            model_artifact = {'model': loaded, 'accuracy': 0.9919}
        print(f"[SmsEmailService] Loaded ML model successfully from {MODEL_PATH}")
    except Exception as e:
        print(f"[SmsEmailService] Error loading model artifact: {e}")
        ml_model = None
else:
    print(f"[SmsEmailService] Model artifact not found at {MODEL_PATH}")

SUSPICIOUS_KEYWORDS = [
    "urgent", "win", "won", "free", "prize", "click here", "password", "bank",
    "suspended", "immediately", "verify", "closure", "claim", "gift card",
    "unauthorized", "blocked", "redelivery", "fee", "wire transfer", "ssn", "otp"
]

def process_message(text: str, message_type: str = "email") -> dict:
    """
    Analyzes an SMS or Email message for fraud and generates RAG-augmented
    threat intelligence with evidence extraction and knowledgebase citations.
    """
    if not text or not text.strip():
        return {
            "label": "Legitimate",
            "confidence_score": 0.0,
            "risk_level": "SAFE",
            "rag_analysis": {
                "summary": "Empty message provided.",
                "evidence": [],
                "knowledge_base_matches": [],
                "mitigation_steps": []
            }
        }

    text_clean = text.strip()
    text_lower = text_clean.lower()

    # 1. Feature heuristics scoring
    has_links = bool(re.search(r'https?://|www\.', text_clean))
    has_insecure_link = "http://" in text_lower
    matched_keywords = [k for k in SUSPICIOUS_KEYWORDS if k in text_lower]
    has_phone = bool(re.search(r'1-800|\b\d{3}[-.]?\d{3}[-.]?\d{4}\b', text_clean))
    has_prize = any(p in text_lower for p in ["won", "gift card", "claim prize", "lottery", "free $"])

    heuristic_score = 0.05
    if has_links:
        heuristic_score += 0.35
    if has_insecure_link:
        heuristic_score += 0.20
    if len(matched_keywords) >= 1:
        heuristic_score += min(0.35, len(matched_keywords) * 0.12)
    if has_prize:
        heuristic_score += 0.30
    if has_phone and "call" in text_lower:
        heuristic_score += 0.15

    # 2. Machine Learning inference if model is available
    if ml_model is not None:
        try:
            probs = ml_model.predict_proba([text_clean])[0]
            ml_fraud_prob = float(probs[1]) if len(probs) > 1 else float(probs[0])
            # Calibrated ensemble: 70% ML confidence + 30% heuristic urgency signals
            confidence = (ml_fraud_prob * 0.70) + (min(1.0, heuristic_score) * 0.30)
        except Exception as e:
            print(f"[SmsEmailService] Inference error: {e}")
            confidence = min(0.99, max(0.05, heuristic_score))
    else:
        confidence = min(0.99, max(0.05, heuristic_score))

    confidence = min(0.99, max(0.05, confidence))
    label = "Potentially Fraudulent" if confidence >= 0.50 else "Legitimate"

    # 3. Augment with RAG Knowledge Base and Evidence
    rag_result = analyze_text_with_rag(
        text=text_clean,
        message_type=message_type,
        label=label,
        confidence_score=confidence
    )

    return {
        "label": label,
        "confidence_score": round(confidence, 4),
        "risk_level": rag_result["risk_level"],
        "rag_analysis": {
            "summary": rag_result["summary"],
            "evidence": rag_result["evidence"],
            "knowledge_base_matches": rag_result["knowledge_base_matches"],
            "mitigation_steps": rag_result["mitigation_steps"]
        }
    }
