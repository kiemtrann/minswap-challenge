import { twMerge } from "tailwind-merge"

interface PriceChangeProps {
  value: number
  suffix?: string
}

export function PriceChange({ value, suffix = "%" }: PriceChangeProps) {
  const positive = value > 0
  const zero = value === 0

  return (
    <span
      className={twMerge(
        "inline-flex items-center gap-0.5 text-sm font-medium tabular-nums",
        zero && "text-slate-500",
        positive && "text-emerald-400",
        !positive && !zero && "text-rose-400",
      )}
    >
      {!zero && (
        <svg
          className={twMerge("size-3 shrink-0", positive ? "rotate-0" : "rotate-180")}
          viewBox="0 0 10 10"
          fill="currentColor"
        >
          <path d="M5 2 L9 8 L1 8 Z" />
        </svg>
      )}
      {positive ? "+" : ""}
      {value.toFixed(2)}
      {suffix}
    </span>
  )
}
