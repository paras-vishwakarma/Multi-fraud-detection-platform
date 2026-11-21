import random

def process_message(text: str) -> dict:
    text_lower = text.lower()
    suspicious_keywords = ["urgent", "win", "free", "prize", "click here", "password", "bank"]
    
    # Simple check for testing until your ML model pkl is loaded
    if any(keyword in text_lower for keyword in suspicious_keywords):
        confidence = random.uniform(0.70, 0.99)
    else:
        confidence = random.uniform(0.01, 0.40)
        
    label = "Potentially Fraudulent" if confidence >= 0.5 else "Legitimate"
    
    return {
        "label": label,
        "confidence_score": round(confidence, 4)
    }