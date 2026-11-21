export default function RiskBadge({ risk }) {
  const value = String(risk || "").toLowerCase();

  const styles = {
    high: "bg-red-400/10 text-red-300 border-red-400/20",
    medium: "bg-amber-400/10 text-amber-300 border-amber-400/20",
    low: "bg-emerald-400/10 text-emerald-300 border-emerald-400/20",
    safe: "bg-emerald-400/10 text-emerald-300 border-emerald-400/20",
    legitimate: "bg-emerald-400/10 text-emerald-300 border-emerald-400/20",
    phishing: "bg-red-400/10 text-red-300 border-red-400/20",
    spam: "bg-amber-400/10 text-amber-300 border-amber-400/20",
    fraud: "bg-red-400/10 text-red-300 border-red-400/20",
  };

  const label = value
    ? value.charAt(0).toUpperCase() + value.slice(1)
    : "Unknown";

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
        styles[value] || "border-slate-700 bg-slate-800 text-slate-300"
      }`}
    >
      {label}
    </span>
  );
}
