'use client'

import { use, useState, useMemo } from 'react'
import Link from 'next/link'
import { ArrowLeft, Landmark, CreditCard, Clipboard, FileText, Printer, CheckCircle, HelpCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import PageHeader from '@/components/shared/PageHeader'
import PageWrapper from '@/components/shared/PageWrapper'
import CurrencyDisplay from '@/components/shared/CurrencyDisplay'
import { formatDate } from '@/lib/utils/dates'

const TABS = [
  { id: 'services', label: 'Services Ledger', icon: Clipboard },
  { id: 'financials', label: 'Financial Summary', icon: CreditCard },
  { id: 'invoice', label: 'Client Invoice', icon: FileText },
]

const JOBS_DATA: Record<string, any> = {
  'os-1': {
    id: 'os-1', client: 'Pearl Continental Hotel', event: 'Corporate Dinner Banquet', date: '2025-12-15',
    venue: 'PC Hotel, Club Road, Karachi', status: 'Completed',
    workersDeployed: 12, supervisor: 'Sajid Mehmood',
    equipment: [
      { name: 'Standing AC (2 Ton)', qty: 5, unitCost: 4000, totalCost: 20000 },
      { name: '100KVA Diesel Generator', qty: 1, unitCost: 15000, totalCost: 15000 },
      { name: 'VIP Banquet Round Tables', qty: 20, unitCost: 500, totalCost: 10000 },
    ],
    labor: [
      { role: 'AC Technician', qty: 2, wage: 2000, totalWage: 4000 },
      { role: 'Generators Helper', qty: 1, wage: 1500, totalWage: 1500 },
      { role: 'Waiters Crew', qty: 9, wage: 1000, totalWage: 9000 },
    ],
    financials: {
      revenue: 185000,
      equipCost: 45000,
      laborCost: 14500,
      transport: 12500,
      taxRate: 13, // Sindh Sales Tax on services
    }
  },
  'os-2': {
    id: 'os-2', client: 'Emaar Beach Front', event: 'Beach Wedding Lawn Setup', date: '2025-12-18',
    venue: 'Emaar Beach Front Lawn, Phase 8 DHA, Karachi', status: 'In Progress',
    workersDeployed: 8, supervisor: 'Kamran Ali',
    equipment: [
      { name: 'Premium Canopy Marquee', qty: 2, unitCost: 20000, totalCost: 40000 },
      { name: 'Soft Uplighter Bulbs', qty: 40, unitCost: 100, totalCost: 4000 },
      { name: 'Sound System Subwoofers', qty: 4, unitCost: 3500, totalCost: 14000 },
    ],
    labor: [
      { role: 'Tent Assemblers', qty: 4, wage: 1800, totalWage: 7200 },
      { role: 'Electricians Team', qty: 2, wage: 2000, totalWage: 4000 },
      { role: 'Sound Engineer', qty: 2, wage: 2500, totalWage: 5000 },
    ],
    financials: {
      revenue: 245000,
      equipCost: 58000,
      laborCost: 16200,
      transport: 15000,
      taxRate: 13,
    }
  }
}

export default function OutsourcingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [activeTab, setActiveTab] = useState('services')

  const job = useMemo(() => {
    return JOBS_DATA[id] || JOBS_DATA['os-1']
  }, [id])

  const totals = useMemo(() => {
    const directCost = job.financials.equipCost + job.financials.laborCost + job.financials.transport
    const netProfit = job.financials.revenue - directCost
    const margin = Math.round((netProfit / job.financials.revenue) * 100)
    
    // Invoice GST calculation
    const gst = Math.round((job.financials.revenue * job.financials.taxRate) / 100)
    const invoiceTotal = job.financials.revenue + gst

    return { directCost, netProfit, margin, gst, invoiceTotal }
  }, [job])

  const printInvoice = () => {
    window.print()
    toast.success('Invoice sent to printing system!')
  }

  return (
    <PageWrapper>
      {/* Printable Area Wrapper */}
      <div className="print:hidden">
        <Link href="/outsourcing" className="inline-flex items-center gap-1.5 text-xs font-semibold mb-4 text-[var(--color-text-secondary)] hover:text-[#556ee6] transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Outsourcing
        </Link>

        <PageHeader 
          title={job.client} 
          description={`Subcontract Details: ${job.id.toUpperCase()} · ${job.event}`} 
        />

        {/* Tab Selection */}
        <div className="flex gap-1 border-b border-[var(--color-border)] mb-6 overflow-x-auto">
          {TABS.map((tab) => {
            const IconComp = tab.icon
            const isSelected = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-2 px-4 py-3 text-xs font-semibold relative transition-all whitespace-nowrap"
                style={{ color: isSelected ? 'var(--color-accent)' : 'var(--color-text-secondary)' }}
              >
                <IconComp className="h-4 w-4" />
                {tab.label}
                {isSelected && (
                  <motion.span 
                    layoutId="outsourcingTabUnderline" 
                    className="absolute bottom-0 left-0 right-0 h-[2.5px] rounded-full bg-[var(--color-accent)]" 
                  />
                )}
              </button>
            )
          })}
        </div>

        {/* Tab contents */}
        <div className="min-h-[350px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
            >
              
              {/* TAB 1: SERVICES LEDGER */}
              {activeTab === 'services' && (
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Equipment deployed card */}
                  <div className="rounded-xl border border-[var(--color-border)] bg-white p-5 shadow-sm space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-wider text-[var(--color-text-muted)] border-b pb-2">Operational Equipment Deployed</h3>
                    <div className="space-y-3">
                      {job.equipment.map((eq: any, idx: number) => (
                        <div key={idx} className="flex justify-between items-center text-xs border-b pb-2 last:border-0 border-[var(--color-border)]">
                          <div>
                            <p className="font-bold text-[var(--color-text-primary)]">{eq.name}</p>
                            <p className="text-[10px] text-[var(--color-text-muted)] mt-0.5">Quantity: {eq.qty} units @ <CurrencyDisplay value={eq.unitCost} compact /> / unit</p>
                          </div>
                          <span className="font-mono font-bold text-[var(--color-text-primary)]"><CurrencyDisplay value={eq.totalCost} /></span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Labor and crew card */}
                  <div className="rounded-xl border border-[var(--color-border)] bg-white p-5 shadow-sm space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-wider text-[var(--color-text-muted)] border-b pb-2">Outsourced Labor & Crew</h3>
                    <div className="space-y-3">
                      {job.labor.map((lb: any, idx: number) => (
                        <div key={idx} className="flex justify-between items-center text-xs border-b pb-2 last:border-0 border-[var(--color-border)]">
                          <div>
                            <p className="font-bold text-[var(--color-text-primary)]">{lb.role}</p>
                            <p className="text-[10px] text-[var(--color-text-muted)] mt-0.5">{lb.qty} workers @ <CurrencyDisplay value={lb.wage} compact /> / worker</p>
                          </div>
                          <span className="font-mono font-bold text-[var(--color-text-primary)]"><CurrencyDisplay value={lb.totalWage} /></span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: FINANCIAL SUMMARY */}
              {activeTab === 'financials' && (
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="md:col-span-2 rounded-xl border border-[var(--color-border)] bg-white p-6 shadow-sm space-y-5">
                    <h3 className="text-xs font-black uppercase tracking-wider text-[var(--color-text-muted)] border-b pb-2">Contractual Financial Summary</h3>
                    
                    <div className="grid gap-4 sm:grid-cols-2 text-sm">
                      <div>
                        <p className="text-xs font-semibold text-[var(--color-text-muted)]">Subcontract Job Revenue</p>
                        <p className="font-bold text-2xl text-[var(--color-text-primary)] font-mono mt-1"><CurrencyDisplay value={job.financials.revenue} /></p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-[var(--color-text-muted)]">Total Direct Hire Costs</p>
                        <p className="font-bold text-2xl text-[var(--color-text-primary)] font-mono mt-1"><CurrencyDisplay value={totals.directCost} /></p>
                      </div>
                    </div>

                    <div className="border-t pt-4 border-[var(--color-border)] text-xs space-y-2">
                      <div className="flex justify-between text-[var(--color-text-secondary)]">
                        <span>Equipment Rental Costs</span>
                        <span className="font-mono font-bold"><CurrencyDisplay value={job.financials.equipCost} /></span>
                      </div>
                      <div className="flex justify-between text-[var(--color-text-secondary)]">
                        <span>Labor & Wages Cost</span>
                        <span className="font-mono font-bold"><CurrencyDisplay value={job.financials.laborCost} /></span>
                      </div>
                      <div className="flex justify-between text-[var(--color-text-secondary)]">
                        <span>Transport & Fuel Charges</span>
                        <span className="font-mono font-bold"><CurrencyDisplay value={job.financials.transport} /></span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-[var(--color-border)] bg-white p-6 shadow-sm space-y-5">
                    <h3 className="text-xs font-black uppercase tracking-wider text-[var(--color-text-muted)] border-b pb-2">Business Margins</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs font-semibold text-[var(--color-text-muted)]">Net Job Profit</p>
                        <p className="font-black text-2xl text-[#34c38f] font-mono mt-1"><CurrencyDisplay value={totals.netProfit} /></p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-[var(--color-text-muted)]">P&L Profit Margin</p>
                        <p className="font-black text-2xl text-[#34c38f] font-mono mt-1">{totals.margin}%</p>
                      </div>
                      <div className="h-2 rounded-full bg-[var(--color-bg-sunken)]">
                        <div className="h-2 rounded-full bg-[#34c38f]" style={{ width: `${totals.margin}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: CLIENT INVOICE */}
              {activeTab === 'invoice' && (
                <div className="space-y-4 max-w-2xl mx-auto">
                  <div className="rounded-xl border border-[var(--color-border)] bg-white p-6 shadow-sm flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-[var(--color-text-primary)]">Ready to generate customer receipt?</p>
                      <p className="text-xs text-[var(--color-text-muted)] mt-0.5">Click below to open print guidelines containing SST taxes.</p>
                    </div>
                    <button 
                      onClick={printInvoice}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-[#556ee6] px-4 py-2 text-xs font-semibold text-white hover:brightness-110 transition-all"
                    >
                      <Printer className="h-4 w-4" /> Print Invoice
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* INVOICE HIGH-FIDELITY PRINTABLE SHEET */}
      <div id="invoice-sheet-print" className="hidden print:block p-8 bg-white text-slate-800 max-w-3xl mx-auto">
        <div className="flex justify-between items-start border-b-2 pb-6 border-slate-200">
          <div>
            <h2 className="text-xl font-black tracking-wide text-slate-800">SHAADIBOOK CRM LTD</h2>
            <p className="text-xs font-bold text-slate-500 mt-1">SST Registered: 1234567-8</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Off Club Road, North Karachi, Pakistan</p>
          </div>
          <div className="text-right">
            <h1 className="text-lg font-black text-slate-700 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded">TAX INVOICE</h1>
            <p className="text-xs font-mono text-slate-500 mt-2">Invoice Ref: SB-INV-2025-001</p>
            <p className="text-xs font-mono text-slate-500 mt-0.5">Date Issued: {formatDate(job.date)}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 my-6 text-xs">
          <div>
            <p className="text-[10px] font-bold uppercase text-slate-400">Billed Customer</p>
            <p className="font-bold text-slate-800 mt-1">{job.client}</p>
            <p className="text-slate-600 font-medium mt-0.5">Venue: {job.venue}</p>
            <p className="text-slate-500 mt-0.5">Subcontract: {job.event}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold uppercase text-slate-400">Operational Supervisor</p>
            <p className="font-bold text-slate-800 mt-1">{job.supervisor}</p>
            <p className="text-slate-500 mt-0.5">Deployed Workers: {job.workersDeployed} pax</p>
          </div>
        </div>

        {/* Invoice lines table */}
        <table className="w-full text-xs my-6 border-t border-b border-slate-200">
          <thead>
            <tr className="border-b border-slate-200 text-[10px] font-bold uppercase text-slate-400">
              <th className="py-3 text-left">Service Line Description</th>
              <th className="py-3 text-right">Quantity</th>
              <th className="py-3 text-right">Unit Rate</th>
              <th className="py-3 text-right">Line Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {job.equipment.map((eq: any, idx: number) => (
              <tr key={idx} className="border-b border-slate-100 last:border-0">
                <td className="py-3 font-semibold text-slate-800">{eq.name} (Rentals)</td>
                <td className="py-3 text-right font-mono">{eq.qty}</td>
                <td className="py-3 text-right font-mono"><CurrencyDisplay value={eq.unitCost} /></td>
                <td className="py-3 text-right font-mono font-semibold text-slate-800"><CurrencyDisplay value={eq.totalCost} /></td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals side section */}
        <div className="w-64 ml-auto text-xs space-y-2 border-b-2 pb-4 border-slate-200">
          <div className="flex justify-between text-slate-600 font-medium">
            <span>Services Subtotal</span>
            <span className="font-mono text-slate-800"><CurrencyDisplay value={job.financials.revenue} /></span>
          </div>
          <div className="flex justify-between text-slate-600 font-medium">
            <span>Sindh Sales Tax ({job.financials.taxRate}%)</span>
            <span className="font-mono text-slate-800"><CurrencyDisplay value={totals.gst} /></span>
          </div>
          <div className="flex justify-between border-t pt-2 font-bold text-sm text-slate-800">
            <span>Invoice Total Due</span>
            <span className="font-mono text-slate-900"><CurrencyDisplay value={totals.invoiceTotal} /></span>
          </div>
        </div>

        <div className="flex justify-between items-center text-[10px] text-slate-400 mt-10 pt-4 border-t border-dashed">
          <span>This is a computer-generated tax ledger receipt. No signatures required.</span>
          <span>Approved Representative: _________________</span>
        </div>
      </div>
    </PageWrapper>
  )
}
