import { useState } from "react";
import {
  FileText,
  Upload,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  LoaderCircle,
  Copy,
  CheckCircle2,
  RotateCcw,
  BookOpen,
  Sparkles,
  Layers,
  Check,
  FileSearch,
} from "lucide-react";
import { scanDocument } from "../services/api";
import RiskBadge from "../components/Riskbadge";

export default function DocumentAnalyzer() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);

  function selectFile(e) {
    const chosen = e.target.files?.[0];
    if (chosen) {
      setFile(chosen);
      setError("");
      setResult(null);
    }
  }

  async function handleAnalyze() {
    if (!file) {
      setError("Please select a document file (.pdf, .jpg, .png) to analyze.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const data = await scanDocument(file);
      setResult(data);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Failed to analyze document. Please ensure your backend is running at http://127.0.0.1:8000."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setFile(null);
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
    result?.label?.toLowerCase().includes("tampered") ||
    result?.label?.toLowerCase().includes("fraud") ||
    result?.label?.toLowerCase().includes("fake") ||
    result?.label?.toLowerCase().includes("forged");

  const confidencePercent = result?.confidence_score
    ? Math.round(result.confidence_score * 100)
    : null;

  const rag = result?.rag_analysis;

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-12">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3.5 py-1 text-xs font-semibold text-cyan-300">
          <FileText size={14} className="text-cyan-400" />
          Document Forgery & Visual Tampering RAG
        </div>
        <h1 className="mt-2.5 text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Document Forgery & Tampering Detection
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Analyze invoices, identity documents, credentials, and receipts for optical tampering,
          splicing artifacts, and mismatched formatting with RAG forensic standards.
        </p>
      </div>

      {/* Upload Zone Card */}
      <div className="rounded-2xl border border-slate-800 bg-[#111827] p-6 shadow-xl backdrop-blur-xl">
        <label
          htmlFor="document-upload"
          className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-700 bg-[#0b1120] p-8 text-center transition hover:border-cyan-400/50 hover:bg-slate-900/60"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-cyan-950/50 text-cyan-400 border border-cyan-500/20">
            <Upload size={24} />
          </div>
          <span className="mt-3 text-sm font-semibold text-white">
            {file ? file.name : "Click or drop a file to upload"}
          </span>
          <span className="mt-1 text-xs text-slate-400">
            Supports JPG, PNG, WEBP, TIFF image documents up to 25 MB
          </span>

          <span className="mt-3 break-all text-xs font-mono text-cyan-400">
            {file ? file.name : "No file selected"}
          </span>

          <input
            id="document-upload"
            type="file"
            accept=".jpg,.jpeg,.png,.webp,.bmp,.tiff,image/jpeg,image/png,image/webp"
            onChange={selectFile}
            className="sr-only"
          />
        </label>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={loading || !file}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#0891B2] to-[#06B6D4] px-6 py-3 text-sm font-bold text-slate-950 shadow-md shadow-cyan-500/25 transition hover:from-[#06B6D4] hover:to-[#22D3EE] hover:shadow-cyan-500/40 disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <LoaderCircle className="animate-spin" size={18} />
                Scanning Visuals & RAG Knowledge...
              </>
            ) : (
              <>
                <FileSearch size={18} />
                Analyze Document
              </>
            )}
          </button>

          {file && (
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

        {error && (
          <p role="alert" className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">
            {error}
          </p>
        )}
      </div>

      {/* Analysis Results Display */}
      {result && (
        <div className="space-y-6">
          <div
            className={`rounded-2xl border p-6 shadow-xl transition-all ${
              isThreat
                ? "border-red-500/35 bg-gradient-to-br from-red-950/20 to-[#111827]"
                : "border-emerald-500/35 bg-gradient-to-br from-emerald-950/20 to-[#111827]"
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
              <div className="flex items-center gap-3">
                <div
                  className={`rounded-xl p-3 ${
                    isThreat
                      ? "bg-red-500/15 text-red-400"
                      : "bg-emerald-500/15 text-emerald-400"
                  }`}
                >
                  {isThreat ? <ShieldAlert size={28} /> : <ShieldCheck size={28} />}
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
                  <p className="mt-0.5 text-xs text-slate-400">
                    File: {file?.name || "Target Document"} · Evaluated with Vision & RAG Forensics
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <RiskBadge risk={isThreat ? "high" : "safe"} />
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-300 hover:border-cyan-400/50 transition"
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

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {/* Confidence Score Bar */}
              <div className="rounded-xl border border-slate-800 bg-[#0b1120] p-4">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Tampering Risk Probability</span>
                  <span className="font-semibold text-white">
                    {confidencePercent !== null ? `${confidencePercent}%` : "N/A"}
                  </span>
                </div>
                <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-slate-800">
                  <div
                    className={`h-full transition-all duration-500 ${
                      isThreat ? "bg-red-400" : "bg-cyan-400"
                    }`}
                    style={{ width: `${confidencePercent || 100}%` }}
                  />
                </div>
                <p className="mt-2.5 text-xs text-slate-400">
                  {isThreat
                    ? "Deep learning model observed anomalous compression or splicing signatures."
                    : "No visual manipulation or optical tampering patterns detected."}
                </p>
              </div>

              {/* OCR Parsing Summary */}
              <div className="rounded-xl border border-slate-800 bg-[#0b1120] p-4">
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-400">
                  <span>OCR Text Parsing</span>
                  <span className={result.text_extracted ? "text-cyan-400 font-bold" : "text-slate-400"}>
                    {result.text_extracted ? "Text Detected" : "No OCR Text"}
                  </span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-slate-200 font-mono line-clamp-2">
                  "{result.ocr_preview || "No readable text detected"}"
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
                Extracted visual anomalies, optical typography, and layout checks:
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

          {/* Security Knowledge Base & Standards */}
          {rag?.knowledge_base_matches && rag.knowledge_base_matches.length > 0 && (
            <div className="rounded-2xl border border-slate-800 bg-[#111827] p-6 shadow-xl">
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-slate-200">
                <BookOpen size={16} className="text-cyan-400" />
                Knowledge Base & Document Standards (ICAO / ISO)
              </div>
              <p className="mt-1 text-xs text-slate-400">
                Matched document forgery vectors and international identity document guidelines:
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
                          Verification Guideline:
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
                Actionable Verification & KYC Checklist
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
