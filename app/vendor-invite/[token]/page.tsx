import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { AcceptInviteForm } from '@/components/vendor-invite/accept-form'

export default async function VendorInvitePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const admin = createAdminClient()

  const { data: invite } = await admin
    .from('vendor_invites')
    .select('id, email, name, status, expires_at, event_id')
    .eq('token', token)
    .single()

  if (!invite) notFound()

  const expired = invite.expires_at && new Date(invite.expires_at) < new Date()

  const { data: event } = await admin
    .from('events')
    .select('title, event_date, location')
    .eq('id', invite.event_id)
    .single()

  return (
    <div className="min-h-screen bg-void flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <p className="font-display text-2xl font-bold text-pulse">Ówàmbẹ̀</p>
          <p className="mt-1 text-sm text-foreground/40">Vendor Invitation</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 flex flex-col gap-6">
          <div>
            <h1 className="font-display text-xl font-bold">{event?.title ?? 'Event Invitation'}</h1>
            {event?.event_date && (
              <p className="mt-1 text-sm text-foreground/50">
                {new Date(event.event_date).toLocaleDateString('en-NG', { dateStyle: 'full' })}
              </p>
            )}
            {event?.location && <p className="text-sm text-foreground/40">{event.location}</p>}
          </div>

          {invite.status === 'accepted' && (
            <div className="rounded-lg border border-sage/30 bg-sage/5 p-4 text-center">
              <p className="text-sm font-medium text-sage">You have already accepted this invite.</p>
            </div>
          )}

          {invite.status === 'declined' && (
            <div className="rounded-lg border border-white/10 p-4 text-center">
              <p className="text-sm text-foreground/50">This invite has been declined.</p>
            </div>
          )}

          {expired && invite.status === 'pending' && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-4 text-center">
              <p className="text-sm text-red-400">This invitation has expired. Contact the event host for a new link.</p>
            </div>
          )}

          {invite.status === 'pending' && !expired && (
            <AcceptInviteForm
              invite={{
                id: invite.id,
                email: invite.email,
                name: invite.name,
                event_title: event?.title ?? '',
                event_date: event?.event_date,
              }}
              token={token}
            />
          )}
        </div>
      </div>
    </div>
  )
}
