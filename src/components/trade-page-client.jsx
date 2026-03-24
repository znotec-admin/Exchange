"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { parseEther } from "viem";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Clock, Shield, CheckCircle, ExternalLink, Copy, AlertTriangle, Loader, } from "lucide-react";
import { formatCurrency, truncateAddress, calculateTotal } from "@/lib/utils";
import { useWallet } from "@/lib/hooks/useWallet";
import { createTrade, fetchOffer, fetchTrade, markTradeFunded, markTradePaid, } from "@/lib/api";
import { AuthRequiredError } from "@/lib/auth";
import { ESCROW_ADDRESS, isEscrowConfigured, p2pEscrowAbi, } from "@/lib/contracts";
const ETHERSCAN_TX = "https://sepolia.etherscan.io/tx/";
function stepFromTradeStatus(status) {
    switch (status) {
        case "open":
            return "awaiting_fund";
        case "funded":
            return "payment";
        case "paid":
            return "awaiting_release";
        case "released":
            return "success";
        case "refunded":
            return "error";
        default:
            return "error";
    }
}
export default function TradePageClient() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const offerId = searchParams.get("offerId") || "";
    const tradeIdParam = searchParams.get("tradeId") || "";
    const { wallet, connect, ensureAuth, isAuthenticated } = useWallet();
    const [offer, setOffer] = useState(null);
    const [trade, setTrade] = useState(null);
    const [amount, setAmount] = useState(0);
    const [step, setStep] = useState("loading");
    const [error, setError] = useState(null);
    const [busy, setBusy] = useState(false);
    const [linkCopied, setLinkCopied] = useState(false);
    const { writeContractAsync, data: fundTxHash } = useWriteContract();
    const { isSuccess: fundConfirmed } = useWaitForTransactionReceipt({
        hash: fundTxHash,
    });
    const tradeLink = useMemo(() => {
        if (!trade?.id || typeof window === "undefined")
            return "";
        return `${window.location.origin}/trade/?tradeId=${encodeURIComponent(trade.id)}`;
    }, [trade?.id]);
    // Load by tradeId (resume) or offerId (new)
    useEffect(() => {
        let cancelled = false;
        (async () => {
            setStep("loading");
            setError(null);
            if (tradeIdParam) {
                try {
                    if (!wallet.connected) {
                        setError("Connect your wallet to open this trade");
                        setStep("error");
                        return;
                    }
                    await ensureAuth();
                    const t = await fetchTrade(tradeIdParam);
                    if (cancelled)
                        return;
                    setTrade(t);
                    try {
                        const o = await fetchOffer(t.offerId);
                        if (!cancelled) {
                            setOffer(o);
                            setAmount(Number(t.amountEth));
                        }
                    }
                    catch {
                        if (!cancelled) {
                            setOffer({
                                id: t.offerId,
                                seller: t.seller,
                                amount: Number(t.amountEth),
                                amountEth: t.amountEth,
                                pricePerAnx: t.pricePerEth,
                                pricePerEth: t.pricePerEth,
                                method: t.method,
                                tag: t.tag,
                                rating: 0,
                                trades: 0,
                                status: "reserved",
                            });
                            setAmount(Number(t.amountEth));
                        }
                    }
                    if (t.status === "refunded") {
                        setError("Trade was refunded");
                    }
                    setStep(stepFromTradeStatus(t.status));
                }
                catch (e) {
                    if (cancelled)
                        return;
                    if (e instanceof AuthRequiredError) {
                        setError("Sign in with your wallet to open this trade");
                    }
                    else {
                        setError(e instanceof Error ? e.message : "Trade not found");
                    }
                    setStep("error");
                }
                return;
            }
            if (!offerId) {
                setError("Missing offerId or tradeId");
                setStep("error");
                return;
            }
            try {
                const o = await fetchOffer(offerId);
                if (cancelled)
                    return;
                setOffer(o);
                setAmount(o.amount);
                setStep("amount");
            }
            catch (e) {
                if (!cancelled) {
                    setError(e instanceof Error ? e.message : "Offer not found");
                    setStep("error");
                }
            }
        })();
        return () => {
            cancelled = true;
        };
        // Re-run when tradeId/offerId change or wallet connects for resume
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tradeIdParam, offerId, wallet.connected, isAuthenticated]);
    // Poll trade while waiting for fund / release
    useEffect(() => {
        if (!trade?.id)
            return;
        if (step !== "awaiting_fund" &&
            step !== "awaiting_release" &&
            step !== "payment") {
            return;
        }
        const tick = async () => {
            try {
                await ensureAuth();
                const t = await fetchTrade(trade.id);
                setTrade(t);
                if (t.status === "funded" && step === "awaiting_fund") {
                    setStep("payment");
                }
                if (t.status === "released") {
                    setStep("success");
                }
                if (t.status === "refunded") {
                    setError("Trade was refunded");
                    setStep("error");
                }
            }
            catch {
                /* ignore transient poll errors */
            }
        };
        tick();
        const id = setInterval(tick, 4000);
        return () => clearInterval(id);
    }, [trade?.id, step, ensureAuth]);
    // After on-chain fund confirms, notify API
    useEffect(() => {
        if (!fundConfirmed || !fundTxHash || !trade)
            return;
        if (trade.status !== "open")
            return;
        (async () => {
            try {
                await ensureAuth();
                const updated = await markTradeFunded(trade.id, fundTxHash);
                setTrade(updated);
                setStep("payment");
            }
            catch (e) {
                setError(e instanceof Error ? e.message : "Failed to mark funded");
            }
            finally {
                setBusy(false);
            }
        })();
    }, [fundConfirmed, fundTxHash, trade, ensureAuth]);
    const total = useMemo(() => {
        if (!offer && !trade)
            return 0;
        const amt = amount || Number(trade?.amountEth || offer?.amount || 0);
        const price = trade?.pricePerEth ?? offer?.pricePerEth ?? 0;
        return calculateTotal(amt, price);
    }, [amount, offer, trade]);
    const isSeller = !!wallet.address &&
        !!trade &&
        wallet.address.toLowerCase() === trade.seller.toLowerCase();
    const isBuyer = !!wallet.address &&
        !!trade &&
        wallet.address.toLowerCase() === trade.buyer.toLowerCase();
    const startTrade = async () => {
        if (!wallet.connected || !wallet.address) {
            await connect();
            return;
        }
        if (!offer)
            return;
        setBusy(true);
        setError(null);
        try {
            await ensureAuth();
            const t = await createTrade({
                offerId: offer.id,
                amountEth: amount || offer.amount,
            });
            setTrade(t);
            setStep("awaiting_fund");
            router.replace(`/trade/?tradeId=${encodeURIComponent(t.id)}`);
        }
        catch (e) {
            setError(e instanceof Error ? e.message : "Failed to open trade");
        }
        finally {
            setBusy(false);
        }
    };
    const fundEscrow = useCallback(async () => {
        if (!trade)
            return;
        if (!isEscrowConfigured()) {
            setBusy(true);
            try {
                await ensureAuth();
                const fake = "0x" +
                    Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
                const updated = await markTradeFunded(trade.id, fake);
                setTrade(updated);
                setStep("payment");
            }
            catch (e) {
                setError(e instanceof Error ? e.message : "Failed to mark funded");
            }
            finally {
                setBusy(false);
            }
            return;
        }
        setBusy(true);
        setError(null);
        try {
            await ensureAuth();
            const deadline = trade.deadline
                ? BigInt(Math.floor(new Date(trade.deadline).getTime() / 1000))
                : BigInt(Math.floor(Date.now() / 1000) + 1800);
            await writeContractAsync({
                address: ESCROW_ADDRESS,
                abi: p2pEscrowAbi,
                functionName: "createTrade",
                args: [
                    trade.onChainTradeId,
                    trade.buyer,
                    deadline,
                ],
                value: parseEther(trade.amountEth),
            });
        }
        catch (e) {
            setError(e instanceof Error ? e.message : "Escrow funding failed");
            setBusy(false);
        }
    }, [trade, writeContractAsync, ensureAuth]);
    const confirmPaid = async () => {
        if (!trade)
            return;
        setBusy(true);
        setError(null);
        try {
            await ensureAuth();
            const updated = await markTradePaid(trade.id);
            setTrade(updated);
            setStep("awaiting_release");
        }
        catch (e) {
            setError(e instanceof Error ? e.message : "Failed to mark paid");
        }
        finally {
            setBusy(false);
        }
    };
    const copyToClipboard = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
        }
        catch {
            /* ignore */
        }
    };
    const copyTradeLink = async () => {
        if (!tradeLink)
            return;
        await copyToClipboard(tradeLink);
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 2000);
    };
    if (step === "loading") {
        return (<div className="min-h-screen">
        <Navigation />
        <div className="flex justify-center py-20 text-slate-400 gap-2">
          <Loader className="w-5 h-5 animate-spin"/>
          {tradeIdParam ? "Loading trade…" : "Loading offer…"}
        </div>
      </div>);
    }
    if (step === "error" && !offer && !trade) {
        return (<div className="min-h-screen">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Trade unavailable</h1>
          <p className="text-slate-400 mb-6">{error || "Not found"}</p>
          {tradeIdParam && !wallet.connected ? (<Button onClick={() => connect()} className="mb-3">
              Connect Wallet
            </Button>) : null}
          <div>
            <Button variant="outline" onClick={() => router.push("/exchange/")}>
              Back to Exchange
            </Button>
          </div>
        </div>
      </div>);
    }
    const sellerLabel = offer?.seller || trade?.seller || "";
    return (<div className="min-h-screen">
      <Navigation />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8 flex-wrap">
          <Button variant="ghost" size="sm" onClick={() => router.push("/exchange/")} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4"/>
            Back to Exchange
          </Button>
          <h1 className="text-2xl font-bold">
            {trade
            ? `Trade with ${truncateAddress(sellerLabel)}`
            : `Buy ANX from ${truncateAddress(sellerLabel)}`}
          </h1>
          {trade ? (<Button variant="outline" size="sm" onClick={copyTradeLink} className="ml-auto flex items-center gap-2">
              <Copy className="w-4 h-4"/>
              {linkCopied ? "Copied!" : "Copy trade link"}
            </Button>) : null}
        </div>

        {error && (<Card className="mb-6 bg-red-500/10 border-red-500/30">
            <CardContent className="p-4 text-red-300 text-sm">{error}</CardContent>
          </Card>)}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {step === "amount" && offer && (<Card>
                <CardHeader>
                  <CardTitle>Select Amount</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Amount of ANX to buy
                    </label>
                    <Input type="number" value={amount || offer.amount} onChange={(e) => setAmount(Number(e.target.value))} max={offer.amount} min={0.0001} step="any" className="text-lg"/>
                    <p className="text-sm text-slate-400 mt-1">
                      Available: {offer.amountEth} ANX
                    </p>
                  </div>

                  <div className="bg-space-700/30 p-4 rounded-lg space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>
                        {formatCurrency((amount || offer.amount) * offer.pricePerEth)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm text-slate-400">
                      <span>Network fee (1%):</span>
                      <span>
                        {formatCurrency((amount || offer.amount) * offer.pricePerEth * 0.01)}
                      </span>
                    </div>
                    <hr className="border-slate-600"/>
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total fiat:</span>
                      <span className="text-emerald-400">
                        {formatCurrency(total)}
                      </span>
                    </div>
                  </div>

                  <Button className="w-full" onClick={startTrade} disabled={busy || !(amount || offer.amount)} loading={busy}>
                    {wallet.connected ? "Open Trade" : "Connect Wallet"}
                  </Button>
                </CardContent>
              </Card>)}

            {step === "awaiting_fund" && trade && (<Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-amber-400"/>
                    Escrow funding
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-slate-300 text-sm">
                    Seller must lock <strong>{trade.amountEth} ANX</strong> in
                    the escrow contract before fiat payment.
                  </p>
                  <p className="text-xs text-slate-500 font-mono break-all">
                    Trade ID: {trade.id}
                    <br />
                    On-chain ID: {trade.onChainTradeId}
                  </p>
                  {tradeLink ? (<p className="text-xs text-slate-400">
                      Share this link with the other party so they can resume:{" "}
                      <button type="button" onClick={copyTradeLink} className="text-amber-300 underline">
                        copy link
                      </button>
                    </p>) : null}

                  {isSeller ? (<Button className="w-full" onClick={fundEscrow} disabled={busy} loading={busy}>
                      {isEscrowConfigured()
                    ? "Fund Escrow (createTrade)"
                    : "Mark Funded (demo — no contract address)"}
                    </Button>) : (<div className="flex items-center gap-2 text-slate-400 text-sm">
                      <Loader className="w-4 h-4 animate-spin"/>
                      Waiting for seller to fund escrow…
                    </div>)}
                </CardContent>
              </Card>)}

            {step === "payment" && trade && (<Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-emerald-400"/>
                    Payment Instructions
                    <Badge variant="emerald" className="ml-auto">
                      Funded
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5"/>
                      <p className="text-amber-200/80 text-sm">
                        Send fiat to the seller, then mark paid. A verifier
                        releases escrowed ANX to your wallet.
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Send {formatCurrency(total)} to:
                    </label>
                    <div className="bg-space-700/50 p-4 rounded-lg border border-slate-600 flex items-center justify-between">
                      <span className="font-mono text-lg">{trade.tag}</span>
                      <Button variant="ghost" size="sm" onClick={() => copyToClipboard(trade.tag)}>
                        <Copy className="w-4 h-4"/>
                      </Button>
                    </div>
                    <p className="text-slate-400 text-sm mt-1">
                      Payment method: {trade.method}
                    </p>
                  </div>

                  {isBuyer ? (<Button className="w-full" onClick={confirmPaid} disabled={busy} loading={busy}>
                      I&apos;ve Sent the Payment
                    </Button>) : (<p className="text-sm text-slate-400">
                      Waiting for buyer to confirm fiat payment…
                    </p>)}
                </CardContent>
              </Card>)}

            {step === "awaiting_release" && trade && (<Card>
                <CardHeader>
                  <CardTitle>Awaiting verifier</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Loader className="w-5 h-5 animate-spin text-amber-400"/>
                    Payment marked. Verifier will call release on-chain.
                  </div>
                  <p className="text-xs text-slate-500">
                    Admin:{" "}
                    <code className="text-slate-400">
                      POST /admin/trades/{trade.id}/verify
                    </code>{" "}
                    with header{" "}
                    <code className="text-slate-400">x-verifier-key</code>
                  </p>
                  {trade.releaseTxHash && (<a href={`${ETHERSCAN_TX}${trade.releaseTxHash}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm text-amber-300">
                      View release tx <ExternalLink className="w-3 h-3"/>
                    </a>)}
                </CardContent>
              </Card>)}

            {step === "success" && trade && (<Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-emerald-400">
                    <CheckCircle className="w-5 h-5"/>
                    Trade complete
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-slate-300">
                    Escrow released {trade.amountEth} ANX to the buyer.
                  </p>
                  {trade.releaseTxHash &&
                !trade.releaseTxHash.startsWith("0xmock") && (<a href={`${ETHERSCAN_TX}${trade.releaseTxHash}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm text-amber-300">
                        View on Etherscan <ExternalLink className="w-3 h-3"/>
                      </a>)}
                  <Button onClick={() => router.push("/exchange/")}>
                    Back to Exchange
                  </Button>
                </CardContent>
              </Card>)}

            {step === "error" && trade && (<Card>
                <CardHeader>
                  <CardTitle>Trade closed</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-slate-400">{error || "This trade ended."}</p>
                  <Button onClick={() => router.push("/exchange/")}>
                    Back to Exchange
                  </Button>
                </CardContent>
              </Card>)}
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Trade summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Seller</span>
                  <span>{truncateAddress(sellerLabel)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Price</span>
                  <span>
                    {formatCurrency(trade?.pricePerEth ?? offer?.pricePerEth ?? 0)}{" "}
                    / ANX
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Method</span>
                  <span>{trade?.method || offer?.method}</span>
                </div>
                {trade && (<div className="flex justify-between">
                    <span className="text-slate-400">Status</span>
                    <Badge variant="outline">{trade.status}</Badge>
                  </div>)}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>);
}
