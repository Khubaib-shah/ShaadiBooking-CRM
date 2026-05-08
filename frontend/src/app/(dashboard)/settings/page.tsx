'use client'

import { useState, useEffect } from 'react'
import PageHeader from '@/components/shared/PageHeader'
import PageWrapper from '@/components/shared/PageWrapper'
import ResponsiveModal from '@/components/shared/ResponsiveModal'
import { mockDb, type MockTeamMember } from '@/lib/utils/mockDb'
import { toast } from 'sonner'
import { Plus, Mail, Shield, UserPlus, CheckCircle, Clock, Edit2, Trash2, Search } from 'lucide-react'
import { formatRupees } from '@/lib/utils/currency'


const TABS = ['Business Profile', 'SMS Templates', 'Reminders', 'Team', 'Master Menu Planner', 'Subscription']


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

  // Menu Planner States
  const [subTab, setSubTab] = useState<'dishes' | 'categories'>('dishes')
  const [menuItems, setMenuItems] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all')
  const [menuSearchQuery, setMenuSearchQuery] = useState('')
  
  // Create / Edit dish modal states
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false)
  const [editingMenuItem, setEditingMenuItem] = useState<any | null>(null)
  const [menuFormName, setMenuFormName] = useState('')
  const [menuFormCategory, setMenuFormCategory] = useState<string>('main')
  const [menuFormPrice, setMenuFormPrice] = useState(100)
  const [menuFormIcon, setMenuFormIcon] = useState('🍛')

  // Create / Edit category modal states
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<any | null>(null)
  const [categoryFormName, setCategoryFormName] = useState('')
  const [categoryFormSlug, setCategoryFormSlug] = useState('')
  const [categoryFormIcon, setCategoryFormIcon] = useState('📁')

  useEffect(() => {
    setTeam(mockDb.getTeam())
    setMenuItems(mockDb.getMenuItems())
    
    const dbCategories = mockDb.getMenuCategories()
    setCategories(dbCategories)
    if (dbCategories.length > 0) {
      setMenuFormCategory(dbCategories[0].slug)
    }
  }, [])

  const handleMenuSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!menuFormName) {
      toast.error('Please enter a name for the dish')
      return
    }

    const updated = mockDb.saveMenuItem({
      _id: editingMenuItem?._id,
      name: menuFormName,
      category: menuFormCategory,
      price: Number(menuFormPrice) || 0,
      icon: menuFormIcon,
    })

    if (editingMenuItem?._id) {
      toast.success(`${menuFormName} successfully updated!`)
    } else {
      toast.success(`${menuFormName} successfully added to Master Menu!`)
    }

    setMenuItems(mockDb.getMenuItems())
    setIsMenuModalOpen(false)
    resetMenuForm()
  }

  const resetMenuForm = () => {
    setEditingMenuItem(null)
    setMenuFormName('')
    setMenuFormCategory(categories[0]?.slug || 'main')
    setMenuFormPrice(100)
    setMenuFormIcon('🍛')
  }

  const handleEditClick = (item: any) => {
    setEditingMenuItem(item)
    setMenuFormName(item.name)
    setMenuFormCategory(item.category)
    setMenuFormPrice(item.price)
    setMenuFormIcon(item.icon)
    setIsMenuModalOpen(true)
  }

  const handleDeleteClick = (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove "${name}" from the master menu?`)) {
      mockDb.deleteMenuItem(id)
      setMenuItems(mockDb.getMenuItems())
      toast.success(`Removed "${name}" from master menu.`)
    }
  }

  const handleCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!categoryFormName) {
      toast.error('Please enter a name for the category')
      return
    }

    const slug = categoryFormSlug || categoryFormName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

    const updated = mockDb.saveMenuCategory({
      _id: editingCategory?._id,
      name: categoryFormName,
      slug,
      icon: categoryFormIcon,
    })

    if (editingCategory?._id) {
      toast.success(`Category "${categoryFormName}" successfully updated!`)
    } else {
      toast.success(`Category "${categoryFormName}" successfully created!`)
    }

    setCategories(mockDb.getMenuCategories())
    setIsCategoryModalOpen(false)
    resetCategoryForm()
  }

  const resetCategoryForm = () => {
    setEditingCategory(null)
    setCategoryFormName('')
    setCategoryFormSlug('')
    setCategoryFormIcon('📁')
  }

  const handleEditCategoryClick = (cat: any) => {
    setEditingCategory(cat)
    setCategoryFormName(cat.name)
    setCategoryFormSlug(cat.slug)
    setCategoryFormIcon(cat.icon)
    setIsCategoryModalOpen(true)
  }

  const handleDeleteCategoryClick = (id: string, name: string, slug: string) => {
    const list = mockDb.getMenuItems()
    const count = list.filter(m => m.category === slug).length
    if (count > 0) {
      toast.error(`Cannot delete category "${name}". There are ${count} dishes currently assigned to it! Please reassign or delete them first.`)
      return
    }

    if (confirm(`Are you sure you want to delete the category "${name}"?`)) {
      mockDb.deleteMenuCategory(id)
      setCategories(mockDb.getMenuCategories())
      toast.success(`Deleted category "${name}" successfully.`)
    }
  }

  // Filter and search computation
  const filteredMenuItems = menuItems.filter((item) => {
    const matchesCategory = selectedCategoryFilter === 'all' || item.category === selectedCategoryFilter
    const matchesSearch = item.name.toLowerCase().includes(menuSearchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })


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

        {/* TAB 4: Master Menu Planner */}
        {activeTab === 4 && (
          <div className="space-y-6 animate-fade-in">
            {/* Sub Tabs Selector */}
            <div className="flex gap-2 border-b pb-3 border-[var(--color-border)]">
              <button
                onClick={() => setSubTab('dishes')}
                className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                  subTab === 'dishes'
                    ? 'bg-[var(--color-accent-soft)]/20 text-[var(--color-accent)]'
                    : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-sunken)]'
                }`}
              >
                🍜 Manage Dishes ({menuItems.length})
              </button>
              <button
                onClick={() => setSubTab('categories')}
                className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                  subTab === 'categories'
                    ? 'bg-[var(--color-accent-soft)]/20 text-[var(--color-accent)]'
                    : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-sunken)]'
                }`}
              >
                📁 Manage Categories ({categories.length})
              </button>
            </div>

            {subTab === 'dishes' ? (
              <>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-[var(--color-text-muted)]">Master Wedding Menu Dishes</h3>
                    <p className="text-xs text-[var(--color-text-muted)] mt-0.5">Configure master prices, categories, and representations of dishes available in quotation builders.</p>
                  </div>
                  <button
                    onClick={() => {
                      resetMenuForm()
                      setIsMenuModalOpen(true)
                    }}
                    className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold uppercase tracking-wider transition-all hover:brightness-110 active:scale-[0.97]"
                    style={{ background: 'var(--color-accent)', color: 'var(--color-text-inverse)' }}
                  >
                    <Plus className="h-4 w-4" /> Add Menu Item
                  </button>
                </div>

                {/* Filter and Search Bar */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-text-muted)]" />
                    <input
                      type="text"
                      placeholder="Search wedding dishes..."
                      value={menuSearchQuery}
                      onChange={(e) => setMenuSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border focus:outline-none focus:border-[var(--color-accent)]"
                      style={{ background: 'var(--color-bg-sunken)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}
                    />
                  </div>
                  
                  <div className="w-full sm:w-64 shrink-0">
                    <select
                      value={selectedCategoryFilter}
                      onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-lg border focus:outline-none focus:border-[var(--color-accent)] font-semibold text-[var(--color-text-secondary)]"
                      style={{ background: 'var(--color-bg-sunken)', borderColor: 'var(--color-border)' }}
                    >
                      <option value="all">📁 All Categories</option>
                      {categories.map((cat) => (
                        <option key={cat.slug} value={cat.slug}>
                          {cat.icon} {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Dishes Roster Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {filteredMenuItems.length > 0 ? (
                    filteredMenuItems.map((item) => (
                      <div
                        key={item._id}
                        className="flex items-center justify-between p-4 rounded-xl border transition-all hover:shadow-xs bg-[var(--color-bg-elevated)] border-[var(--color-border)]"
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div className="text-3xl h-12 w-12 rounded-lg bg-[var(--color-bg-sunken)] flex items-center justify-center shrink-0 border border-[var(--color-border)]">
                            {item.icon}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-[var(--color-text-primary)] text-sm truncate">{item.name}</h4>
                              <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[var(--color-bg-sunken)] text-[var(--color-text-muted)] border border-[var(--color-border)]">
                                {categories.find(c => c.slug === item.category)?.icon || '🍛'}{' '}
                                {categories.find(c => c.slug === item.category)?.name || item.category}
                              </span>
                            </div>
                            <p className="text-xs font-semibold text-[var(--color-accent)] font-mono mt-1">
                              {formatRupees(item.price)} <span className="text-[10px] text-[var(--color-text-muted)] font-sans font-normal">per head cost</span>
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-1 shrink-0 ml-3">
                          <button
                            onClick={() => handleEditClick(item)}
                            title="Edit Dish"
                            className="p-2 rounded-lg hover:bg-[var(--color-bg-sunken)] text-[var(--color-text-secondary)] transition-colors"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(item._id, item.name)}
                            title="Delete Dish"
                            className="p-2 rounded-lg hover:bg-[var(--color-danger-soft)]/20 text-[var(--color-danger)] transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-1 md:col-span-2 text-center py-12 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] text-[var(--color-text-muted)] font-medium text-xs">
                      No matching menu items found.
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-[var(--color-text-muted)]">Menu Categories</h3>
                    <p className="text-xs text-[var(--color-text-muted)] mt-0.5">Manage master categories used to classify and group different catering dishes.</p>
                  </div>
                  <button
                    onClick={() => {
                      resetCategoryForm()
                      setIsCategoryModalOpen(true)
                    }}
                    className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold uppercase tracking-wider transition-all hover:brightness-110 active:scale-[0.97]"
                    style={{ background: 'var(--color-accent)', color: 'var(--color-text-inverse)' }}
                  >
                    <Plus className="h-4 w-4" /> Add Category
                  </button>
                </div>

                {/* Categories Grid Table */}
                <div className="overflow-x-auto rounded-xl border border-[var(--color-border)] bg-white shadow-xs">
                  <table className="w-full min-w-[500px]">
                    <thead className="bg-[var(--color-bg-sunken)]">
                      <tr>
                        <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">Icon</th>
                        <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">Category Name</th>
                        <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">Slug</th>
                        <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">Dishes Assigned</th>
                        <th className="px-4 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm text-[var(--color-text-secondary)]">
                      {categories.map((cat) => {
                        const count = menuItems.filter(m => m.category === cat.slug).length
                        return (
                          <tr key={cat._id} className="border-t border-[var(--color-border)] hover:bg-[var(--color-bg-sunken)] transition-colors">
                            <td className="px-4 py-3 text-2xl">{cat.icon}</td>
                            <td className="px-4 py-3 font-bold text-[var(--color-text-primary)]">{cat.name}</td>
                            <td className="px-4 py-3 font-mono text-xs text-[var(--color-text-muted)]">{cat.slug}</td>
                            <td className="px-4 py-3 font-bold">
                              <span className="px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[var(--color-bg-sunken)] text-[var(--color-accent)] border border-[var(--color-border)]">
                                {count} Dishes
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex justify-end gap-1.5">
                                <button
                                  onClick={() => handleEditCategoryClick(cat)}
                                  className="p-1.5 rounded hover:bg-[var(--color-bg-sunken)] text-[var(--color-text-secondary)] transition-colors"
                                >
                                  <Edit2 className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteCategoryClick(cat._id, cat.name, cat.slug)}
                                  className="p-1.5 rounded hover:bg-[var(--color-danger-soft)]/20 text-[var(--color-danger)] transition-colors"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {/* Menu Item Add / Edit Modal */}
            <ResponsiveModal
              isOpen={isMenuModalOpen}
              onClose={() => setIsMenuModalOpen(false)}
              title={editingMenuItem ? 'Edit Wedding Dish' : 'Add New Wedding Dish'}
              description="Configure pricing, category, and representing icon for client quotations."
            >
              <form onSubmit={handleMenuSubmit} className="space-y-4">
                <div className="grid grid-cols-4 gap-4">
                  <div className="space-y-1.5 col-span-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">Icon</label>
                    <input
                      required
                      type="text"
                      maxLength={4}
                      value={menuFormIcon}
                      onChange={(e) => setMenuFormIcon(e.target.value)}
                      placeholder="🍛"
                      className="w-full rounded-lg border px-3 py-2 text-center text-lg focus:outline-none focus:border-[var(--color-accent)]"
                      style={{ background: 'var(--color-bg-sunken)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}
                    />
                  </div>

                  <div className="space-y-1.5 col-span-3">
                    <label className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">Dish Name</label>
                    <input
                      required
                      type="text"
                      value={menuFormName}
                      onChange={(e) => setMenuFormName(e.target.value)}
                      placeholder="e.g. Chicken Seekh Kabab"
                      className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-accent)]"
                      style={{ background: 'var(--color-bg-sunken)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">Category</label>
                    <select
                      value={menuFormCategory}
                      onChange={(e) => setMenuFormCategory(e.target.value)}
                      className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-accent)]"
                      style={{ background: 'var(--color-bg-sunken)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}
                    >
                      {categories.map((cat) => (
                        <option key={cat.slug} value={cat.slug}>
                          {cat.name} ({cat.icon})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">Base Price (Rs. / Head)</label>
                    <input
                      required
                      type="number"
                      value={menuFormPrice}
                      onChange={(e) => setMenuFormPrice(Number(e.target.value) || 0)}
                      placeholder="350"
                      className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-accent)] font-mono"
                      style={{ background: 'var(--color-bg-sunken)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-[var(--color-border)]">
                  <button
                    type="button"
                    onClick={() => setIsMenuModalOpen(false)}
                    className="px-4 py-2 text-sm font-semibold text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-border)] rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg px-6 py-2 text-sm font-bold uppercase tracking-wider transition-all hover:brightness-110 active:scale-[0.97]"
                    style={{ background: 'var(--color-accent)', color: 'var(--color-text-inverse)' }}
                  >
                    {editingMenuItem ? 'Save Changes' : 'Add to Menu'}
                  </button>
                </div>
              </form>
            </ResponsiveModal>

            {/* Category Add / Edit Modal */}
            <ResponsiveModal
              isOpen={isCategoryModalOpen}
              onClose={() => setIsCategoryModalOpen(false)}
              title={editingCategory ? 'Edit Menu Category' : 'Create Menu Category'}
              description="Configure grouping labels and representing icons for wedding dishes."
            >
              <form onSubmit={handleCategorySubmit} className="space-y-4">
                <div className="grid grid-cols-4 gap-4">
                  <div className="space-y-1.5 col-span-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">Icon</label>
                    <input
                      required
                      type="text"
                      maxLength={4}
                      value={categoryFormIcon}
                      onChange={(e) => setCategoryFormIcon(e.target.value)}
                      placeholder="📁"
                      className="w-full rounded-lg border px-3 py-2 text-center text-lg focus:outline-none focus:border-[var(--color-accent)]"
                      style={{ background: 'var(--color-bg-sunken)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}
                    />
                  </div>

                  <div className="space-y-1.5 col-span-3">
                    <label className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">Category Name</label>
                    <input
                      required
                      type="text"
                      value={categoryFormName}
                      onChange={(e) => setCategoryFormName(e.target.value)}
                      placeholder="e.g. Seafood Delight"
                      className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-accent)]"
                      style={{ background: 'var(--color-bg-sunken)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">Slug Label (Optional)</label>
                  <input
                    type="text"
                    value={categoryFormSlug}
                    onChange={(e) => setCategoryFormSlug(e.target.value)}
                    placeholder="e.g. seafood-delight (Auto-generated if empty)"
                    className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-accent)] font-mono"
                    style={{ background: 'var(--color-bg-sunken)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-[var(--color-border)]">
                  <button
                    type="button"
                    onClick={() => setIsCategoryModalOpen(false)}
                    className="px-4 py-2 text-sm font-semibold text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-border)] rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg px-6 py-2 text-sm font-bold uppercase tracking-wider transition-all hover:brightness-110 active:scale-[0.97]"
                    style={{ background: 'var(--color-accent)', color: 'var(--color-text-inverse)' }}
                  >
                    {editingCategory ? 'Save Changes' : 'Create Category'}
                  </button>
                </div>
              </form>
            </ResponsiveModal>
          </div>
        )}


        {/* TAB 5: Subscription */}
        {activeTab === 5 && (
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
