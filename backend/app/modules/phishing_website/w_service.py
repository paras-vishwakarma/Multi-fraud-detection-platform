import random


def check_url(url: str) -> dict:
    """
    Placeholder phishing URL checker.
    Replace with your ML model once it's trained and exported.
    """
    suspicious_patterns = [
        "login", "verify", "secure", "account", "update",
        "confirm", "banking", "paypal", "signin", "password"
    ]

    url_lower = url.lower()

    if any(pattern in url_lower for pattern in suspicious_patterns):
        confidence = random.uniform(0.65, 0.99)
    else:
        confidence = random.uniform(0.01, 0.35)

    label = "Phishing" if confidence >= 0.5 else "Legitimate"

    return {
        "label": label,
        "confidence_score": round(confidence, 4)
    }