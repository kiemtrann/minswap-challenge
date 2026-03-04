"use client"

import * as React from "react"
import * as Form from "@radix-ui/react-form"
import { twMerge } from "tailwind-merge"

interface AddressInputProps {
  onSearch: (address: string) => void
  loading: boolean
}

export function AddressInput({ onSearch, loading }: AddressInputProps) {
  const [value, setValue] = React.useState("")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = value.trim()
    if (trimmed) onSearch(trimmed)
  }

  return (
    <Form.Root onSubmit={handleSubmit} className="w-full">
      <Form.Field name="address" className="flex flex-col gap-1.5">
        <Form.Label className="text-xs font-medium tracking-widest text-slate-400 uppercase">
          Sui Wallet Address
        </Form.Label>

        <div className="flex gap-3">
          <Form.Control asChild>
            <input
              id="wallet-address"
              type="text"
              required
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="0x200e6f6d..."
              spellCheck={false}
              className={twMerge(
                "flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3",
                "font-mono text-sm text-white placeholder:text-slate-600",
                "outline-none transition-all duration-200",
                "focus:border-sky-500/60 focus:bg-white/8 focus:ring-2 focus:ring-sky-500/20",
              )}
            />
          </Form.Control>

          <Form.Submit asChild>
            <button
              id="lookup-btn"
              disabled={loading || !value.trim()}
              className={twMerge(
                "flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-200",
                "bg-sky-500 text-white hover:bg-sky-400 active:scale-95",
                "disabled:cursor-not-allowed disabled:opacity-40",
              )}
            >
              {loading ? (
                <>
                  <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Loading…
                </>
              ) : (
                "Look up"
              )}
            </button>
          </Form.Submit>
        </div>

        <Form.Message match="valueMissing" className="text-xs text-red-400">
          Please enter a wallet address.
        </Form.Message>
      </Form.Field>
    </Form.Root>
  )
}
