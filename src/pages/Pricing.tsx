import { ArrowRight, Check } from 'lucide-react'
import { Link } from 'react-router-dom'

import PublicSiteShell from '@/components/PublicSiteShell'
import { useAuthStore } from '@/store/useAuthStore'

const plans = [
  {
    name: 'Free',
    price: '$0',
    suffix: '/month',
    description: 'For developers evaluating Nomos against Cursor, Trae, and Windsurf before committing to a deeper workflow.',
    features: ['AI chat and repo-aware assistance', 'Starter agent runs', 'Dashboard access', 'Usage visibility and upgrade path'],
    featured: false,
  },
  {
    name: 'Pro',
    price: '$20',
    suffix: '/month',
    description: 'For serious builders who want Nomos as their primary AI agentic IDE and software delivery environment.',
    features: ['Everything in Free', 'Longer multi-file agent execution', 'Persistent project memory', 'Priority billing and account workflow'],
    featured: true,
  },
  {
    name: 'Team',
    price: 'Custom',
    suffix: '',
    description: 'For engineering teams standardizing on Nomos as a shared AI software builder across projects and workspaces.',
    features: ['Shared workspace rollout', 'Centralized billing coordination', 'Team onboarding support', 'Expanded operational visibility'],
    featured: false,
  },
]

const faqs = [
  {
    question: 'Who is Nomos built for?',
    answer: 'Nomos is built for developers and teams who want an AI IDE that can reason across the codebase and help build software, not just autocomplete lines.',
  },
  {
    question: 'How is Nomos different from Cursor, Trae, or Windsurf?',
    answer: 'The product direction here is a more agentic software builder workflow: planning, execution, memory, and operational visibility in one connected surface.',
  },
  {
    question: 'How does Pro activation work?',
    answer: 'The web client starts checkout, Stripe confirms the subscription, and the webhook updates the Supabase profile row that the billing and dashboard pages read.',
  },
]

export default function Pricing() {
  const session = useAuthStore((state) => state.session)

  return (
    <PublicSiteShell>
      <section className="nomos-public-section">
        <article className="nomos-public-card">
          <span className="nomos-public-eyebrow">Pricing</span>
          <h1 className="mt-6">Pricing for an AI agentic IDE built to help teams ship software.</h1>
          <p className="nomos-public-body">
            Choose the level of execution depth you need, from early evaluation to a full-time AI software builder workflow
            for teams replacing lighter-weight coding assistants.
          </p>

          <div className="nomos-pricing-grid">
            {plans.map((plan) => (
              <article
                className={`nomos-pricing-card ${plan.featured ? 'nomos-pricing-card--featured' : ''}`}
                key={plan.name}
              >
                <span className="nomos-pricing-kicker">{plan.name}</span>
                <div className="nomos-pricing-price">
                  {plan.price}
                  {plan.suffix ? <small>{plan.suffix}</small> : null}
                </div>
                <p className="nomos-pricing-copy">{plan.description}</p>

                <ul className="nomos-pricing-features">
                  {plan.features.map((feature) => (
                    <li key={feature}>
                      <Check size={16} style={{ marginTop: 3, flexShrink: 0 }} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="nomos-pricing-cta">
                  <Link className="nomos-home__pill" to={session ? '/billing' : '/'}>
                    {session ? (plan.name === 'Free' ? 'Open billing' : 'Manage account') : 'Back to homepage'}
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </article>

        <section className="nomos-home__band" style={{ marginBottom: 24 }}>
          <h2>Start with the builder experience, then scale into deeper agent execution and team workflow.</h2>
          <p>The public pages frame the product. The authenticated routes manage the real account, usage, and upgrade state.</p>
          <div className="nomos-home__cta-row">
            <Link className="nomos-home__pill" to={session ? '/billing' : '/'}>
              {session ? 'Open billing' : 'Back to homepage'}
            </Link>
            <Link className="nomos-home__pill nomos-home__pill--ghost" to="/">
              Back to homepage
            </Link>
          </div>
        </section>

        <article className="nomos-public-card">
          <span className="nomos-public-eyebrow">FAQ</span>
          <div className="nomos-faq-grid">
            {faqs.map((faq) => (
              <div className="nomos-faq-card" key={faq.question}>
                <h3>{faq.question}</h3>
                <p>{faq.answer}</p>
              </div>
            ))}
          </div>
        </article>
      </section>
    </PublicSiteShell>
  )
}
