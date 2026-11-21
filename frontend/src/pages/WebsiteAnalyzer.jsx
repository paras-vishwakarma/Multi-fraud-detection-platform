import { useState } from "react";
import {
  Globe,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  LoaderCircle,
  ExternalLink,
  Copy,
  CheckCircle2,
  Lock,
  Unlock,
  RotateCcw,
} from "lucide-react";
import { scanWebsite } from "../services/api";
import RiskBadge from "../components/RiskBadge";

const SAMPLE_URLS = [
  {
    label: "Suspicious Bank Clone",
    url: "http://secure-login-chase-update-account.fake-domain.com/login",
  },
  {
    label: "Fake PayPal Verification",
    url: "http://paypal-verification-center-security.com/resolve",
  },
  {
    label: "Legitimate Portal (Google)",
    url: "https://www.google.com",
  },
  {
    label: "Legitimate Portal (GitHub)",
    url: "https://github.com",
  },
];

export default function WebsiteAnalyzer() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);

  async function handleAnalyze(e) {
    if (e) e.preventDefault();
    if (!url.trim()) {
      setError("Please enter a website URL to scan.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const data = await scanWebsite(url.trim());
      setResult(data);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Failed to scan website. Please verify your backend server is active at http://127.0.0.1:8000."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setUrl("");
    setResult(null);
    setError("");
  }

  function handleCopy() {
    if (!result) return;
    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const isPhishing =
    result?.label?.toLowerCase().includes("phish") ||
    result?.label?.toLowerCase().includes("bad") ||
    result?.label?.toLowerCase().includes("fraud") ||
    result?.label?.toLowerCase().includes("malicious");

  const confidencePercent = result?.confidence_score
    ? Math.round(result.confidence_score * 100)
    : null;

  const hasHttps = url.startsWith("https://");

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-300">
          <Globe size={14} />
          URL Threat Intelligence
        </div>
        <h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
          Phishing Website Scanner
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Detect fraudulent URLs, typosquatting domains, credential-harvesting pages, and scam links.
        </p>
      </div>

      {/* Main Analysis Form */}
      <div className="rounded-2xl border border-slate-800 bg-[#111827] p-6 shadow-xl">
        <form onSubmit={handleAnalyze} className="space-y-5">
          {/* Quick test samples */}
          <div>
            <span className="text-xs text-slate-500">Quick Test URLs:</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {SAMPLE_URLS.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setUrl(sample.url);
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

          {/* URL Input */}
          <div>
            <label htmlFor="url-input" className="block text-xs font-medium text-slate-300">
              Target Website URL
            </label>
            <div className="relative mt-2">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500">
                {hasHttps ? (
                  <Lock size={16} className="text-emerald-400" />
                ) : (
                  <Unlock size={16} className="text-amber-400" />
                )}
              </div>
              <input
                id="url-input"
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/login or paste suspicious URL"
                className="w-full rounded-xl border border-slate-800 bg-[#0b1120] py-3.5 pl-11 pr-4 text-sm text-slate-200 placeholder-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
              />
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

          {/* Submit Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={loading || !url.trim()}
              className="flex items-center gap-2 rounded-xl bg-cyan-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <LoaderCircle className="animate-spin" size={18} />
                  Scanning URL...
                </>
              ) : (
                <>
                  <Globe size={18} />
                  Analyze Website
                </>
              )}
            </button>

            {url && (
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

      {/* Results Display */}
      {result && (
        <div
          className={`rounded-2xl border p-6 shadow-xl transition-all ${
            isPhishing
              ? "border-red-500/30 bg-gradient-to-br from-red-950/20 to-[#111827]"
              : "border-emerald-500/30 bg-gradient-to-br from-emerald-950/20 to-[#111827]"
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
            <div className="flex items-center gap-3">
              <div
                className={`rounded-xl p-3 ${
                  isPhishing
                    ? "bg-red-500/10 text-red-400"
                    : "bg-emerald-500/10 text-emerald-400"
                }`}
              >
                {isPhishing ? (
                  <ShieldAlert size={26} />
                ) : (
                  <ShieldCheck size={26} />
                )}
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">
                  Verdict: {result.label}
                </h2>
                <p className="max-w-md truncate text-xs text-slate-400" title={url}>
                  {url}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <RiskBadge risk={isPhishing ? "high" : "safe"} />
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-300 hover:border-slate-500"
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
                    isPhishing ? "bg-red-400" : "bg-emerald-400"
                  }`}
                  style={{ width: `${confidencePercent || 100}%` }}
                />
              </div>
              <p className="mt-3 text-xs text-slate-400">
                {isPhishing
                  ? "Identified characteristic features of known malicious landing pages or phishing heuristics."
                  : "URL passes heuristic checks with no deceptive signatures found."}
              </p>
            </div>

            {/* Recommendations */}
            <div className="rounded-xl border border-slate-800/80 bg-[#0b1120] p-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Security Advisory
              </div>
              <p className="mt-2 text-xs leading-5 text-slate-300">
                {isPhishing
                  ? "DANGER: Do NOT visit this link or enter passwords or personal data. Add to domain blocklists and flag to cybersecurity team."
                  : "Legitimate indicators present. Always ensure the SSL certificate matches the intended company domain."}
              </p>
              <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                <ExternalLink size={12} />
                <span>Protocol: {hasHttps ? "HTTPS (Encrypted)" : "HTTP (Unencrypted)"}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
