import { useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  ShieldAlert,
  ShieldCheck,
  Target,
  MessageSquare,
  Globe,
  Mail,
  FileText,
  ArrowRight,
  Shield,
  Clock,
  Cpu,
  CheckCircle2,
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

import StatCard from "../components/Statcard";
import RiskBadge from "../components/Riskbadge";
import HeroShield from "../components/HeroShield";

/* ── Analytics Chart Data ── */
const trendDataMap = {
  "7days": [
    { name: "Mon", safe: 320, suspicious: 45, highRisk: 18, fraud: 8 },
    { name: "Tue", safe: 410, suspicious: 52, highRisk: 22, fraud: 12 },
    { name: "Wed", safe: 380, suspicious: 48, highRisk: 19, fraud: 7 },
    { name: "Thu", safe: 460, suspicious: 64, highRisk: 27, fraud: 15 },
    { name: "Fri", safe: 430, suspicious: 58, highRisk: 24, fraud: 11 },
    { name: "Sat", safe: 490, suspicious: 72, highRisk: 31, fraud: 18 },
    { name: "Sun", safe: 450, suspicious: 60, highRisk: 25, fraud: 10 },
  ],
  "30days": [
    { name: "Week 1", safe: 2450, suspicious: 320, highRisk: 130, fraud: 62 },
    { name: "Week 2", safe: 2890, suspicious: 375, highRisk: 155, fraud: 74 },
    { name: "Week 3", safe: 3120, suspicious: 410, highRisk: 172, fraud: 81 },
    { name: "Week 4", safe: 3410, suspicious: 440, highRisk: 185, fraud: 92 },
  ],
  "90days": [
    { name: "Month 1", safe: 9800, suspicious: 1240, highRisk: 520, fraud: 240 },
    { name: "Month 2", safe: 11200, suspicious: 1410, highRisk: 590, fraud: 285 },
    { name: "Month 3", safe: 12846, suspicious: 1580, highRisk: 660, fraud: 315 },
  ],
};

/* ── Detection Modules Data ── */
const modules = [
  {
    title: "SMS & Email Detection",
    icon: MessageSquare,
    scans: "9,946",
    threats: "1,035",
    btnText: "Scan Messages",
    path: "/sms",
  },
  {
    title: "Website Phishing",
    icon: Globe,
    scans: "6,412",
    threats: "847",
    btnText: "Scan Website",
    path: "/website-analyzer",
  },
  {
    title: "Document Detection",
    icon: FileText,
    scans: "2,900",
    threats: "249",
    btnText: "Scan Document",
    path: "/documents",
  },
];

/* ── Recent Detections Data ── */
const recentDetections = [
  {
    type: "SMS",
    content: "Bank verification required",
    risk: "highrisk",
    confidence: "94%",
    time: "2 min ago",
    status: "Blocked",
  },
  {
    type: "Email",
    content: "Account verification",
    risk: "fraud",
    confidence: "98%",
    time: "8 min ago",
    status: "Blocked",
  },
  {
    type: "Document",
    content: "Payment Notice.pdf",
    risk: "suspicious",
    confidence: "81%",
    time: "15 min ago",
    status: "Review",
  },
  {
    type: "SMS",
    content: "Your OTP for login is 918234. Valid for 5 min.",
    risk: "safe",
    confidence: "99%",
    time: "21 min ago",
    status: "Passed",
  },
  {
    type: "Email",
    content: "Wire transfer details updated - action required",
    risk: "fraud",
    confidence: "97%",
    time: "32 min ago",
    status: "Blocked",
  },
  {
    type: "Document",
    content: "Vendor_Agreement_Final.pdf",
    risk: "safe",
    confidence: "96%",
    time: "44 min ago",
    status: "Passed",
  },
];

/* ── Custom Dark Chart Tooltip ── */
function DarkTooltip({ active, payload, label }) {
  if (!active || !payload) return null;
  return (
    <div className="rounded-xl border border-slate-800 bg-[#0F172A]/95 px-4 py-3 shadow-xl backdrop-blur-md">
      <p className="mb-1.5 text-xs font-semibold text-white">{label}</p>
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2 text-xs">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-slate-400">{entry.name}:</span>
          <span className="font-semibold text-white">{entry.value.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const [timeFilter, setTimeFilter] = useState("7days");
  const chartData = trendDataMap[timeFilter];

  return (
    <div className="space-y-7">
      {/* ────── Main Hero Card (Large Dark Navy Panel with Cyan Glow) ────── */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-[#111827] text-white shadow-xl">
        {/* Cyan background glow */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-[#06B6D4]/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-[#0891B2]/5 blur-3xl" />

        <div className="relative grid items-center gap-6 lg:grid-cols-12">
          {/* Left Text & CTA */}
          <div className="p-7 sm:p-10 lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3.5 py-1 text-xs font-semibold text-cyan-300">
              <Shield size={13} className="text-cyan-400" />
              <span>Real-Time Threat Intelligence</span>
            </div>

            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              AI Fraud Protection
            </h1>

            <p className="mt-2.5 max-w-xl text-sm leading-relaxed text-slate-400">
              Detect suspicious content before it becomes a threat. Analyze incoming SMS alerts, phishing emails, and forged documents in seconds.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a
                href="/sms"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#0891B2] to-[#06B6D4] px-6 py-3 text-xs font-bold text-slate-950 shadow-md shadow-cyan-500/25 transition hover:from-[#06B6D4] hover:to-[#22D3EE] hover:shadow-cyan-500/40"
              >
                <span>Start New Scan</span>
                <ArrowRight size={15} />
              </a>

              <a
                href="/history"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-[#0F172A] px-5 py-3 text-xs font-semibold text-slate-300 transition hover:border-slate-700 hover:text-white"
              >
                <span>View Activity</span>
              </a>
            </div>
          </div>

          {/* Right 3D Shield */}
          <div className="hidden lg:col-span-5 lg:block lg:pr-6">
            <HeroShield />
          </div>
        </div>
      </section>

      {/* ────── Four Statistics Cards ────── */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Scans"
          value="12,846"
          change="+12.5% this week"
          changeType="up"
          icon={Activity}
          delay={0.05}
        />
        <StatCard
          title="Threats Detected"
          value="1,284"
          change="+8.2% vs last week"
          changeType="up"
          icon={ShieldAlert}
          delay={0.1}
        />
        <StatCard
          title="Threats Blocked"
          value="1,109"
          change="86.4% block rate"
          changeType="up"
          icon={ShieldCheck}
          delay={0.15}
        />
        <StatCard
          title="Detection Accuracy"
          value="99.8%"
          change="+0.3% model update"
          changeType="up"
          icon={Target}
          delay={0.2}
        />
      </section>

      {/* ────── Detection Modules ────── */}
      <section>
        <div className="mb-3.5 flex items-center justify-between">
          <h2 className="text-base font-bold text-white">Detection Modules</h2>
          <span className="text-xs text-slate-400">Multi-modal AI scanning</span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((mod) => (
            <motion.div
              key={mod.title}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className="group rounded-2xl border border-slate-800 bg-[#111827] p-6 shadow-xl backdrop-blur-xl transition hover:border-cyan-500/40"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <mod.icon size={22} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{mod.title}</h3>
                  <p className="text-xs text-slate-400">{mod.scans} scans</p>
                </div>
              </div>

              <div className="mt-4 rounded-xl bg-[#0b1120] p-3 text-xs text-slate-400 border border-slate-800">
                <span className="font-semibold text-rose-500">{mod.threats}</span> threats detected
              </div>

              <a
                href={mod.path}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0891B2] py-2.5 text-xs font-bold text-white transition hover:bg-[#06B6D4] shadow-sm"
              >
                <span>{mod.btnText}</span>
                <ArrowRight size={14} />
              </a>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ────── Threat Overview + AI Protection Status ────── */}
      <section className="grid gap-6 xl:grid-cols-12">
        {/* Threat Detection Overview */}
        <div className="rounded-2xl border border-slate-800 bg-[#111827] p-6 text-white shadow-xl backdrop-blur-xl xl:col-span-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-white">Threat Detection Overview</h2>
              <p className="mt-0.5 text-xs text-slate-400">
                Continuous monitoring across Safe, Suspicious, High Risk &amp; Fraud
              </p>
            </div>

            {/* Filters: 7 Days | 30 Days | 90 Days */}
            <div className="flex rounded-xl border border-slate-800 bg-[#0F172A] p-1">
              {[
                { key: "7days", label: "7 Days" },
                { key: "30days", label: "30 Days" },
                { key: "90days", label: "90 Days" },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setTimeFilter(key)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                    timeFilter === key
                      ? "bg-[#0891B2] text-white font-bold shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#06B6D4]" />
              <span className="text-slate-400">Safe</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#FBBF24]" />
              <span className="text-slate-400">Suspicious</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#FB923C]" />
              <span className="text-slate-400">High Risk</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#F43F5E]" />
              <span className="text-slate-400">Fraud</span>
            </span>
          </div>

          <div className="mt-5 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="cyanFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06B6D4" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#06B6D4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#1E293B" strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="#64748B" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748B" tick={{ fontSize: 11 }} />
                <Tooltip content={<DarkTooltip />} />
                <Area
                  type="monotone"
                  dataKey="safe"
                  name="Safe"
                  stroke="#06B6D4"
                  fill="url(#cyanFill)"
                  strokeWidth={2.5}
                />
                <Area
                  type="monotone"
                  dataKey="suspicious"
                  name="Suspicious"
                  stroke="#FBBF24"
                  fill="transparent"
                  strokeWidth={1.5}
                />
                <Area
                  type="monotone"
                  dataKey="highRisk"
                  name="High Risk"
                  stroke="#FB923C"
                  fill="transparent"
                  strokeWidth={1.5}
                />
                <Area
                  type="monotone"
                  dataKey="fraud"
                  name="Fraud"
                  stroke="#F43F5E"
                  fill="transparent"
                  strokeWidth={1.5}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Protection Status */}
        <div className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-[#0F172A] p-6 text-white shadow-xl backdrop-blur-xl xl:col-span-4">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cpu size={18} className="text-[#06B6D4]" />
                <h3 className="text-sm font-bold text-white">FraudGuard AI Engine</h3>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-2.5 py-1 text-[11px] font-semibold text-cyan-300">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                Online
              </span>
            </div>

            <p className="mt-2 text-xs text-slate-400">
              Autonomous neural classification pipeline with RAG grounding.
            </p>

            <div className="mt-5 space-y-3">
              <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-[#111827] px-3.5 py-2.5">
                <span className="text-xs text-slate-400">Model Accuracy</span>
                <span className="text-xs font-bold text-cyan-400">99.8%</span>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-[#111827] px-3.5 py-2.5">
                <span className="text-xs text-slate-400">Real-time Analysis</span>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400">
                  <CheckCircle2 size={13} /> Active
                </span>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-[#111827] px-3.5 py-2.5">
                <span className="text-xs text-slate-400">Threat Knowledge Base</span>
                <span className="text-xs font-semibold text-cyan-400">Updated</span>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-[#111827] px-3.5 py-2.5">
                <span className="text-xs text-slate-400">Last Scan</span>
                <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                  <Clock size={12} /> 2 minutes ago
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-slate-800 bg-[#111827] p-3 text-center">
            <span className="text-[11px] text-slate-400">Active Neural Weights: v2.4 · RAG Indexed</span>
          </div>
        </div>
      </section>

      {/* ────── Recent Detections ────── */}
      <section className="rounded-2xl border border-slate-800 bg-[#111827] shadow-xl backdrop-blur-xl overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-800 p-5 sm:px-6">
          <div>
            <h2 className="text-base font-bold text-white">Recent Detections</h2>
            <p className="mt-0.5 text-xs text-slate-400">
              Real-time audit log of evaluated messages and documents
            </p>
          </div>
          <a
            href="/history"
            className="rounded-xl border border-slate-800 bg-slate-900/60 px-3.5 py-1.5 text-xs font-semibold text-cyan-400 transition hover:bg-slate-800"
          >
            View All History
          </a>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-[#0b1120] text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3">Message / Document</th>
                <th className="px-6 py-3">Risk Level</th>
                <th className="px-6 py-3">Confidence</th>
                <th className="px-6 py-3">Time</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-200">
              {recentDetections.map((row, i) => (
                <tr key={i} className="transition hover:bg-white/[0.02]">
                  <td className="whitespace-nowrap px-6 py-3.5 font-medium">
                    <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-[#0b1120] px-2.5 py-1 text-[11px] text-slate-200">
                      {row.type === "SMS" && <MessageSquare size={12} className="text-cyan-400" />}
                      {row.type === "Email" && <Mail size={12} className="text-cyan-400" />}
                      {row.type === "Document" && <FileText size={12} className="text-cyan-400" />}
                      <span>{row.type}</span>
                    </span>
                  </td>
                  <td className="max-w-[320px] truncate px-6 py-3.5 font-medium text-white">
                    {row.content}
                  </td>
                  <td className="whitespace-nowrap px-6 py-3.5">
                    <RiskBadge risk={row.risk} />
                  </td>
                  <td className="whitespace-nowrap px-6 py-3.5 font-semibold text-white">
                    {row.confidence}
                  </td>
                  <td className="whitespace-nowrap px-6 py-3.5 text-slate-400">
                    {row.time}
                  </td>
                  <td className="whitespace-nowrap px-6 py-3.5">
                    <span
                      className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold ${
                        row.status === "Blocked"
                          ? "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                          : row.status === "Review"
                          ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                          : "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
