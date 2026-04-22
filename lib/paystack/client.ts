import { createHmac } from 'crypto'

const BASE = 'https://api.paystack.co'

export const PAYSTACK_CHANNELS = ['card', 'bank', 'ussd', 'mobile_money', 'bank_transfer'] as const

function headers() {
  return {
    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
    'Content-Type': 'application/json',
  }
}

export async function initializeTransaction(payload: {
  email: string
  amount: number
  reference: string
  callback_url?: string
  channels?: string[]
  metadata?: Record<string, unknown>
}) {
  const res = await fetch(`${BASE}/transaction/initialize`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ ...payload, channels: payload.channels ?? PAYSTACK_CHANNELS }),
  })
  return res.json() as Promise<{
    status: boolean
    message: string
    data: { authorization_url: string; access_code: string; reference: string }
  }>
}

export async function verifyTransaction(reference: string): Promise<{
  success: boolean
  amountNgn: number
  currency: string
}> {
  const res = await fetch(`${BASE}/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: headers(),
    next: { revalidate: 0 },
  })
  const json = await res.json() as {
    status: boolean
    data: { status: string; amount: number; currency: string }
  }
  return {
    success: json.status && json.data?.status === 'success',
    amountNgn: (json.data?.amount ?? 0) / 100,
    currency: json.data?.currency ?? 'NGN',
  }
}

export function verifyPaystackSignature(rawBody: string, signature: string): boolean {
  const hash = createHmac('sha512', process.env.PAYSTACK_SECRET_KEY!)
    .update(rawBody)
    .digest('hex')
  return hash === signature
}
