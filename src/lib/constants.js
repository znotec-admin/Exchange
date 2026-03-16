export const MOCK_STATS = {
  totalTrades: 26847,
  totalVolume: 5300000,
  totalSellers: 2405,
};

export const PAYMENT_METHODS = ['Revolut', 'Wise', 'PayPal'];

/** EVM address explorers keyed by chain id */
export const EVM_EXPLORER_ADDR = {
  1: 'https://etherscan.io/address/',
  8453: 'https://basescan.org/address/',
  42161: 'https://arbiscan.io/address/',
  10: 'https://optimistic.etherscan.io/address/',
  137: 'https://polygonscan.com/address/',
  11155111: 'https://sepolia.etherscan.io/address/',
};

export function getEvmAddressExplorer(chainId, address) {
  const base = (chainId && EVM_EXPLORER_ADDR[chainId]) || EVM_EXPLORER_ADDR[1];
  return `${base}${address}`;
}

export const INITIAL_WALLET_STATE = {
  connected: false,
  address: '',
  balance: '0',
  balanceNanoErgs: '0',
  symbol: 'ANX',
};
