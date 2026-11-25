import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import GenerateButton from "../components/ui/GenerateButton";
import WaveGridBackground from "../components/ui/WaveGridBackground";
import {
    ShieldCheck,
    ArrowRight,
    MessageSquareWarning,
    Globe,
    FileSearch,
    Shield,
    ExternalLink,
} from "lucide-react";

export default function Home() {
    const navigate = useNavigate();
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
        <div className="relative min-h-screen bg-white text-[#1E293B]">

            {/* Wave Grid Background */}
            <div className="pointer-events-none fixed inset-0 z-0 opacity-40">
                <WaveGridBackground
                    colorBase="#FFFFFF"
                    colorHigh="#06B6D4"
                    gridSize={40}
                    waveAmplitude={0.35}
                    waveSpeed={5}
                    waveFrequency={1.2}
                    waveWidth={3.5}
                    waveMaxHeight={0.35}
                    waveJitter={0.15}
                    autoAnimate={true}
                    vignette={false}
                />
            </div>

            {/* Foreground content with relative z-10 */}
            <div className="relative z-10">
                {/* ── Top Header / Navigation with Spotlight ── */}
                <header
                    ref={headerRef}
                    onMouseMove={handleMouseMove}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-md overflow-hidden"
                >
                    {/* Spotlight background & border beam */}
                    <div
                        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
                        style={{
                            opacity: isHovered ? 1 : 0,
                            background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(6, 182, 212, 0.08), transparent 75%)`,
                        }}
                    />
                    <div
                        className="pointer-events-none absolute bottom-0 left-0 right-0 h-[2px] transition-opacity duration-300"
                        style={{
                            opacity: isHovered ? 1 : 0,
                            background: `radial-gradient(180px circle at ${mousePos.x}px 50%, #06B6D4, transparent 80%)`,
                        }}
                    />

                    <div className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-2.5">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-[#0891B2] border border-cyan-200 shadow-sm">
                                <ShieldCheck size={22} className="text-[#0891B2]" />
                            </div>
                            <div>
                                <span className="text-lg font-bold tracking-tight text-[#0F172A]">
                                    Fraud<span className="text-[#0891B2]">Guard</span> AI
                                </span>
                                <span className="ml-2 rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                                    v2.4
                                </span>
                            </div>
                        </Link>

                        {/* Nav Links */}
                        <nav className="hidden items-center gap-10 md:flex text-sm font-semibold text-slate-600">
                            <a href="#features" className="transition hover:text-[#0891B2]">Features</a>
                            <a href="#modules" className="transition hover:text-[#0891B2]">Detection Modules</a>
                            <a href="#how-it-works" className="transition hover:text-[#0891B2]">How It Works</a>
                            <a href="#metrics" className="transition hover:text-[#0891B2]">Accuracy</a>
                        </nav>

                        {/* Action CTAs */}
                        <div className="flex items-center gap-3">
                            <GenerateButton
                                hue={190}
                                to="/dashboard"
                            >
                                Enter Dashboard
                            </GenerateButton>
                        </div>
                    </div>
                </header>

                {/* ── Hero Section ── */}
                <section className="relative overflow-hidden px-6 pt-16 pb-20 sm:pt-24 lg:px-8">
                    <div className="mx-auto max-w-4xl text-center">
                        {/* Pill Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-4 py-1.5 text-xs font-semibold text-[#0891B2] shadow-sm"
                        >
                            <Shield size={14} className="text-[#0891B2]" />
                            <span>Next-Generation Multi-Modal Fraud Detection</span>
                        </motion.div>

                        {/* Main Title */}
                        <motion.h1
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="mt-6 text-4xl font-extrabold tracking-tight text-[#0F172A] sm:text-6xl"
                        >
                            Autonomous Threat Detection For{" "}
                            <span className="text-[#0891B2]">Websites, Messages &amp; Documents</span>
                        </motion.h1>

                        {/* Subtitle */}
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg"
                        >
                            Protect against malicious phishing websites, deceptive smishing alerts, and forged identity documents using advanced deep learning classification with 99.8% accuracy.
                        </motion.p>

                        {/* Main CTAs */}
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="mt-8 flex flex-wrap items-center justify-center gap-4"
                        >
                            <GenerateButton
                                hue={190}
                                to="/dashboard"
                                className="!py-3.5 !px-7 text-sm"
                            >
                                Enter Live Dashboard
                            </GenerateButton>

                            <Link
                                to="/sms"
                                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-[#0F172A] shadow-sm transition hover:border-[#0891B2]/40 hover:bg-slate-50"
                            >
                                <MessageSquareWarning size={16} className="text-[#0891B2]" />
                                <span>Quick Message Scan</span>
                            </Link>
                        </motion.div>

                        {/* Key Trust Stats */}
                        <div id="metrics" className="mt-14 grid grid-cols-2 gap-4 border-t border-slate-200 pt-10 sm:grid-cols-4">
                            <div>
                                <p className="text-2xl font-extrabold text-[#0F172A]">96.8%</p>
                                <p className="text-xs text-slate-500">Model Accuracy</p>
                            </div>
                            <div>
                                <p className="text-2xl font-extrabold text-[#0891B2]">&lt; 250ms</p>
                                <p className="text-xs text-slate-500">Inference Latency</p>
                            </div>
                            <div>
                                <p className="text-2xl font-extrabold text-[#0F172A]">12,800+</p>
                                <p className="text-xs text-slate-500">Scans Processed</p>
                            </div>
                            <div>
                                <p className="text-2xl font-extrabold text-emerald-600">Zero-Log</p>
                                <p className="text-xs text-slate-500">Privacy Guarantee</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── Interactive Dashboard Preview Banner ── */}
                <section className="px-6 py-8 lg:px-8">
                    <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl border border-slate-800 bg-[#0F172A] p-8 shadow-2xl text-white">
                        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-6">
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 animate-pulse" />
                                    <h3 className="text-base font-bold text-white">Live Monitoring Console</h3>
                                </div>
                                <p className="mt-1 text-xs text-slate-400">
                                    Centralized telemetry across smishing, spear-phishing, and document tampering
                                </p>
                            </div>
                            <Link
                                to="/dashboard"
                                className="inline-flex items-center gap-1.5 rounded-xl bg-[#0891B2] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#06B6D4]"
                            >
                                <span>Launch Dashboard</span>
                                <ExternalLink size={13} />
                            </Link>
                        </div>

                        <div className="mt-6 grid gap-4 sm:grid-cols-3">
                            <div className="rounded-2xl border border-slate-800 bg-[#111827] p-5">
                                <span className="text-[11px] font-semibold uppercase tracking-wider text-cyan-400">Channel 01</span>
                                <h4 className="mt-2 text-sm font-bold text-white">SMS & Email Engine</h4>
                                <p className="mt-1 text-xs text-slate-400">Flags spoofed banking alerts, urgency traps, prize scams & smishing links.</p>
                                <span className="mt-4 inline-block text-[11px] font-semibold text-emerald-400">98.2% confidence</span>
                            </div>

                            <div className="rounded-2xl border border-slate-800 bg-[#111827] p-5">
                                <span className="text-[11px] font-semibold uppercase tracking-wider text-cyan-400">Channel 02</span>
                                <h4 className="mt-2 text-sm font-bold text-white">Website Phishing Radar</h4>
                                <p className="mt-1 text-xs text-slate-400">Scans URLs, typosquatting domains & credential harvesters with RAG.</p>
                                <span className="mt-4 inline-block text-[11px] font-semibold text-emerald-400">99.8% confidence</span>
                            </div>

                            <div className="rounded-2xl border border-slate-800 bg-[#111827] p-5">
                                <span className="text-[11px] font-semibold uppercase tracking-wider text-cyan-400">Channel 03</span>
                                <h4 className="mt-2 text-sm font-bold text-white">Document Authenticator</h4>
                                <p className="mt-1 text-xs text-slate-400">Inspects metadata revisions, forged signatures & font alterations.</p>
                                <span className="mt-4 inline-block text-[11px] font-semibold text-emerald-400">95.1% confidence</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── Detection Modules Section ── */}
                <section id="modules" className="px-6 py-20 lg:px-8">
                    <div className="mx-auto max-w-6xl">
                        <div className="text-center">
                            <span className="text-xs font-bold uppercase tracking-wider text-[#0891B2]">
                                Specialized Modules
                            </span>
                            <h2 className="mt-2 text-3xl font-extrabold text-[#0F172A] sm:text-4xl">
                                Comprehensive Multi-Vector Defense
                            </h2>
                            <p className="mx-auto mt-3 max-w-xl text-sm text-slate-600">
                                Every threat vector requires distinct neural feature extractors and RAG intelligence.
                            </p>
                        </div>

                        <div className="mt-12 grid gap-6 sm:grid-cols-3">
                            {/* SMS & Email */}
                            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition hover:border-[#0891B2]/40 hover:shadow-md">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-50 text-[#0891B2] border border-cyan-100">
                                    <MessageSquareWarning size={24} />
                                </div>
                                <h3 className="mt-5 text-base font-bold text-[#0F172A]">SMS & Email Detection</h3>
                                <p className="mt-2 text-xs leading-relaxed text-slate-600">
                                    Parses messages and emails for urgency triggers, suspicious domain disguises, prize scams, and impersonation.
                                </p>
                                <Link
                                    to="/sms"
                                    className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-[#0891B2] hover:text-[#06B6D4]"
                                >
                                    <span>Test Message Scanner</span>
                                    <ArrowRight size={13} />
                                </Link>
                            </div>

                            {/* Website Phishing */}
                            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition hover:border-[#0891B2]/40 hover:shadow-md">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-50 text-[#0891B2] border border-cyan-100">
                                    <Globe size={24} />
                                </div>
                                <h3 className="mt-5 text-base font-bold text-[#0F172A]">Website Analyzer</h3>
                                <p className="mt-2 text-xs leading-relaxed text-slate-600">
                                    Evaluates URLs, typosquatting domains, and credential-harvesting landing pages with MITRE ATT&CK RAG evidence.
                                </p>
                                <Link
                                    to="/website-analyzer"
                                    className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-[#0891B2] hover:text-[#06B6D4]"
                                >
                                    <span>Test Website Scanner</span>
                                    <ArrowRight size={13} />
                                </Link>
                            </div>

                            {/* Document */}
                            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition hover:border-[#0891B2]/40 hover:shadow-md">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-50 text-[#0891B2] border border-cyan-100">
                                    <FileSearch size={24} />
                                </div>
                                <h3 className="mt-5 text-base font-bold text-[#0F172A]">Document Forensics</h3>
                                <p className="mt-2 text-xs leading-relaxed text-slate-600">
                                    Optical character recognition (OCR) extracts text while convolutional layers verify document structure authenticity.
                                </p>
                                <Link
                                    to="/documents"
                                    className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-[#0891B2] hover:text-[#06B6D4]"
                                >
                                    <span>Test Document Scanner</span>
                                    <ArrowRight size={13} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── How It Works Section ── */}
                <section id="how-it-works" className="border-t border-slate-200 bg-slate-50/80 px-6 py-20 lg:px-8">
                    <div className="mx-auto max-w-6xl">
                        <div className="text-center">
                            <span className="text-xs font-bold uppercase tracking-wider text-[#0891B2]">
                                Workflow
                            </span>
                            <h2 className="mt-2 text-3xl font-extrabold text-[#0F172A]">
                                How FraudGuard AI Works
                            </h2>
                            <p className="mx-auto mt-2 max-w-lg text-sm text-slate-600">
                                From ingestion to classification in three streamlined steps.
                            </p>
                        </div>

                        <div className="mt-14 grid gap-8 md:grid-cols-3">
                            <div className="text-center">
                                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white border border-slate-200 text-lg font-bold text-[#0891B2] shadow-sm">
                                    1
                                </div>
                                <h3 className="mt-4 text-sm font-bold text-[#0F172A]">Submit Message or File</h3>
                                <p className="mt-2 text-xs leading-relaxed text-slate-600">
                                    Paste text content or drag and drop suspicious documents directly into the web console.
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white border border-slate-200 text-lg font-bold text-[#0891B2] shadow-sm">
                                    2
                                </div>
                                <h3 className="mt-4 text-sm font-bold text-[#0F172A]">Neural Feature Analysis</h3>
                                <p className="mt-2 text-xs leading-relaxed text-slate-600">
                                    Natural language transformers and heuristic engines evaluate fraud markers, linguistic deception, and anomalies.
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white border border-slate-200 text-lg font-bold text-[#0891B2] shadow-sm">
                                    3
                                </div>
                                <h3 className="mt-4 text-sm font-bold text-[#0F172A]">Verdict &amp; Mitigation</h3>
                                <p className="mt-2 text-xs leading-relaxed text-slate-600">
                                    Receive instant confidence rating, risk badge (Safe, Suspicious, High Risk, Fraud) and mitigation guidance.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── Call To Action Banner ── */}
                <section className="px-6 py-16 lg:px-8">
                    <div className="mx-auto max-w-5xl rounded-3xl border border-slate-800 bg-[#0F172A] p-10 text-center text-white shadow-2xl sm:p-14">
                        <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                            Start Monitoring Threats With AI
                        </h2>
                        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-slate-400">
                            Access the unified multi-fraud analytics platform to inspect alerts, review scan history, and secure communications.
                        </p>
                        <div className="mt-8 flex justify-center gap-4">
                            <GenerateButton
                                hue={190}
                                to="/dashboard"
                                className="!py-3.5 !px-8 text-sm"
                            >
                                Enter Dashboard
                            </GenerateButton>
                        </div>
                    </div>
                </section>

                {/* ── Footer ── */}
                <footer className="border-t border-slate-200 bg-white px-6 py-8 text-center text-xs text-slate-500">
                    <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
                        <p>FraudGuard AI · Intelligent Threat Monitoring &copy; 2026</p>
                        <div className="flex gap-6">
                            <Link to="/dashboard" className="hover:text-[#0891B2]">Dashboard</Link>
                            <Link to="/sms" className="hover:text-[#0891B2]">SMS Scanner</Link>
                            <Link to="/website-analyzer" className="hover:text-[#0891B2]">Website Scanner</Link>
                            <Link to="/documents" className="hover:text-[#0891B2]">Document Scanner</Link>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
}
