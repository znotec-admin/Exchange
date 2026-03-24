"use client";
import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { Star, Filter, ArrowUpDown, Loader, } from "lucide-react";
import { BrandIcon } from "@/components/ui/icon";
import { PAYMENT_METHODS } from "@/lib/constants";
import { formatCurrency, truncateAddress } from "@/lib/utils";
import { useWallet } from "@/lib/hooks/useWallet";
import { fetchMyTrades, fetchOffers, } from "@/lib/api";
import Link from "next/link";
const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
};
export default function ExchangePage() {
    const [selectedMethod, setSelectedMethod] = useState("all");
    const [sortBy, setSortBy] = useState("price-asc");
    const [offers, setOffers] = useState([]);
    const [myTrades, setMyTrades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { wallet, connect, isAuthenticated, ensureAuth } = useWallet();
    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                setLoading(true);
                const data = await fetchOffers();
                if (!cancelled) {
                    setOffers(data);
                    setError(null);
                }
            }
            catch (e) {
                if (!cancelled) {
                    setError(e instanceof Error ? e.message : "Failed to load offers");
                }
            }
            finally {
                if (!cancelled)
                    setLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, []);
    useEffect(() => {
        let cancelled = false;
        (async () => {
            if (!wallet.connected || !isAuthenticated) {
                setMyTrades([]);
                return;
            }
            try {
                await ensureAuth();
                const trades = await fetchMyTrades();
                if (!cancelled) {
                    setMyTrades(trades.filter((t) => ["open", "funded", "paid"].includes(t.status)));
                }
            }
            catch {
                if (!cancelled)
                    setMyTrades([]);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [wallet.connected, isAuthenticated, ensureAuth]);
    const sortOptions = [
        { value: "price-asc", label: "Price: Low to High" },
        { value: "price-desc", label: "Price: High to Low" },
        { value: "amount-asc", label: "Amount: Low to High" },
        { value: "amount-desc", label: "Amount: High to Low" },
        { value: "rating-desc", label: "Rating: High to Low" },
    ];
    const methodOptions = [
        { value: "all", label: "All Methods" },
        ...PAYMENT_METHODS.map((method) => ({ value: method, label: method })),
    ];
    const filteredAndSortedOffers = useMemo(() => {
        const filtered = selectedMethod === "all"
            ? offers
            : offers.filter((offer) => offer.method === selectedMethod);
        return [...filtered].sort((a, b) => {
            switch (sortBy) {
                case "price-asc":
                    return a.pricePerEth - b.pricePerEth;
                case "price-desc":
                    return b.pricePerEth - a.pricePerEth;
                case "amount-asc":
                    return a.amount - b.amount;
                case "amount-desc":
                    return b.amount - a.amount;
                case "rating-desc":
                    return b.rating - a.rating;
                default:
                    return 0;
            }
        });
    }, [offers, selectedMethod, sortBy]);
    const OfferCard = ({ offer }) => (<motion.div layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
      <Card className="hover:border-amber-500/50 transition-all duration-300 group cursor-pointer glow-frontier">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="text-xs">
                  {truncateAddress(offer.seller)}
                </Badge>
                <Badge variant="trust" className="text-xs flex items-center gap-1">
                  <Star className="w-3 h-3 fill-current"/>
                  {offer.rating}
                </Badge>
              </div>
              <p className="text-sm text-gray-400">{offer.trades} trades completed</p>
            </div>
            <Badge variant={offer.method === "Revolut" ? "emerald" : "secondary"}>
              {offer.method}
            </Badge>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-400 mb-1">Amount</p>
              <p className="text-xl font-bold text-white">
                {offer.amountEth} ANX
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Price per ANX</p>
              <p className="text-xl font-bold text-emerald-400">
                {formatCurrency(offer.pricePerEth)}
              </p>
            </div>
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-400 mb-1">Payment to</p>
            <p className="text-white font-mono text-sm bg-navy-700/50 px-3 py-2 rounded-lg">
              {offer.tag}
            </p>
          </div>

          <div className="flex justify-between items-center text-sm text-gray-400 mb-4">
            <span>
              Total: {formatCurrency(offer.amount * offer.pricePerEth)}
            </span>
            <span>+ 1% network fee</span>
          </div>

          <Link href={`/trade/?offerId=${encodeURIComponent(offer.id)}`}>
            <Button className="w-full group-hover:glow-frontier transition-all font-bold" disabled={!wallet.connected}>
              {wallet.connected ? "Buy ANX" : "Connect Wallet to Trade"}
            </Button>
          </Link>
        </CardContent>
      </Card>
    </motion.div>);
    const bestPrice = offers.length > 0
        ? Math.min(...offers.map((o) => o.pricePerEth))
        : 0;
    const avgPrice = offers.length > 0
        ? offers.reduce((sum, o) => sum + o.pricePerEth, 0) / offers.length
        : 0;
    const totalAvailable = offers.reduce((sum, o) => sum + o.amount, 0);
    return (<div className="min-h-screen">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <motion.div className="text-center mb-8" {...fadeInUp}>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-amber-200 bg-clip-text text-transparent">
            ANX Exchange
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Browse sellers and buy ANX peer-to-peer with fiat payment methods
          </p>
        </motion.div>

        {!wallet.connected && (<motion.div className="mb-8" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card className="bg-amber-500/10 border-amber-500/30">
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <BrandIcon name="wallet" size="md"/>
                  <span className="text-amber-300">
                    Connect your wallet to start trading
                  </span>
                </div>
                <Button variant="amber" size="sm" onClick={connect} className="border-amber-500/50 text-white hover:bg-amber-600">
                  Connect Wallet
                </Button>
              </CardContent>
            </Card>
          </motion.div>)}

        {error && (<Card className="mb-8 bg-red-500/10 border-red-500/30">
            <CardContent className="p-4 text-red-300 text-sm">
              {error}. Is the API running? (`npm run dev` starts web + API)
            </CardContent>
          </Card>)}

        {myTrades.length > 0 && (<motion.div className="mb-8" {...fadeInUp}>
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold">My open trades</h2>
                <p className="text-sm text-slate-400">
                  Resume an in-progress trade (share the link with the other party)
                </p>
              </CardHeader>
              <CardContent className="space-y-2">
                {myTrades.map((t) => {
                const role = wallet.address?.toLowerCase() === t.buyer
                    ? "Buyer"
                    : "Seller";
                return (<Link key={t.id} href={`/trade/?tradeId=${encodeURIComponent(t.id)}`} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-700/50 bg-space-800/40 px-4 py-3 hover:border-amber-500/40 transition-colors">
                      <div className="text-sm">
                        <span className="font-medium text-white">
                          {t.amountEth} ANX
                        </span>
                        <span className="text-slate-500 mx-2">·</span>
                        <span className="text-slate-400">{role}</span>
                        <span className="text-slate-500 mx-2">·</span>
                        <span className="text-slate-400">
                          vs {truncateAddress(role === "Buyer" ? t.seller : t.buyer)}
                        </span>
                      </div>
                      <Badge variant="outline">{t.status}</Badge>
                    </Link>);
            })}
              </CardContent>
            </Card>
          </motion.div>)}

        <motion.div className="flex flex-col sm:flex-row gap-4 mb-8 p-4 bg-navy-800/30 rounded-lg" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }}>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400"/>
            <span className="text-sm text-gray-400 whitespace-nowrap">
              Filter by:
            </span>
            <Select options={methodOptions} value={selectedMethod} onChange={(e) => setSelectedMethod(e.target.value)}/>
          </div>

          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-gray-400"/>
            <span className="text-sm text-gray-400 whitespace-nowrap">
              Sort by:
            </span>
            <Select options={sortOptions} value={sortBy} onChange={(e) => setSortBy(e.target.value)}/>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-400 sm:ml-auto">
            <span>{filteredAndSortedOffers.length} offers</span>
          </div>
        </motion.div>

        <motion.div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }}>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-1 mb-2">
                <BrandIcon name="arrow-down" size="sm"/>
                <span className="text-sm text-gray-400">Best Price</span>
              </div>
              <div className="text-lg font-bold text-emerald-400">
                {offers.length ? formatCurrency(bestPrice) : "—"}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-1 mb-2">
                <BrandIcon name="arrow-up" size="sm"/>
                <span className="text-sm text-gray-400">Avg Price</span>
              </div>
              <div className="text-lg font-bold text-amber-400">
                {offers.length ? formatCurrency(avgPrice) : "—"}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-1 mb-2">
                <BrandIcon name="shield" size="sm"/>
                <span className="text-sm text-gray-400">Total Available</span>
              </div>
              <div className="text-lg font-bold text-white">
                {totalAvailable.toFixed(4)} ANX
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-1 mb-2">
                <BrandIcon name="clock" size="sm"/>
                <span className="text-sm text-gray-400">Avg Response</span>
              </div>
              <div className="text-lg font-bold text-white">~2 min</div>
            </CardContent>
          </Card>
        </motion.div>

        {loading ? (<div className="flex justify-center py-16 text-slate-400 gap-2">
            <Loader className="w-5 h-5 animate-spin"/>
            Loading offers…
          </div>) : (<motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.6 }}>
            {filteredAndSortedOffers.map((offer) => (<OfferCard key={offer.id} offer={offer}/>))}
          </motion.div>)}

        {!loading && filteredAndSortedOffers.length === 0 && !error && (<div className="text-center py-16">
            <h3 className="text-xl font-semibold mb-2">No offers found</h3>
            <p className="text-gray-400 mb-4">
              Try adjusting your filters or create a sell offer
            </p>
            <Link href="/sell/">
              <Button variant="outline">Sell ANX</Button>
            </Link>
          </div>)}
      </main>
    </div>);
}
