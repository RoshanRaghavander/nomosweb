import { useEffect, useState } from 'react'

import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store/useAuthStore'
import { formatCapability, formatPlanLabel } from '@/utils/format'

interface DashboardMetric {
  label: string
  value: string
  detail: string
}

interface ActivityItem {
  id: string
  title: string
  detail: string
  timestamp: string
}

interface DashboardData {
  metrics: DashboardMetric[]
  activity: ActivityItem[]
  isFallback: boolean
}

function buildFallbackData(plan: 'free' | 'plus' | 'pro' | 'pro_max' = 'free'): DashboardData {
  return {
    metrics: [
      { label: 'Current plan', value: formatPlanLabel(plan), detail: 'Synced from your profile row when available.' },
      { label: 'Monthly runs', value: '0', detail: 'Usage data will appear after your first live requests.' },
      { label: 'Seven day activity', value: '0', detail: 'Recent activity is empty for this account.' },
      { label: 'Active workspace', value: '1', detail: 'The starter app assumes one primary workspace.' },
    ],
    activity: [
      {
        id: 'empty-state',
        title: 'No activity yet',
        detail: 'Once the desktop app or web surfaces write usage events, they will appear here.',
        timestamp: new Date().toISOString(),
      },
    ],
    isFallback: true,
  }
}

export function useDashboardData() {
  const session = useAuthStore((state) => state.session)
  const profile = useAuthStore((state) => state.profile)
  const [data, setData] = useState<DashboardData>(buildFallbackData(profile?.plan ?? 'free'))
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

      const weekStart = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

      const [recentResult, monthlyResult, weeklyResult] = await Promise.all([
        supabase
          .from('usage_events')
          .select('id, capability, created_at')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })
          .limit(6),
        supabase
          .from('usage_events')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', session.user.id)
          .gte('created_at', monthStart.toISOString()),
        supabase
          .from('usage_events')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', session.user.id)
          .gte('created_at', weekStart),
      ])

      if (recentResult.error || monthlyResult.error || weeklyResult.error) {
        setError('Live usage data is not reachable yet. Check your Supabase grants and migration state.')
        setData(buildFallbackData(profile?.plan ?? 'free'))
        setLoading(false)
        return
      }

      const recentEvents = recentResult.data ?? []
      const uniqueCapabilities = new Set(recentEvents.map((event) => event.capability))

      setData({
        metrics: [
          {
            label: 'Current plan',
            value: formatPlanLabel(profile?.plan ?? 'free'),
            detail: profile?.stripeCustomerId ? 'Billing is linked to a Stripe customer record.' : 'No billing record linked yet.',
          },
          {
            label: 'Monthly runs',
            value: String(monthlyResult.count ?? 0),
            detail: 'Counted from usage events stored in Supabase.',
          },
          {
            label: 'Seven day activity',
            value: String(weeklyResult.count ?? 0),
            detail: `${uniqueCapabilities.size || 1} capability stream active recently.`,
          },
          {
            label: 'Active workspace',
            value: '1',
            detail: `Member since ${profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'this month'}.`,
          },
        ],
        activity:
          recentEvents.length > 0
            ? recentEvents.map((event) => ({
                id: String(event.id),
                title: formatCapability(event.capability),
                detail: `${formatCapability(event.capability)} recorded for your Nomos account.`,
                timestamp: event.created_at,
              }))
            : buildFallbackData(profile?.plan ?? 'free').activity,
        isFallback: false,
      })

      setLoading(false)
    }

    void load()
  }, [profile?.createdAt, profile?.plan, profile?.stripeCustomerId, session])

  return { data, loading, error }
}
