import { Link } from 'react-router-dom'

import PublicSiteShell from '@/components/PublicSiteShell'
import { useAuthStore } from '@/store/useAuthStore'

const featureCards = [
  {
    icon: '✦',
    iconClassName: 'nomos-home__feature-icon nomos-home__feature-icon--lime',
    title: 'Agentic code execution',
    copy: 'Move from prompt to working implementation with agents that understand the repo, edit multiple files, and keep momentum.',
  },
  {
    icon: '◌',
    iconClassName: 'nomos-home__feature-icon nomos-home__feature-icon--mint',
    title: 'Persistent codebase memory',
    copy: 'Carry architecture decisions, task context, and product goals across sessions instead of starting cold every time.',
  },
  {
    icon: '▣',
    iconClassName: 'nomos-home__feature-icon nomos-home__feature-icon--sky',
    title: 'Software builder workflow',
    copy: 'Ship with planning, implementation, usage visibility, and account controls in one surface built for production work.',
  },
]

export default function Home() {
  const session = useAuthStore((state) => state.session)

  return (
    <PublicSiteShell>
      <header id="product">
        <h1 className="nomos-home__headline">The AI agentic IDE for teams building software end to end.</h1>
        <p className="nomos-home__sub">
          Nomos is an AI software builder competing with Cursor, Trae, and Windsurf <span className="nomos-home__dash">—</span>{' '}
          built for planning, coding, iterating, and shipping across the whole codebase.
        </p>

        <div className="nomos-home__cta-row">
          <a
            className="nomos-home__pill"
            href="https://github.com/2505-Labs/Nomos/releases"
            rel="noreferrer"
            target="_blank"
          >
            Download
          </a>
          {session ? (
            <Link className="nomos-home__pill nomos-home__pill--ghost" to="/dashboard">
              Open dashboard
            </Link>
          ) : (
            <Link className="nomos-home__pill nomos-home__pill--ghost" to="/auth">
              Sign in
            </Link>
          )}
        </div>

        <div className="nomos-home__stage" aria-hidden="true">
          <div className="nomos-home__blob nomos-home__blob--1" />
          <div className="nomos-home__blob nomos-home__blob--2" />
          <div className="nomos-home__blob nomos-home__blob--3" />
          <div className="nomos-home__hill" />
          <div className="nomos-home__monolith" />

          <div className="nomos-home__ui-card nomos-home__card-diff">
            <div className="kw">repo</div>
            <div className="add">+ dashboard route</div>
            <div className="add">+ billing center</div>
            <div className="del">- disconnected account UI</div>
          </div>

          <div className="nomos-home__ui-card nomos-home__card-agent">
            <div className="head">
              <span className="nomos-home__card-title">Agent run</span>
              <span className="nomos-home__chip nomos-home__chip--green">Live</span>
            </div>
            <div className="row">
              <span className="nomos-home__avatar nomos-home__avatar--green">N</span>
              <div>
                <div className="nomos-home__card-title">Nomos workspace</div>
                <div className="nomos-home__card-meta">Scoped to the current repo</div>
              </div>
            </div>
            <div className="nomos-home__card-body">
              Agents stay anchored to the repo, execute across files, and keep product context alive while you build.
            </div>
          </div>

          <div className="nomos-home__ui-card nomos-home__card-pilot">
            <div className="row">
              <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                <span className="nomos-home__avatar nomos-home__avatar--dark">AI</span>
                <div>
                  <div className="nomos-home__card-title">Execution pilot</div>
                  <div className="nomos-home__card-meta">Homepage, dashboard, billing</div>
                </div>
              </div>
              <span className="nomos-home__chip nomos-home__chip--yellow">Ready</span>
            </div>
            <div className="nomos-home__card-body">
              Built for teams comparing AI IDEs and wanting a deeper software-building workflow than autocomplete alone.
            </div>
          </div>

          <div className="nomos-home__ui-card nomos-home__card-secure">
            <div className="row">
              <span className="nomos-home__avatar nomos-home__avatar--sky">✓</span>
              <div>
                <div className="nomos-home__card-title">Supabase auth</div>
                <div className="nomos-home__card-meta">Account-backed access</div>
              </div>
            </div>
            <div className="nomos-home__card-body">
              Usage, billing, and account state stay tied to the same identity that powers the builder experience.
            </div>
          </div>
        </div>
      </header>

      <section className="nomos-home__strip">
        <p>Built for teams evaluating agentic software builders, not just AI autocomplete</p>
        <div className="nomos-home__logos">
          <span>Planning</span>
          <span>Agents</span>
          <span>Codebase memory</span>
          <span>Workflows</span>
          <span>Shipping</span>
        </div>
      </section>

      <section className="nomos-home__features" id="features">
        <h2>One IDE for planning, coding, and shipping with agents that understand the whole project.</h2>
        <p className="nomos-home__lead">
          Nomos gives teams an AI-native development environment that can reason about the repo, execute larger tasks, and
          keep the operational side visible once work moves beyond experimentation.
        </p>

        <div className="nomos-home__grid">
          {featureCards.map((card) => (
            <article className="nomos-home__feature-card" key={card.title}>
              <div className={card.iconClassName}>{card.icon}</div>
              <h3>{card.title}</h3>
              <p>{card.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="nomos-home__band">
        <h2>From first prompt to shipped product, keep the same execution context.</h2>
        <p>Use Nomos as the AI IDE and software builder layer for teams that need more than inline completion.</p>
        <div className="nomos-home__cta-row">
          <Link className="nomos-home__pill" to={session ? '/dashboard' : '/auth'}>
            {session ? 'Continue to dashboard' : 'Create account'}
          </Link>
          <Link className="nomos-home__pill nomos-home__pill--ghost" to="/pricing">
            Compare plans
          </Link>
        </div>
      </section>
    </PublicSiteShell>
  )
}
