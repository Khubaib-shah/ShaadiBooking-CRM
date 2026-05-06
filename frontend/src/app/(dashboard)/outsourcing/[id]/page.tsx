import PageHeader from '@/components/shared/PageHeader'
import PageWrapper from '@/components/shared/PageWrapper'
import CurrencyDisplay from '@/components/shared/CurrencyDisplay'

export default async function OutsourcingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  return (
    <PageWrapper>
      <PageHeader title="Outsourcing Detail" description={`Job reference: ${id.toUpperCase()}`} />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-[#e9ecef] bg-white p-5 lg:col-span-2">
          <h3 className="mb-3 text-[15px] font-semibold text-[#343a40]">Services Provided</h3>
          <div className="space-y-2 text-[13px] text-[#495057]">
            <p>Workers deployed: 8</p>
            <p>Equipment: Standing AC x5, Generator x1, Tables x20</p>
            <p>Venue: PC Hotel, Club Road</p>
            <p>Date: 15 Dec 2025</p>
          </div>
        </div>
        <div className="rounded-xl border border-[#e9ecef] bg-white p-5">
          <h3 className="mb-3 text-[15px] font-semibold text-[#343a40]">Financial Summary</h3>
          <div className="space-y-2 text-[13px] text-[#495057]">
            <p>Revenue: <CurrencyDisplay value={85000} /></p>
            <p>Worker cost: <CurrencyDisplay value={32000} /></p>
            <p>Equipment cost: <CurrencyDisplay value={10000} /></p>
            <p>Transport: <CurrencyDisplay value={4000} /></p>
            <p className="font-semibold text-[#34c38f]">Net Profit: <CurrencyDisplay value={39000} /></p>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}

