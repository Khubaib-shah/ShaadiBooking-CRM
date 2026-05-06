import PageHeader from '@/components/shared/PageHeader'
import PageWrapper from '@/components/shared/PageWrapper'
import StatusDot from '@/components/shared/StatusDot'

const events = [
  { id: 'e1', name: 'Imran Barat', date: '20 Dec 2025', required: 12, assigned: 8 },
  { id: 'e2', name: 'Sara Mehndi', date: '22 Dec 2025', required: 9, assigned: 9 },
]

export default function StaffDeploymentPage() {
  return (
    <PageWrapper>
      <PageHeader title="Staff Deployment" description="Event-wise staffing completeness and assignments" />
      <div className="space-y-4">
        {events.map((event) => {
          const percent = Math.round((event.assigned / event.required) * 100)
          const understaffed = event.assigned < event.required

          return (
            <div key={event.id} className="rounded-xl border border-[#e9ecef] bg-white p-5">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="text-[15px] font-semibold text-[#343a40]">{event.name}</p>
                  <p className="text-[13px] text-[#74788d]">{event.date}</p>
                </div>
                <StatusDot tone={understaffed ? 'warning' : 'success'} label={understaffed ? `${event.required - event.assigned} missing` : 'Fully staffed'} />
              </div>
              <div className="mb-2 h-2 rounded-full bg-[#f1f3f5]">
                <div className="h-2 rounded-full" style={{ width: `${percent}%`, background: understaffed ? '#f1b44c' : '#34c38f' }} />
              </div>
              <p className="text-[12px] text-[#74788d]">Required {event.required} | Assigned {event.assigned}</p>
            </div>
          )
        })}
      </div>
    </PageWrapper>
  )
}

