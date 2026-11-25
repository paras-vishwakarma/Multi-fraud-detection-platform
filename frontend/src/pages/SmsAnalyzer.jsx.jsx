
import { useState } from "react";
import { analyzeSms } from "../services/api";
import { ShieldAlert, LoaderCircle } from "lucide-react";
import RiskBadge from "../components/RiskBadge";

export default function SmsAnalyzer() {
  const [message, setMessage] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleAnalyze() {
    if (!message.trim()) {
      setError("Enter a message before analyzing.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const data = await analyzeSms(message);
      setResult(data);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        "Analysis failed. Check whether your FastAPI backend is running."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">
          SMS & Email Fraud Detection
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Check messages for suspicious links, scam language and phishing indicators.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-[#111827] p-6">
        <label htmlFor="sms" className="text-sm font-medium text-white">
          Message content
        </label>

        <textarea
          id="sms"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Example: Your account requires verification..."
          rows={8}
          maxLength={10000}
          className="mt-3 w-full rounded-xl border border-slate-700 bg-[#0b1120] p-4 text-sm text-white placeholder:text-slate-600"
        />

        <div className="mt-2 flex justify-between text-xs text-slate-500">
          <span>Do not enter passwords or confidential information.</span>
          <span>{message.length}/10000</span>
        </div>

        <button
          type="button"
          onClick={handleAnalyze}
          disabled={loading}
          className="mt-5 flex items-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 hover:bg-cyan-300"
        >
          {loading ? (
            <LoaderCircle className="animate-spin" size={18} />
          ) : (
            <ShieldAlert size={18} />
          )}
          {loading ? "Analyzing..." : "Analyze Message"}
        </button>

        {error && (
          <p role="alert" className="mt-4 text-sm text-red-300">
            {error}
          </p>
        )}
      </div>

      {result && (
        <div className="rounded-2xl border border-slate-800 bg-[#111827] p-6">
          <h2 className="text-lg font-semibold text-white">
            Analysis Results
          </h2>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <RiskBadge risk={result.risk || result.risk_level} />
            <span className="text-sm text-slate-300">
              Prediction: {result.prediction || result.label || "Unavailable"}
            </span>
          </div>

          {result.risk_score != null && (
            <p className="mt-4 text-sm text-slate-300">
              Risk score: {result.risk_score}%
            </p>
          )}

          <p className="mt-4 text-sm leading-6 text-slate-400">
            {result.explanation || "No explanation was returned by the API."}
          </p>
        </div>
      )}
    </div>
  );
}
