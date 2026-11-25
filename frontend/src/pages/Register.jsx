import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck, Mail, Lock, User, ArrowRight } from "lucide-react";

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      navigate("/login");
    }, 400);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#0B1120] px-4 py-12 text-slate-200">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-cyan-600/5 blur-3xl" />

      <div className="relative w-full max-w-md rounded-2xl border border-slate-800 bg-[#111827] p-8 shadow-2xl backdrop-blur-xl">
        {/* Logo */}
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-500/30 bg-cyan-950/40 text-cyan-400 shadow-md">
            <ShieldCheck size={30} />
          </div>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-white">
            Create Security Account
          </h1>
          <p className="mt-1.5 text-xs text-slate-400">
            Get access to multi-modal neural fraud analysis
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-7 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300">
              Full Name
            </label>
            <div className="relative mt-1.5">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <User size={16} />
              </div>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Morgan"
                className="w-full rounded-xl border border-slate-800 bg-[#0b1120] py-2.5 pl-10 pr-4 text-sm text-slate-100 placeholder-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300">
              Email Address
            </label>
            <div className="relative mt-1.5">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Mail size={16} />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="analyst@security.org"
                className="w-full rounded-xl border border-slate-800 bg-[#0b1120] py-2.5 pl-10 pr-4 text-sm text-slate-100 placeholder-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300">
              Password
            </label>
            <div className="relative mt-1.5">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Lock size={16} />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full rounded-xl border border-slate-800 bg-[#0b1120] py-2.5 pl-10 pr-4 text-sm text-slate-100 placeholder-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0891B2] to-[#06B6D4] py-3 text-sm font-bold text-white shadow-md shadow-cyan-500/25 transition hover:from-[#06B6D4] hover:to-[#22D3EE] hover:shadow-cyan-500/40 disabled:opacity-50 cursor-pointer"
          >
            <span>{loading ? "Creating..." : "Create Account"}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-400">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-cyan-400 hover:text-cyan-300">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
