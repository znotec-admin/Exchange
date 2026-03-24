import { http, createConfig } from 'wagmi';
import { mainnet, base, arbitrum, optimism, polygon, sepolia } from 'wagmi/chains';
/**
 * EVM config for MetaMask, Rabby, Phantom, Coinbase extension, Brave, etc.
 * Wagmi's multiInjectedProviderDiscovery (default true) registers each
 * EIP-6963 browser wallet as its own connector — no connector barrel import
 * (avoids pulling optional Coinbase/Base Account peer deps).
 *
 * For WalletConnect / mobile QR, set NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID and
 * we can add the walletConnect connector once peer deps are installed.
 */
export const wagmiConfig = createConfig({
    chains: [mainnet, base, arbitrum, optimism, polygon, sepolia],
    transports: {
        [mainnet.id]: http(),
        [base.id]: http(),
        [arbitrum.id]: http(),
        [optimism.id]: http(),
        [polygon.id]: http(),
        [sepolia.id]: http(),
    },
    multiInjectedProviderDiscovery: true,
});
