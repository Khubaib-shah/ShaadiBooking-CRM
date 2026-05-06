'use client'

import { useState } from 'react'
import PageHeader from '@/components/shared/PageHeader'

const TABS = ['Business Profile', 'SMS Templates', 'Reminders', 'Team', 'Subscription']

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <div>
      <PageHeader title="Settings" description="Manage your vendor account" />

      <div className="flex gap-1 border-b mb-6" style={{ borderColor:'var(--color-border)' }}>
        {TABS.map((tab, i) => (
          <button key={tab} onClick={() => setActiveTab(i)}
            className="px-4 py-2.5 text-xs font-medium transition-all relative"
            style={{ color: activeTab === i ? 'var(--color-accent)' : 'var(--color-text-secondary)' }}>
            {tab}
            {activeTab === i && <span className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ background:'var(--color-accent)' }} />}
          </button>
        ))}
      </div>

      <div className="max-w-2xl">
        {activeTab === 0 && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color:'var(--color-text-secondary)' }}>Vendor Name</label>
              <input className="w-full rounded-[var(--radius-md)] border px-3 py-2.5 text-[var(--text-sm)] focus:outline-none focus:border-[var(--color-accent)]"
                style={{ background:'var(--color-bg-sunken)', borderColor:'var(--color-border)', color:'var(--color-text-primary)' }}
                defaultValue="Royal Caterers" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color:'var(--color-text-secondary)' }}>Vendor Type</label>
              <select className="w-full rounded-[var(--radius-md)] border px-3 py-2.5 text-[var(--text-sm)] focus:outline-none focus:border-[var(--color-accent)]"
                style={{ background:'var(--color-bg-sunken)', borderColor:'var(--color-border)', color:'var(--color-text-primary)' }}>
                <option>Catering</option><option>Marquee Hall</option><option>Photography</option><option>Event Management</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color:'var(--color-text-secondary)' }}>Phone</label>
              <input className="w-full rounded-[var(--radius-md)] border px-3 py-2.5 text-[var(--text-sm)] focus:outline-none focus:border-[var(--color-accent)]"
                style={{ background:'var(--color-bg-sunken)', borderColor:'var(--color-border)', color:'var(--color-text-primary)' }}
                defaultValue="03121234567" />
            </div>
            <button className="rounded-lg px-4 py-2 text-sm font-semibold transition-all hover:brightness-110"
              style={{ background:'var(--color-accent)', color:'var(--color-text-inverse)' }}>Save Changes</button>
          </div>
        )}
        {activeTab === 1 && (
          <div className="space-y-4">
            {['Payment Reminder', 'Payment Receipt', 'Staff Assignment'].map(t => (
              <div key={t}>
                <label className="block text-xs font-medium mb-1" style={{ color:'var(--color-text-secondary)' }}>{t}</label>
                <textarea className="w-full rounded-[var(--radius-md)] border px-3 py-2.5 text-[var(--text-sm)] focus:outline-none focus:border-[var(--color-accent)] min-h-[80px]"
                  style={{ background:'var(--color-bg-sunken)', borderColor:'var(--color-border)', color:'var(--color-text-primary)' }}
                  defaultValue={`Dear {clientName}, your ${t.toLowerCase()} for {eventType} on {eventDate}...`} />
              </div>
            ))}
          </div>
        )}
        {activeTab === 2 && (
          <div className="space-y-3">
            <p className="text-sm mb-4" style={{ color:'var(--color-text-secondary)' }}>Choose when to send payment reminders:</p>
            {[{ days: 7, label: '7 days before due' }, { days: 3, label: '3 days before due' }, { days: 0, label: 'On due date' }].map(r => (
              <label key={r.days} className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors hover:bg-[var(--color-bg-sunken)]">
                <input type="checkbox" defaultChecked className="h-4 w-4 rounded accent-[var(--color-accent)]" />
                <span className="text-sm" style={{ color:'var(--color-text-primary)' }}>{r.label}</span>
              </label>
            ))}
          </div>
        )}
        {activeTab === 3 && (
          <div>
            <p className="text-sm mb-4" style={{ color:'var(--color-text-secondary)' }}>Manage team members and their roles.</p>
            <div className="rounded-lg border p-4" style={{ borderColor:'var(--color-border)', background:'var(--color-bg-sunken)' }}>
              <p className="text-sm" style={{ color:'var(--color-text-muted)' }}>Team management coming soon.</p>
            </div>
          </div>
        )}
        {activeTab === 4 && (
          <div className="rounded-xl border p-6" style={{ borderColor:'var(--color-border)', background:'var(--color-bg-elevated)' }}>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-lg font-semibold" style={{ fontFamily:'var(--font-display)', color:'var(--color-text-primary)' }}>Trial Plan</span>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background:'var(--color-warning-bg)', color:'var(--color-warning)' }}>23 days left</span>
            </div>
            <p className="text-sm mb-4" style={{ color:'var(--color-text-secondary)' }}>You&apos;re on a 30-day free trial. Upgrade to unlock all features.</p>
            <button className="rounded-lg px-4 py-2 text-sm font-semibold transition-all hover:brightness-110"
              style={{ background:'var(--color-accent)', color:'var(--color-text-inverse)' }}>Upgrade Now</button>
          </div>
        )}
      </div>
    </div>
  )
}
