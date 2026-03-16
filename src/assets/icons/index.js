/**
 * Brand SVG icons — each file required individually so webpack/Next emits a URL.
 * Usage: require('@/assets/icons')['wallet'] or import { brandIcons } from '@/assets/icons'
 */
const brandIcons = {
  wallet: require("./icon-wallet.svg"),
  chart: require("./icon-chart.svg"),
  shield: require("./icon-shield.svg"),
  lock: require("./icon-lock.svg"),
  "arrow-up": require("./icon-arrow-up.svg"),
  "arrow-down": require("./icon-arrow-down.svg"),
  check: require("./icon-check.svg"),
  copy: require("./icon-copy.svg"),
  external: require("./icon-external.svg"),
  trade: require("./icon-trade.svg"),
  nodes: require("./icon-nodes.svg"),
  fiat: require("./icon-fiat.svg"),
  escrow: require("./icon-escrow.svg"),
  clock: require("./icon-clock.svg"),
};

module.exports = { brandIcons, ...brandIcons };
