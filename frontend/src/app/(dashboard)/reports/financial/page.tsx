import PageHeader from '@/components/shared/PageHeader'
import PageWrapper from '@/components/shared/PageWrapper'
import CurrencyDisplay from '@/components/shared/CurrencyDisplay'

export default function FinancialReportsPage() {
  return (
    <PageWrapper>
      <PageHeader title="Financial Report" description="Revenue, expenses and net profitability" />
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-[#e9ecef] bg-white p-4"><p className="text-[13px] text-[#74788d]">Revenue</p><p className="text-[24px] font-semibold text-[#343a40]"><CurrencyDisplay value={7700000} compact /></p></div>
        <div className="rounded-xl border border-[#e9ecef] bg-white p-4"><p className="text-[13px] text-[#74788d]">Expenses</p><p className="text-[24px] font-semibold text-[#343a40]"><CurrencyDisplay value={4570000} compact /></p></div>
        <div className="rounded-xl border border-[#e9ecef] bg-white p-4"><p className="text-[13px] text-[#74788d]">Net Profit</p><p className="text-[24px] font-semibold text-[#34c38f]"><CurrencyDisplay value={3130000} compact /></p></div>
        <div className="rounded-xl border border-[#e9ecef] bg-white p-4"><p className="text-[13px] text-[#74788d]">Margin</p><p className="text-[24px] font-semibold text-[#343a40]">40.6%</p></div>
      </div>
    </PageWrapper>
  )
}

