import { PortfolioView } from "components/portfolio/PortfolioView"

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -top-64 left-1/2 -translate-x-1/2 size-[700px] rounded-full bg-sky-600/10 blur-[120px]" />
        <div className="absolute top-1/3 -right-48 size-[500px] rounded-full bg-violet-600/8 blur-[100px]" />
      </div>

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-xs font-medium text-sky-400">
            <span className="size-1.5 animate-pulse rounded-full bg-sky-400" />
            Sui Mainnet · Live
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Wallet Portfolio
          </h1>
          <p className="mt-3 text-base text-slate-500">
            Enter any Sui wallet address to view its coin balances, USD values, and price performance.
          </p>
        </div>

        <PortfolioView />
      </div>
    </main>
  )
}
