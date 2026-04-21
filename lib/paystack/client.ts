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

export function verifyPaystackSignature(rawBody: string, signature: string): boolean {
  const hash = createHmac('sha512', process.env.PAYSTACK_SECRET_KEY!)
    .update(rawBody)
    .digest('hex')
  return hash === signature
}
