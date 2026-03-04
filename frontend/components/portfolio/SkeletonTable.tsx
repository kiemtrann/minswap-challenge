export function SkeletonRow() {
  return (
    <tr className="border-b border-white/5">
      {[1, 2, 3, 4, 5, 6, 7].map((i) => (
        <td key={i} className="px-4 py-4">
          <div className="h-4 animate-pulse rounded-md bg-white/8" style={{ width: i === 1 ? "140px" : "80px" }} />
        </td>
      ))}
    </tr>
  )
}

export function SkeletonTable({ rows = 4 }: { rows?: number }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/10 bg-white/5">
            {["Asset", "Amount", "Price", "Value", "1D", "7D", "30D"].map((h) => (
              <th key={h} className="px-4 py-3 text-left text-xs font-medium tracking-widest text-slate-500 uppercase">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <SkeletonRow key={i} />
          ))}
        </tbody>
      </table>
    </div>
  )
}
