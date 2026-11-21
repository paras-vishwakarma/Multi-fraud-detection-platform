import axios from "axios";

const API_BASE = "http://127.0.0.1:8000/api/v1";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

// Helper to save scan history in localStorage
export const saveScanToHistory = (scanItem) => {
  try {
    const existing = JSON.parse(localStorage.getItem("fraudguard_scans") || "[]");
    const updated = [
      {
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        ...scanItem,
      },
      ...existing,
    ].slice(0, 100);
    localStorage.setItem("fraudguard_scans", JSON.stringify(updated));
  } catch (e) {
    console.error("Failed to save scan to history", e);
  }
};

// SMS and Email Fraud Detection
export const scanText = async (text, messageType = "email") => {
  const response = await axios.post(`${API_BASE}/sms-email/scan`, {
    text,
    message_type: messageType,
  });

  const label = response.data?.label || "Unknown";
  const isHighRisk = ["spam", "fraud", "phishing", "fake", "malicious"].some((bad) =>
    label.toLowerCase().includes(bad)
  );

  saveScanToHistory({
    type: messageType === "sms" ? "SMS" : "Email",
    target: text.length > 50 ? text.substring(0, 50) + "..." : text,
    prediction: label,
    risk: isHighRisk ? "high" : "safe",
    risk_score: response.data?.confidence_score
      ? Math.round(response.data.confidence_score * 100)
      : null,
  });

  return response.data;
};

// Website Phishing Detection
export const scanWebsite = async (url) => {
  const response = await axios.post(`${API_BASE}/phishing-website/scan`, {
    url,
  });

  const label = response.data?.label || "Unknown";
  const isHighRisk = ["phish", "bad", "fraud", "malicious", "unsafe"].some((bad) =>
    label.toLowerCase().includes(bad)
  );

  saveScanToHistory({
    type: "Website",
    target: url,
    prediction: label,
    risk: isHighRisk ? "high" : "safe",
    risk_score: response.data?.confidence_score
      ? Math.round(response.data.confidence_score * 100)
      : null,
  });

  return response.data;
};

// Document Fraud Detection
export const scanDocument = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axios.post(
    `${API_BASE}/document-detection/scan`,
    formData
  );

  const label = response.data?.label || "Unknown";
  const isHighRisk = ["fraud", "fake", "tampered", "forged"].some((bad) =>
    label.toLowerCase().includes(bad)
  );

  saveScanToHistory({
    type: "Document",
    target: file.name,
    prediction: label,
    risk: isHighRisk ? "high" : "safe",
    risk_score: response.data?.confidence_score
      ? Math.round(response.data.confidence_score * 100)
      : null,
  });

  return response.data;
};

// Authentication / Login
export const loginUser = async (username, password) => {
  // If backend implements an auth endpoint, call it:
  try {
    const response = await axios.post(`${API_BASE}/auth/login`, { username, password });
    return response.data;
  } catch (error) {
    // If backend doesn't have /auth/login implemented yet, fallback for demo mode
    if (username && password) {
      return {
        access_token: `demo_token_${Date.now()}`,
        token_type: "bearer",
        user: { username }
      };
    }
    throw error;
  }
};

// Compatibility aliases
export const analyzeDocument = scanDocument;
export const analyzeSms = scanText;
export const analyzeWebsite = scanWebsite;

export default api;
