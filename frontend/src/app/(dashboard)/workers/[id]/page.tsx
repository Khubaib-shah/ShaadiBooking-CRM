import PageHeader from '@/components/shared/PageHeader'
import PageWrapper from '@/components/shared/PageWrapper'
import CurrencyDisplay from '@/components/shared/CurrencyDisplay'

export default async function WorkerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  return (
    <PageWrapper>
      <PageHeader title="Worker Profile" description={`Detailed profile for ${id.toUpperCase()}`} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-[#e9ecef] bg-white p-5 lg:col-span-2">
          <h3 className="mb-3 text-[15px] font-semibold text-[#343a40]">Overview</h3>
          <div className="grid gap-2 text-[13px] text-[#495057] md:grid-cols-2">
            <p>Name: Ahmed Ali</p>
            <p>Role: Head Waiter</p>
            <p>Type: Permanent</p>
            <p>Status: Active</p>
            <p>CNIC: 42101-1234567-1</p>
            <p>Phone: 0321-2345678</p>
          </div>
        </div>

        <div className="rounded-xl border border-[#e9ecef] bg-white p-5">
          <h3 className="mb-3 text-[15px] font-semibold text-[#343a40]">Quick Stats</h3>
          <div className="space-y-2 text-[13px] text-[#495057]">
            <p>Total Events: 84</p>
            <p>Total Earned: <CurrencyDisplay value={735000} /></p>
            <p>Current Month: <CurrencyDisplay value={34000} /></p>
            <p>Attendance: 95%</p>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}

