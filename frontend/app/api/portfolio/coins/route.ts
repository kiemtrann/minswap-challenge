import { type NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:3001"

export async function GET(req: NextRequest) {
  const address = req.nextUrl.searchParams.get("address")

  if (!address) {
    return NextResponse.json(
      { message: "Query parameter 'address' is required" },
      { status: 400 },
    )
  }

  const url = `${BACKEND_URL}/api/v1/portfolio/coins?address=${encodeURIComponent(address)}`

  const res = await fetch(url, { cache: "no-store" })
  const data = await res.json()

  return NextResponse.json(data, { status: res.status })
}
