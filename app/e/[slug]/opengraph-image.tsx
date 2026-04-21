import { ImageResponse } from 'next/og'
import { createClient } from '@/lib/supabase/server'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OGImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: event } = await supabase
    .from('events')
    .select('title, description, event_date, location')
    .eq('slug', slug)
    .eq('is_public', true)
    .single()

  const title = event?.title ?? 'Ówàmbẹ̀'
  const date = event?.event_date
    ? new Date(event.event_date).toLocaleDateString('en-US', { dateStyle: 'long' })
    : null

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%', height: '100%',
          display: 'flex', flexDirection: 'column',
          alignItems: 'flex-start', justifyContent: 'flex-end',
          padding: '60px 72px',
          background: '#080808',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ position: 'absolute', top: 48, left: 72, display: 'flex', color: '#e8a44a', fontSize: 22, fontWeight: 700 }}>
          Ówàmbẹ̀
        </div>
        <div style={{ color: '#e8a44a', fontSize: 14, marginBottom: 16, textTransform: 'uppercase', letterSpacing: 4 }}>
          You&apos;re invited
        </div>
        <div style={{ color: '#f5f5f5', fontSize: 64, fontWeight: 800, lineHeight: 1.1, maxWidth: 900 }}>
          {title}
        </div>
        {date && (
          <div style={{ color: 'rgba(245,245,245,0.5)', fontSize: 24, marginTop: 20 }}>{date}</div>
        )}
        {event?.location && (
          <div style={{ color: 'rgba(245,245,245,0.4)', fontSize: 20, marginTop: 8 }}>{event.location}</div>
        )}
      </div>
    ),
    size
  )
}
