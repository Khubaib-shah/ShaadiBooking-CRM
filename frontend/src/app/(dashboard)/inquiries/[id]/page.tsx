import PageHeader from '@/components/shared/PageHeader'
import PageWrapper from '@/components/shared/PageWrapper'

export default async function InquiryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return (
    <PageWrapper>
      <PageHeader title="Inquiry Detail" description={`Lead reference ${id.toUpperCase()}`} />
      <div className="rounded-xl border border-[#e9ecef] bg-white p-5 text-[13px] text-[#495057]">
        <p>Client: Zara Hussain</p>
        <p>Phone: 0300-1234567</p>
        <p>Event Type: Mehndi</p>
        <p>Status: Negotiating</p>
        <div className="mt-4 flex gap-2">
          <button className="rounded-lg bg-[#34c38f] px-3 py-2 text-[12px] font-semibold text-white">Convert to Booking</button>
          <button className="rounded-lg border border-[#e9ecef] px-3 py-2 text-[12px] font-semibold text-[#74788d]">Mark Lost</button>
        </div>
      </div>
    </PageWrapper>
  )
}

