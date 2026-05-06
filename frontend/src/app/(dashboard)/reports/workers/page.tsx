import PageHeader from '@/components/shared/PageHeader'
import PageWrapper from '@/components/shared/PageWrapper'

export default function WorkerReportsPage() {
  return (
    <PageWrapper>
      <PageHeader title="Worker Report" description="Workforce utilization and payout insights" />
      <div className="rounded-xl border border-[#e9ecef] bg-white p-5 text-[13px] text-[#495057]">
        <p>Total Workers: 42</p>
        <p>Total Salary Paid: Rs. 9,80,000</p>
        <p>Average Workers Per Event: 11</p>
        <p>Most Active Worker: Ahmed Ali</p>
      </div>
    </PageWrapper>
  )
}

