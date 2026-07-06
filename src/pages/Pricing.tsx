import { ArrowRight, Check } from 'lucide-react'
import { Link } from 'react-router-dom'

import PublicSiteShell from '@/components/PublicSiteShell'
import { useAuthStore } from '@/store/useAuthStore'

const plans = [
  {
    name: 'Free',
    price: '$0',
    suffix: '/mo',
    description: 'Perfect for developers testing out a clean, privacy-first alternative to basic coding assistants.',
    features: [
      'Full Open VSX Registry compatibility for themes, keymaps, and language tools',
      'One-click import of your existing VS Code workspace configuration',
      'Standard inline autocomplete with multi-line predictions',
      'Context-aware chat for the active file and open tabs',
      'Starter agent loops inside a single-file boundary',
      'Basic command diagnostics for structural terminal fixes',
      'Local telemetry control with full opt-out for non-essential metrics',
      'Zero model training guardrails for your code clips',
    ],
    featured: false,
  },
  {
    name: 'Plus',
    price: '$7.99',
    suffix: '/mo',
    description: 'Built for independent developers, students, and freelancers who need extended execution depth without steep price anchors.',
    features: [
      'Everything in Free',
      'Unlimited fast-queue autocomplete with priority generation access',
      'Deep reasoning chat across larger code fragments',
      'Full repo indexing and semantic workspace search',
      'Multi-file context from neighboring files and patterns',
      'Autonomous agent runs across up to 3 files simultaneously',
      'Automated scaffolding for starter files and basic directories',
      'Standard cloud sync for settings, layout history, and operational profiles',
    ],
    featured: false,
  },
  {
    name: 'Pro',
    price: '$9.99',
    suffix: '/mo',
    description: 'The professional engineering standard. High-capacity agent pipelines and zero credit anxiety for production-grade builds.',
    features: [
      'Everything in Plus',
      'Full workspace refactoring across hundreds of interacting files',
      'Terminal and test execution with autonomous retry and self-correction',
      'Intelligent soft throttle when high-tier reasoning quota is exhausted',
      'Deep structural intent across complex dependency chains',
      'Predictive codebase navigation based on current edit patterns',
      'Visual diff previews for multi-file agent changes before accepting them',
    ],
    featured: true,
  },
  {
    name: 'Pro max',
    price: '$14.99',
    suffix: '/mo',
    description: 'The ultimate power tier for solo founders, technical leads, and development agencies running heavy, non-stop autonomous pipelines.',
    features: [
      'Everything in Pro',
      'Unthrottled frontier engine access with the highest priority queues',
      'Maximum token windows for massive monorepos',
      'Up to 5 concurrent autonomous coding tasks in parallel workspaces',
      'Complex specification blueprinting from long design docs and full issues',
      'Persistent codebase memory aligned to historical structural choices',
      'Immediate beta access to new automation tools and workflows',
      'Priority cloud routing on the highest-tier infrastructure nodes',
    ],
    featured: false,
  },
]

const faqs = [
  {
    question: 'Who is Nomos built for?',
    answer: 'Nomos is built for developers, freelancers, founders, and engineering teams who want an AI IDE that can move beyond autocomplete into planning, execution, and software delivery.',
  },
  {
    question: 'How do the paid tiers scale?',
    answer: 'The tiers scale by execution depth, workspace coverage, concurrency, and autonomy. Free is for evaluation, Plus expands compute and repo context, Pro unlocks production-grade refactors, and Pro max is built for sustained parallel agent work.',
  },
  {
    question: 'How does activation work?',
    answer: 'Once your upgrade is completed, your account unlocks the selected plan and the billing area reflects the updated status automatically.',
  },
]

export default function Pricing() {
  const session = useAuthStore((state) => state.session)

  return (
    <PublicSiteShell>
      <section className="nomos-public-section">
        <article className="nomos-public-card">
          <span className="nomos-public-eyebrow">Pricing</span>
          <h1 className="mt-6">Pricing for an AI agentic IDE built to scale from fast evaluation to nonstop autonomous execution.</h1>
          <p className="nomos-public-body">
            Choose the level of execution depth you need, from privacy-first autocomplete and chat to frontier multi-agent
            pipelines for production-grade software building.
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
          <h2>Start lean, then scale into deeper agent execution, larger workspace context, and parallel autonomy.</h2>
          <p>The public site explains the tiers. The authenticated routes handle the real account, usage, billing, and upgrade state.</p>
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
