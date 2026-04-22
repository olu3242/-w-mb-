import Stripe from 'stripe'
import { loadStripe } from '@stripe/stripe-js'

let _stripe: Stripe | null = null
export function getStripeServer(): Stripe {
  if (!_stripe) _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-02-24.acacia' })
  return _stripe
}

export const getStripe = () => loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
