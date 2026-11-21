import { useEffect, useState } from "react";
import { History, RefreshCw, Trash2 } from "lucide-react";
import RiskBadge from "../components/RiskBadge";
import api from "../services/api";

export default function ScanHistory() {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function loadHistory() {
    setLoading(true);
    setError("");

    try {
      const res = await api.get("/api/scans");
      const list = Array.isArray(res.data) ? res.data : res.data.items || [];
      setScans(list);
    } catch {
      // Gracefully fall back to locally saved scans from current browser session
      try {
        const local = JSON.parse(localStorage.getItem("fraudguard_scans") || "[]");
        setScans(local);
      } catch {
        setError("Unable to load scan history.");
      }
    } finally {
      setLoading(false);
    }
  }

  function handleClearHistory() {
    localStorage.removeItem("fraudguard_scans");
    setScans([]);
  }

  useEffect(() => {
    loadHistory();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Scan History
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Review previous fraud analysis results and security scans.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {scans.length > 0 && (
            <button
              type="button"
              onClick={handleClearHistory}
              className="flex items-center gap-2 rounded-xl border border-red-500/30 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10"
            >
              <Trash2 size={16} />
              Clear History
            </button>
          )}

          <button
            type="button"
            onClick={loadHistory}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl border border-slate-700 px-4 py-2.5 text-sm text-slate-300 hover:border-cyan-400"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div role="alert" className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-[#111827]">
        <table className="w-full min-w-[650px] text-left text-sm">
          <thead className="border-b border-slate-800 text-slate-400">
            <tr>
              <th className="px-5 py-4">Type</th>
              <th className="px-5 py-4">Target / Content</th>
              <th className="px-5 py-4">Prediction</th>
              <th className="px-5 py-4">Risk Level</th>
              <th className="px-5 py-4">Date</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800">
            {!loading && scans.map((scan, index) => (
              <tr key={scan.id ?? index} className="hover:bg-slate-800/30">
                <td className="px-5 py-4 font-medium text-cyan-300">
                  {scan.type || scan.scan_type || "Unknown"}
                </td>
                <td className="max-w-xs truncate px-5 py-4 text-slate-300" title={scan.target || scan.filename || scan.url}>
                  {scan.target || scan.filename || scan.url || "—"}
                </td>
                <td className="px-5 py-4 text-slate-300 font-semibold">
                  {scan.prediction || scan.label || "—"}
                </td>
                <td className="px-5 py-4">
                  <RiskBadge risk={scan.risk || scan.risk_level || (scan.prediction?.toLowerCase().includes("spam") ? "high" : "safe")} />
                </td>
                <td className="px-5 py-4 text-slate-400">
                  {scan.created_at
                    ? new Date(scan.created_at).toLocaleString()
                    : "—"}
                </td>
              </tr>
            ))}

            {!loading && scans.length === 0 && !error && (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <History size={32} className="text-slate-600" />
                    <span>No scan history yet. Run a scan from the SMS, Website, or Document modules!</span>
                  </div>
                </td>
              </tr>
            )}

            {loading && (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center text-slate-400">
                  Loading scan history...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
