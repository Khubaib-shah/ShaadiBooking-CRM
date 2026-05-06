'use client'

import { useState, useEffect } from 'react'
import PageHeader from '@/components/shared/PageHeader'
import PageWrapper from '@/components/shared/PageWrapper'
import ResponsiveModal from '@/components/shared/ResponsiveModal'
import { mockDb, type MockTeamMember } from '@/lib/utils/mockDb'
import { toast } from 'sonner'
import { Plus, Mail, Shield, UserPlus, CheckCircle, Clock } from 'lucide-react'

const TABS = ['Business Profile', 'SMS Templates', 'Reminders', 'Team', 'Subscription']

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState(0)

  // Team states
  const [team, setTeam] = useState<MockTeamMember[]>([])
  const [isInviteOpen, setIsInviteOpen] = useState(false)
  const [inviteName, setInviteName] = useState('')
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState<'Owner' | 'Sales Rep' | 'Operations Manager' | 'Coordinator'>('Sales Rep')

  useEffect(() => {
    setTeam(mockDb.getTeam())
  }, [])

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inviteName || !inviteEmail) {
      toast.error('Please enter name and email address')
      return
    }

    const newMember = mockDb.saveTeamMember({
      name: inviteName,
      email: inviteEmail,
      role: inviteRole,
    })

    setTeam([...team, newMember])
    setIsInviteOpen(false)
    setInviteName('')
    setInviteEmail('')
    toast.success(`Invitation successfully sent to ${inviteEmail}!`)
  }

  return (
    <PageWrapper>
      <PageHeader title="Settings" description="Manage your vendor business account, notification timelines, and active team rosters" />

      {/* Settings Navigation Tabs */}
      <div className="flex gap-1 border-b mb-6 overflow-x-auto flex-nowrap scrollbar-none whitespace-nowrap" style={{ borderColor: 'var(--color-border)', WebkitOverflowScrolling: 'touch' }}>
        {TABS.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all relative"
            style={{ color: activeTab === i ? 'var(--color-accent)' : 'var(--color-text-secondary)' }}
          >
            {tab}
            {activeTab === i && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ background: 'var(--color-accent)' }} />
            )}
          </button>
        ))}
      </div>

      <div className="max-w-4xl">
        {/* TAB 0: Profile */}
        {activeTab === 0 && (
          <div className="space-y-4 max-w-xl">
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>Vendor Name</label>
              <input className="w-full rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:border-[var(--color-accent)]"
                style={{ background: 'var(--color-bg-sunken)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}
                defaultValue="Royal Caterers" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>Vendor Type</label>
              <select className="w-full rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:border-[var(--color-accent)]"
                style={{ background: 'var(--color-bg-sunken)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}>
                <option>Catering</option><option>Marquee Hall</option><option>Photography</option><option>Event Management</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>Phone</label>
              <input className="w-full rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:border-[var(--color-accent)]"
                style={{ background: 'var(--color-bg-sunken)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}
                defaultValue="03121234567" />
            </div>
            <button
              onClick={() => toast.success('Vendor profile settings saved!')}
              className="rounded-lg px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all hover:brightness-110"
              style={{ background: 'var(--color-accent)', color: 'var(--color-text-inverse)' }}
            >
              Save Changes
            </button>
          </div>
        )}

        {/* TAB 1: SMS Templates */}
        {activeTab === 1 && (
          <div className="space-y-4 max-w-2xl">
            {['Payment Reminder', 'Payment Receipt', 'Staff Assignment'].map(t => (
              <div key={t}>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>{t}</label>
                <textarea className="w-full rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:border-[var(--color-accent)] min-h-[80px]"
                  style={{ background: 'var(--color-bg-sunken)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}
                  defaultValue={`Dear {clientName}, your ${t.toLowerCase()} for {eventType} on {eventDate}...`} />
              </div>
            ))}
            <button
              onClick={() => toast.success('SMS message templates updated!')}
              className="rounded-lg px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all hover:brightness-110"
              style={{ background: 'var(--color-accent)', color: 'var(--color-text-inverse)' }}
            >
              Save Templates
            </button>
          </div>
        )}

        {/* TAB 2: Reminders */}
        {activeTab === 2 && (
          <div className="space-y-3 max-w-xl">
            <p className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: 'var(--color-text-muted)' }}>Automation Reminders</p>
            {[{ days: 7, label: '7 days before due' }, { days: 3, label: '3 days before due' }, { days: 0, label: 'On due date' }].map(r => (
              <label key={r.days} className="flex items-center gap-3 p-3.5 rounded-xl cursor-pointer transition-colors hover:bg-[var(--color-bg-sunken)] border border-[var(--color-border)]">
                <input type="checkbox" defaultChecked className="h-4 w-4 rounded accent-[var(--color-accent)]" />
                <span className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>{r.label}</span>
              </label>
            ))}
          </div>
        )}

        {/* TAB 3: Team Management */}
        {activeTab === 3 && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-2">
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-[var(--color-text-muted)]">Active Team Roster</h3>
                <p className="text-xs text-[var(--color-text-muted)] mt-0.5">Manage administrative and coordination access roles</p>
              </div>
              <button
                onClick={() => setIsInviteOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold uppercase tracking-wider transition-all hover:brightness-110 active:scale-[0.97]"
                style={{ background: 'var(--color-accent)', color: 'var(--color-text-inverse)' }}
              >
                <UserPlus className="h-4 w-4" /> Invite Member
              </button>
            </div>

            {/* Team Roster Grid Table */}
            <div className="overflow-x-auto rounded-xl border border-[var(--color-border)] bg-white shadow-xs">
              <table className="w-full min-w-[550px]">
                <thead className="bg-[var(--color-bg-sunken)]">
                  <tr>
                    <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">User</th>
                    <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">Email</th>
                    <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">Role</th>
                    <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-[var(--color-text-secondary)]">
                  {team.map((member) => (
                    <tr key={member._id} className="border-t border-[var(--color-border)] hover:bg-[var(--color-bg-sunken)] transition-colors">
                      <td className="px-4 py-3.5 font-bold text-[var(--color-text-primary)]">{member.name}</td>
                      <td className="px-4 py-3.5 font-mono text-xs">{member.email}</td>
                      <td className="px-4 py-3.5">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[var(--color-text-primary)]">
                          <Shield className="h-3 w-3 text-[var(--color-accent)]" /> {member.role}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        {member.status === 'Active' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-black bg-[#34c38f]/10 text-[#34c38f]">
                            <CheckCircle className="h-3 w-3" /> Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-black bg-[#f1b44c]/10 text-[#f1b44c]">
                            <Clock className="h-3 w-3" /> Invited
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Invite Member Responsive Modal / Bottom Sheet */}
            <ResponsiveModal
              isOpen={isInviteOpen}
              onClose={() => setIsInviteOpen(false)}
              title="Invite Team Member"
              description="Invite coordinates, sales reps, or hall managers to handle operational flow."
            >
              <form onSubmit={handleInviteSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">Full Name</label>
                  <input
                    required
                    type="text"
                    value={inviteName}
                    onChange={(e) => setInviteName(e.target.value)}
                    placeholder="e.g. Asad Jamil"
                    className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-accent)]"
                    style={{ background: 'var(--color-bg-sunken)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">Email Address</label>
                  <input
                    required
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="e.g. asad@shaadibook.com"
                    className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-accent)]"
                    style={{ background: 'var(--color-bg-sunken)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">Access Role</label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value as any)}
                    className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-accent)]"
                    style={{ background: 'var(--color-bg-sunken)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}
                  >
                    <option value="Owner">Owner (Full Admin Access)</option>
                    <option value="Sales Rep">Sales Rep (Leads & Inquiries)</option>
                    <option value="Operations Manager">Operations Manager (Workforce & Deployment)</option>
                    <option value="Coordinator">Coordinator (On-site Logistics)</option>
                  </select>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-[var(--color-border)]">
                  <button
                    type="button"
                    onClick={() => setIsInviteOpen(false)}
                    className="px-4 py-2 text-sm font-semibold text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-border)] rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg px-6 py-2 text-sm font-bold uppercase tracking-wider transition-all hover:brightness-110 active:scale-[0.97]"
                    style={{ background: 'var(--color-accent)', color: 'var(--color-text-inverse)' }}
                  >
                    Send Invite
                  </button>
                </div>
              </form>
            </ResponsiveModal>
          </div>
        )}

        {/* TAB 4: Subscription */}
        {activeTab === 4 && (
          <div className="rounded-xl border p-6 max-w-xl" style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg-elevated)' }}>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-lg font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}>Trial Plan</span>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full" style={{ background: 'var(--color-warning-bg)', color: 'var(--color-warning)' }}>23 days left</span>
            </div>
            <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>You&apos;re on a 30-day free trial. Upgrade to unlock SMS notifications, full workforce analytics, and priority print receipt layout parameters.</p>
            <button
              onClick={() => toast.success('Redirecting to payment gateway...')}
              className="rounded-lg px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all hover:brightness-110"
              style={{ background: 'var(--color-accent)', color: 'var(--color-text-inverse)' }}
            >
              Upgrade Now
            </button>
          </div>
        )}
      </div>
    </PageWrapper>
  )
}
