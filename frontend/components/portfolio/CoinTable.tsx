"use client"

import * as Tooltip from "@radix-ui/react-tooltip"
import * as React from "react"
import type { CoinPortfolio } from "app/portfolio/types"
import { PriceChange } from "./PriceChange"

interface CoinTableProps {
  coins: CoinPortfolio[]
}

export function CoinTable({ coins }: CoinTableProps) {
  return (
    <Tooltip.Provider delayDuration={200}>
      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full min-w-[700px] border-collapse">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              {["#", "Asset", "Amount", "Price", "Value (USD)", "1D", "7D", "30D", "P&L Today"].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3.5 text-left text-xs font-medium tracking-widest text-slate-500 uppercase first:w-10"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {coins.map((coin, idx) => (
              <CoinRow key={coin.coin_type} coin={coin} rank={idx + 1} />
            ))}
          </tbody>
        </table>
      </div>
    </Tooltip.Provider>
  )
}

function CoinRow({ coin, rank }: { coin: CoinPortfolio; rank: number }) {
  const pnlPositive = coin.pnl_today >= 0

  return (
    <tr className="group border-b border-white/5 transition-colors hover:bg-white/4 last:border-none">
      {/* Rank */}
      <td className="px-4 py-4 text-sm text-slate-600">{rank}</td>

      {/* Asset name + icon */}
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          <CoinIcon url={coin.icon_url} symbol={coin.symbol} />
          <div>
            <p className="text-sm font-semibold text-white">{coin.symbol}</p>
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <p className="max-w-[120px] cursor-default truncate font-mono text-xs text-slate-600">
                  {shortType(coin.coin_type)}
                </p>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  className="max-w-xs break-all rounded-lg border border-white/10 bg-slate-900 px-3 py-2 font-mono text-xs text-slate-300 shadow-xl"
                  sideOffset={6}
                >
                  {coin.coin_type}
                  <Tooltip.Arrow className="fill-slate-900" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </div>
        </div>
      </td>

      {/* Amount */}
      <td className="px-4 py-4 text-sm tabular-nums text-slate-300">
        {formatAmount(coin.amount)} <span className="text-slate-600">{coin.symbol}</span>
      </td>

      {/* Price */}
      <td className="px-4 py-4 text-sm tabular-nums text-slate-300">{formatUsd(coin.price)}</td>

      {/* USD Value */}
      <td className="px-4 py-4 text-sm font-semibold tabular-nums text-white">{formatUsd(coin.usd_value)}</td>

      {/* Price changes */}
      <td className="px-4 py-4"><PriceChange value={coin.price_change_1d} /></td>
      <td className="px-4 py-4"><PriceChange value={coin.price_change_7d} /></td>
      <td className="px-4 py-4"><PriceChange value={coin.price_change_30d} /></td>

      {/* P&L today */}
      <td className="px-4 py-4">
        <span className={`text-sm font-medium tabular-nums ${pnlPositive ? "text-emerald-400" : "text-rose-400"}`}>
          {pnlPositive ? "+" : ""}
          {formatUsd(coin.pnl_today)}
        </span>
      </td>
    </tr>
  )
}

function CoinIcon({ url, symbol }: { url: string; symbol: string }) {
  const [errored, setErrored] = React.useState(false)

  if (!url || errored) {
    return (
      <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-slate-700 text-xs font-bold text-white">
        {symbol.slice(0, 2).toUpperCase()}
      </div>
    )
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={url}
      alt={symbol}
      width={36}
      height={36}
      referrerPolicy="no-referrer"
      onError={() => setErrored(true)}
      className="size-9 shrink-0 rounded-full bg-slate-800 object-cover"
    />
  )
}

function shortType(coinType: string) {
  const parts = coinType.split("::")
  if (parts.length >= 3) return `${parts[0]?.slice(0, 6)}…::${parts[2]}`
  return coinType
}

function formatUsd(v: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 4 }).format(v)
}

function formatAmount(v: number) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 6 }).format(v)
}
