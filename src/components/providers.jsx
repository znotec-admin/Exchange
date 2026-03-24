"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { useState } from "react";
import { wagmiConfig } from "@/lib/wagmi";
import { WalletProvider } from "@/lib/hooks/useWallet";
export function Providers({ children }) {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 30_000,
                refetchOnWindowFocus: false,
            },
        },
    }));
    return (<WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <WalletProvider>{children}</WalletProvider>
      </QueryClientProvider>
    </WagmiProvider>);
}
