import PageHeader from '@/components/shared/PageHeader'
import PageWrapper from '@/components/shared/PageWrapper'
import CurrencyDisplay from '@/components/shared/CurrencyDisplay'

const expenses = [
  { date: '02 May 2026', event: 'Imran Barat', category: 'Food/Catering', amount: 280000, paidTo: 'Al-Habib Caterers' },
  { date: '03 May 2026', event: 'Imran Barat', category: 'Worker Wages', amount: 85000, paidTo: 'Payroll' },
  { date: '03 May 2026', event: 'Imran Barat', category: 'Transport', amount: 12000, paidTo: 'Logistics Team' },
]

export default function ExpensesPage() {
  return (
    <PageWrapper>
      <PageHeader title="Expenses" description="Track all event-level and operational costs" />
      <div className="rounded-xl border border-[#e9ecef] bg-white p-4">
        <p className="mb-3 text-[13px] text-[#74788d]">This Month Total Expenses</p>
        <p className="text-[24px] font-semibold text-[#343a40]"><CurrencyDisplay value={457000} /></p>
      </div>
      <div className="overflow-x-auto rounded-xl border border-[#e9ecef] bg-white">
        <table className="w-full min-w-[780px]">
          <thead className="bg-[#f8f9fa]">
            <tr>
              {['Date', 'Event', 'Category', 'Amount', 'Paid To'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-[12px] font-semibold uppercase tracking-wider text-[#74788d]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {expenses.map((row, idx) => (
              <tr key={idx} className="border-t border-[#e9ecef] text-[13px] text-[#495057]">
                <td className="px-4 py-3">{row.date}</td>
                <td className="px-4 py-3 font-medium text-[#343a40]">{row.event}</td>
                <td className="px-4 py-3">{row.category}</td>
                <td className="px-4 py-3"><CurrencyDisplay value={row.amount} /></td>
                <td className="px-4 py-3">{row.paidTo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageWrapper>
  )
}

