"use client";
import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Navigation } from '@/components/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Cpu, MemoryStick, Wifi, MonitorCog, Wallet, Server, Box, ChevronRight, Copy, Check, AlertTriangle, ExternalLink, Zap, Clock, TrendingUp, ArrowRight, } from 'lucide-react';
// ── Calculator Logic ──────────────────────────────────────────────────────
const ANX_PRICE_USD = 0.42;
const BASE_MONTHLY_ANX = 8;
const CPU_WEIGHT = 0.35;
const RAM_WEIGHT = 0.30;
const NET_WEIGHT = 0.15;
const UPTIME_WEIGHT = 0.20;
const GPU_BONUS_FACTOR = 1.25;
const REF_CPU = 8;
const REF_RAM = 16;
const REF_NET = 100;
const REF_UPTIME = 24;
function calcScore(value, reference, maxBoost) {
    const ratio = value / reference;
    return Math.min(Math.pow(ratio, 0.6), maxBoost);
}
// ── Animations ────────────────────────────────────────────────────────────
const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
};
const stagger = {
    animate: {
        transition: {
            staggerChildren: 0.15,
        },
    },
};
// ── Copyable Code Block ───────────────────────────────────────────────────
function CodeBlock({ code, label }) {
    const [copied, setCopied] = useState(false);
    const handleCopy = useCallback(() => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }, [code]);
    return (<div className="relative group">
      {label && (<div className="text-xs text-slate-500 mb-1 font-mono">{label}</div>)}
      <div className="bg-space-900/80 border border-slate-700/40 rounded-xl p-4 font-mono text-sm text-amber-400 overflow-x-auto">
        <pre className="whitespace-pre-wrap break-all">{code}</pre>
        <button onClick={handleCopy} className="absolute top-3 right-3 p-1.5 rounded-lg bg-space-700/60 hover:bg-space-600/80 text-slate-400 hover:text-amber-300 transition-all opacity-0 group-hover:opacity-100" aria-label="Copy to clipboard">
          {copied ? <Check className="w-4 h-4 text-emerald-400"/> : <Copy className="w-4 h-4"/>}
        </button>
      </div>
    </div>);
}
function PlatformTabs({ content, }) {
    const [platform, setPlatform] = useState('linux');
    const platforms = [
        { key: 'linux', label: 'Linux' },
        { key: 'mac', label: 'macOS' },
        { key: 'windows', label: 'Windows' },
    ];
    return (<div>
      <div className="flex gap-2 mb-4">
        {platforms.map((p) => (<button key={p.key} onClick={() => setPlatform(p.key)} className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${platform === p.key
                ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200 border border-transparent hover:border-slate-700/50'}`}>
            {p.label}
          </button>))}
      </div>
      <div>{content[platform]}</div>
    </div>);
}
// ── Main Page ─────────────────────────────────────────────────────────────
export default function NodesPage() {
    // Calculator state
    const [cpuCores, setCpuCores] = useState(4);
    const [ram, setRam] = useState(8);
    const [uptime, setUptime] = useState(16);
    const [hasGpu, setHasGpu] = useState(false);
    // Compute earnings
    const cpuScore = calcScore(cpuCores, REF_CPU, 4.0);
    const ramScore = calcScore(ram, REF_RAM, 4.0);
    const netScore = calcScore(100, REF_NET, 3.0); // simplified — fixed at 100Mbps
    const uptimeScore = uptime / REF_UPTIME;
    const compositeScore = cpuScore * CPU_WEIGHT +
        ramScore * RAM_WEIGHT +
        netScore * NET_WEIGHT +
        uptimeScore * UPTIME_WEIGHT;
    const finalScore = hasGpu ? compositeScore * GPU_BONUS_FACTOR : compositeScore;
    const monthlyAnx = BASE_MONTHLY_ANX * finalScore;
    const dailyErg = monthlyAnx / 30;
    const yearlyErg = monthlyAnx * 12;
    const monthlyUsd = monthlyAnx * ANX_PRICE_USD;
    const competitivePct = Math.min(100, Math.round((finalScore / 2.5) * 100));
    const uptimeOptions = [
        { label: 'Casual', hours: 6, sub: '~6 hrs/day' },
        { label: 'Regular', hours: 16, sub: '~16 hrs/day' },
        { label: '24/7', hours: 24, sub: 'Always on' },
    ];
    return (<div className="min-h-screen">
      <Navigation />

      <main>
        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden py-20 px-4">
          <div className="max-w-7xl mx-auto text-center relative z-10">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              {/* Alpha badge */}
              <div className="inline-block mb-6 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                <span className="text-xs font-semibold text-amber-400 tracking-widest uppercase">
                  Alpha Network — Early Operators Welcome
                </span>
              </div>

              <h1 className="text-5xl md:text-7xl font-frontier font-bold mb-6 bg-gradient-to-r from-slate-50 via-amber-300 to-amber-500 bg-clip-text text-transparent tracking-tight leading-none">
                EARN ANX BY POWERING
                <br />
                <span className="text-amber-400">DECENTRALIZED AI</span>
              </h1>

              <p className="text-xl text-slate-400 mb-8 max-w-3xl mx-auto leading-relaxed">
                Run a Celaut Nodo. Share your spare compute. Get paid in ANX — trustlessly, on-chain.
                Think of it as Airbnb for CPU &amp; RAM, powered by the Ergo blockchain.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a href="#get-started">
                  <Button size="lg" className="text-lg px-8 py-4 h-auto group">
                    Get Started
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform"/>
                  </Button>
                </a>
                <a href="#calculator">
                  <Button variant="outline" size="lg" className="text-lg px-8 py-4 h-auto">
                    Estimate Earnings
                  </Button>
                </a>
              </div>
            </motion.div>

            {/* Ambient glow */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-amber-500/5"/>
              <motion.div className="absolute w-96 h-96 rounded-full opacity-10 blur-3xl bg-amber-400" animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.15, 0.1] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }} style={{ right: '20%', bottom: '10%' }}/>
              <motion.div className="absolute w-72 h-72 rounded-full opacity-10 blur-3xl bg-amber-400" animate={{ scale: [1, 1.15, 1], opacity: [0.08, 0.12, 0.08] }} transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }} style={{ left: '15%', top: '20%' }}/>
            </div>
          </div>
        </section>

        {/* ── Value Props ──────────────────────────────────────────────── */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-8" variants={stagger} initial="initial" animate="animate">
              {[
            {
                icon: Zap,
                title: 'Earn Passively',
                desc: 'Your computer works while you sleep. Nodo handles job routing, pricing, and payments automatically.',
            },
            {
                icon: Server,
                title: 'No Middleman',
                desc: 'Payments flow directly to your Ergo wallet via smart contracts. No platform takes a cut.',
            },
            {
                icon: TrendingUp,
                title: 'Early Advantage',
                desc: 'The network is young and growing. Early operators build reputation and earn more as demand scales.',
            },
        ].map((item, i) => {
            const Icon = item.icon;
            return (<motion.div key={i} variants={fadeInUp}>
                    <Card className="h-full hover:border-amber-500/50 transition-all duration-300 group glow-frontier">
                      <CardHeader className="text-center">
                        <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-amber-500/20 transition-colors border border-amber-500/20">
                          <Icon className="w-8 h-8 text-amber-400"/>
                        </div>
                        <CardTitle className="text-xl font-frontier tracking-wider">
                          {item.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-slate-400 text-center">{item.desc}</p>
                      </CardContent>
                    </Card>
                  </motion.div>);
        })}
            </motion.div>
          </div>
        </section>

        {/* ── Earning Calculator ───────────────────────────────────────── */}
        <section id="calculator" className="py-20 px-4 bg-space-800/20">
          <div className="max-w-4xl mx-auto">
            <motion.div className="text-center mb-12" {...fadeInUp}>
              <h2 className="text-4xl font-frontier font-bold mb-4 tracking-wider">
                EARNING CALCULATOR
              </h2>
              <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                Estimate how much ANX you can earn based on your hardware
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Hardware Config */}
              <Card className="p-6">
                <CardContent className="space-y-8 p-0">
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">
                    ⚙️ Your Hardware
                  </div>

                  {/* CPU Cores */}
                  <div>
                    <div className="flex justify-between items-baseline mb-2">
                      <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                        <Cpu className="w-4 h-4 text-amber-400"/> CPU Cores
                      </label>
                      <span className="text-xl font-bold text-amber-400 tabular-nums">
                        {cpuCores}
                        <span className="text-xs text-slate-500 ml-1">cores</span>
                      </span>
                    </div>
                    <input type="range" min={1} max={64} step={1} value={cpuCores} onChange={(e) => setCpuCores(Number(e.target.value))} className="w-full accent-amber-500 h-1.5 rounded-full bg-slate-700 appearance-none cursor-pointer
                        [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 
                        [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-500 
                        [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(115,66,220,0.5)] [&::-webkit-slider-thumb]:cursor-pointer
                        [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full 
                        [&::-moz-range-thumb]:bg-amber-500 [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:cursor-pointer"/>
                    <div className="flex justify-between text-xs text-slate-600 mt-1">
                      <span>1</span><span>16</span><span>32</span><span>48</span><span>64</span>
                    </div>
                  </div>

                  {/* RAM */}
                  <div>
                    <div className="flex justify-between items-baseline mb-2">
                      <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                        <MemoryStick className="w-4 h-4 text-amber-400"/> RAM
                      </label>
                      <span className="text-xl font-bold text-amber-400 tabular-nums">
                        {ram}
                        <span className="text-xs text-slate-500 ml-1">GB</span>
                      </span>
                    </div>
                    <input type="range" min={2} max={256} step={2} value={ram} onChange={(e) => setRam(Number(e.target.value))} className="w-full accent-amber-500 h-1.5 rounded-full bg-slate-700 appearance-none cursor-pointer
                        [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 
                        [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-500 
                        [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(115,66,220,0.5)] [&::-webkit-slider-thumb]:cursor-pointer
                        [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full 
                        [&::-moz-range-thumb]:bg-amber-500 [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:cursor-pointer"/>
                    <div className="flex justify-between text-xs text-slate-600 mt-1">
                      <span>2</span><span>64</span><span>128</span><span>192</span><span>256</span>
                    </div>
                  </div>

                  {/* Uptime */}
                  <div>
                    <label className="text-sm font-medium text-slate-300 flex items-center gap-2 mb-3">
                      <Clock className="w-4 h-4 text-amber-400"/> Uptime
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {uptimeOptions.map((opt) => (<button key={opt.hours} onClick={() => setUptime(opt.hours)} className={`p-3 rounded-xl text-center text-sm font-semibold transition-all duration-200 border ${uptime === opt.hours
                ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                : 'text-slate-400 border-slate-700/40 hover:border-slate-600/60 hover:text-slate-200'}`}>
                          {opt.label}
                          <span className="block text-xs opacity-60 mt-0.5">{opt.sub}</span>
                        </button>))}
                    </div>
                  </div>

                  {/* GPU Toggle */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-slate-300 flex items-center gap-2">
                        <MonitorCog className="w-4 h-4 text-amber-400"/> GPU Available
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        NVIDIA GPU for compute workloads
                      </div>
                    </div>
                    <button onClick={() => setHasGpu(!hasGpu)} className={`relative w-12 h-7 rounded-full transition-colors duration-200 ${hasGpu ? 'bg-amber-500' : 'bg-slate-700'}`}>
                      <div className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white transition-transform duration-200 ${hasGpu ? 'translate-x-5' : 'translate-x-0'}`}/>
                    </button>
                  </div>
                </CardContent>
              </Card>

              {/* Results */}
              <div className="space-y-6">
                <Card className="p-6 bg-gradient-to-br from-space-800 to-space-700 border-amber-500/30 glow-frontier">
                  <CardContent className="p-0 space-y-6">
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
                      💰 Estimated Earnings
                    </div>

                    {/* Monthly — featured */}
                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-5 text-center">
                      <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">
                        Monthly Estimate
                      </div>
                      <div className="text-4xl font-bold text-amber-400 tabular-nums">
                        {monthlyAnx.toFixed(1)}
                        <span className="text-lg text-slate-500 ml-1">ANX</span>
                      </div>
                      <div className="text-sm text-amber-400 mt-1">
                        ≈ ${monthlyUsd.toFixed(2)} USD/month
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-space-900/50 rounded-xl p-4 text-center">
                        <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">
                          Daily
                        </div>
                        <div className="text-2xl font-bold text-amber-400 tabular-nums">
                          {dailyErg.toFixed(2)}
                          <span className="text-sm text-slate-500 ml-1">ANX</span>
                        </div>
                      </div>
                      <div className="bg-space-900/50 rounded-xl p-4 text-center">
                        <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">
                          Yearly
                        </div>
                        <div className="text-2xl font-bold text-amber-400 tabular-nums">
                          {yearlyErg.toFixed(0)}
                          <span className="text-sm text-slate-500 ml-1">ANX</span>
                        </div>
                      </div>
                    </div>

                    {/* Competitiveness Bar */}
                    <div>
                      <div className="flex justify-between text-xs mb-2">
                        <span className="text-slate-500">Node Competitiveness</span>
                        <span className="text-amber-400 font-bold">{competitivePct}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-700/50 rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-500" style={{ width: `${competitivePct}%` }}/>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Disclaimer */}
                <div className="bg-amber-500/5 border border-amber-500/15 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5"/>
                    <div className="text-xs text-slate-400 leading-relaxed">
                      <span className="text-amber-400 font-semibold">Estimates only.</span>{' '}
                      Celaut is in alpha — the network is small and growing. Actual earnings
                      depend on demand, uptime, and network conditions.
                      Early operators are positioning for future growth.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 3 Step Onboarding ────────────────────────────────────────── */}
        <section id="get-started" className="py-20 px-4">
          <div className="max-w-5xl mx-auto">
            <motion.div className="text-center mb-16" {...fadeInUp}>
              <h2 className="text-4xl font-frontier font-bold mb-4 tracking-wider">
                THREE STEPS TO START EARNING
              </h2>
              <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                From zero to earning ANX in under 30 minutes
              </p>
            </motion.div>

            {/* ── Step 1: Get Wallet ─────────────────────────────────── */}
            <motion.div className="mb-12" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.6 }}>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-copper-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="text-2xl font-frontier font-bold tracking-wide">
                    GET AN ERGO WALLET
                  </h3>
                  <p className="text-slate-400 text-sm">
                    You need a wallet to receive ANX earnings — takes 2 minutes
                  </p>
                </div>
              </div>

              <Card className="p-6">
                <CardContent className="p-0 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Mobile */}
                    <div className="bg-space-900/40 rounded-xl p-5 border border-slate-700/30">
                      <div className="flex items-center gap-3 mb-3">
                        <Wallet className="w-5 h-5 text-amber-400"/>
                        <h4 className="font-semibold text-slate-200">
                          📱 On Phone (Easiest)
                        </h4>
                      </div>
                      <ul className="space-y-2 text-sm text-slate-400">
                        <li className="flex items-start gap-2">
                          <ChevronRight className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5"/>
                          <span>
                            <strong className="text-slate-300">iPhone:</strong> Download{' '}
                            <em>Terminus Wallet</em> from the App Store
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <ChevronRight className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5"/>
                          <span>
                            <strong className="text-slate-300">Android:</strong> Download{' '}
                            <em>Ergo Wallet</em> from Google Play
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <ChevronRight className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5"/>
                          <span>Create wallet → write down your 15-word phrase on <strong className="text-amber-300">paper</strong></span>
                        </li>
                      </ul>
                    </div>

                    {/* Desktop */}
                    <div className="bg-space-900/40 rounded-xl p-5 border border-slate-700/30">
                      <div className="flex items-center gap-3 mb-3">
                        <Wallet className="w-5 h-5 text-amber-400"/>
                        <h4 className="font-semibold text-slate-200">
                          💻 On Computer
                        </h4>
                      </div>
                      <ul className="space-y-2 text-sm text-slate-400">
                        <li className="flex items-start gap-2">
                          <ChevronRight className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5"/>
                          <span>
                            Install <strong className="text-slate-300">Nautilus Wallet</strong>{' '}
                            browser extension
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <ChevronRight className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5"/>
                          <span>
                            Available for Chrome, Firefox, Brave, Edge
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <ChevronRight className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5"/>
                          <span>Create wallet → write down your 15-word phrase on <strong className="text-amber-300">paper</strong></span>
                        </li>
                      </ul>
                      <a href="https://chrome.google.com/webstore/detail/nautilus-wallet/gjlmehlldlphhljhpnlddaodbjjcchai" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 mt-3 text-xs text-amber-400 hover:text-amber-300 transition-colors">
                        Get Nautilus <ExternalLink className="w-3 h-3"/>
                      </a>
                    </div>
                  </div>

                  <div className="bg-red-500/5 border border-red-500/15 rounded-lg p-3 text-xs text-slate-400">
                    🔒 <strong className="text-red-300">Never share your 15-word recovery phrase.</strong>{' '}
                    Not with support agents, websites, or &ldquo;airdrops.&rdquo; Anyone with your phrase has your funds.
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* ── Step 2: Run Ergo Node (Optional) ──────────────────── */}
            <motion.div className="mb-12" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }}>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-copper-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="text-2xl font-frontier font-bold tracking-wide">
                    RUN AN ERGO NODE
                    <span className="ml-3 text-xs font-normal bg-slate-700/50 text-slate-400 px-2.5 py-1 rounded-full">
                      Optional
                    </span>
                  </h3>
                  <p className="text-slate-400 text-sm">
                    Strengthen the network — not required for Nodo earnings
                  </p>
                </div>
              </div>

              <Card className="p-6">
                <CardContent className="p-0 space-y-4">
                  <div className="text-sm text-slate-400 mb-4">
                    Requires <strong className="text-slate-300">Java 11+</strong>, <strong className="text-slate-300">4 GB RAM</strong>, and{' '}
                    <strong className="text-slate-300">20 GB SSD</strong> minimum.{' '}
                    <a href="https://satergo.com" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:text-amber-300 underline decoration-amber-500/30">
                      Or use Satergo
                    </a>{' '}
                    for a GUI alternative.
                  </div>

                  <PlatformTabs content={{
            linux: (<div className="space-y-3">
                          <CodeBlock label="Install Java" code="sudo apt update && sudo apt install -y default-jre-headless"/>
                          <CodeBlock label="Download & Run" code={`mkdir -p ~/ergo && cd ~/ergo
curl -L -o ergo-6.0.2.jar https://github.com/ergoplatform/ergo/releases/download/v6.0.2/ergo-6.0.2.jar

cat > ergo.conf << 'EOF'
ergo {
  node { mining = false }
}
scorex {
  restApi {
    apiKeyHash = "1ca70854ef0e1a95e1eab823e1e3e86f099142efb76e2af6e0af9b71e6a15fc8"
  }
}
EOF

java -jar -Xmx4G ergo-6.0.2.jar --mainnet -c ergo.conf`}/>
                        </div>),
            mac: (<div className="space-y-3">
                          <CodeBlock label="Install Java via Homebrew" code="brew install openjdk@17"/>
                          <CodeBlock label="Download & Run" code={`mkdir -p ~/ergo && cd ~/ergo
curl -L -o ergo-6.0.2.jar https://github.com/ergoplatform/ergo/releases/download/v6.0.2/ergo-6.0.2.jar

cat > ergo.conf << 'EOF'
ergo {
  node { mining = false }
}
scorex {
  restApi {
    apiKeyHash = "1ca70854ef0e1a95e1eab823e1e3e86f099142efb76e2af6e0af9b71e6a15fc8"
  }
}
EOF

java -jar -Xmx4G ergo-6.0.2.jar --mainnet -c ergo.conf`}/>
                        </div>),
            windows: (<div className="space-y-3">
                          <CodeBlock label="Install Java (PowerShell)" code="winget install EclipseAdoptium.Temurin.17.JDK"/>
                          <CodeBlock label="Download & Run (PowerShell)" code={`New-Item -ItemType Directory -Force -Path D:\\ergo-node
Invoke-WebRequest -Uri "https://github.com/ergoplatform/ergo/releases/download/v6.0.2/ergo-6.0.2.jar" -OutFile "D:\\ergo-node\\ergo-6.0.2.jar"

# Create ergo.conf in D:\\ergo-node with:
# ergo { node { mining = false } }
# scorex { restApi { apiKeyHash = "1ca70854..." } }

cd D:\\ergo-node
java -jar -Xmx4G ergo-6.0.2.jar --mainnet -c ergo.conf`}/>
                        </div>),
        }}/>

                  <div className="bg-amber-500/5 border border-amber-500/15 rounded-lg p-3 text-xs text-slate-400 mt-4">
                    <strong className="text-amber-300">⚠️ Generate your own API key!</strong>{' '}
                    The hash above is a placeholder. Once your node is running, visit{' '}
                    <a href="http://127.0.0.1:9053/swagger" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:text-amber-300 underline decoration-amber-500/30">
                      http://127.0.0.1:9053/swagger
                    </a>{' '}
                    to generate a secure API key hash and replace it in your{' '}
                    <code className="bg-space-900/60 px-1 rounded text-amber-400">ergo.conf</code>.
                  </div>

                  <div className="text-xs text-slate-500 mt-2">
                    Verify at{' '}
                    <code className="bg-space-900/60 px-1.5 py-0.5 rounded text-amber-400">
                      http://127.0.0.1:9053/panel
                    </code>{' '}
                    — initial sync takes several hours.
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* ── Step 3: Run Celaut Nodo ──────────────────────────── */}
            <motion.div className="mb-12" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }}>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-copper-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="text-2xl font-frontier font-bold tracking-wide">
                    RUN CELAUT NODO
                  </h3>
                  <p className="text-slate-400 text-sm">
                    Start earning ANX by sharing your compute resources
                  </p>
                </div>
              </div>

              <Card className="p-6">
                <CardContent className="p-0 space-y-4">
                  <div className="text-sm text-slate-400 mb-4">
                    Requires <strong className="text-slate-300">Ubuntu 22.04+</strong>. One command installs everything.{' '}
                    <strong className="text-slate-300">~5 minutes</strong> total.
                  </div>

                  <div className="space-y-3">
                    <CodeBlock label="Install Nodo (Ubuntu 22.04+)" code={`curl --proto '=https' --tlsv1.2 -sSf https://raw.githubusercontent.com/celaut-project/nodo/stable/install.sh | sudo bash`}/>
                    <CodeBlock label="Configure your wallet" code={`# Open interactive config:
nodo config

# Or manually edit:
sudo nano /nodo/config.yaml
# Set your wallet mnemonic under ledgers.ergo.WALLET_MNEMONIC

sudo systemctl restart nodo`}/>
                    <CodeBlock label="Monitor your node" code={`nodo tui      # Live dashboard
nodo info     # Quick status
nodo peers    # Connected peers
nodo logs     # View logs`}/>
                  </div>

                  {/* Connectivity */}
                  <div className="bg-space-900/40 rounded-xl p-4 border border-slate-700/30 mt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Wifi className="w-4 h-4 text-amber-400"/>
                      <h4 className="text-sm font-semibold text-slate-300">
                        Network Connectivity
                      </h4>
                    </div>
                    <div className="text-xs text-slate-400 space-y-1">
                      <p>
                        <strong className="text-slate-300">Best:</strong> Forward a port on your router and set{' '}
                        <code className="bg-space-900/60 px-1 rounded text-amber-400">
                          GATEWAY_PORT
                        </code>{' '}
                        in config.
                      </p>
                      <p>
                        <strong className="text-slate-300">Easy:</strong> Use{' '}
                        <a href="https://ngrok.com" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:text-amber-300">
                          ngrok
                        </a>{' '}
                        — add your auth token to config for zero-config tunneling.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* ── Alpha Network Notice ─────────────────────────────────── */}
        <section className="py-12 px-4">
          <div className="max-w-3xl mx-auto">
            <Card className="p-8 bg-gradient-to-br from-space-800 to-space-700 border-amber-500/20">
              <CardContent className="p-0 text-center space-y-4">
                <div className="w-14 h-14 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto border border-amber-500/20">
                  <AlertTriangle className="w-7 h-7 text-amber-400"/>
                </div>
                <h3 className="text-2xl font-frontier font-bold tracking-wider">
                  ALPHA NETWORK NOTICE
                </h3>
                <p className="text-slate-400 max-w-xl mx-auto leading-relaxed">
                  Celaut is in active development. The network is small and earnings are modest —
                  but it needs operators like you to grow. Early node runners build
                  reputation and position themselves for when demand
                  scales. This is the ground floor.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
                  <a href="https://github.com/celaut-project/nodo" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="group">
                      <Box className="w-4 h-4 mr-2"/>
                      Nodo GitHub
                      <ExternalLink className="w-3 h-3 ml-2 opacity-50 group-hover:opacity-100 transition-opacity"/>
                    </Button>
                  </a>
                  <a href="https://github.com/celaut-project/paradigm" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="group">
                      Celaut Paradigm
                      <ExternalLink className="w-3 h-3 ml-2 opacity-50 group-hover:opacity-100 transition-opacity"/>
                    </Button>
                  </a>
                  <a href="https://discord.gg/ergo-platform-668903786361651200" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="group">
                      Ergo Discord
                      <ExternalLink className="w-3 h-3 ml-2 opacity-50 group-hover:opacity-100 transition-opacity"/>
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────────── */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }}>
              <Card className="p-12 bg-gradient-to-br from-space-800 to-space-700 border-amber-500/20 glow-frontier">
                <CardContent className="space-y-6">
                  <h2 className="text-4xl font-frontier font-bold tracking-wider">
                    READY TO START EARNING?
                  </h2>
                  <p className="text-xl text-slate-300">
                    Join the decentralized compute revolution. Your machine. Your earnings. No middleman.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <a href="#get-started">
                      <Button size="lg" className="text-lg px-8 py-4 h-auto group">
                        Start Setup Guide
                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform"/>
                      </Button>
                    </a>
                    <Link href="/exchange">
                      <Button variant="outline" size="lg" className="text-lg px-8 py-4 h-auto">
                        Trade ANX
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>
      </main>
    </div>);
}
