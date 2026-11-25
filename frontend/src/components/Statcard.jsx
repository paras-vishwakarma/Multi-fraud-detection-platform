import { motion } from "framer-motion";

export default function StatCard({
  title,
  value,
  change,
  changeType = "up",
  icon: Icon,
  delay = 0,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className="rounded-2xl border border-[#DCE3EA] bg-white p-5 shadow-sm transition hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
            {title}
          </p>
          <h3 className="mt-2 text-2xl font-bold tracking-tight text-[#1E293B]">
            {value}
          </h3>
          {change && (
            <p className={`mt-1.5 text-xs font-medium ${changeType === "up" ? "text-emerald-600" : "text-amber-600"
              }`}>
              {changeType === "up" ? "↑" : "↓"} {change}
            </p>
          )}
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E6F9FC] text-[#0891B2]">
          {Icon && <Icon size={21} />}
        </div>
      </div>
    </motion.div>
  );
}
