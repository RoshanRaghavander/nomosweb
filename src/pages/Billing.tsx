import { CreditCard, ExternalLink, ReceiptText, ShieldCheck } from 'lucide-react'
import { useLocation } from 'react-router-dom'

import AppFrame from '@/components/AppFrame'
import MetricCard from '@/components/MetricCard'
import { useBillingData } from '@/hooks/useBillingData'
import { type NomosPaidPlan } from '@/lib/supabase'
import { useAuthStore } from '@/store/useAuthStore'
import { formatDate, formatPlanLabel } from '@/utils/format'

const paidPlans: { plan: NomosPaidPlan; label: string; price: string; detail: string }[] = [
  { plan: 'plus', label: 'Plus', price: '$7.99', detail: 'Unlimited fast chat, autocomplete, and agent execution on the DeepSeek Flash route.' },
  { plan: 'pro', label: 'Pro', price: '$9.99', detail: 'Premium Claude agent routing with a 120-run monthly soft throttle.' },
  { plan: 'pro_max', label: 'Pro max', price: '$14.99', detail: 'Expanded premium Claude capacity with 1-hour cache-friendly agent sessions.' },
]

function CheckoutBanner() {
  const location = useLocation()
  const state = new URLSearchParams(location.search).get('checkout')

  if (state === 'success') {
    return (
      <div className="rounded-[24px] border border-[#c5e86c] bg-[#edf7d2] p-4 text-sm text-[#305017]">
        Checkout returned successfully. Billing sync is still what upgrades the account.
      </div>
    )
  }

  if (state === 'cancelled') {
    return (
      <div className="rounded-[24px] border border-[#f4e96b] bg-[#fff6dc] p-4 text-sm text-[#74580b]">
        Checkout was cancelled before completion. You can restart it whenever you are ready.
      </div>
    )
  }

  return null
}

export default function Billing() {
  const { checkoutEnabled, checkoutPending, data, error, loading, startCheckout } = useBillingData()
  const profile = useAuthStore((state) => state.profile)

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
            <p className="text-xs uppercase tracking-[0.24em] text-[#8a8a92]">Billing</p>
            <h1 className="mt-4 font-display text-5xl text-[#111114]">Plan, usage, and payment state in one place.</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#3c3c43]">
              This route reads your current plan, starter usage, premium agent quota state, and upgrade options from the Nomos billing stack.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {paidPlans.map((plan) => {
              const isActive = profile?.plan === plan.plan

              return (
                <button
                  key={plan.plan}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#111114] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#26262b] disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={!checkoutEnabled || checkoutPending || isActive}
                  onClick={() => void startCheckout(plan.plan)}
                  type="button"
                >
                  {isActive ? `${plan.label} active` : checkoutPending ? 'Creating checkout…' : `Choose ${plan.label}`}
                  <ExternalLink size={16} />
                </button>
              )
            })}
          </div>
        </div>

        <div className="mt-6">
          <CheckoutBanner />
        </div>
      </section>

      <section className="mt-8 grid gap-5 lg:grid-cols-4">
        <MetricCard
          detail={profile?.stripeSubscriptionId ? 'A live subscription is linked to this account.' : 'No active subscription recorded yet.'}
          label="Current plan"
          value={formatPlanLabel(data.currentPlan)}
        />
        <MetricCard
          detail={data.currentPlan === 'free' ? 'Starter allowance is counted across chat and autocomplete requests.' : 'Counted from usage events for the current calendar month.'}
          label={data.currentPlan === 'free' ? 'Starter usage' : 'Usage this month'}
          value={data.currentPlan === 'free' ? `${data.starterRequestsUsed ?? 0}/${data.starterRequestsMax ?? 20}` : String(data.usageThisMonth)}
        />
        <MetricCard
          detail={data.premiumAgentQuota ? 'Once the monthly premium quota is exhausted, agent routing falls back automatically.' : 'Available on Pro and Pro max.'}
          label="Premium agent quota"
          value={data.premiumAgentQuota ? `${data.premiumAgentRunsThisMonth ?? 0}/${data.premiumAgentQuota}` : 'Not active'}
        />
        <MetricCard detail={`Profile created ${formatDate(profile?.createdAt ?? null)}.`} label="Account status" value={data.statusLabel} />
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-3">
        <article className="rounded-[32px] border border-[#e7e7ea] bg-white p-6 shadow-[0_16px_36px_rgba(17,17,20,0.05)]">
          <div className="flex items-center gap-3">
            <CreditCard className="text-[#3c3c43]" size={18} />
            <h2 className="font-display text-2xl text-[#111114]">Payment state</h2>
          </div>
          <p className="mt-5 text-sm leading-7 text-[#3c3c43]">{data.paymentSummary}</p>
        </article>

        <article className="rounded-[32px] border border-[#e7e7ea] bg-white p-6 shadow-[0_16px_36px_rgba(17,17,20,0.05)]">
          <div className="flex items-center gap-3">
            <ReceiptText className="text-[#3c3c43]" size={18} />
            <h2 className="font-display text-2xl text-[#111114]">Plans</h2>
          </div>
          <div className="mt-5 flex flex-col gap-4">
            {paidPlans.map((plan) => (
              <div key={plan.plan} className="rounded-[24px] border border-[#ececf1] p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="font-medium text-[#111114]">{plan.label}</div>
                    <div className="text-sm text-[#8a8a92]">{plan.price}/mo</div>
                  </div>
                  <button
                    className="inline-flex items-center gap-2 rounded-full bg-[#111114] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#26262b] disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={!checkoutEnabled || checkoutPending || profile?.plan === plan.plan}
                    onClick={() => void startCheckout(plan.plan)}
                    type="button"
                  >
                    {profile?.plan === plan.plan ? 'Active' : 'Select'}
                  </button>
                </div>
                <p className="mt-3 text-sm leading-6 text-[#3c3c43]">{plan.detail}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[32px] border border-[#e7e7ea] bg-white p-6 shadow-[0_16px_36px_rgba(17,17,20,0.05)]">
          <div className="flex items-center gap-3">
            <ShieldCheck className="text-[#3c3c43]" size={18} />
            <h2 className="font-display text-2xl text-[#111114]">Next step</h2>
          </div>
          <p className="mt-5 text-sm leading-7 text-[#3c3c43]">{data.nextStep}</p>
          {error ? <p className="mt-4 text-sm text-[#74580b]">{error}</p> : null}
          {loading ? <p className="mt-4 text-sm text-[#8a8a92]">Refreshing billing data…</p> : null}
        </article>
      </section>
    </AppFrame>
  )
}
