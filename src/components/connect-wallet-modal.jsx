"use client";
import { useMemo } from "react";
import { X, Loader } from "lucide-react";
import { BrandIcon } from "@/components/ui/icon";
import { useWallet } from "@/lib/hooks/useWallet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
const WALLET_HINTS = {
    metamask: "Browser extension",
    rabby: "Browser extension",
    phantom: "Browser extension",
    "coinbase wallet": "Extension or smart wallet",
    walletconnect: "Mobile & desktop wallets",
    injected: "Browser wallet",
};
function hintFor(connector) {
    const key = connector.name.toLowerCase();
    for (const [name, hint] of Object.entries(WALLET_HINTS)) {
        if (key.includes(name))
            return hint;
    }
    if (connector.type === "walletConnect")
        return "QR / mobile wallets";
    if (connector.type === "injected")
        return "Browser extension";
    return "EVM wallet";
}
function WalletIcon({ connector }) {
    if (connector.icon) {
        return (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={connector.icon} alt="" className="w-8 h-8 rounded-lg object-contain bg-space-900/60"/>);
    }
    return (<div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center">
      <BrandIcon name="wallet" size="sm"/>
    </div>);
}
export function ConnectWalletModal() {
    const { isModalOpen, closeModal, connectors, connectWith, pendingConnectorId, error, } = useWallet();
    const listed = useMemo(() => {
        // Prefer EIP-6963 named wallets; keep a single generic Injected fallback.
        const named = connectors.filter((c) => c.type !== "injected" || c.name.toLowerCase() !== "injected");
        const generic = connectors.filter((c) => c.type === "injected" && c.name.toLowerCase() === "injected");
        const seen = new Set();
        const unique = [];
        for (const c of [...named, ...generic]) {
            const key = `${c.type}:${c.name}`;
            if (seen.has(key))
                continue;
            seen.add(key);
            unique.push(c);
        }
        return unique;
    }, [connectors]);
    if (!isModalOpen)
        return null;
    return (<div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-space-900/80 backdrop-blur-sm" onClick={closeModal}/>
      <div role="dialog" aria-modal="true" aria-labelledby="connect-wallet-title" className="relative w-full max-w-md rounded-2xl border border-slate-700/50 bg-space-800/95 shadow-2xl">
        <div className="flex items-start justify-between gap-4 p-5 border-b border-slate-700/40">
          <div>
            <h2 id="connect-wallet-title" className="text-lg font-bold text-slate-50 tracking-tight">
              Connect Wallet
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              MetaMask, Rabby, Phantom, Coinbase, WalletConnect, and other EVM
              wallets.
            </p>
          </div>
          <button type="button" onClick={closeModal} className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-space-700/60 transition-colors" aria-label="Close">
            <X className="w-4 h-4"/>
          </button>
        </div>

        <div className="p-4 space-y-2 max-h-[60vh] overflow-y-auto">
          {listed.length === 0 ? (<div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-200">
              No EVM wallet detected. Install MetaMask, Rabby, or Phantom, then
              refresh this page.
            </div>) : (listed.map((connector) => {
            const busy = pendingConnectorId === connector.uid;
            return (<button key={connector.uid} type="button" disabled={Boolean(pendingConnectorId)} onClick={() => connectWith(connector)} className={cn("w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all text-left", "border-slate-700/40 bg-space-900/40 hover:border-amber-500/40 hover:bg-amber-500/5", "disabled:opacity-60 disabled:cursor-not-allowed")}>
                  <WalletIcon connector={connector}/>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-slate-100 truncate">
                      {connector.name}
                    </div>
                    <div className="text-xs text-slate-400">
                      {hintFor(connector)}
                    </div>
                  </div>
                  {busy ? (<Loader className="w-4 h-4 animate-spin text-amber-300"/>) : null}
                </button>);
        }))}
        </div>

        {error ? (<div className="px-4 pb-2">
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
              {error}
            </div>
          </div>) : null}

        <div className="p-4 pt-2 border-t border-slate-700/40 space-y-3">
          <p className="text-xs text-slate-500 leading-relaxed">
            Install a browser extension wallet, then refresh. Installed EVM
            wallets (MetaMask, Rabby, Phantom, Coinbase, and others) appear
            automatically via EIP-6963.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="text-xs" onClick={() => window.open("https://metamask.io/download/", "_blank")}>
              Get MetaMask <BrandIcon name="external" size="xs" className="ml-1"/>
            </Button>
            <Button variant="outline" size="sm" className="text-xs" onClick={() => window.open("https://rabby.io/", "_blank")}>
              Get Rabby <BrandIcon name="external" size="xs" className="ml-1"/>
            </Button>
            <Button variant="outline" size="sm" className="text-xs" onClick={() => window.open("https://phantom.app/", "_blank")}>
              Get Phantom <BrandIcon name="external" size="xs" className="ml-1"/>
            </Button>
          </div>
        </div>
      </div>
    </div>);
}
