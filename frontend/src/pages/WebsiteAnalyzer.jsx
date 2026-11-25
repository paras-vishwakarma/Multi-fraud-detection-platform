import { useState } from "react";
import {
  Globe,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  LoaderCircle,
  Copy,
  CheckCircle2,
  Lock,
  Unlock,
  RotateCcw,
  BookOpen,
  Sparkles,
  Layers,
  Check,
} from "lucide-react";
import { scanWebsite } from "../services/api";
import RiskBadge from "../components/Riskbadge";

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
    label: "IP Address Phishing",
    url: "http://192.168.1.100/webscr/login",
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
  const rag = result?.rag_analysis;

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-12">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3.5 py-1 text-xs font-semibold text-cyan-300">
          <Globe size={14} className="text-cyan-400" />
          URL Threat Intelligence with RAG
        </div>
        <h1 className="mt-2.5 text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Phishing Website Scanner & RAG Intelligence
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Deep learning heuristic detection coupled with Retrieval-Augmented Generation (RAG),
          MITRE ATT&CK knowledgebase evidence, and forensic indicator matching.
        </p>
      </div>

      {/* Main Analysis Form */}
      <div className="rounded-2xl border border-slate-800 bg-[#111827] p-6 shadow-xl backdrop-blur-xl">
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
                  <Lock size={16} className="text-cyan-400" />
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
                className="w-full rounded-xl border border-slate-800 bg-[#0b1120] py-3.5 pl-11 pr-4 text-sm text-slate-100 placeholder-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
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
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#0891B2] to-[#06B6D4] px-6 py-3 text-sm font-bold text-slate-950 shadow-md shadow-cyan-500/25 transition hover:from-[#06B6D4] hover:to-[#22D3EE] hover:shadow-cyan-500/40 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <LoaderCircle className="animate-spin" size={18} />
                  Scanning & Retrieving RAG Evidence...
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
                className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-sm font-medium text-slate-400 transition hover:bg-slate-800 hover:text-white"
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
        <div className="space-y-6">
          {/* Main Verdict Card */}
          <div
            className={`rounded-2xl border p-6 shadow-xl transition-all ${
              isPhishing
                ? "border-red-500/35 bg-gradient-to-br from-red-950/20 to-[#111827]"
                : "border-emerald-500/35 bg-gradient-to-br from-emerald-950/20 to-[#111827]"
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
              <div className="flex items-center gap-3">
                <div
                  className={`rounded-xl p-3 ${
                    isPhishing
                      ? "bg-red-500/15 text-red-400"
                      : "bg-emerald-500/15 text-emerald-400"
                  }`}
                >
                  {isPhishing ? <ShieldAlert size={28} /> : <ShieldCheck size={28} />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-white">
                      Verdict: {result.label}
                    </h2>
                    {result.risk_level && (
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider ${
                          result.risk_level === "CRITICAL" || result.risk_level === "HIGH"
                            ? "bg-red-500/20 text-red-400 border border-red-500/40"
                            : result.risk_level === "MEDIUM"
                            ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                            : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                        }`}
                      >
                        {result.risk_level} Risk
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 max-w-lg truncate text-xs text-slate-400" title={url}>
                    {url}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <RiskBadge risk={isPhishing ? "high" : "safe"} />
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-300 hover:border-cyan-400/50 transition"
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

            {/* Model Confidence & Transport Stats */}
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-800 bg-[#0b1120] p-4">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>ML Confidence Score</span>
                  <span className="font-semibold text-white">
                    {confidencePercent !== null ? `${confidencePercent}%` : "N/A"}
                  </span>
                </div>
                <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-slate-800">
                  <div
                    className={`h-full transition-all duration-500 ${
                      isPhishing ? "bg-red-400" : "bg-cyan-400"
                    }`}
                    style={{ width: `${confidencePercent || 100}%` }}
                  />
                </div>
                <p className="mt-2.5 text-xs text-slate-400">
                  {isPhishing
                    ? "Classification model detected high-risk malicious features."
                    : "No phishing or deceptive heuristics detected."}
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-[#0b1120] p-4">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Network Transport Protocol
                </div>
                <div className="mt-2 flex items-center gap-2 text-sm font-medium text-slate-200">
                  {hasHttps ? (
                    <>
                      <Lock size={16} className="text-cyan-400" />
                      <span>HTTPS (TLS Encrypted)</span>
                    </>
                  ) : (
                    <>
                      <Unlock size={16} className="text-amber-400" />
                      <span className="text-amber-400">HTTP (Unencrypted / Insecure)</span>
                    </>
                  )}
                </div>
                <p className="mt-2 text-xs text-slate-400">
                  {hasHttps
                    ? "Communication is encrypted, but domain legitimacy must still be verified."
                    : "Authentication on unencrypted HTTP is an immediate security vulnerability."}
                </p>
              </div>
            </div>
          </div>

          {/* RAG Grounded Summary Card */}
          {rag?.summary && (
            <div className="rounded-2xl border border-cyan-500/20 bg-gradient-to-r from-cyan-950/20 via-[#111827] to-slate-900/40 p-5 shadow-lg">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400">
                <Sparkles size={16} />
                RAG AI Threat Assessment
              </div>
              <p className="mt-2 text-sm leading-relaxed text-slate-200">
                {rag.summary}
              </p>
            </div>
          )}

          {/* Forensic Evidence Discovered */}
          {rag?.evidence && rag.evidence.length > 0 && (
            <div className="rounded-2xl border border-slate-800 bg-[#111827] p-6 shadow-xl">
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-slate-200">
                <Layers size={16} className="text-cyan-400" />
                Forensic Evidence Discovered ({rag.evidence.length})
              </div>
              <p className="mt-1 text-xs text-slate-400">
                Extracted technical indicators matching known attack vectors:
              </p>

              <div className="mt-4 space-y-3">
                {rag.evidence.map((item, idx) => {
                  const isCrit = item.severity === "CRITICAL";
                  const isHigh = item.severity === "HIGH";
                  const isMed = item.severity === "MEDIUM";
                  return (
                    <div
                      key={idx}
                      className="flex flex-col gap-2 rounded-xl border border-slate-800 bg-[#0b1120] p-3.5 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="space-y-1">
                        <div className="text-xs font-semibold text-slate-200">
                          {item.category}
                        </div>
                        <p className="text-xs text-slate-400">
                          {item.detail}
                        </p>
                      </div>
                      <span
                        className={`inline-flex shrink-0 items-center self-start rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider sm:self-center ${
                          isCrit || isHigh
                            ? "bg-red-500/20 text-red-400 border border-red-500/30"
                            : isMed
                            ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                            : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        }`}
                      >
                        {item.severity}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Security Knowledge Base & MITRE ATT&CK */}
          {rag?.knowledge_base_matches && rag.knowledge_base_matches.length > 0 && (
            <div className="rounded-2xl border border-slate-800 bg-[#111827] p-6 shadow-xl">
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-slate-200">
                <BookOpen size={16} className="text-cyan-400" />
                Knowledge Base & MITRE ATT&CK Intelligence
              </div>
              <p className="mt-1 text-xs text-slate-400">
                Matched adversary tactics, techniques, and procedures (TTPs) retrieved from the cybersecurity knowledge base:
              </p>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {rag.knowledge_base_matches.map((kb, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col justify-between rounded-xl border border-slate-800 bg-[#0b1120] p-4"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="rounded border border-cyan-400/30 bg-cyan-400/10 px-2 py-0.5 font-mono text-xs font-bold text-cyan-300">
                          {kb.id}
                        </span>
                        {kb.mitre_technique && (
                          <span className="text-[11px] text-slate-400">
                            {kb.mitre_technique}
                          </span>
                        )}
                      </div>
                      <h3 className="mt-2 text-sm font-bold text-white">
                        {kb.title}
                      </h3>
                      <div className="mt-1 text-xs font-medium text-slate-400">
                        Vector: <span className="text-slate-300">{kb.attack_vector}</span>
                      </div>
                      <p className="mt-2 text-xs leading-relaxed text-slate-400">
                        {kb.description}
                      </p>
                    </div>

                    {kb.recommended_actions && kb.recommended_actions.length > 0 && (
                      <div className="mt-3 border-t border-slate-800/80 pt-3">
                        <span className="text-[11px] font-semibold text-slate-400">
                          Knowledge Base Recommendation:
                        </span>
                        <p className="mt-1 text-xs text-slate-300">
                          • {kb.recommended_actions[0]}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actionable Remediation Checklist */}
          {rag?.mitigation_steps && rag.mitigation_steps.length > 0 && (
            <div className="rounded-2xl border border-slate-800 bg-[#111827] p-6 shadow-xl">
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-slate-200">
                <CheckCircle2 size={16} className="text-cyan-400" />
                Actionable Defense & Remediation Steps
              </div>
              <ul className="mt-4 space-y-2.5">
                {rag.mitigation_steps.map((step, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 rounded-lg border border-slate-800/60 bg-[#0b1120] p-3 text-xs text-slate-300"
                  >
                    <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-cyan-400/10 text-cyan-400">
                      <Check size={12} />
                    </div>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
