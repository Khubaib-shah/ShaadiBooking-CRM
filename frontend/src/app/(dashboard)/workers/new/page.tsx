import PageHeader from '@/components/shared/PageHeader'
import PageWrapper from '@/components/shared/PageWrapper'

export default function NewWorkerPage() {
  return (
    <PageWrapper>
      <PageHeader title="Add Worker" description="Register a new worker profile" />
      <div className="rounded-xl border border-[#e9ecef] bg-white p-5">
        <div className="grid gap-4 md:grid-cols-2">
          <input className="rounded-lg border border-[#e9ecef] px-3 py-2 text-[13px]" placeholder="Full Name" />
          <input className="rounded-lg border border-[#e9ecef] px-3 py-2 text-[13px]" placeholder="CNIC (xxxxx-xxxxxxx-x)" />
          <input className="rounded-lg border border-[#e9ecef] px-3 py-2 text-[13px]" placeholder="Phone" />
          <input className="rounded-lg border border-[#e9ecef] px-3 py-2 text-[13px]" placeholder="WhatsApp" />
          <select className="rounded-lg border border-[#e9ecef] px-3 py-2 text-[13px]">
            <option>Worker Type</option>
            <option>Permanent</option>
            <option>Temporary</option>
            <option>Contractor</option>
          </select>
          <select className="rounded-lg border border-[#e9ecef] px-3 py-2 text-[13px]">
            <option>Primary Role</option>
            <option>Waiter</option>
            <option>Chef</option>
            <option>Electrician</option>
            <option>Manager</option>
          </select>
        </div>
        <div className="mt-4">
          <textarea className="min-h-24 w-full rounded-lg border border-[#e9ecef] px-3 py-2 text-[13px]" placeholder="Internal notes" />
        </div>
        <div className="mt-4 flex justify-end">
          <button className="rounded-lg bg-[#556ee6] px-4 py-2 text-[13px] font-semibold text-white">Save Worker</button>
        </div>
      </div>
    </PageWrapper>
  )
}

