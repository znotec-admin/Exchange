import { Inter, Syne } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";
const inter = Inter({
    subsets: ["latin"],
    display: 'swap',
    variable: '--font-inter',
    weight: ['300', '400', '500', '600', '700', '800', '900']
});
const brand = Syne({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-brand",
    weight: ["500", "600", "700", "800"],
});
export const metadata = {
    title: "AlphaNex Exchange — Decentralized P2P Trading",
    description: "Trade peer-to-peer with trustless smart contract escrow and Verification Network. No middleman.",
    keywords: "AlphaNex, cryptocurrency, P2P exchange, DeFi, decentralized verification, trustless, decentralized trading",
    authors: [{ name: "AlphaNex Team" }],
    openGraph: {
        title: "AlphaNex Exchange — Decentralized P2P Trading",
        description: "Trade peer-to-peer with trustless smart contract escrow and Verification Network.",
        type: "website",
        url: "https://alphanex.exchange"
    },
    twitter: {
        card: "summary_large_image",
        title: "AlphaNex Exchange — Decentralized P2P Trading",
        description: "Trade peer-to-peer with trustless smart contract escrow and Verification Network."
    }
};
export const viewport = {
    width: "device-width",
    initialScale: 1,
    themeColor: "#0d0a07",
};
export default function RootLayout({ children, }) {
    return (<html lang="en" className={`${inter.variable} ${brand.variable} dark`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
      </head>
      <body className={`${inter.className} min-h-screen bg-space-900 text-slate-50 antialiased overflow-x-hidden`}>
        <Providers>
          <div className="legendary-bg min-h-screen relative">
            {children}
          </div>
        </Providers>
      </body>
    </html>);
}
