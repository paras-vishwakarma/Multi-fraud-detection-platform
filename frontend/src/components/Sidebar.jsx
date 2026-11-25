import { NavLink, Link } from "react-router-dom";
import {
  LayoutDashboard,
  MessageSquareWarning,
  Globe,
  FileSearch,
  History,
  BarChart3,
  Settings,
  ShieldCheck,
  ChevronRight,
  Home as HomeIcon,
} from "lucide-react";

const mainLinks = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/sms", label: "SMS & Email Detection", icon: MessageSquareWarning },
  { to: "/website-analyzer", label: "Website Analyzer", icon: Globe },
  { to: "/documents", label: "Document Detection", icon: FileSearch },
  { to: "/history", label: "Detection History", icon: History },
];

const secondaryLinks = [
  { to: "/", label: "Landing Page", icon: HomeIcon },
  { to: "/reports", label: "Reports", icon: BarChart3 },
  { to: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  return (
    <aside className="flex w-[260px] shrink-0 flex-col border-r border-[#DCE3EA] bg-[#FFFCF5]">
      {/* FraudGuard AI Logo */}
      <Link to="/" className="flex items-center gap-3 border-b border-[#DCE3EA]/60 px-6 py-6 transition hover:opacity-90">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E6F9FC] text-[#0891B2] shadow-sm">
          <ShieldCheck size={22} className="text-[#0891B2]" />
        </div>
        <div>
          <h1 className="text-base font-bold tracking-tight text-[#1E293B]">
            Fraud<span className="text-[#0891B2]">Guard</span> AI
          </h1>
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#64748B]">
            Security Platform
          </p>
        </div>
      </Link>

      {/* Main Navigation */}
      <div className="px-3 pt-5">
        <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.15em] text-[#94A3B8]">
          Navigation
        </p>
        <nav className="flex flex-col gap-1">
          {mainLinks.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[13px] font-medium transition-all duration-200 ${isActive
                  ? "bg-[#E6F9FC] font-semibold text-[#0891B2] shadow-sm"
                  : "text-[#64748B] hover:bg-white hover:text-[#1E293B]"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={18}
                    className={isActive ? "text-[#0891B2]" : "text-[#94A3B8] group-hover:text-[#1E293B]"}
                  />
                  <span>{label}</span>
                  {isActive && (
                    <ChevronRight size={14} className="ml-auto text-[#0891B2]/60" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Secondary System Menu */}
      <div className="mt-6 px-3">
        <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.15em] text-[#94A3B8]">
          System
        </p>
        <nav className="flex flex-col gap-1">
          {secondaryLinks.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[13px] font-medium transition-all duration-200 ${isActive
                  ? "bg-[#E6F9FC] font-semibold text-[#0891B2]"
                  : "text-[#64748B] hover:bg-white hover:text-[#1E293B]"
                }`
              }
            >
              <Icon size={18} className="text-[#94A3B8] group-hover:text-[#1E293B]" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Active Guard Status pill */}
      <div className="mt-auto p-4">
        <div className="rounded-xl border border-[#DCE3EA] bg-white p-3.5 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#06B6D4] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#06B6D4]" />
            </span>
            <span className="text-xs font-semibold text-[#1E293B]">Threat Shield Active</span>
          </div>
          <p className="mt-1.5 text-[11px] leading-relaxed text-[#64748B]">
            Automated SMS, Email &amp; Document fraud protection.
          </p>
        </div>
      </div>
    </aside>
  );
}
