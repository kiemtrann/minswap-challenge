import type { PortfolioResponse } from "app/portfolio/types"

interface PortfolioSummaryProps {
  data: PortfolioResponse
  address: string
}

export function PortfolioSummary({ data, address }: PortfolioSummaryProps) {
  const totalPnl = data.coins.reduce((sum, c) => sum + c.pnl_today, 0)
  const pnlPositive = totalPnl >= 0

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="mb-1 text-xs font-medium tracking-widest text-slate-500 uppercase">Portfolio Value</p>
          <p className="text-4xl font-bold tracking-tight text-white">
            {formatUsd(data.total_usd)}
          </p>
          <p className="mt-2 flex items-center gap-1.5 font-mono text-xs text-slate-500">
            <WalletIcon />
            <span className="truncate max-w-[260px] sm:max-w-none">{address}</span>
          </p>
        </div>

        <div className="flex flex-col items-start sm:items-end">
          <p className="mb-1 text-xs font-medium tracking-widest text-slate-500 uppercase">P&L Today</p>
          <p
            className={`text-2xl font-semibold ${pnlPositive ? "text-emerald-400" : "text-rose-400"}`}
          >
            {pnlPositive ? "+" : ""}
            {formatUsd(totalPnl)}
          </p>
          <p className="mt-1 text-xs text-slate-500">{data.coins.length} assets tracked</p>
        </div>
      </div>
    </div>
  )
}

function WalletIcon() {
  return (
    <svg className="size-3.5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
      <path d="M2 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v1H2V4Z" />
      <path
        fillRule="evenodd"
        d="M2 7h16v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7Zm11 3a1 1 0 1 0 0 2h2a1 1 0 1 0 0-2h-2Z"
        clipRule="evenodd"
      />
    </svg>
  )
}

function formatUsd(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(value)
}
