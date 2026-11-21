import { useState } from "react";
import {
  MessageSquareWarning,
  Mail,
  MessageSquare,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  LoaderCircle,
  Copy,
  CheckCircle2,
  RotateCcw,
} from "lucide-react";
import { scanText } from "../services/api";
import RiskBadge from "../components/RiskBadge";

const SAMPLE_TEMPLATES = [
  {
    type: "sms",
    label: "Bank Alert Scam",
    text: "URGENT: Your Wells Fargo account has been suspended due to suspicious activity. Verify immediately at http://secure-wellsfargo-login.xyz to avoid permanent closure.",
  },
  {
    type: "sms",
    label: "Lottery / Prize Scam",
    text: "Congratulations! You won a $1,000 Walmart gift card. Claim your prize now by calling 1-800-FAKE or clicking http://claim-giftcard-now.net",
  },
  {
    type: "email",
    label: "Package Delivery Phishing",
    text: "Dear Customer, Your FedEx shipment #849204 could not be delivered due to an incorrect address. Please update your delivery details and pay the $1.99 redelivery fee at http://fedx-trackings-update.com",
  },
  {
    type: "email",
    label: "Legitimate Notification",
    text: "Hi Team, reminder that our weekly project sync is scheduled for tomorrow at 10:00 AM in Conference Room B. Please review the quarterly roadmap deck attached before the meeting.",
  },
];

export default function SmsAnalyzer() {
  const [messageType, setMessageType] = useState("sms");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);

  async function handleAnalyze(e) {
    if (e) e.preventDefault();
    if (!text.trim()) {
      setError("Please enter or paste message content to analyze.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const data = await scanText(text.trim(), messageType);
      setResult(data);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Failed to analyze message. Please ensure the backend is running at http://127.0.0.1:8000."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setText("");
    setResult(null);
    setError("");
  }

  function handleCopy() {
    if (!result) return;
    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const isThreat =
    result?.label?.toLowerCase().includes("spam") ||
    result?.label?.toLowerCase().includes("fraud") ||
    result?.label?.toLowerCase().includes("phish");

  const confidencePercent = result?.confidence_score
    ? Math.round(result.confidence_score * 100)
    : null;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-300">
          <MessageSquareWarning size={14} />
          NLP Fraud & Phishing Detection
        </div>
        <h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
          SMS & Email Fraud Detection
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Analyze suspicious text messages, SMS alerts, and phishing emails using deep natural language models.
        </p>
      </div>

      {/* Main Analysis Form Card */}
      <div className="rounded-2xl border border-slate-800 bg-[#111827] p-6 shadow-xl">
        <form onSubmit={handleAnalyze} className="space-y-5">
          {/* Channel selector */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Message Type:
            </span>
            <div className="inline-flex rounded-xl border border-slate-800 bg-slate-900 p-1">
              <button
                type="button"
                onClick={() => setMessageType("sms")}
                className={`flex items-center gap-2 rounded-lg px-4 py-1.5 text-xs font-medium transition ${
                  messageType === "sms"
                    ? "bg-cyan-500 text-slate-950 font-semibold shadow"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <MessageSquare size={14} />
                SMS
              </button>
              <button
                type="button"
                onClick={() => setMessageType("email")}
                className={`flex items-center gap-2 rounded-lg px-4 py-1.5 text-xs font-medium transition ${
                  messageType === "email"
                    ? "bg-cyan-500 text-slate-950 font-semibold shadow"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Mail size={14} />
                Email
              </button>
            </div>
          </div>

          {/* Quick sample templates */}
          <div>
            <span className="text-xs text-slate-500">Quick Test Samples:</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {SAMPLE_TEMPLATES.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setMessageType(sample.type);
                    setText(sample.text);
                    setError("");
                    setResult(null);
                  }}
                  className="rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-xs text-slate-300 transition hover:border-cyan-400/50 hover:bg-slate-800"
                >
                  {sample.label}
                </button>
              ))}
            </div>
          </div>

          {/* Message Textarea */}
          <div>
            <label htmlFor="message-input" className="block text-xs font-medium text-slate-300">
              Message Content
            </label>
            <div className="relative mt-2">
              <textarea
                id="message-input"
                rows={5}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste the SMS text or email body here to analyze..."
                className="w-full rounded-xl border border-slate-800 bg-[#0b1120] p-4 text-sm text-slate-200 placeholder-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
              />
              <div className="absolute bottom-3 right-3 text-xs text-slate-500">
                {text.length} characters
              </div>
            </div>
          </div>

          {error && (
            <div
              role="alert"
              className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300"
            >
              <AlertTriangle size={18} className="shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={loading || !text.trim()}
              className="flex items-center gap-2 rounded-xl bg-cyan-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <LoaderCircle className="animate-spin" size={18} />
                  Analyzing Message...
                </>
              ) : (
                <>
                  <MessageSquareWarning size={18} />
                  Scan Message
                </>
              )}
            </button>

            {text && (
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-2 rounded-xl border border-slate-800 px-4 py-3 text-sm font-medium text-slate-400 transition hover:bg-slate-800 hover:text-white"
              >
                <RotateCcw size={16} />
                Reset
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Analysis Result Card */}
      {result && (
        <div
          className={`rounded-2xl border p-6 shadow-xl transition-all ${
            isThreat
              ? "border-red-500/30 bg-gradient-to-br from-red-950/20 to-[#111827]"
              : "border-emerald-500/30 bg-gradient-to-br from-emerald-950/20 to-[#111827]"
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
            <div className="flex items-center gap-3">
              <div
                className={`rounded-xl p-3 ${
                  isThreat
                    ? "bg-red-500/10 text-red-400"
                    : "bg-emerald-500/10 text-emerald-400"
                }`}
              >
                {isThreat ? <ShieldAlert size={26} /> : <ShieldCheck size={26} />}
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">
                  Detection Verdict: {result.label}
                </h2>
                <p className="text-xs text-slate-400">
                  Channel: {messageType.toUpperCase()} · AI Classification
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <RiskBadge risk={isThreat ? "high" : "safe"} />
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-300 hover:border-slate-500"
                title="Copy JSON result"
              >
                {copied ? (
                  <>
                    <CheckCircle2 size={14} className="text-emerald-400" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy size={14} />
                    Export
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {/* Confidence Score Bar */}
            <div className="rounded-xl border border-slate-800/80 bg-[#0b1120] p-4">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Model Confidence</span>
                <span className="font-semibold text-white">
                  {confidencePercent !== null ? `${confidencePercent}%` : "N/A"}
                </span>
              </div>
              <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-slate-800">
                <div
                  className={`h-full transition-all duration-500 ${
                    isThreat ? "bg-red-400" : "bg-emerald-400"
                  }`}
                  style={{ width: `${confidencePercent || 100}%` }}
                />
              </div>
              <p className="mt-3 text-xs text-slate-400">
                {isThreat
                  ? "High probability of deceptive or fraudulent intent detected."
                  : "Message appears standard with normal patterns."}
              </p>
            </div>

            {/* Recommended Safety Action */}
            <div className="rounded-xl border border-slate-800/80 bg-[#0b1120] p-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Recommended Action
              </div>
              <p className="mt-2 text-xs leading-5 text-slate-300">
                {isThreat
                  ? "Do not click links, reply, or share OTPs or passwords. Block the sender and report to telecom/email abuse filters."
                  : "No malicious patterns flagged. Always verify unfamiliar sender domains before sharing personal info."}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
