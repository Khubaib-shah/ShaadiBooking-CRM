import Link from 'next/link'
import PageHeader from '@/components/shared/PageHeader'
import PageWrapper from '@/components/shared/PageWrapper'
import CurrencyDisplay from '@/components/shared/CurrencyDisplay'

const jobs = [
  { id: 'os-1', client: 'Pearl Continental Hotel', event: 'Corporate Dinner', date: '15 Dec 2025', revenue: 85000, cost: 32000, profit: 53000, status: 'Confirmed' },
  { id: 'os-2', client: 'Emaar Beach Front', event: 'Beach Wedding', date: '18 Dec 2025', revenue: 145000, cost: 48000, profit: 97000, status: 'In Progress' },
]

export default function OutsourcingPage() {
  return (
    <PageWrapper>
      <PageHeader title="Outsourcing" description="Track external service jobs and profitability" />
      <div className="grid gap-4 md:grid-cols-2">
        {jobs.map((job) => (
          <Link key={job.id} href={`/outsourcing/${job.id}`} className="rounded-xl border border-[#e9ecef] bg-white p-5 transition hover:shadow-sm">
            <p className="text-[15px] font-semibold text-[#343a40]">{job.client}</p>
            <p className="text-[13px] text-[#74788d]">{job.event} - {job.date}</p>
            <div className="mt-3 grid grid-cols-3 gap-2 text-[12px]">
              <div><p className="text-[#74788d]">Revenue</p><p className="font-semibold text-[#343a40]"><CurrencyDisplay value={job.revenue} compact /></p></div>
              <div><p className="text-[#74788d]">Cost</p><p className="font-semibold text-[#343a40]"><CurrencyDisplay value={job.cost} compact /></p></div>
              <div><p className="text-[#74788d]">Profit</p><p className="font-semibold text-[#34c38f]"><CurrencyDisplay value={job.profit} compact /></p></div>
            </div>
            <span className="mt-3 inline-flex rounded-full bg-[#d1ecf1] px-2 py-0.5 text-[11px] font-semibold text-[#50a5f1]">{job.status}</span>
          </Link>
        ))}
      </div>
    </PageWrapper>
  )
}

