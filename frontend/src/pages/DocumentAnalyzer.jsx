
import { useState } from "react";
import { FileSearch, Upload, LoaderCircle } from "lucide-react";
import { analyzeDocument } from "../services/api";
import RiskBadge from "../components/RiskBadge";

export default function DocumentAnalyzer() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function selectFile(event) {
    const selected = event.target.files?.[0];

    setError("");
    setResult(null);
    setFile(null);

    if (!selected) return;

    const allowed = ["application/pdf", "image/jpeg", "image/png"];
    const allowedExtensions = [".pdf", ".jpg", ".jpeg", ".png"];
    const extension = selected.name
      .slice(selected.name.lastIndexOf("."))
      .toLowerCase();

    if (
      !allowed.includes(selected.type) ||
      !allowedExtensions.includes(extension)
    ) {
      setError("Upload a PDF, JPG, JPEG or PNG file.");
      event.target.value = "";
      return;
    }

    if (selected.size > 10 * 1024 * 1024) {
      setError("Maximum file size is 10 MB.");
      event.target.value = "";
      return;
    }

    setFile(selected);
  }

  async function handleAnalyze() {
    if (!file) {
      setError("Choose a document first.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const data = await analyzeDocument(file);
      setResult(data);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        "Document analysis failed. Check your backend."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">
          Document Fraud Detection
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Upload a document for OCR, text extraction and fraud analysis.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-[#111827] p-6">
        <label
          htmlFor="document"
          className="flex cursor-pointer flex-col items-center rounded-xl border-2 border-dashed border-slate-700 bg-[#0b1120] px-5 py-12 text-center hover:border-cyan-400/60"
        >
          <Upload className="mb-4 text-cyan-300" size={36} />

          <span className="font-semibold text-white">
            Choose a document to analyze
          </span>

          <span className="mt-2 text-sm text-slate-500">
            PDF, JPG, JPEG or PNG · Maximum 10 MB
          </span>

          <span className="mt-4 break-all text-sm text-cyan-300">
            {file ? file.name : "No file selected"}
          </span>

          <input
            id="document"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
            onChange={selectFile}
            className="sr-only"
          />
        </label>

        <button
          type="button"
          onClick={handleAnalyze}
          disabled={loading || !file}
          className="mt-5 flex items-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 hover:bg-cyan-300"
        >
          {loading ? (
            <LoaderCircle className="animate-spin" size={18} />
          ) : (
            <FileSearch size={18} />
          )}
          {loading ? "Analyzing document..." : "Analyze Document"}
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
            Document Analysis Results
          </h2>

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

          {result.extracted_text && (
            <div className="mt-5">
              <h3 className="mb-2 text-sm font-semibold text-white">
                Extracted Text
              </h3>
              <pre className="max-h-72 overflow-auto whitespace-pre-wrap break-words rounded-xl bg-[#0b1120] p-4 text-xs leading-6 text-slate-400">
                {result.extracted_text}
              </pre>
            </div>
          )}

          <p className="mt-4 text-sm leading-6 text-slate-400">
            {result.explanation || "No explanation was returned by the API."}
          </p>
        </div>
      )}
    </div>
  );
}
