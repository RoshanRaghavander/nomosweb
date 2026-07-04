import { useEffect, useMemo, useState } from 'react'

import { getCheckoutRedirects, supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store/useAuthStore'

interface BillingData {
  currentPlan: 'free' | 'pro'
  statusLabel: string
  usageThisMonth: number
  paymentSummary: string
  invoiceSummary: string
  nextStep: string
}

function buildFallbackData(plan: 'free' | 'pro' = 'free'): BillingData {
  return {
    currentPlan: plan,
    statusLabel: plan === 'pro' ? 'Active' : 'Starter',
    usageThisMonth: 0,
    paymentSummary: plan === 'pro' ? 'Stored in Stripe' : 'No payment method stored yet',
    invoiceSummary: 'Invoices will populate after Stripe web billing is deployed.',
    nextStep: plan === 'pro' ? 'Review billing events in Supabase and Stripe.' : 'Upgrade after the checkout edge function is deployed.',
  }
}

export function useBillingData() {
  const session = useAuthStore((state) => state.session)
  const profile = useAuthStore((state) => state.profile)
  const [data, setData] = useState<BillingData>(buildFallbackData(profile?.plan ?? 'free'))
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [checkoutPending, setCheckoutPending] = useState(false)

  useEffect(() => {
    if (!session || !supabase) {
      setData(buildFallbackData(profile?.plan ?? 'free'))
      setLoading(false)
      return
    }

    const load = async () => {
      setLoading(true)
      setError(null)

      const monthStart = new Date()
      monthStart.setUTCDate(1)
      monthStart.setUTCHours(0, 0, 0, 0)

      const usageResult = await supabase
        .from('usage_events')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', session.user.id)
        .gte('created_at', monthStart.toISOString())

      if (usageResult.error) {
        setError('Billing metrics are waiting on the Supabase read migration.')
        setData(buildFallbackData(profile?.plan ?? 'free'))
        setLoading(false)
        return
      }

      const currentPlan = profile?.plan ?? 'free'

      setData({
        currentPlan,
        statusLabel: currentPlan === 'pro' ? 'Active' : 'Starter',
        usageThisMonth: usageResult.count ?? 0,
        paymentSummary: profile?.stripeCustomerId ? 'Stored in Stripe and linked to this account.' : 'No Stripe customer is linked yet.',
        invoiceSummary: profile?.stripeSubscriptionId
          ? 'Stripe subscription detected. Surface invoice history after webhook expansion.'
          : 'Invoices will appear after the first successful checkout.',
        nextStep:
          currentPlan === 'pro'
            ? 'Keep webhook events deployed so plan changes stay synchronized.'
            : 'Use checkout to upgrade, then Stripe webhooks can promote the account to Pro.',
      })

      setLoading(false)
    }

    void load()
  }, [profile?.plan, profile?.stripeCustomerId, profile?.stripeSubscriptionId, session])

  const checkoutEnabled = useMemo(
    () => Boolean(session && supabase && profile?.plan !== 'pro'),
    [profile?.plan, session],
  )

  const startCheckout = async () => {
    if (!supabase || !session || profile?.plan === 'pro') {
      return
    }

    setCheckoutPending(true)
    setError(null)

    const { data: checkoutData, error: checkoutError } = await supabase.functions.invoke('create-checkout-session', {
      body: getCheckoutRedirects(),
    })

    setCheckoutPending(false)

    if (checkoutError) {
      setError(checkoutError.message)
      return
    }

    if (!checkoutData?.url) {
      setError('Checkout session returned without a URL.')
      return
    }

    window.location.assign(checkoutData.url)
  }

  return {
    checkoutEnabled,
    checkoutPending,
    data,
    error,
    loading,
    startCheckout,
  }
}
