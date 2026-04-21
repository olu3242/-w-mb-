'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { generateSlug } from '@/lib/utils'
import { EventSchema } from '@/lib/validations'

type Step1 = { title: string; description: string; event_date: string; location: string }
type Step2 = { is_public: boolean; signals: Record<string, boolean> }

const SIGNALS = [
  { key: 'has_contributions', label: 'Gift registry & contributions' },
  { key: 'has_venue', label: 'Venue tools' },
  { key: 'has_vendors', label: 'Vendor hub' },
  { key: 'has_tasks', label: 'Task board' },
  { key: 'has_timeline', label: 'Execution timeline' },
  { key: 'has_budget_profile', label: 'Budget engine' },
]

export default function NewEventPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [step1, setStep1] = useState<Step1>({ title: '', description: '', event_date: '', location: '' })
  const [step2, setStep2] = useState<Step2>({
    is_public: true,
    signals: { alice_calibrated: false, alice_budget_generated: false },
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleStep1(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setStep1(p => ({ ...p, [e.target.name]: e.target.value }))
  }

  function toggleSignal(key: string) {
    setStep2(p => ({ ...p, signals: { ...p.signals, [key]: !p.signals[key] } }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const parsed = EventSchema.parse({
        ...step1,
        event_date: step1.event_date ? new Date(step1.event_date).toISOString() : undefined,
        is_public: step2.is_public,
      })
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      const slug = generateSlug(parsed.title)
      const { data, error: err } = await supabase
        .from('events')
        .insert({
          ...parsed,
          slug,
          owner_id: user!.id,
          signals: step2.signals,
        })
        .select('slug')
        .single()
      if (err) throw new Error(err.message)
      router.push(`/events/${data.slug}`)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-lg">
      <div className="mb-8 flex items-center gap-3">
        <div className={`h-2 flex-1 rounded-full ${step >= 1 ? 'bg-pulse' : 'bg-white/10'}`} />
        <div className={`h-2 flex-1 rounded-full ${step >= 2 ? 'bg-pulse' : 'bg-white/10'}`} />
      </div>

      {step === 1 && (
        <div className="flex flex-col gap-6">
          <h1 className="font-display text-2xl font-bold">Event details</h1>
          <div className="flex flex-col gap-4">
            <input
              name="title"
              placeholder="Event name *"
              value={step1.title}
              onChange={handleStep1}
              required
              className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-pulse/60"
            />
            <textarea
              name="description"
              placeholder="Description (optional)"
              value={step1.description}
              onChange={handleStep1}
              rows={3}
              className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-pulse/60 resize-none"
            />
            <input
              name="event_date"
              type="datetime-local"
              value={step1.event_date}
              onChange={handleStep1}
              className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-pulse/60"
            />
            <input
              name="location"
              placeholder="Location (optional)"
              value={step1.location}
              onChange={handleStep1}
              className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-pulse/60"
            />
          </div>
          <button
            onClick={() => step1.title.trim() && setStep(2)}
            className="rounded-lg bg-pulse py-3 font-semibold text-void hover:bg-pulse/90 transition-colors disabled:opacity-50"
            disabled={!step1.title.trim()}
          >
            Continue
          </button>
        </div>
      )}

      {step === 2 && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <h1 className="font-display text-2xl font-bold">Features & visibility</h1>
          <div>
            <p className="mb-3 text-sm text-foreground/60">Enable features</p>
            <div className="flex flex-col gap-2">
              {SIGNALS.map(({ key, label }) => (
                <label key={key} className="flex cursor-pointer items-center gap-3 rounded-lg border border-white/5 p-3 hover:border-white/10 transition-colors">
                  <input
                    type="checkbox"
                    checked={!!step2.signals[key]}
                    onChange={() => toggleSignal(key)}
                    className="accent-pulse"
                  />
                  <span className="text-sm">{label}</span>
                </label>
              ))}
            </div>
          </div>
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={step2.is_public}
              onChange={e => setStep2(p => ({ ...p, is_public: e.target.checked }))}
              className="accent-pulse"
            />
            <span className="text-sm">Public guest page</span>
          </label>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex-1 rounded-lg border border-white/10 py-3 text-sm hover:border-white/20 transition-colors"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-lg bg-pulse py-3 font-semibold text-void hover:bg-pulse/90 transition-colors disabled:opacity-50"
            >
              {loading ? 'Creating…' : 'Create event'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
