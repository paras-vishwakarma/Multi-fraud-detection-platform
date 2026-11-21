
import { useState } from "react";
import { Globe, ShieldAlert, LoaderCircle } from "lucide-react";
import { analyzeWebsite } from "../services/api";
import RiskBadge from "../components/RiskBadge";

export default function WebsiteAnalyzer() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleAnalyze() {
    let parsed;

    try {
      parsed = new URL(url.trim());
    } catch {
      setError("Enter a valid website URL.");
      return;
    }

    if (!["http:", "https:"].includes(parsed.protocol)) {
      setError("Only HTTP and HTTPS URLs are supported.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const data = await analyzeWebsite(url.trim());
      setResult(data);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        "Website analysis failed. Check your backend."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">
          Website Fraud Detection
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Submit a URL to analyze it with your phishing detection model.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-[#111827] p-6">
        <label htmlFor="url" className="text-sm font-medium text-white">
          Website URL
        </label>

        <div className="mt-3 flex flex-col gap-3 sm:flex-row">
          <input
            id="url"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAnalyze();
            }}
            placeholder="https://example.com"
            className="min-w-0 flex-1 rounded-xl border border-slate-700 bg-[#0b1120] px-4 py-3 text-white placeholder:text-slate-600"
          />

          <button
            type="button"
            onClick={handleAnalyze}
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 hover:bg-cyan-300"
          >
            {loading ? (
              <LoaderCircle className="animate-spin" size={18} />
            ) : (
              <Globe size={18} />
            )}
            {loading ? "Scanning..." : "Scan URL"}
          </button>
        </div>

        <p className="mt-3 text-xs text-slate-500">
          A valid URL alone does not establish that a website is safe.
          Do not open suspicious links to test them.
        </p>

        {error && (
          <p role="alert" className="mt-4 text-sm text-red-300">
            {error}
          </p>
        )}
      </div>

      {result && (
        <div className="rounded-2xl border border-slate-800 bg-[#111827] p-6">
          <div className="flex items-center gap-3">
            <ShieldAlert className="text-cyan-300" size={24} />
            <h2 className="text-lg font-semibold text-white">
              Website Analysis Results
            </h2>
          </div>

          <p className="mt-4 break-all text-sm text-slate-300">
            URL: {result.url || url}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <RiskBadge risk={result.risk || result.risk_level} />
            <span className="text-sm text-slate-300">
              {result.prediction || result.label || "Unknown"}
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
