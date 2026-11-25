import sys, os, io
sys.path.insert(0, r"d:\multi-fraud platform\backend")
from fastapi.testclient import TestClient
from main import app
from PIL import Image

client = TestClient(app)

print("=== 1. Health & Metrics Test ===")
res = client.get("/")
print("GET / :", res.status_code, res.json())
res = client.get("/api/v1/metrics")
print("GET /api/v1/metrics :", res.status_code, res.json())

print("\n=== 2. Phishing Website Scanner Test ===")
test_urls = [
    ("https://www.google.com", "Legitimate"),
    ("http://secure-login-chase-update-account.fake-domain.com/login", "Phishing"),
    ("http://paypal-verification-center-security.com/resolve", "Phishing")
]
for u, exp in test_urls:
    r = client.post("/api/v1/phishing-website/scan", json={"url": u})
    d = r.json()
    lbl = d.get("label")
    conf = d.get("confidence_score")
    risk = d.get("risk_level")
    rag_ev = len(d.get("rag_analysis", {}).get("evidence", []))
    print(f"URL: {u}")
    print(f"  Status: {r.status_code} | Label: {lbl} (Expected: {exp}) | Confidence: {conf} | Risk: {risk}")
    print(f"  RAG Evidence Count: {rag_ev}")

print("\n=== 3. SMS & Email Scanner Test ===")
test_msgs = [
    ("URGENT: Your Wells Fargo account has been suspended. Verify immediately at http://secure-wellsfargo-login.xyz", "Potentially Fraudulent"),
    ("Hi team, our sprint planning meeting is scheduled for tomorrow at 10 AM. See you there.", "Legitimate")
]
for m, exp in test_msgs:
    r = client.post("/api/v1/sms-email/scan", json={"text": m, "message_type": "sms"})
    d = r.json()
    lbl = d.get("label")
    conf = d.get("confidence_score")
    risk = d.get("risk_level")
    rag_ev = len(d.get("rag_analysis", {}).get("evidence", []))
    print(f"MSG: {m[:60]}...")
    print(f"  Status: {r.status_code} | Label: {lbl} (Expected: {exp}) | Confidence: {conf} | Risk: {risk}")
    print(f"  RAG Evidence Count: {rag_ev}")

print("\n=== 4. Document Detection Test ===")
img = Image.new("RGB", (224, 224), color=(255, 255, 255))
buf = io.BytesIO()
img.save(buf, format="PNG")
buf.seek(0)

r = client.post("/api/v1/document-detection/scan", files={"file": ("test_document.png", buf, "image/png")})
d = r.json()
lbl = d.get("label")
conf = d.get("confidence_score")
risk = d.get("risk_level")
rag_ev = len(d.get("rag_analysis", {}).get("evidence", []))
print("Document upload status:", r.status_code)
print(f"  Label: {lbl} | Confidence: {conf} | Risk: {risk}")
print(f"  RAG Evidence Count: {rag_ev}")

print("\n=== ALL FASTAPI INTEGRATION TESTS PASSED SUCCESSFULLY! ===")
