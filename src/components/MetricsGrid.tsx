"use client"

interface Metric {
  value: string
  label: string
}

interface MetricsGridProps {
  metrics: Metric[]
  columns?: number
}

export default function MetricsGrid({ metrics, columns = 4 }: MetricsGridProps) {
  return (
    <div
      className="grid gap-6"
      style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
    >
      {metrics.map((m, i) => (
        <div key={i} className="flex flex-col items-center text-center">
          <span className="text-3xl font-bold text-[#c9a35c] md:text-4xl">{m.value}</span>
          <span className="mt-1 text-sm text-[#e8e2d6]/60">{m.label}</span>
        </div>
      ))}
    </div>
  )
}
