import type { PortfolioResponse } from "./types"

export async function fetchPortfolio(address: string, signal?: AbortSignal): Promise<PortfolioResponse> {
  const res = await fetch(`/api/portfolio/coins?address=${encodeURIComponent(address)}`, {
    signal,
    cache: "no-store",
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({})) as { message?: string };
    throw new Error(body?.message ?? `Request failed: HTTP ${res.status}`)
  }

  return res.json() as Promise<PortfolioResponse>
}
