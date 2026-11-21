
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#0b1120] text-slate-200">
      <div className="flex min-h-screen">
        <div className="hidden md:flex">
          <Sidebar />
        </div>

        <div className="min-w-0 flex-1">
          <Navbar />

          <main className="mx-auto w-full max-w-[1600px] p-5 sm:p-8">
            {children}
          </main>

          <footer className="border-t border-slate-800 px-8 py-4 text-center text-xs text-slate-500">
            FraudGuard · AI-Powered Multi Fraud Detection
          </footer>
        </div>
      </div>
    </div>
  );
}
