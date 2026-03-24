"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Navigation } from '@/components/navigation';
import { ArrowRight, ChevronRight, } from 'lucide-react';
import { BrandIcon } from '@/components/ui/icon';
import { MOCK_STATS } from '@/lib/constants';
import { formatNumber, formatCurrency } from '@/lib/utils';
const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
};
const stagger = {
    animate: {
        transition: {
            staggerChildren: 0.1
        }
    }
};
export default function HomePage() {
    const [animatedStats, setAnimatedStats] = useState({
        trades: 0,
        volume: 0,
        sellers: 0
    });
    useEffect(() => {
        const animateStats = () => {
            const duration = 2000;
            const steps = 60;
            const stepTime = duration / steps;
            let currentStep = 0;
            const timer = setInterval(() => {
                const progress = currentStep / steps;
                const easeOut = 1 - Math.pow(1 - progress, 3);
                setAnimatedStats({
                    trades: Math.floor(MOCK_STATS.totalTrades * easeOut),
                    volume: Math.floor(MOCK_STATS.totalVolume * easeOut),
                    sellers: Math.floor(MOCK_STATS.totalSellers * easeOut)
                });
                currentStep++;
                if (currentStep > steps) {
                    clearInterval(timer);
                }
            }, stepTime);
        };
        const timer = setTimeout(animateStats, 1000);
        return () => clearTimeout(timer);
    }, []);
    const features = [
        {
            icon: "escrow",
            title: "Trustless Escrow",
            description: "Smart contracts hold ANX until payment is verified by independent verifiers"
        },
        {
            icon: "trade",
            title: "Instant Trading",
            description: "Connect wallet, pick offer, pay seller, get ANX. Simple as that."
        },
        {
            icon: "nodes",
            title: "Decentralized",
            description: "No middleman, no KYC, no exchange risk. Pure peer-to-peer trading."
        },
        {
            icon: "fiat",
            title: "Low Fees",
            description: "Only 1% network fee. No deposit, withdrawal or platform fees."
        }
    ];
    const steps = [
        { number: 1, title: "Connect Wallet", description: "Link MetaMask, Rabby, Phantom, or any EVM wallet" },
        { number: 2, title: "Choose Offer", description: "Browse ANX sellers" },
        { number: 3, title: "Send Payment", description: "Pay via Revolut/Wise" },
        { number: 4, title: "Get ANX", description: "Verification complete, ANX sent to your wallet" }
    ];
    return (<div className="min-h-screen">
      <Navigation />
      
      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 px-4">
          <div className="max-w-7xl mx-auto text-center relative z-10">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <h1 className="text-6xl md:text-8xl font-frontier font-bold mb-6 bg-gradient-to-r from-slate-50 via-amber-300 to-amber-500 bg-clip-text text-transparent tracking-tight leading-none">
                TRADE ANX.
                <br />
                <span className="text-amber-400">PEER TO PEER.</span>
                <br />
                <span className="text-teal-400">NO MIDDLEMAN.</span>
              </h1>
              
              <p className="text-xl text-slate-400 mb-8 max-w-3xl mx-auto leading-relaxed">
                The frontier of decentralized exchange.
                Trade ANX for fiat directly with sellers, secured by smart contracts.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/exchange">
                  <Button size="lg" className="text-lg px-8 py-4 h-auto group">
                    Start Trading
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform"/>
                  </Button>
                </Link>
                
                <Link href="/how-it-works">
                  <Button variant="outline" size="lg" className="text-lg px-8 py-4 h-auto">
                    How It Works
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Frontier horizon gradient */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-amber-500/5"/>
              <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-radial from-amber-500/10 via-amber-500/5 to-transparent"/>
              {/* Subtle warm ambient light */}
              <motion.div className="absolute w-96 h-96 rounded-full opacity-10 blur-3xl bg-amber-400" animate={{
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.15, 0.1],
        }} transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
        }} style={{
            right: '20%',
            bottom: '10%',
        }}/>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 px-4">
          <motion.div className="max-w-4xl mx-auto" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.8 }}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="p-6">
                <div className="text-4xl font-bold text-amber-400 mb-2">
                  {formatNumber(animatedStats.trades)}
                </div>
                <div className="text-slate-400">Total Trades</div>
              </div>
              
              <div className="p-6">
                <div className="text-4xl font-bold text-amber-400 mb-2">
                  {formatCurrency(animatedStats.volume)}
                </div>
                <div className="text-slate-400">Volume Traded</div>
              </div>
              
              <div className="p-6">
                <div className="text-4xl font-bold text-amber-400 mb-2">
                  {animatedStats.sellers}
                </div>
                <div className="text-slate-400">Active Sellers</div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.div className="text-center mb-16" {...fadeInUp}>
              <h2 className="text-5xl font-frontier font-bold mb-4 tracking-wider">WHY CHOOSE ALPHANEX?</h2>
              <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                Experience the frontier of cryptocurrency trading with our secure, decentralized platform
              </p>
            </motion.div>

            <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8" variants={stagger} initial="initial" animate="animate">
              {features.map((feature, index) => {
            return (<motion.div key={index} variants={fadeInUp}>
                    <Card className="h-full hover:border-amber-500/50 transition-all duration-300 group glow-frontier">
                      <CardHeader className="text-center">
                        <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-amber-500/20 transition-colors border border-amber-500/20">
                          <BrandIcon name={feature.icon} size="xl"/>
                        </div>
                        <CardTitle className="text-xl font-frontier tracking-wider">{feature.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-slate-400 text-center">{feature.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>);
        })}
            </motion.div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 px-4 bg-space-800/20">
          <div className="max-w-6xl mx-auto">
            <motion.div className="text-center mb-16" {...fadeInUp}>
              <h2 className="text-4xl font-bold mb-4">Trading Made Simple</h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Four steps to get ANX in your wallet. No registration, no KYC, no hassle.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((step, index) => (<motion.div key={index} className="relative text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.2, duration: 0.6 }}>
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-copper-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl shadow-lg">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-frontier font-bold mb-2 tracking-wide">{step.title}</h3>
                  <p className="text-slate-400">{step.description}</p>
                  
                  {/* Arrow between steps */}
                  {index < steps.length - 1 && (<div className="hidden lg:block absolute top-8 -right-4 text-amber-500/60">
                      <ChevronRight className="w-8 h-8"/>
                    </div>)}
                </motion.div>))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }}>
              <Card className="p-12 bg-gradient-to-br from-space-800 to-space-700 border-amber-500/20 glow-frontier">
                <CardContent className="space-y-6">
                  <h2 className="text-4xl font-frontier font-bold tracking-wider">READY TO START TRADING?</h2>
                  <p className="text-xl text-slate-300">
                    Join AlphaNex Exchange. Trade securely with real pioneers.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link href="/exchange">
                      <Button size="lg" className="text-lg px-8 py-4 h-auto group">
                        View Exchange
                        <BrandIcon name="chart" size="md" className="ml-2 group-hover:scale-110 transition-transform"/>
                      </Button>
                    </Link>
                    <Link href="/sell">
                      <Button variant="emerald" size="lg" className="text-lg px-8 py-4 h-auto">
                        Start Selling
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
