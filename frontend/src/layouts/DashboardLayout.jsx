import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#FFFCF5] text-[#1E293B]">
      <div className="flex min-h-screen">
        <div className="hidden lg:flex">
          <Sidebar />
        </div>

        <div className="min-w-0 flex-1">
          <Navbar />

          <main className="mx-auto w-full max-w-[1550px] p-5 sm:p-7 lg:p-9">
            {children}
          </main>

          <footer className="border-t border-[#DCE3EA] bg-[#FFFCF5] px-8 py-5 text-center text-xs text-[#64748B]">
            FraudGuard AI · Intelligent Threat Monitoring · © 2026
          </footer>
        </div>
      </div>
    </div>
  );
}
