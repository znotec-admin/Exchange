# AlphaNex Exchange

**Trade peer to peer. Trustless.**

A decentralized P2P exchange with cryptographic payment verification. No middleman. Just math.

## 🚀 Features

- **Trustless Trading**: Smart contract escrow ensures secure P2P ANX trades
- **Real Wallet Integration**: Connect your Nautilus wallet and see your real ANX balance
- **Decentralized Verification**: Independent verifiers cryptographically confirm fiat payments
- **Multiple Payment Methods**: Support for Revolut, Wise, and PayPal
- **Zero KYC**: No registration, no personal data, just connect and trade
- **Mobile Responsive**: Beautiful design that works perfectly on all devices

## 🛠 Tech Stack

- **Tailwind CSS** for stunning responsive design
- **Framer Motion** for smooth animations (if is compatible with svelte)
- **shadcn/ui** components
- **Nautilus Wallet Integration** via EIP-12 dApp connector
- **Static Export** for IPFS deployment

## 🎨 Design Philosophy

TODO: Remember, the brand theme is western. Check the logs, there is the color.
P.D: But i love the navy blue too ...

**LEGENDARY** - Every pixel crafted to perfection:
- Deep space navy backgrounds with subtle noise textures
- Electric blue accents for CTAs and active states
- Warm amber highlights honoring Ergo's heritage
- Smooth animations and micro-interactions
- Professional typography with perfect spacing

## 💼 How It Works

### For Buyers (Dead Simple):
1. **Connect Wallet** → Link your Nautilus wallet
2. **Pick Offer** → Browse verified sellers in the order book
3. **Send Payment** → Pay seller via Revolut/Wise/PayPal
4. **Get ANX** → Verification network confirms payment, ANX sent to your wallet

### For Sellers:
1. **List ANX** → Set amount, price, and payment method
2. **Lock in Escrow** → Smart contract secures your ANX
3. **Receive Orders** → Buyers send fiat directly to you
4. **Auto Release** → Verification confirms payment, ANX released automatically

## 🔐 Security

- **Smart Contract Escrow**: ANX locked until payment cryptographically verified
- **Distributed Verification**: 5 independent verifiers, 3/5 consensus required
- **Privacy Preserved**: Verifiers see transaction confirmation only, not account details
- **No Single Point of Failure**: Fully decentralized, unstoppable protocol

## 🚀 Getting Started

### Prerequisites

- **Node.js 18+**
- **Nautilus Wallet** for real wallet integration (optional for development)

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

### Wallet + SIWE auth

The app uses EVM wallets (MetaMask, Rabby, etc. via wagmi) and **SIWE** sessions for API auth:

- **Connect**: Pick a browser wallet, then sign the login message
- **Session**: API calls use `Authorization: Bearer <session token>` (not a spoofable address)
- **Trades**: Open from Exchange; resume via `/trade/?tradeId=…`
- See [docs/local-dev.md](docs/local-dev.md) for fund checks and verifier steps

## 📁 Project Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── page.jsx        # Landing page with animated hero
│   ├── exchange/       # Order book and trading interface
│   ├── sell/           # Create sell offers
│   ├── trade/[id]/     # Multi-step trading flow
│   └── how-it-works/   # Protocol explanation
├── components/
│   ├── ui/             # shadcn/ui components
│   └── navigation.jsx  # Navigation with wallet integration
└── lib/
    ├── wallet.js       # Wallet helpers
    ├── constants.js    # Mock data and configuration
    └── utils.js        # Utility functions
```

## 🎭 Mock Data vs Real Integration

**Current Status**: Demo MVP with SIWE auth, JSON order book, optional Sepolia escrow

- ✅ **Real**: EVM wallet + SIWE sessions, offer/trade API, trade resume links
- ✅ **Real** (when configured): on-chain escrow fund checks + verifier release
- 🔄 **Mock / manual**: fiat payment verification (buyer self-attests; admin verifies)
- 🔄 **Label**: UI says ANX; escrow/balance are native ETH on the configured chain

## 🌐 Deployment

### Static Export (IPFS Ready)

```bash
npm run build  # Creates out/ directory
```

The built site is a completely static export, perfect for:
- **IPFS hosting**
- **GitHub Pages**
- **Netlify/Vercel**
- **Any static hosting**

### Environment

No environment variables needed - everything is client-side!

## 🎨 Design System

### Colors
- **Primary brand**: Violet (`#7342DC`) for CTAs, accents, and focus states
- **Background**: Deep space (`#0d0a07`) with noise texture
- **Success**: Emerald green (`#22c55e`) for confirmations
- **Text**: Warm whites and muted slates

### Typography
- **Primary**: Inter for clean, modern readability
- **Mono**: JetBrains Mono for addresses and amounts
- **Hierarchy**: Bold headlines, medium weights, tight letter-spacing

### Animations
- **Micro-interactions**: Hover effects, button transforms
- **Page transitions**: Smooth fade-ins and slide animations
- **Verification flow**: Dramatic node-by-node confirmation sequence

## 🤝 Contributing

We welcome contributions! Please:

1. **Fork** the repository
2. **Create** a feature branch
3. **Build** something amazing
4. **Test** thoroughly
5. **Submit** a pull request

### Code Style
- **JavaScript** (Next.js `.js` / `.jsx`)
- **Tailwind CSS** for styling
- **ESLint/Prettier** for formatting
- **Semantic** component names

## 🙏 Acknowledgments

- **shadcn/ui** for beautiful component primitives
- **Framer Motion** for buttery smooth animations
- **wagmi / viem** for EVM wallet connectivity

---

**Built by the AlphaNex team**

*Unstoppable. Decentralized. Yours.*
