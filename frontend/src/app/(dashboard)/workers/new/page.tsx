'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Check, Sparkles, AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import PageHeader from '@/components/shared/PageHeader'
import PageWrapper from '@/components/shared/PageWrapper'

const ROLES = [
  { key: 'waiter', label: 'Waiter', emoji: '🍽' },
  { key: 'head_waiter', label: 'Head Waiter', emoji: '👨‍🍳' },
  { key: 'chef', label: 'Chef', emoji: '🧑‍🍳' },
  { key: 'electrician', label: 'Electrician', emoji: '⚡' },
  { key: 'manager', label: 'Manager', emoji: '👔' },
  { key: 'driver', label: 'Driver', emoji: '🚗' },
  { key: 'helper', label: 'Helper', emoji: '🤝' },
  { key: 'generator_operator', label: 'Generator Op', emoji: '⚙️' },
]

const SKILLS = ['Can Drive', 'AC Technician', 'Generator Repair', 'Electrical Wiring', 'First Aid Trained', 'Food Decoration']

export default function NewWorkerPage() {
  const router = useRouter()
  const [workerType, setWorkerType] = useState<'permanent' | 'temporary' | 'contractor'>('temporary')
  const [primaryRole, setPrimaryRole] = useState('waiter')
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form Fields State
  const [name, setName] = useState('')
  const [cnic, setCnic] = useState('')
  const [phone, setPhone] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [emergencyName, setEmergencyName] = useState('')
  const [emergencyPhone, setEmergencyPhone] = useState('')
  const [salary, setSalary] = useState('')
  const [wage, setWage] = useState('')
  const [notes, setNotes] = useState('')

  const handleCnicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '')
    if (val.length > 5 && val.length <= 12) {
      val = val.slice(0, 5) + '-' + val.slice(5)
    } else if (val.length > 12) {
      val = val.slice(0, 5) + '-' + val.slice(5, 12) + '-' + val.slice(12, 13)
    }
    setCnic(val)
  }

  const handlePhoneChange = (setter: (v: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '')
    if (val.length > 4) {
      val = val.slice(0, 4) + '-' + val.slice(4, 11)
    }
    setter(val)
  }

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !cnic || !phone) {
      toast.error('Please fill in Name, CNIC, and Phone Number')
      return
    }

    if (cnic.length < 15) {
      toast.error('Please enter a valid CNIC (13 digits formatted as xxxxx-xxxxxxx-x)')
      return
    }

    if (phone.length < 12) {
      toast.error('Please enter a valid 11-digit Pakistani Phone Number (03xx-xxxxxxx)')
      return
    }

    setIsSubmitting(true)
    setTimeout(() => {
      toast.success(`Worker "${name}" successfully registered!`)
      setIsSubmitting(false)
      router.push('/workers')
    }, 1000)
  }

  return (
    <PageWrapper>
      <Link href="/workers" className="inline-flex items-center gap-1.5 text-xs font-semibold mb-4 text-[var(--color-text-secondary)] hover:text-[#556ee6] transition-colors">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Workforce
      </Link>

      <PageHeader title="Add Worker" description="Register a new workforce profile in the system ledger" />

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* SECTION 1: BASIC INFORMATION */}
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-[var(--color-text-muted)] flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-[#556ee6]" /> 1. Personal & Contact Ledger
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--color-text-secondary)]">Full Name *</label>
              <input
                required
                type="text"
                placeholder="e.g. Ahmed Ali"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm bg-[var(--color-bg-sunken)] focus:outline-none focus:border-[var(--color-accent)] text-[var(--color-text-primary)]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--color-text-secondary)]">CNIC Number *</label>
              <input
                required
                type="text"
                maxLength={15}
                placeholder="42101-1234567-1"
                value={cnic}
                onChange={handleCnicChange}
                className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm bg-[var(--color-bg-sunken)] focus:outline-none focus:border-[var(--color-accent)] font-mono text-[var(--color-text-primary)]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--color-text-secondary)]">Primary Phone *</label>
              <input
                required
                type="text"
                maxLength={12}
                placeholder="0321-1234567"
                value={phone}
                onChange={handlePhoneChange(setPhone)}
                className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm bg-[var(--color-bg-sunken)] focus:outline-none focus:border-[var(--color-accent)] font-mono text-[var(--color-text-primary)]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--color-text-secondary)]">WhatsApp Number</label>
              <input
                type="text"
                maxLength={12}
                placeholder="0321-1234567"
                value={whatsapp}
                onChange={handlePhoneChange(setWhatsapp)}
                className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm bg-[var(--color-bg-sunken)] focus:outline-none focus:border-[var(--color-accent)] font-mono text-[var(--color-text-primary)]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--color-text-secondary)]">Emergency Contact Name</label>
              <input
                type="text"
                placeholder="e.g. Brother or Father's Name"
                value={emergencyName}
                onChange={e => setEmergencyName(e.target.value)}
                className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm bg-[var(--color-bg-sunken)] focus:outline-none focus:border-[var(--color-accent)] text-[var(--color-text-primary)]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--color-text-secondary)]">Emergency Phone Number</label>
              <input
                type="text"
                maxLength={12}
                placeholder="0300-1234567"
                value={emergencyPhone}
                onChange={handlePhoneChange(setEmergencyPhone)}
                className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm bg-[var(--color-bg-sunken)] focus:outline-none focus:border-[var(--color-accent)] font-mono text-[var(--color-text-primary)]"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: ROLE & EMPLOYMENT */}
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-[var(--color-text-muted)] flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-[#556ee6]" /> 2. Role & Employment Parameters
          </h3>

          <div className="space-y-5">
            {/* Employment Type */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-[var(--color-text-secondary)]">Employment Type *</label>
              <div className="grid gap-3 grid-cols-3 max-w-lg">
                {(['permanent', 'temporary', 'contractor'] as const).map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setWorkerType(type)}
                    className={`rounded-lg border px-3 py-2.5 text-xs font-semibold capitalize transition-all ${workerType === type ? 'border-[#556ee6] bg-[#eef2ff] text-[#556ee6]' : 'border-[var(--color-border)] hover:bg-[var(--color-bg-sunken)] text-[var(--color-text-secondary)]'}`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Visual Grid of Primary Roles */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-[var(--color-text-secondary)]">Primary Role *</label>
              <div className="grid gap-3 grid-cols-2 sm:grid-cols-4 max-w-2xl">
                {ROLES.map(role => (
                  <button
                    key={role.key}
                    type="button"
                    onClick={() => setPrimaryRole(role.key)}
                    className={`flex flex-col items-center justify-center border p-4 rounded-xl transition-all hover:scale-[1.02] ${primaryRole === role.key ? 'border-[#556ee6] bg-[#eef2ff]/50 shadow-sm' : 'border-[var(--color-border)] hover:bg-[var(--color-bg-sunken)]'}`}
                  >
                    <span className="text-2xl mb-1">{role.emoji}</span>
                    <span className="text-xs font-semibold text-[var(--color-text-primary)]">{role.label}</span>
                    {primaryRole === role.key && (
                      <div className="mt-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#556ee6] text-white">
                        <Check className="h-2.5 w-2.5 stroke-[3px]" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Secondary Multi-select Skills */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-[var(--color-text-secondary)]">Secondary Skills (Optional)</label>
              <div className="flex flex-wrap gap-2">
                {SKILLS.map(skill => {
                  const selected = selectedSkills.includes(skill)
                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleSkill(skill)}
                      className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all ${selected ? 'bg-[#556ee6] text-white' : 'bg-[var(--color-bg-sunken)] text-[var(--color-text-secondary)] hover:bg-[var(--color-border-mid)]'}`}
                    >
                      {skill} {selected && '✓'}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: COMPENSATION DETAILS */}
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-[var(--color-text-muted)] flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-[#556ee6]" /> 3. Financial Compensation
          </h3>

          <div className="max-w-md space-y-4">
            {workerType === 'permanent' && (
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[var(--color-text-secondary)]">Monthly Base Salary (Rs.)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs font-bold text-[var(--color-text-muted)]">Rs.</span>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 30000"
                    value={salary}
                    onChange={e => setSalary(e.target.value)}
                    className="w-full rounded-lg border border-[var(--color-border)] pl-10 pr-3 py-2 text-sm bg-[var(--color-bg-sunken)] focus:outline-none focus:border-[var(--color-accent)] font-mono text-[var(--color-text-primary)]"
                  />
                </div>
                <p className="text-[11px] text-[var(--color-text-muted)]">Fixed salary paid at the start of every month ledger.</p>
              </div>
            )}

            {(workerType === 'temporary' || workerType === 'contractor') && (
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[var(--color-text-secondary)]">
                  {workerType === 'temporary' ? 'Default Event wage (Rs.)' : 'Per Event Contract Rate (Rs.)'}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs font-bold text-[var(--color-text-muted)]">Rs.</span>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 1500"
                    value={wage}
                    onChange={e => setWage(e.target.value)}
                    className="w-full rounded-lg border border-[var(--color-border)] pl-10 pr-3 py-2 text-sm bg-[var(--color-bg-sunken)] focus:outline-none focus:border-[var(--color-accent)] font-mono text-[var(--color-text-primary)]"
                  />
                </div>
                <p className="text-[11px] text-[var(--color-text-muted)]">Default rate paid directly after event assignments worked.</p>
              </div>
            )}
          </div>
        </div>

        {/* SECTION 4: INTERNAL NOTES */}
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <h3 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--color-text-muted)' }}>
            4. Operational Notes
          </h3>
          <textarea
            rows={3}
            placeholder="Enter medical guidelines, restriction reports, or special remarks about this worker..."
            value={notes}
            onChange={e => setNotes(e.target.value)}
            className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2.5 text-sm bg-[var(--color-bg-sunken)] focus:outline-none focus:border-[var(--color-accent)] text-[var(--color-text-primary)]"
          />
        </div>

        {/* SUBMIT TRIGGERS */}
        <div className="flex justify-end gap-3 border-t pt-5 border-[var(--color-border)]">
          <Link
            href="/workers"
            className="rounded-lg border border-[var(--color-border)] px-5 py-2 text-xs font-semibold text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-sunken)] transition-all"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#556ee6] px-5 py-2 text-xs font-semibold text-white hover:brightness-110 active:scale-[0.97] transition-all disabled:opacity-50"
          >
            {isSubmitting ? 'Registering...' : 'Save Worker Ledger'}
          </button>
        </div>
      </form>
    </PageWrapper>
  )
}
