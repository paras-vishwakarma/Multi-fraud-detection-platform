export default function RiskBadge({ risk }) {
  const value = String(risk || "").toLowerCase().replace(/\s+/g, "");

  const styles = {
    safe: "bg-emerald-50 text-emerald-700 border-emerald-200",
    suspicious: "bg-amber-50 text-amber-700 border-amber-200",
    highrisk: "bg-orange-50 text-orange-700 border-orange-200",
    fraud: "bg-rose-50 text-rose-700 border-rose-200",
  };

  const dotColors = {
    safe: "bg-emerald-500",
    suspicious: "bg-amber-500",
    highrisk: "bg-orange-500",
    fraud: "bg-rose-500",
  };

  const labels = {
    safe: "Safe",
    suspicious: "Suspicious",
    highrisk: "High Risk",
    fraud: "Fraud",
  };

  const label = labels[value] || (risk ? risk : "Unknown");

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${styles[value] || "border-[#DCE3EA] bg-slate-50 text-slate-600"
        }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dotColors[value] || "bg-slate-400"}`} />
      {label}
    </span>
  );
}
