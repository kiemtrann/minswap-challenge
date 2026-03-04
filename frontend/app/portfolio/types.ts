export interface CoinPortfolio {
  coin_type: string
  symbol: string
  decimals: number
  icon_url: string
  amount: number
  usd_value: number
  price: number
  pnl_today: number
  price_change_1d: number
  price_change_7d: number
  price_change_30d: number
}

export interface PortfolioResponse {
  coins: CoinPortfolio[]
  total_usd: number
}
