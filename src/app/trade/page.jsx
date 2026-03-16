"use client";
import { Suspense } from "react";
import TradePageClient from "@/components/trade-page-client";
import { Loader } from "lucide-react";
export default function TradePage() {
    return (<Suspense fallback={<div className="min-h-screen flex items-center justify-center text-slate-400 gap-2">
          <Loader className="w-5 h-5 animate-spin"/>
          Loading trade…
        </div>}>
      <TradePageClient />
    </Suspense>);
}
