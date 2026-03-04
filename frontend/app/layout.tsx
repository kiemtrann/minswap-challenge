import type { Metadata } from "next"
import "styles/tailwind.css"

export const metadata: Metadata = {
  title: "Portfolio",
  description: "View your Sui wallet coin balances, USD values, and price changes in one place.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#090e1a] font-sans text-white antialiased">{children}</body>
    </html>
  )
}
