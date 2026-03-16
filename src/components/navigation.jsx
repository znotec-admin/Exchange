"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, RefreshCw, LogOut, AlertCircle, Home, HelpCircle, } from 'lucide-react';
import { BrandIcon } from '@/components/ui/icon';
import { cn, truncateAddress } from '@/lib/utils';
import { useWallet } from '@/lib/hooks/useWallet';
import { getEvmAddressExplorer } from '@/lib/constants';
import { ConnectWalletModal } from '@/components/connect-wallet-modal';
import { Logo } from '@/components/logo';
export function Navigation() {
    const pathname = usePathname();
    const { wallet, isConnecting, error, connect, disconnect, refreshBalance, isWalletAvailable, chainId, connectorName, symbol, } = useWallet();
    const [showDropdown, setShowDropdown] = useState(false);
    const [errorDismissed, setErrorDismissed] = useState(false);
    const navItems = [
        { href: '/', label: 'Home', lucide: Home },
        { href: '/exchange', label: 'Exchange', icon: 'chart' },
        { href: '/sell', label: 'Sell', icon: 'trade' },
        { href: '/how-it-works', label: 'How It Works', lucide: HelpCircle },
        { href: '/nodes', label: 'Nodes', icon: 'nodes' },
    ];
    const normalizedPath = pathname !== '/' && pathname.endsWith('/')
        ? pathname.slice(0, -1)
        : pathname;
    const isNavActive = (href) => {
        if (href === '/')
            return normalizedPath === '/';
        return (normalizedPath === href || normalizedPath.startsWith(`${href}/`));
    };
    const handleConnect = async () => {
        setErrorDismissed(false);
        await connect();
    };
    const copyAddress = async () => {
        if (wallet.address) {
            await navigator.clipboard.writeText(wallet.address);
        }
    };
    const openExplorer = () => {
        if (wallet.address) {
            window.open(getEvmAddressExplorer(chainId, wallet.address), '_blank');
        }
    };
    const balanceLabel = `${wallet.balance} ${wallet.symbol || symbol || 'ANX'}`;
    return (<>
      <nav className="border-b border-slate-700/30 bg-space-800/60 backdrop-blur-lg sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="group">
              <Logo size="md"/>
            </Link>

            <div className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => {
            const isActive = isNavActive(item.href);
            const LucideIcon = item.lucide;
            return (<Link key={item.href} href={item.href} className={cn("flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold tracking-tight transition-all duration-300", isActive
                    ? "text-amber-300 bg-amber-500/10 border border-amber-500/20 glow-frontier"
                    : "text-slate-300 hover:text-white hover:bg-space-700/50 hover:text-amber-300 border border-transparent")}>
                    {item.icon ? (<BrandIcon name={item.icon} size="sm"/>) : LucideIcon ? (<LucideIcon className="w-4 h-4"/>) : null}
                    <span>{item.label}</span>
                  </Link>);
        })}
            </div>

            <div className="flex items-center space-x-3">
              {!wallet.connected ? (<Button onClick={handleConnect} variant={isWalletAvailable ? "invite" : "default"} disabled={isConnecting} loading={isConnecting} className="flex items-center space-x-2">
                  <BrandIcon name="wallet" size="sm"/>
                  <span className="hidden sm:inline">
                    {isConnecting ? "Connecting..." : "Connect Wallet"}
                  </span>
                </Button>) : (<div className="relative">
                  <Button onClick={() => setShowDropdown(!showDropdown)} variant="emerald" className="flex items-center space-x-2 pr-3">
                    <div className="w-2 h-2 bg-emerald-300 rounded-full animate-pulse"/>
                    <div className="hidden sm:flex flex-col items-start">
                      <span className="text-xs font-medium">
                        {truncateAddress(wallet.address)}
                      </span>
                      <span className="text-xs opacity-90">
                        {balanceLabel}
                      </span>
                    </div>
                    <span className="sm:hidden font-bold">
                      {balanceLabel}
                    </span>
                    <ChevronDown className="w-4 h-4"/>
                  </Button>

                  {showDropdown && (<div className="absolute right-0 top-full mt-2 w-72 bg-space-800/95 backdrop-blur-lg border border-slate-700/50 rounded-xl shadow-2xl z-50">
                      <div className="p-4 border-b border-slate-700/50">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-sm text-slate-400">Wallet Address</div>
                          {connectorName ? (<Badge variant="outline" className="text-[10px]">
                              {connectorName}
                            </Badge>) : null}
                        </div>
                        <div className="font-mono text-xs text-slate-300 break-all">
                          {wallet.address}
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <div>
                            <div className="text-sm text-slate-400">Balance</div>
                            <div className="text-lg font-bold text-emerald-400">
                              {balanceLabel}
                            </div>
                          </div>
                          <Badge variant="verified" className="text-xs">
                            Connected
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="p-2">
                        <button onClick={copyAddress} className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-space-700/50 rounded-lg transition-all">
                          <BrandIcon name="copy" size="sm"/>
                          <span>Copy Address</span>
                        </button>
                        
                        <button onClick={openExplorer} className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-space-700/50 rounded-lg transition-all">
                          <BrandIcon name="external" size="sm"/>
                          <span>View on Explorer</span>
                        </button>
                        
                        <button onClick={refreshBalance} className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-space-700/50 rounded-lg transition-all">
                          <RefreshCw className="w-4 h-4"/>
                          <span>Refresh Balance</span>
                        </button>
                        
                        <hr className="my-2 border-slate-700/50"/>
                        
                        <button onClick={() => {
                    disconnect();
                    setShowDropdown(false);
                }} className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-red-300 hover:text-red-200 hover:bg-red-500/10 rounded-lg transition-all">
                          <LogOut className="w-4 h-4"/>
                          <span>Disconnect</span>
                        </button>
                      </div>
                    </div>)}
                </div>)}
            </div>
          </div>

          <div className="md:hidden pb-4 pt-2">
            <div className="flex items-center justify-around">
              {navItems.map((item) => {
            const isActive = isNavActive(item.href);
            const LucideIcon = item.lucide;
            return (<Link key={item.href} href={item.href} className={cn("flex flex-col items-center space-y-1 p-2 rounded-lg text-xs font-medium transition-all", isActive
                    ? "text-amber-300 bg-amber-500/10 border border-amber-500/20"
                    : "text-slate-400 hover:text-amber-300 border border-transparent")}>
                    {item.icon ? (<BrandIcon name={item.icon} size="sm"/>) : LucideIcon ? (<LucideIcon className="w-4 h-4"/>) : null}
                    <span>{item.label}</span>
                  </Link>);
        })}
            </div>
          </div>
        </div>
      </nav>

      <ConnectWalletModal />

      {error && !errorDismissed && !wallet.connected ? (<div className="fixed top-20 right-4 bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-xl shadow-lg backdrop-blur-sm z-50 max-w-sm">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5"/>
            <div>
              <p className="text-sm font-medium">{error}</p>
            </div>
            <button onClick={() => setErrorDismissed(true)} className="text-red-400 hover:text-red-300 text-xs">
              ×
            </button>
          </div>
        </div>) : null}

      {showDropdown && (<div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)}/>)}
    </>);
}
