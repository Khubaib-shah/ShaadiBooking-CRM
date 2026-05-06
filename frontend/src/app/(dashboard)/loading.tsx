export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      {/* Stats skeleton */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-[140px] rounded-xl skeleton"
          />
        ))}
      </div>
      {/* Chart skeleton */}
      <div className="h-[300px] rounded-xl skeleton" />
      {/* List skeleton */}
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-[72px] rounded-lg skeleton" />
        ))}
      </div>
    </div>
  )
}
