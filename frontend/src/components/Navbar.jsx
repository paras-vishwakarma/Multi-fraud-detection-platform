import React, { useState, useRef } from "react";
import { Bell, Search, ShieldCheck, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

export default function Navbar() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const headerRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!headerRef.current) return;
    const rect = headerRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <header
      ref={headerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="sticky top-0 z-30 flex min-h-[76px] items-center justify-between gap-4 border-b border-[#DCE3EA] bg-[#FFFCF5]/90 px-6 backdrop-blur-md lg:px-10 overflow-hidden"
    >
      {/* ── Interactive Spotlight Background Effect ── */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(380px circle at ${mousePos.x}px ${mousePos.y}px, rgba(6, 182, 212, 0.08), transparent 75%)`,
        }}
      />

      {/* ── Bottom Border Spotlight Beam ── */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-[2px] transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(180px circle at ${mousePos.x}px 50%, #06B6D4, transparent 80%)`,
        }}
      />

      {/* ── Title & Subtitle ── */}
      <div className="relative z-10">
        <h2 className="text-xl font-bold tracking-tight text-[#1E293B]">
          AI-Powered Fraud Detection
        </h2>
        <p className="mt-0.5 text-xs font-medium text-[#64748B]">
          Monitor and analyze suspicious websites, messages, and documents in real time.
        </p>
      </div>

      {/* ── Right Controls ── */}
      <div className="relative z-10 flex items-center gap-3.5">
        {/* Search */}
        <div className="hidden items-center gap-2.5 rounded-xl border border-[#DCE3EA] bg-white px-3.5 py-2 shadow-sm transition hover:border-[#0891B2]/40 hover:shadow-[0_0_15px_rgba(6,182,212,0.1)] md:flex">
          <Search size={15} className="text-[#94A3B8]" />
          <input
            type="text"
            placeholder="Search threats, scans..."
            className="w-48 bg-transparent text-xs text-[#1E293B] placeholder-[#94A3B8] outline-none"
          />
          <kbd className="rounded border border-[#DCE3EA] bg-[#FFFCF5] px-1.5 py-0.5 text-[10px] font-semibold text-[#64748B]">
            ⌘K
          </kbd>
        </div>

        {/* Notifications */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="button"
          aria-label="Notifications"
          className="relative rounded-xl border border-[#DCE3EA] bg-white p-2.5 text-[#64748B] shadow-sm transition hover:border-[#0891B2]/40 hover:text-[#0891B2] hover:shadow-[0_0_15px_rgba(6,182,212,0.1)]"
        >
          <Bell size={17} />
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#0891B2] text-[9px] font-bold text-white shadow-sm">
            3
          </span>
        </motion.button>

        {/* User profile */}
        <div className="flex items-center gap-2.5 rounded-xl border border-[#DCE3EA] bg-white px-3 py-1.5 shadow-sm transition hover:border-[#0891B2]/40">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E6F9FC] text-[#0891B2]">
            <ShieldCheck size={17} />
          </div>
          <div className="hidden text-left lg:block">
            <p className="text-xs font-semibold text-[#1E293B]">Security Admin</p>
            <p className="text-[10px] text-[#64748B]">admin@fraudguard.ai</p>
          </div>
          <ChevronDown size={14} className="hidden text-[#94A3B8] lg:block" />
        </div>
      </div>
    </header>
  );
}
