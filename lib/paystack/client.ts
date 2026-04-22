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

export async function createTransferRecipient(params: {
  name: string
  accountNumber: string
  bankCode: string
}) {
  const res = await fetch(`${BASE}/transferrecipient`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({
      type: 'nuban',
      name: params.name,
      account_number: params.accountNumber,
      bank_code: params.bankCode,
      currency: 'NGN',
    }),
  })
  return res.json() as Promise<{
    status: boolean
    message: string
    data: { recipient_code: string; id: number }
  }>
}

export async function initiateTransfer(params: {
  amountNgn: number
  recipientCode: string
  reason?: string
  reference?: string
}) {
  const res = await fetch(`${BASE}/transfer`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({
      source: 'balance',
      amount: Math.round(params.amountNgn * 100),
      recipient: params.recipientCode,
      reason: params.reason ?? 'Vendor payment — Ówàmbẹ̀',
      reference: params.reference,
    }),
  })
  return res.json() as Promise<{
    status: boolean
    message: string
    data: { transfer_code: string; status: string; amount: number }
  }>
}

export async function verifyTransfer(transferCode: string) {
  const res = await fetch(`${BASE}/transfer/${transferCode}`, {
    headers: headers(),
    next: { revalidate: 0 },
  })
  return res.json() as Promise<{
    status: boolean
    data: { status: string; transfer_code: string; amount: number }
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
