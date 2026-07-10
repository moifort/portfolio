/**
 * CryptoBot real performance numbers — the single source of truth
 * for the /crypto-bot landing page and the home teaser card.
 *
 * To refresh: open the CryptoBot iOS app (HeroProfitCard, "Tout" period),
 * update the values below, then rebuild + deploy.
 */
export const cryptoBot = {
  invested: 1367, // USD deployed
  netProfit: 44.65, // USD, gross - fees
  netPercent: 3.27, // % net return since launch
  grossProfit: 55.35, // USD
  fees: 10.69, // USD
  alphaVsHold: 18.6, // percentage points vs buy-and-hold BTC
  holdPercent: -15.3, // BTC buy-and-hold return over the same period, %
  trades: 17,
  since: '2026-04-28', // first real trade
  gridLevels: 10,
  pair: 'BTC/USDC',
  exchange: 'Kraken',
  cycleSeconds: 30,
  // "life" snapshot shown in the hero status strip (from the app's activity feed)
  openPositions: 4,
  lastSale: '2 days ago',
} as const

export const sinceLabel = new Date(cryptoBot.since).toLocaleDateString('en-US', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
})
