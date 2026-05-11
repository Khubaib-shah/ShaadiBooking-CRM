import PageHeader from '@/components/shared/PageHeader'
import PageWrapper from '@/components/shared/PageWrapper'

export default function NewOutsourcingPage() {
  return (
    <PageWrapper>
      <PageHeader title="New Outsourcing Job" description="Create a new external client service order" />
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5">
        <div className="grid gap-4 md:grid-cols-2">
          <input className="rounded-lg border border-[var(--color-border)] px-3 py-2 text-[13px]" placeholder="Client Organization" />
          <input className="rounded-lg border border-[var(--color-border)] px-3 py-2 text-[13px]" placeholder="Client Contact Phone" />
          <input className="rounded-lg border border-[var(--color-border)] px-3 py-2 text-[13px]" placeholder="Venue Name" />
          <input type="date" className="rounded-lg border border-[var(--color-border)] px-3 py-2 text-[13px]" />
        </div>
        <textarea className="mt-4 min-h-24 w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-[13px]" placeholder="Services and notes" />
        <button className="mt-4 rounded-lg bg-[#556ee6] px-4 py-2 text-[13px] font-semibold text-white">Create Job</button>
      </div>
    </PageWrapper>
  )
}

