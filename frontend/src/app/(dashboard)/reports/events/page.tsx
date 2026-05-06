import PageHeader from '@/components/shared/PageHeader'
import PageWrapper from '@/components/shared/PageWrapper'

export default function EventReportsPage() {
  return (
    <PageWrapper>
      <PageHeader title="Event Performance" description="Event type trends and venue performance" />
      <div className="rounded-xl border border-[#e9ecef] bg-white p-5 text-[13px] text-[#495057]">
        <p>Top Event Type: Barat</p>
        <p>Peak Season: Oct - Mar</p>
        <p>Best Performing Venue: Pearl Continental</p>
        <p>Returning Clients Ratio: 34%</p>
      </div>
    </PageWrapper>
  )
}

