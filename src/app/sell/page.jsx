"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Navigation } from '@/components/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Info, AlertTriangle, Star, Eye, Users, ExternalLink, } from 'lucide-react';
import { BrandIcon } from '@/components/ui/icon';
import { PAYMENT_METHODS } from '@/lib/constants';
import { formatCurrency, formatANX } from '@/lib/utils';
import { useWallet } from '@/lib/hooks/useWallet';
import { createOffer } from '@/lib/api';
import { useRouter } from 'next/navigation';
const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
};
export default function SellPage() {
    const router = useRouter();
    const { wallet, connect, ensureAuth } = useWallet();
    const [formData, setFormData] = useState({
        amount: '',
        pricePerAnx: '',
        paymentMethod: 'Revolut',
        paymentTag: '',
        verificationConsent: false
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!wallet.connected || !wallet.address) {
            setSubmitError('Connect your wallet first');
            return;
        }
        setIsSubmitting(true);
        setSubmitError(null);
        try {
            await ensureAuth();
            await createOffer({
                amountEth: formData.amount,
                pricePerEth: Number(formData.pricePerAnx),
                method: formData.paymentMethod,
                tag: formData.paymentTag,
            });
            setFormData({
                amount: '',
                pricePerAnx: '',
                paymentMethod: 'Revolut',
                paymentTag: '',
                verificationConsent: false
            });
            router.push('/exchange/');
        }
        catch (err) {
            setSubmitError(err instanceof Error ? err.message : 'Failed to create offer');
        }
        finally {
            setIsSubmitting(false);
        }
    };
    const totalValue = formData.amount && formData.pricePerAnx
        ? Number(formData.amount) * Number(formData.pricePerAnx)
        : 0;
    const isFormValid = formData.amount &&
        formData.pricePerAnx &&
        formData.paymentTag &&
        formData.verificationConsent &&
        wallet.connected;
    const paymentMethodOptions = PAYMENT_METHODS.map(method => ({
        value: method,
        label: method
    }));
    return (<div className="min-h-screen">
      <Navigation />
      
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div className="text-center mb-12" {...fadeInUp}>
          <h1 className="text-5xl font-frontier font-bold mb-4 bg-gradient-to-r from-slate-50 to-amber-300 bg-clip-text text-transparent tracking-wider">
            SELL YOUR ANX
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            List your ANX for sale and earn from direct peer-to-peer trades secured by smart contracts
          </p>
        </motion.div>

        {/* Wallet Status */}
        {!wallet.connected && (<motion.div className="mb-8" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card className="bg-amber-500/10 border-amber-500/30">
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-400"/>
                  <span className="text-amber-300">Connect your wallet to start selling ANX</span>
                </div>
                <Button variant="amber" size="sm" onClick={connect} className="text-white hover:bg-amber-600">
                  Connect Wallet
                </Button>
              </CardContent>
            </Card>
          </motion.div>)}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <motion.div {...fadeInUp}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BrandIcon name="fiat" size="md"/>
                    Create Sell Offer
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* ANX Amount */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Amount of ANX to sell *
                      </label>
                      <div className="relative">
                        <Input type="number" value={formData.amount} onChange={(e) => handleInputChange('amount', e.target.value)} placeholder="1000" min="1" step="0.1" required disabled={!wallet.connected} className="text-lg pr-16"/>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
                          ANX
                        </div>
                      </div>
                      {wallet.connected && (<p className="text-sm text-slate-400 mt-1">
                          Wallet balance: {wallet.balance} {wallet.symbol || 'ANX'}
                        </p>)}
                      {submitError ? (<p className="text-sm text-red-400 mt-2">{submitError}</p>) : null}
                    </div>

                    {/* Price per ANX */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Price per ANX (USD) *
                      </label>
                      <div className="relative">
                        <Input type="number" value={formData.pricePerAnx} onChange={(e) => handleInputChange('pricePerAnx', e.target.value)} placeholder="1.85" min="0.01" step="0.01" required disabled={!wallet.connected} className="text-lg pr-16"/>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
                          USD
                        </div>
                      </div>
                      <p className="text-sm text-gray-400 mt-1">
                        Current market average: $1.83
                      </p>
                    </div>

                    {/* Payment Method */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Payment Method *
                      </label>
                      <Select options={paymentMethodOptions} value={formData.paymentMethod} onChange={(e) => handleInputChange('paymentMethod', e.target.value)} disabled={!wallet.connected}/>
                      <p className="text-sm text-gray-400 mt-1">
                        Choose how buyers will send you payment
                      </p>
                    </div>

                    {/* Payment Handle */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        {formData.paymentMethod} Handle *
                      </label>
                      <Input type="text" value={formData.paymentTag} onChange={(e) => handleInputChange('paymentTag', e.target.value)} placeholder={formData.paymentMethod === 'Revolut' ? '@your_revolut_tag' :
            formData.paymentMethod === 'PayPal' ? 'your.email@example.com' :
                'your.wise@email.com'} required disabled={!wallet.connected} className="font-mono"/>
                      <p className="text-sm text-gray-400 mt-1">
                        Buyers will send payment to this {formData.paymentMethod} handle
                      </p>
                    </div>

                    {/* Verification Consent */}
                    <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-lg">
                      <div className="flex items-start gap-3">
                        <input type="checkbox" id="verificationConsent" checked={formData.verificationConsent} onChange={(e) => handleInputChange('verificationConsent', e.target.checked)} disabled={!wallet.connected} className="mt-1 w-4 h-4 text-amber-600 bg-navy-700 border-gray-600 rounded focus:ring-amber-500"/>
                        <div>
                          <label htmlFor="verificationConsent" className="text-sm font-medium text-amber-300 cursor-pointer">
                            I grant our verification network access to confirm received payments *
                          </label>
                          <p className="text-xs text-amber-200/80 mt-1">
                            This allows verifiers to confirm when payments are received, ensuring secure trades.
                            Only transaction verification data is accessed, not personal information.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Order Summary */}
                    {totalValue > 0 && (<div className="bg-navy-700/30 p-4 rounded-lg">
                        <h4 className="font-medium mb-3">Offer Summary</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-400">ANX Amount:</span>
                            <span className="font-mono">{formatANX(Number(formData.amount))}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Price per ANX:</span>
                            <span className="font-mono">{formatCurrency(Number(formData.pricePerAnx))}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Payment Method:</span>
                            <Badge variant="emerald">{formData.paymentMethod}</Badge>
                          </div>
                          <hr className="border-gray-600"/>
                          <div className="flex justify-between text-lg font-bold">
                            <span>Total Value:</span>
                            <span className="text-emerald-400">{formatCurrency(totalValue)}</span>
                          </div>
                        </div>
                      </div>)}

                    {/* Submit Button */}
                    <Button type="submit" className="w-full text-lg py-3 h-auto" disabled={!isFormValid || isSubmitting} loading={isSubmitting}>
                      {isSubmitting ? 'Creating offer...' : 'Create Offer'}
                    </Button>

                    {!wallet.connected && (<p className="text-center text-slate-400 text-sm">
                        Connect your wallet to create offers
                      </p>)}
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* How Selling Works */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.6 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Info className="w-5 h-5 text-amber-400"/>
                    How Selling Works
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                      1
                    </div>
                    <div>
                      <p className="text-sm font-medium">Lock ANX in Escrow</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Your ANX is secured by a smart contract until payment is verified
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                      2
                    </div>
                    <div>
                      <p className="text-sm font-medium">Buyers See Your Offer</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Your offer appears in the exchange order book
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                      3
                    </div>
                    <div>
                      <p className="text-sm font-medium">Receive Payment</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Buyer sends fiat to your payment handle
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                      4
                    </div>
                    <div>
                      <p className="text-sm font-medium">Payment Verification</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Verifiers confirm payment and release ANX to buyer
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Security Features */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.6 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BrandIcon name="shield" size="md"/>
                    Security Features
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <BrandIcon name="lock" size="sm" className="flex-shrink-0"/>
                    <span className="text-sm">Smart contract escrow</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Eye className="w-4 h-4 text-emerald-400 flex-shrink-0"/>
                    <span className="text-sm">Cryptographic verification</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Users className="w-4 h-4 text-emerald-400 flex-shrink-0"/>
                    <span className="text-sm">Independent verifiers</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <BrandIcon name="check" size="sm"/>
                    <span className="text-sm">Automated release</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Market Stats */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4, duration: 0.6 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BrandIcon name="chart" size="md"/>
                    Market Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-sm">Active Offers:</span>
                    <span className="font-bold">6</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-sm">Best Price:</span>
                    <span className="font-bold text-emerald-400">$1.80</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-sm">Average Price:</span>
                    <span className="font-bold">$1.83</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-sm">24h Volume:</span>
                    <span className="font-bold">47,392 ANX</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Top Seller Rating:</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current text-yellow-400"/>
                      <span className="font-bold text-sm">5.0</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Verification Explainer */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5, duration: 0.6 }}>
              <Card className="bg-amber-500/5 border-amber-500/20">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BrandIcon name="shield" size="md"/>
                    About Verification
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-amber-200/80">
                    Our verification network uses independent verifiers to cryptographically 
                    confirm payments were received — no trust required.
                  </p>
                  
                  <p className="text-sm text-amber-200/80">
                    Your financial privacy is protected — verifiers only confirm transaction 
                    status, not account details or balances.
                  </p>
                  
                  <Button variant="outline" size="sm" className="w-full border-amber-500/50 text-amber-400 hover:bg-amber-500/10" onClick={() => window.open('/how-it-works#verification', '_blank')}>
                    Learn More
                    <ExternalLink className="w-3 h-3 ml-2"/>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
    </div>);
}
