import PageHeader from '@/components/shared/PageHeader'
import PageWrapper from '@/components/shared/PageWrapper'
import CurrencyDisplay from '@/components/shared/CurrencyDisplay'

const rows = [
  { worker: 'Ahmed Ali', type: 'Permanent', events: 8, base: 30000, bonus: 4000, advance: 0, deductions: 500, net: 33500, status: 'Paid' },
  { worker: 'Rashid Hussain', type: 'Temporary', events: 6, base: 0, bonus: 9000, advance: 0, deductions: 0, net: 9000, status: 'Paid' },
  { worker: 'Muhammad Aslam', type: 'Permanent', events: 10, base: 45000, bonus: 5000, advance: 10000, deductions: 0, net: 40000, status: 'Partial' },
]

export default function WorkerSalariesPage() {
  return (
    <PageWrapper>
      <PageHeader title="Salary Management" description="Monthly payout and salary ledger" />
      <div className="overflow-x-auto rounded-xl border border-[#e9ecef] bg-white">
        <table className="w-full min-w-[920px]">
          <thead className="bg-[#f8f9fa]">
            <tr>
              {['Worker', 'Type', 'Events', 'Base', 'Bonus', 'Advance', 'Deductions', 'Net', 'Status'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-[12px] font-semibold uppercase tracking-wider text-[#74788d]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.worker} className="border-t border-[#e9ecef] text-[13px] text-[#495057]">
                <td className="px-4 py-3 font-medium text-[#343a40]">{row.worker}</td>
                <td className="px-4 py-3">{row.type}</td>
                <td className="px-4 py-3">{row.events}</td>
                <td className="px-4 py-3"><CurrencyDisplay value={row.base} /></td>
                <td className="px-4 py-3"><CurrencyDisplay value={row.bonus} /></td>
                <td className="px-4 py-3"><CurrencyDisplay value={row.advance} /></td>
                <td className="px-4 py-3"><CurrencyDisplay value={row.deductions} /></td>
                <td className="px-4 py-3 font-semibold"><CurrencyDisplay value={row.net} /></td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${row.status === 'Paid' ? 'bg-[#d4edda] text-[#34c38f]' : 'bg-[#fff3cd] text-[#f1b44c]'}`}>
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageWrapper>
  )
}

