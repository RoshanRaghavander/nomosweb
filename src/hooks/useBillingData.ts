import { useEffect, useMemo, useState } from 'react'

import { getCheckoutRedirects, type NomosPaidPlan, type NomosPlan, supabase } from '@/lib/supabase'
import { formatPlanLabel } from '@/utils/format'
import { useAuthStore } from '@/store/useAuthStore'

interface BillingData {
  currentPlan: NomosPlan
  statusLabel: string
  usageThisMonth: number
  starterRequestsUsed: number | null
  starterRequestsMax: number | null
  premiumAgentRunsThisMonth: number | null
  premiumAgentQuota: number | null
  paymentSummary: string
  invoiceSummary: string
  nextStep: string
}

const PREMIUM_AGENT_QUOTAS: Partial<Record<NomosPlan, number>> = {
  pro: 120,
  pro_max: 400,
}

function buildFallbackData(plan: NomosPlan = 'free'): BillingData {
  const premiumAgentQuota = PREMIUM_AGENT_QUOTAS[plan] ?? null

  return {
    currentPlan: plan,
    statusLabel: plan === 'free' ? 'Starter' : 'Active',
    usageThisMonth: 0,
    starterRequestsUsed: plan === 'free' ? 0 : null,
    starterRequestsMax: plan === 'free' ? 20 : null,
    premiumAgentRunsThisMonth: premiumAgentQuota ? 0 : null,
    premiumAgentQuota,
    paymentSummary: plan === 'free' ? 'No billing record is linked yet.' : 'Billing is linked to your paid Nomos subscription.',
    invoiceSummary: plan === 'free' ? 'Invoices appear after your first upgrade.' : 'Invoice history populates from your active subscription.',
    nextStep:
      plan === 'free'
        ? 'Use the first 20 starter requests, then upgrade to continue.'
        : plan === 'plus'
          ? 'Plus runs on the fast DeepSeek route with no Nomos-side request throttles.'
          : premiumAgentQuota
            ? `${premiumAgentQuota} premium agent runs are available each month before routing falls back automatically.`
            : 'Plan data is active.',
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

      const [usageResult, starterResult, premiumAgentResult] = await Promise.all([
        supabase
          .from('usage_events')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', session.user.id)
          .gte('created_at', monthStart.toISOString()),
        supabase
          .from('usage_events')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', session.user.id)
          .eq('billable_request', true),
        supabase
          .from('usage_events')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', session.user.id)
          .eq('is_premium_agent', true)
          .gte('created_at', monthStart.toISOString()),
      ])

      if (usageResult.error || starterResult.error || premiumAgentResult.error) {
        setError('Billing metrics are waiting on the Supabase read migration.')
        setData(buildFallbackData(profile?.plan ?? 'free'))
        setLoading(false)
        return
      }

      const currentPlan = profile?.plan ?? 'free'
      const premiumAgentQuota = PREMIUM_AGENT_QUOTAS[currentPlan] ?? null
      const starterRequestsUsed = currentPlan === 'free' ? (starterResult.count ?? 0) : null
      const starterRequestsMax = currentPlan === 'free' ? 20 : null
      const premiumAgentRunsThisMonth = premiumAgentQuota ? (premiumAgentResult.count ?? 0) : null

      setData({
        currentPlan,
        statusLabel: currentPlan === 'free' ? 'Starter' : 'Active',
        usageThisMonth: usageResult.count ?? 0,
        starterRequestsUsed,
        starterRequestsMax,
        premiumAgentRunsThisMonth,
        premiumAgentQuota,
        paymentSummary: profile?.stripeCustomerId ? 'Billing is linked to this account.' : currentPlan === 'free' ? 'No billing record is linked yet.' : 'No billing customer is linked yet.',
        invoiceSummary: profile?.stripeSubscriptionId
          ? `${formatPlanLabel(currentPlan)} subscription detected and syncing through the billing webhook.`
          : 'Invoices will appear after the first successful checkout.',
        nextStep:
          currentPlan === 'free'
            ? `Starter usage: ${starterRequestsUsed ?? 0}/${starterRequestsMax ?? 20} requests before the IDE paywall appears.`
            : currentPlan === 'plus'
              ? 'Plus stays on the fast DeepSeek path for autocomplete, chat, and agent execution.'
              : premiumAgentQuota
                ? `Premium agent runs this month: ${premiumAgentRunsThisMonth ?? 0}/${premiumAgentQuota}. After the quota, routing falls back automatically.`
                : 'Billing is active.',
      })

      setLoading(false)
    }

    void load()
  }, [profile?.plan, profile?.stripeCustomerId, profile?.stripeSubscriptionId, session])

  const checkoutEnabled = useMemo(() => Boolean(session && supabase), [session])

  const startCheckout = async (plan: NomosPaidPlan) => {
    if (!supabase || !session) {
      return
    }

    setCheckoutPending(true)
    setError(null)

    const { data: checkoutData, error: checkoutError } = await supabase.functions.invoke('create-checkout-session', {
      body: {
        ...getCheckoutRedirects(),
        plan,
      },
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
