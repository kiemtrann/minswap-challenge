import type { PortfolioResponse } from "./types"

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"

export async function fetchPortfolio(address: string, signal?: AbortSignal): Promise<PortfolioResponse> {
  const res = await fetch(`${API_BASE}/api/v1/portfolio/coins?address=${encodeURIComponent(address)}`, {
    signal,
    cache: "no-store",
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({})) as any;
    throw new Error(body?.message ?? `Request failed: HTTP ${res.status}`)
  }

  return res.json() as Promise<PortfolioResponse>
}
