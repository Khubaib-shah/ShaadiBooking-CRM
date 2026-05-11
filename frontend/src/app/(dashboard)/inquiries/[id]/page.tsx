import PageHeader from '@/components/shared/PageHeader'
import PageWrapper from '@/components/shared/PageWrapper'

export default async function InquiryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return (
    <PageWrapper>
      <PageHeader title="Inquiry Detail" description={`Lead reference ${id.toUpperCase()}`} />
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5 text-[13px] text-[var(--color-text-secondary)]">
        <p>Client: Zara Hussain</p>
        <p>Phone: 0300-1234567</p>
        <p>Event Type: Mehndi</p>
        <p>Status: Negotiating</p>
        <div className="mt-4 flex gap-2">
          <button className="rounded-lg bg-[#34c38f] px-3 py-2 text-[12px] font-semibold text-white">Convert to Booking</button>
          <button className="rounded-lg border border-[var(--color-border)] px-3 py-2 text-[12px] font-semibold text-[var(--color-text-muted)]">Mark Lost</button>
        </div>
      </div>
    </PageWrapper>
  )
}

