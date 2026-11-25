import os
import math
import re
from urllib.parse import urlparse
import joblib
import pandas as pd

from app.rag import analyze_url_with_rag

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "models", "phishing_model.pkl")

# Suspicious keywords for feature extraction and heuristics
SUSPICIOUS_KEYWORDS = [
    'login', 'verify', 'secure', 'account', 'update', 'banking', 'paypal',
    'signin', 'password', 'confirm', 'wallet', 'recover', 'authenticate',
    'billing', 'appleid', 'chase', 'support', 'token', 'access', 'security',
    'alert', 'revalidate', 'ebay', 'amazon-security', 'admin', 'service',
    'bank', 'checkpoint', 'appeal', 'suspend', 'resolution', 'unlock'
]

SHORTENING_SERVICES = {
    'bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'ow.ly', 'is.gd',
    'buff.ly', 'adf.ly', 'bitly.com', 'bl.ink', 'shorturl.at'
}

# Load the trained machine learning model
model_artifact = None
if os.path.exists(MODEL_PATH):
    try:
        model_artifact = joblib.load(MODEL_PATH)
        print(f"[PhishingService] Loaded ML model successfully from {MODEL_PATH}")
    except Exception as e:
        print(f"[PhishingService] Error loading model artifact: {e}")
        model_artifact = None
else:
    print(f"[PhishingService] Model artifact not found at {MODEL_PATH}")


def extract_url_features(url: str) -> dict:
    """
    Extracts 26 structural, lexical, and security indicators from a target URL.
    """
    url_clean = str(url).strip()
    if not url_clean.startswith(('http://', 'https://')):
        url_with_scheme = 'http://' + url_clean
    else:
        url_with_scheme = url_clean

    parsed = urlparse(url_with_scheme)
    hostname = parsed.netloc or ''
    path = parsed.path or ''
    query = parsed.query or ''

    # Shannon Entropy calculation
    prob = [float(url_clean.count(c)) / len(url_clean) for c in set(url_clean)] if url_clean else [0]
    entropy = -sum([p * math.log2(p) for p in prob]) if prob else 0.0

    url_lower = url_clean.lower()
    host_lower = hostname.lower()

    suspicious_count = sum(1 for w in SUSPICIOUS_KEYWORDS if w in url_lower)
    has_sensitive_keyword = 1 if any(w in url_lower for w in ['login', 'verify', 'secure', 'account', 'banking', 'paypal']) else 0
    is_shortened = 1 if any(s in host_lower for s in SHORTENING_SERVICES) else 0

    host_no_port = hostname.split(':')[0]
    ip_pattern = r'^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$'
    has_ip = 1 if re.match(ip_pattern, host_no_port) else 0

    parts = host_lower.split('.')
    count_subdomains = max(0, len(parts) - 2) if not has_ip else 0
    tld_in_subdomain = 1 if any(tld in host_lower[:-len(parts[-1])] for tld in ['.com', '.net', '.org', '.gov', '.edu']) and len(parts) > 2 else 0

    digits_count = sum(c.isdigit() for c in url_clean)
    digits_ratio = digits_count / len(url_clean) if url_clean else 0.0
    special_chars_count = len(re.findall(r'[^a-zA-Z0-9]', url_clean))

    uci_url_length = 1 if len(url_clean) < 54 else (0 if len(url_clean) <= 75 else -1)
    uci_ssl_state = 1 if parsed.scheme == 'https' else -1

    return {
        'url_length': len(url_clean),
        'hostname_length': len(hostname),
        'path_length': len(path),
        'query_length': len(query),
        'count_dots': url_clean.count('.'),
        'count_hyphens': url_clean.count('-'),
        'count_at': url_clean.count('@'),
        'count_question': url_clean.count('?'),
        'count_equal': url_clean.count('='),
        'count_slash': url_clean.count('/'),
        'count_double_slash': 1 if '//' in path else 0,
        'count_subdomains': count_subdomains,
        'count_digits': digits_count,
        'count_special': special_chars_count,
        'digits_ratio': round(digits_ratio, 4),
        'entropy': round(entropy, 4),
        'has_ip': has_ip,
        'has_https': 1 if parsed.scheme == 'https' else 0,
        'is_shortened': is_shortened,
        'prefix_suffix_hyphen': 1 if '-' in hostname else 0,
        'has_http_in_hostname': 1 if 'http' in host_lower else 0,
        'suspicious_words_count': suspicious_count,
        'has_sensitive_keyword': has_sensitive_keyword,
        'tld_in_subdomain': tld_in_subdomain,
        'uci_url_length': uci_url_length,
        'uci_ssl_state': uci_ssl_state
    }


def check_url(url: str) -> dict:
    """
    Scans a website URL using the trained ML model and generates
    a RAG-augmented analysis with technical evidence and knowledge base citations.
    """
    if not url or not url.strip():
        return {
            "label": "Legitimate",
            "confidence_score": 0.0,
            "risk_level": "SAFE",
            "rag_analysis": {
                "summary": "Empty URL provided.",
                "evidence": [],
                "knowledge_base_matches": [],
                "mitigation_steps": []
            }
        }

    url_clean = url.strip()
    features = extract_url_features(url_clean)
    label = "Legitimate"
    confidence = 0.50

    # If ML model is loaded, perform inference
    if model_artifact is not None and 'model' in model_artifact:
        try:
            model = model_artifact['model']
            feature_cols = model_artifact.get('feature_cols', [])

            features_df = pd.DataFrame([features])[feature_cols]

            # Predict probabilities [P(Legitimate), P(Phishing)]
            probabilities = model.predict_proba(features_df)[0]
            phishing_prob = float(probabilities[1])

            if phishing_prob >= 0.5:
                label = "Phishing"
                confidence = phishing_prob
            else:
                label = "Legitimate"
                confidence = float(probabilities[0])

        except Exception as e:
            print(f"[PhishingService] Inference error, falling back to heuristics: {e}")
            url_lower = url_clean.lower()
            has_kw = any(w in url_lower for w in SUSPICIOUS_KEYWORDS)
            is_http = not url_lower.startswith("https://")
            label = "Phishing" if (has_kw and is_http) or url_lower.count("-") >= 3 else "Legitimate"
            confidence = 0.85
    else:
        # Heuristic fallback if model is unavailable
        url_lower = url_clean.lower()
        has_kw = any(w in url_lower for w in SUSPICIOUS_KEYWORDS)
        is_http = not url_lower.startswith("https://")
        label = "Phishing" if (has_kw and is_http) or url_lower.count("-") >= 3 else "Legitimate"
        confidence = 0.85

    # 3. Augment with RAG Knowledge Base and Evidence
    rag_result = analyze_url_with_rag(
        url=url_clean,
        label=label,
        confidence_score=confidence,
        features=features
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
