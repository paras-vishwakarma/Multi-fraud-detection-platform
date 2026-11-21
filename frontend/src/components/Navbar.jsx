
import { Bell, Search, ShieldCheck } from "lucide-react";
import { useLocation } from "react-router-dom";

const pageNames = {
  "/": "Dashboard",
  "/sms": "SMS & Email Analysis",
  "/website": "Website Analysis",
  "/documents": "Document Analysis",
  "/history": "Scan History",
};

export default function Navbar() {
  const location = useLocation();
  const title = pageNames[location.pathname] || "Fraud Detection";

  return (
    <header className="flex min-h-20 items-center justify-between gap-4 border-b border-slate-800 bg-[#0b1120] px-5 sm:px-8">
      <div>
        <h2 className="text-xl font-semibold text-white">
          {title}
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          AI-powered multi-fraud detection
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 rounded-lg border border-slate-800 px-3 py-2 md:flex">
          <Search size={16} className="text-slate-500" />
          <span className="text-xs text-slate-500">
            Fraud analysis platform
          </span>
        </div>

        <button
          type="button"
          aria-label="Notifications"
          className="rounded-lg border border-slate-800 p-2.5 text-slate-400 hover:text-cyan-300"
        >
          <Bell size={18} />
        </button>

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-400/10 text-cyan-300">
          <ShieldCheck size={21} />
        </div>
      </div>
    </header>
  );
}
