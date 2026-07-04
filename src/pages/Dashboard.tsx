import { Activity, ArrowRight, Clock3, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'

import AppFrame from '@/components/AppFrame'
import MetricCard from '@/components/MetricCard'
import { useDashboardData } from '@/hooks/useDashboardData'
import { useAuthStore } from '@/store/useAuthStore'
import { formatPlanLabel, formatRelativeTime } from '@/utils/format'

export default function Dashboard() {
  const { data, error, loading } = useDashboardData()
  const profile = useAuthStore((state) => state.profile)
  const session = useAuthStore((state) => state.session)

  return (
    <AppFrame>
      <section
        className="rounded-[36px] border border-[#e7e7ea] p-8 shadow-[0_18px_40px_rgba(17,17,20,0.06)]"
        style={{
          background:
            'radial-gradient(100% 140% at 0% 0%, #eef6b8 0%, transparent 42%), radial-gradient(95% 110% at 100% 0%, #cfe9f5 0%, transparent 40%), linear-gradient(180deg, #ffffff 0%, #fbfcf7 100%)',
        }}
      >
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-[#8a8a92]">Dashboard</p>
            <h1 className="mt-4 font-display text-5xl text-[#111114]">Your Nomos account at a glance.</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#3c3c43]">
              {session?.user.email} is currently on the {formatPlanLabel(profile?.plan ?? 'free')} plan. This page reads
              usage activity from Supabase and leaves room for richer account analytics as the product expands.
            </p>
          </div>

          <Link
            className="inline-flex items-center gap-2 rounded-full bg-[#111114] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#26262b]"
            to="/billing"
          >
            Open billing
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <section className="mt-8 grid gap-5 lg:grid-cols-4">
        {data.metrics.map((metric) => (
          <MetricCard detail={metric.detail} key={metric.label} label={metric.label} value={metric.value} />
        ))}
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <article className="rounded-[32px] border border-[#e7e7ea] bg-white p-6 shadow-[0_16px_36px_rgba(17,17,20,0.05)]">
          <div className="flex items-center gap-3">
            <Activity className="text-[#3c3c43]" size={18} />
            <h2 className="font-display text-2xl text-[#111114]">Recent activity</h2>
          </div>

          <div className="mt-6 space-y-4">
            {data.activity.map((item) => (
              <div
                key={item.id}
                className="rounded-[24px] border border-[#e7e7ea] bg-[#fcfcfc] p-4 transition hover:bg-[#f6f6f7]"
              >
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <p className="text-base font-medium text-[#111114]">{item.title}</p>
                  <p className="text-xs uppercase tracking-[0.18em] text-[#8a8a92]">{formatRelativeTime(item.timestamp)}</p>
                </div>
                <p className="mt-2 text-sm leading-6 text-[#3c3c43]">{item.detail}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[32px] border border-[#e7e7ea] bg-white p-6 shadow-[0_16px_36px_rgba(17,17,20,0.05)]">
          <div className="flex items-center gap-3">
            <Clock3 className="text-[#3c3c43]" size={18} />
            <h2 className="font-display text-2xl text-[#111114]">Operational notes</h2>
          </div>

          <div className="mt-6 space-y-4 text-sm leading-6 text-[#3c3c43]">
            <p>
              The current dashboard depends on read access to `profiles` and `usage_events`. If those tables are not exposed
              to the Data API yet, the cards fall back gracefully instead of crashing the route.
            </p>
            <p>
              Stripe-backed billing stays separate from plan display. The dashboard reflects the plan on the profile row, and
              webhook events remain the source of truth for promotion to Pro.
            </p>
            <div className="rounded-[24px] border border-dashed border-[#c5e86c] bg-[#edf7d2] p-4 text-[#305017]">
              <div className="flex items-center gap-3">
                <Sparkles size={16} />
                <span>{loading ? 'Refreshing account data…' : data.isFallback ? 'Showing fallback starter data' : 'Live Supabase data loaded'}</span>
              </div>
            </div>
            {error ? <p className="text-[#74580b]">{error}</p> : null}
          </div>
        </article>
      </section>
    </AppFrame>
  )
}
