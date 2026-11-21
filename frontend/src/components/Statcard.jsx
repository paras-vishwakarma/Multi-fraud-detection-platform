export default function StatCard({
  title,
  value,
  description,
  icon: Icon,
  color = "cyan",
}) {
  const colors = {
    cyan: "bg-cyan-400/10 text-cyan-300",
    red: "bg-red-400/10 text-red-300",
    green: "bg-emerald-400/10 text-emerald-300",
    purple: "bg-purple-400/10 text-purple-300",
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-[#111827] p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-400">{title}</p>
          <h3 className="mt-3 text-3xl font-bold text-white">
            {value}
          </h3>
        </div>

        <div className={`rounded-xl p-3 ${colors[color] || colors.cyan}`}>
          {Icon && <Icon size={22} />}
        </div>
      </div>

      <p className="mt-4 text-xs text-slate-500">{description}</p>
    </div>
  );
}
