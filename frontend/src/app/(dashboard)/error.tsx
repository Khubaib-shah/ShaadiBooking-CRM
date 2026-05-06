'use client'

export default function DashboardError({ reset }: { reset: () => void }) {
  return (
    <div className="rounded-xl border border-[#f8d7da] bg-white p-8 text-center">
      <p className="text-[16px] font-semibold text-[#f46a6a]">Failed to load dashboard data</p>
      <p className="mt-2 text-[13px] text-[#74788d]">Something went wrong while loading this page.</p>
      <button
        onClick={reset}
        className="mt-4 rounded-lg bg-[#556ee6] px-4 py-2 text-[13px] font-semibold text-white"
      >
        Try Again
      </button>
    </div>
  )
}

