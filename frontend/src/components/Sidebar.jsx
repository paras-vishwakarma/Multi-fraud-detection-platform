
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  MessageSquareWarning,
  Globe,
  FileSearch,
  History,
  ShieldCheck,
} from "lucide-react";

const links = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/sms", label: "SMS / Email", icon: MessageSquareWarning },
  { to: "/website", label: "Website Scanner", icon: Globe },
  { to: "/documents", label: "Document Scanner", icon: FileSearch },
  { to: "/history", label: "Scan History", icon: History },
];

export default function Sidebar() {
  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-slate-800 bg-[#0d1526] p-5">
      <div className="mb-10 flex items-center gap-3">
        <div className="rounded-xl bg-cyan-400/10 p-3">
          <ShieldCheck className="text-cyan-400" size={27} />
        </div>
        <div>
          <h1 className="text-lg font-bold text-white">
            FRAUD<span className="text-cyan-400">GUARD</span>
          </h1>
          <p className="text-xs text-slate-500">
            AI Security Platform
          </p>
        </div>
      </div>

      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-500">
        Main Menu
      </p>

      <nav className="flex flex-col gap-2">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                isActive
                  ? "bg-cyan-400/10 font-semibold text-cyan-300"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`
            }
          >
            <Icon size={19} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto rounded-xl border border-slate-800 bg-slate-900 p-4">
        <div className="flex items-center gap-2 text-sm font-medium text-white">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          Protection Center
        </div>
        <p className="mt-2 text-xs leading-5 text-slate-400">
          Analyze suspicious messages, URLs, and documents.
        </p>
      </div>
    </aside>
  );
}
