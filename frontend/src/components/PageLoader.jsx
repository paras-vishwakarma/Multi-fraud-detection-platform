import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck } from "lucide-react";

export default function PageLoader() {
  // Start with true so initial page load and refresh display the loader smoothly
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const prevKeyRef = useRef(location.key);

  useEffect(() => {
    // Show loader on initial load and whenever route changes
    setLoading(true);

    const timer = setTimeout(() => {
      setLoading(false);
    }, 700);

    return () => clearTimeout(timer);
  }, [location.pathname, location.key]);

  return (
    <AnimatePresence mode="wait">
      {loading && (
        <motion.div
          key="page-loader-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#0B1120]/90 backdrop-blur-xl"
        >
          {/* Top Glowing Cyan Progress Line */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-slate-900/60 overflow-hidden">
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "0%" }}
              transition={{ duration: 0.65, ease: "easeOut" }}
              className="h-full w-full bg-gradient-to-r from-[#0891B2] via-[#22D3EE] to-[#06B6D4] shadow-[0_0_12px_#06b6d4]"
            />
          </div>

          {/* Central Cyber Radar / Aura Spinner */}
          <div className="relative flex h-24 w-24 items-center justify-center">
            {/* Outer Subtle Pulse Ring */}
            <motion.div
              animate={{ scale: [1, 1.25, 1], opacity: [0.15, 0.4, 0.15] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="absolute inset-0 rounded-full border border-cyan-400/40"
            />

            {/* High-Tech Spinning Cyan Dual-Arc Ring */}
            <div
              className="absolute inset-0 animate-spin rounded-full border-2"
              style={{
                borderTopColor: "#06B6D4",
                borderRightColor: "#22D3EE",
                borderBottomColor: "transparent",
                borderLeftColor: "transparent",
                animationDuration: "0.85s",
              }}
            />

            {/* Reverse Slower Inner Ring */}
            <div
              className="absolute inset-2 animate-spin rounded-full border"
              style={{
                borderTopColor: "transparent",
                borderRightColor: "transparent",
                borderBottomColor: "#0891B2",
                borderLeftColor: "#0891B2",
                animationDuration: "1.4s",
                animationDirection: "reverse",
              }}
            />

            {/* Glowing Pulsing Shield Container */}
            <motion.div
              animate={{ scale: [0.92, 1.05, 0.92] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/40 bg-gradient-to-br from-cyan-950/80 to-[#0F172A] text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)]"
            >
              <ShieldCheck size={26} className="text-[#06B6D4] drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
            </motion.div>
          </div>

          {/* Text and Status */}
          <div className="mt-5 text-center">
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-white">
              Fraud<span className="text-[#06B6D4]">Guard</span> AI
            </p>
            <div className="mt-1.5 flex items-center justify-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
              <p className="text-[11px] font-medium text-slate-400">
                Securing session & telemetry...
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
