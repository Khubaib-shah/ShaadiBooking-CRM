'use client'

import { type ReactNode, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

interface ResponsiveModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description?: string
  children: ReactNode
  size?: 'lg' | 'xl' | '2xl'
}

export default function ResponsiveModal({ isOpen, onClose, title, description, children, size = 'lg' }: ResponsiveModalProps) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Lock scroll on open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black backdrop-blur-xs"
          />

          {/* Modal Container */}
          {isMobile ? (
            /* Bottom Sheet for Mobile Screens */
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative z-10 w-full rounded-t-2xl bg-white p-5 pb-8 shadow-2xl focus:outline-none"
              style={{
                background: 'var(--color-bg-elevated)',
                maxHeight: '90vh',
                overflowY: 'auto',
              }}
            >
              {/* Drag handle line indicator */}
              <div className="mx-auto mb-4 h-1 w-12 rounded-full bg-[var(--color-border)]" />

              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}>{title}</h3>
                  {description && <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>{description}</p>}
                </div>
                <button onClick={onClose} className="rounded-full p-1.5 hover:bg-[var(--color-bg-sunken)] transition-colors">
                  <X className="h-4 w-4" style={{ color: 'var(--color-text-secondary)' }} />
                </button>
              </div>

              <div className="text-sm text-[var(--color-text-secondary)]">{children}</div>
            </motion.div>
          ) : (
            /* Centered Dialog for Desktop/Large Screens */
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className={`relative z-10 w-full rounded-xl border p-6 shadow-2xl focus:outline-none ${
                size === '2xl' ? 'max-w-2xl' : size === 'xl' ? 'max-w-xl' : 'max-w-lg'
              }`}
              style={{
                background: 'var(--color-bg-elevated)',
                borderColor: 'var(--color-border)',
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}>{title}</h3>
                  {description && <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>{description}</p>}
                </div>
                <button onClick={onClose} className="rounded-full p-1.5 hover:bg-[var(--color-bg-sunken)] transition-colors">
                  <X className="h-4 w-4" style={{ color: 'var(--color-text-secondary)' }} />
                </button>
              </div>

              <div className="text-sm text-[var(--color-text-secondary)]">{children}</div>
            </motion.div>
          )}
        </div>
      )}
    </AnimatePresence>
  )
}
