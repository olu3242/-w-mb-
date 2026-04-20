'use client'

import { useEffect } from 'react'
import { cn } from '@/lib/utils'

type ModalProps = {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  className?: string
}

export function Modal({ open, onClose, title, children, className }: ModalProps) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose() }
    if (open) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className={cn('relative w-full max-w-md rounded-2xl border border-white/10 bg-[#111] p-6 shadow-2xl', className)}>
        {title && <h2 className="mb-4 font-display text-lg font-semibold">{title}</h2>}
        {children}
      </div>
    </div>
  )
}
