export function DonutChart({ value }: { value: string }) {
  return (
    <div className="relative flex h-40 w-full items-center justify-center">
      {/* CSS-only chart placeholder retained from Stitch until real chart data lands. */}
      <div className="absolute h-32 w-32 rounded-full border-[12px] border-success-emerald border-r-error" />
      <div className="text-center">
        <span className="block text-2xl font-bold">{value}</span>
        <span className="text-[10px] font-bold uppercase text-outline">Success</span>
      </div>
    </div>
  );
}

export function BarTrend({ values }: { values: number[] }) {
  return (
    <div className="flex h-24 w-full items-end gap-[2px]">
      {/* CSS-only chart placeholder retained from Stitch until real chart data lands. */}
      {values.map((value, index) => (
        <div
          className={`flex-1 rounded-t-sm ${index === values.length - 1 ? "bg-secondary" : "bg-secondary/20"}`}
          key={`${value}-${index}`}
          style={{ height: `${value}%` }}
        />
      ))}
    </div>
  );
}

export function DistributionBars({
  items,
}: {
  items: { label: string; value: number }[];
}) {
  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div key={item.label}>
          <div className="mb-1 flex justify-between text-[11px] font-semibold">
            <span>{item.label}</span>
            <span>{item.value}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-surface-container">
            <div className="h-full bg-secondary" style={{ width: `${item.value}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}
