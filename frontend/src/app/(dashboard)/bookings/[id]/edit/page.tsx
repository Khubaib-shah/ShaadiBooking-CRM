import PageHeader from '@/components/shared/PageHeader'
import PageWrapper from '@/components/shared/PageWrapper'

export default async function EditBookingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return (
    <PageWrapper>
      <PageHeader title="Edit Booking" description={`Update booking ${id.toUpperCase()} details`} />
      <div className="rounded-xl border border-[#e9ecef] bg-white p-5">
        <div className="grid gap-4 md:grid-cols-2">
          <input className="rounded-lg border border-[#e9ecef] px-3 py-2 text-[13px]" defaultValue="Ahmed Khan" />
          <input className="rounded-lg border border-[#e9ecef] px-3 py-2 text-[13px]" defaultValue="03121234567" />
          <input className="rounded-lg border border-[#e9ecef] px-3 py-2 text-[13px]" type="date" />
          <input className="rounded-lg border border-[#e9ecef] px-3 py-2 text-[13px]" defaultValue="Pearl Continental" />
        </div>
        <button className="mt-4 rounded-lg bg-[#556ee6] px-4 py-2 text-[13px] font-semibold text-white">Save Changes</button>
      </div>
    </PageWrapper>
  )
}

