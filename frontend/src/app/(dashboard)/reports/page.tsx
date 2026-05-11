import Link from 'next/link'
import { BarChart3, Users, Receipt } from 'lucide-react'
import PageHeader from '@/components/shared/PageHeader'
import PageWrapper from '@/components/shared/PageWrapper'

const cards = [
  { href: '/reports/financial', title: 'Financial Reports', desc: 'Revenue trends, P&L and collection analytics', icon: Receipt },
  { href: '/reports/workers', title: 'Worker Reports', desc: 'Utilization, salary and performance analysis', icon: Users },
  { href: '/reports/events', title: 'Event Performance', desc: 'Event type and seasonal trend insights', icon: BarChart3 },
]

export default function ReportsHubPage() {
  return (
    <PageWrapper>
      <PageHeader title="Reports" description="Analytics and performance reporting modules" />
      <div className="grid gap-4 md:grid-cols-3">
        {cards.map((card) => (
          <Link key={card.href} href={card.href} className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5 transition hover:shadow-sm">
            <card.icon className="mb-3 h-6 w-6 text-[#556ee6]" />
            <h3 className="text-[15px] font-semibold text-[var(--color-text-primary)]">{card.title}</h3>
            <p className="mt-1 text-[13px] text-[var(--color-text-muted)]">{card.desc}</p>
          </Link>
        ))}
      </div>
    </PageWrapper>
  )
}

