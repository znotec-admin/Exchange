"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Navigation } from '@/components/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Users, Lock, Eye, ArrowRight, CheckCircle, Wallet, DollarSign, Clock, Server, Key, Globe } from 'lucide-react';
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
export default function HowItWorksPage() {
    const steps = [
        {
            icon: Wallet,
            title: "Connect Wallet",
            description: "Link MetaMask, Rabby, Phantom, or any EVM wallet",
            details: "Connect with browser or mobile EVM wallets. No registration or KYC required."
        },
        {
            icon: Eye,
            title: "Browse Offers",
            description: "Find verified sellers with competitive rates",
            details: "All sellers are rated by the community and their ANX is locked in smart contract escrow."
        },
        {
            icon: DollarSign,
            title: "Send Payment",
            description: "Pay the seller via Revolut, Wise, or PayPal",
            details: "Send fiat payment directly to the seller using traditional payment methods."
        },
        {
            icon: Shield,
            title: "Payment Verification",
            description: "Independent verifiers confirm your payment",
            details: "Our verification network checks the seller's account to cryptographically confirm payment was received."
        },
        {
            icon: CheckCircle,
            title: "Receive ANX",
            description: "ANX is automatically sent to your wallet",
            details: "Once payment is verified, the smart contract releases ANX directly to your wallet."
        }
    ];
    const features = [
        {
            icon: Lock,
            title: "Smart Contract Escrow",
            description: "ANX is locked in smart contracts until payment verification",
            benefits: ["Trustless trading", "No counterparty risk", "Automated execution"]
        },
        {
            icon: Users,
            title: "Verification Network",
            description: "Decentralized network of independent verifiers confirm payments cryptographically",
            benefits: ["5 verifiers per trade", "3/5 consensus required", "Privacy preserved"]
        },
        {
            icon: Globe,
            title: "Peer-to-Peer Trading",
            description: "Direct trades between buyers and sellers without intermediaries",
            benefits: ["No exchange fees", "No custody risk", "Global accessibility"]
        }
    ];
    const faqItems = [
        {
            question: "How secure is the verification process?",
            answer: "Our verification network uses cryptographic proofs to confirm payments without exposing sensitive data. Verifiers can confirm a payment was received without seeing account balances or personal information."
        },
        {
            question: "What happens if a seller doesn't receive payment?",
            answer: "If judges cannot verify payment within the time window, the ANX is returned to the seller and the trade is cancelled. The escrow smart contract ensures no funds are lost."
        },
        {
            question: "How long does verification take?",
            answer: "Verification typically takes 2-5 minutes. Verifiers need to reach 3/5 consensus to release the ANX."
        },
        {
            question: "What payment methods are supported?",
            answer: "Currently we support Revolut, Wise, and PayPal. More payment providers will be added based on community demand."
        },
        {
            question: "Are there any fees?",
            answer: "There's only a 1% network fee to cover smart contract execution and judge rewards. No deposit, withdrawal, or platform fees."
        },
        {
            question: "Do I need to provide ID or KYC?",
            answer: "No KYC required. Simply connect an EVM wallet (MetaMask, Rabby, Phantom, WalletConnect, and others) to start trading. AlphaNex Exchange is fully decentralized and permissionless."
        }
    ];
    return (<div className="min-h-screen">
      <Navigation />
      
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div className="text-center mb-16" {...fadeInUp}>
          <h1 className="text-5xl md:text-6xl font-frontier font-bold mb-6 bg-gradient-to-r from-slate-50 via-amber-300 to-amber-500 bg-clip-text text-transparent tracking-wider">
            HOW IT WORKS
          </h1>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            AlphaNex Exchange enables secure peer-to-peer trading using smart contracts 
            and the Verification Network. Here's how the frontier works.
          </p>
        </motion.div>

        {/* Trading Flow */}
        <section className="mb-20">
          <motion.div className="text-center mb-12" {...fadeInUp}>
            <h2 className="text-3xl font-bold mb-4">Trading Flow</h2>
            <p className="text-lg text-gray-400">
              Five simple steps to buy ANX directly from sellers
            </p>
          </motion.div>

          <motion.div className="space-y-8" variants={stagger} initial="initial" animate="animate">
            {steps.map((step, index) => {
            const Icon = step.icon;
            return (<motion.div key={index} variants={fadeInUp}>
                  <Card className="overflow-hidden hover:border-amber-500/50 transition-all duration-300">
                    <CardContent className="p-8">
                      <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                        <div className="flex items-center gap-4 flex-shrink-0">
                          <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                            {index + 1}
                          </div>
                          <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center">
                            <Icon className="w-8 h-8 text-amber-400"/>
                          </div>
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                          <p className="text-gray-300 mb-3">{step.description}</p>
                          <p className="text-sm text-gray-400">{step.details}</p>
                        </div>
                        
                        {index < steps.length - 1 && (<div className="hidden md:block text-gray-500">
                            <ArrowRight className="w-6 h-6"/>
                          </div>)}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>);
        })}
          </motion.div>
        </section>

        {/* Key Features */}
        <section className="mb-20">
          <motion.div className="text-center mb-12" {...fadeInUp}>
            <h2 className="text-3xl font-bold mb-4">Key Features</h2>
            <p className="text-lg text-gray-400">
              Advanced technology stack ensuring secure and efficient trading
            </p>
          </motion.div>

          <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-8" variants={stagger} initial="initial" animate="animate">
            {features.map((feature, index) => {
            const Icon = feature.icon;
            return (<motion.div key={index} variants={fadeInUp}>
                  <Card className="h-full hover:border-emerald-500/50 transition-all duration-300 group">
                    <CardHeader className="text-center">
                      <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-emerald-500/20 transition-colors">
                        <Icon className="w-8 h-8 text-emerald-400"/>
                      </div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-400 text-center mb-6">{feature.description}</p>
                      
                      <div className="space-y-2">
                        {feature.benefits.map((benefit, idx) => (<div key={idx} className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0"/>
                            <span className="text-sm text-gray-300">{benefit}</span>
                          </div>))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>);
        })}
          </motion.div>
        </section>

        {/* Verification Deep Dive */}
        <section className="mb-20" id="verification">
          <motion.div {...fadeInUp}>
            <Card className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border-amber-500/20">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl flex items-center justify-center gap-3">
                  <Shield className="w-8 h-8 text-amber-400"/>
                  Verification Network Explained
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                <p className="text-lg text-center text-gray-300 max-w-3xl mx-auto">
                  Our verification network uses cryptographic proofs to confirm payments 
                  without compromising privacy or requiring trusted intermediaries.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-amber-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <Key className="w-5 h-5 text-amber-400"/>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Cryptographic Verification</h4>
                        <p className="text-sm text-gray-400">
                          Verifiers use cryptographic proofs to confirm transactions 
                          without accessing sensitive account information.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <Users className="w-5 h-5 text-emerald-400"/>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Decentralized Consensus</h4>
                        <p className="text-sm text-gray-400">
                          5 independent verifiers evaluate each trade. 3 out of 5 must agree 
                          before ANX is released from escrow.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <Eye className="w-5 h-5 text-purple-400"/>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Privacy Preserved</h4>
                        <p className="text-sm text-gray-400">
                          Only transaction verification data is shared. Account balances, 
                          personal details, and other transactions remain private.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <Clock className="w-5 h-5 text-yellow-400"/>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Fast Verification</h4>
                        <p className="text-sm text-gray-400">
                          Automated verification process typically completes in 2-5 minutes, 
                          much faster than traditional banking confirmations.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <Server className="w-5 h-5 text-red-400"/>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">No Central Authority</h4>
                        <p className="text-sm text-gray-400">
                          No single entity controls the verification process. Verifiers are 
                          distributed globally and operate independently.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-5 h-5 text-green-400"/>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Dispute Resolution</h4>
                        <p className="text-sm text-gray-400">
                          If consensus cannot be reached, funds are safely returned to 
                          original owners. No funds are ever lost or frozen.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </section>

        {/* FAQ */}
        <section>
          <motion.div className="text-center mb-12" {...fadeInUp}>
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-400">
              Get answers to common questions about AlphaNex Exchange
            </p>
          </motion.div>

          <motion.div className="space-y-4" variants={stagger} initial="initial" animate="animate">
            {faqItems.map((item, index) => (<motion.div key={index} variants={fadeInUp}>
                <Card className="hover:border-gray-600 transition-colors">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-3 text-amber-300">
                      {item.question}
                    </h3>
                    <p className="text-gray-400 leading-relaxed">
                      {item.answer}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>))}
          </motion.div>
        </section>
      </main>
    </div>);
}
