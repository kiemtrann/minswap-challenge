"use client"

import * as React from "react"
import { fetchPortfolio } from "app/portfolio/api"
import type { PortfolioResponse } from "app/portfolio/types"
import { AddressInput } from "components/portfolio/AddressInput"
import { CoinTable } from "components/portfolio/CoinTable"
import { PortfolioSummary } from "components/portfolio/PortfolioSummary"
import { SkeletonTable } from "components/portfolio/SkeletonTable"

type State =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: PortfolioResponse; address: string }
  | { status: "error"; message: string }

export function PortfolioView() {
  const [state, setState] = React.useState<State>({ status: "idle" })

  async function handleSearch(address: string) {
    setState({ status: "loading" })
    try {
      const data = await fetchPortfolio(address)
      setState({ status: "success", data, address })
    } catch (err) {
      setState({
        status: "error",
        message: err instanceof Error ? err.message : "Unexpected error",
      })
    }
  }

  const loading = state.status === "loading"

  return (
    <div className="flex flex-col gap-8">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
        <AddressInput onSearch={handleSearch} loading={loading} />
      </div>

      {state.status === "loading" && (
        <div className="flex flex-col gap-6">
          <div className="h-28 animate-pulse rounded-2xl border border-white/10 bg-white/5" />
          <SkeletonTable rows={5} />
        </div>
      )}

      {state.status === "error" && (
        <div className="flex items-start gap-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-5">
          <span className="mt-0.5 text-rose-400">
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
          </span>
          <div>
            <p className="text-sm font-semibold text-rose-300">Failed to load portfolio</p>
            <p className="mt-0.5 text-sm text-rose-400/80">{state.message}</p>
          </div>
        </div>
      )}

      {state.status === "success" && (
        <div className="flex flex-col gap-6">
          <PortfolioSummary data={state.data} address={state.address} />

          {state.data.coins.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center text-slate-500">
              No known coins found for this wallet.
            </div>
          ) : (
            <CoinTable coins={state.data.coins} />
          )}
        </div>
      )}
    </div>
  )
}
