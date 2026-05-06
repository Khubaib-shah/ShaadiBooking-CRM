export default function LoadingSkeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-[#f1f3f5] ${className}`} />
}

