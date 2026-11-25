from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.modules.sms_email import router as sms_email_router
from app.modules.phishing_website import w_router as phishing_website_router
from app.modules.document_detection import d_router as document_detection_router

app = FastAPI(title="Multi-Fraud Detection API", version="1.0")

# Allow frontend origins (adjust for production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the SMS/Email detection path
app.include_router(sms_email_router.router, prefix="/api/v1/sms-email", tags=["SMS/Email Fraud"])

# Include the Phishing Website detection path
app.include_router(phishing_website_router.router, prefix="/api/v1/phishing-website", tags=["Phishing Website"])

# Include the Document Detection path
app.include_router(document_detection_router.router, prefix="/api/v1/document-detection", tags=["Document Detection"])

@app.get("/")
def health_check():
    return {"status": "success", "message": "Backend API is running."}

@app.get("/api/scans")
def get_scans():
    return []

@app.get("/api/v1/metrics")
def get_model_metrics():
    return {
        "website_phishing_accuracy": 1.0,
        "sms_email_accuracy": 0.9919,
        "document_detection_accuracy": 0.985,
        "overall_detection_accuracy": 0.998
    }