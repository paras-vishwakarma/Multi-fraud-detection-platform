
import {
  Activity,
  ShieldAlert,
  ShieldCheck,
  FileSearch,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

import StatCard from "../components/StatCard";

const activityData = [
  { day: "Mon", scans: 24 },
  { day: "Tue", scans: 38 },
  { day: "Wed", scans: 31 },
  { day: "Thu", scans: 52 },
  { day: "Fri", scans: 43 },
  { day: "Sat", scans: 61 },
  { day: "Sun", scans: 47 },
];

const modules = [
  {
    title: "SMS & Email Detection",
    description: "Analyze messages for phishing and scam indicators.",
    path: "/sms",
    icon: Activity,
  },
  {
    title: "Website Scanner",
    description: "Inspect URLs for suspicious website features.",
    path: "/website",
    icon: ShieldAlert,
  },
  {
    title: "Document Scanner",
    description: "Upload documents for OCR and fraud analysis.",
    path: "/documents",
    icon: FileSearch,
  },
];

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-cyan-400/20 bg-gradient-to-r from-cyan-950/50 to-slate-900 p-6 sm:p-8">
        <p className="text-sm font-medium text-cyan-300">
          SECURITY OVERVIEW
        </p>

        <h1 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
          Detect fraud before it strikes.
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
          Analyze suspicious messages, websites and documents
          from one unified security dashboard.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Scans"
          value="320"
          description="Illustrative demo data"
          icon={Activity}
          color="cyan"
        />

        <StatCard
          title="Threats Detected"
          value="48"
          description="Illustrative demo data"
          icon={ShieldAlert}
          color="red"
        />

        <StatCard
          title="Safe Results"
          value="272"
          description="Illustrative demo data"
          icon={ShieldCheck}
          color="green"
        />

        <StatCard
          title="Documents Analyzed"
          value="76"
          description="Illustrative demo data"
          icon={FileSearch}
          color="purple"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <div className="rounded-2xl border border-slate-800 bg-[#111827] p-5 xl:col-span-2">
          <h2 className="text-lg font-semibold text-white">
            Scan Activity
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Example number of scans per day
          </p>

          <div className="mt-6 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData}>
                <defs>
                  <linearGradient id="scanFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#38bdf8" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid stroke="#243044" strokeDasharray="3 3" />
                <XAxis dataKey="day" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip
                  contentStyle={{
                    background: "#111827",
                    border: "1px solid #334155",
                    borderRadius: "10px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="scans"
                  stroke="#38bdf8"
                  fill="url(#scanFill)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-[#111827] p-5">
          <h2 className="text-lg font-semibold text-white">
            Detection Modules
          </h2>

          <div className="mt-5 space-y-4">
            {modules.map(({ title, description, path, icon: Icon }) => (
              <a
                key={path}
                href={path}
                className="block rounded-xl border border-slate-800 p-4 transition hover:border-cyan-400/40 hover:bg-slate-800/50"
              >
                <Icon className="text-cyan-300" size={22} />
                <h3 className="mt-3 text-sm font-semibold text-white">
                  {title}
                </h3>
                <p className="mt-2 text-xs leading-5 text-slate-400">
                  {description}
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
