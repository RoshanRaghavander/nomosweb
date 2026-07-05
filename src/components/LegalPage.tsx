import { Link } from 'react-router-dom'

import PublicSiteShell from '@/components/PublicSiteShell'

interface LegalSection {
  title: string
  paragraphs: string[]
  bullets?: string[]
}

interface LegalPageProps {
  eyebrow: string
  title: string
  intro: string
  lastUpdated: string
  sections: LegalSection[]
}

export default function LegalPage({ eyebrow, title, intro, lastUpdated, sections }: LegalPageProps) {
  return (
    <PublicSiteShell>
      <section className="nomos-public-section">
        <article className="nomos-public-card nomos-legal-card">
          <span className="nomos-public-eyebrow">{eyebrow}</span>
          <h1 className="mt-6">{title}</h1>
          <p className="nomos-public-body">{intro}</p>

          <div className="nomos-legal-meta">
            <strong>Last updated</strong>
            <span>{lastUpdated}</span>
          </div>

          <div className="nomos-legal-sections">
            {sections.map((section) => (
              <section className="nomos-legal-section" key={section.title}>
                <h2>{section.title}</h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {section.bullets ? (
                  <ul className="nomos-legal-list">
                    {section.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}
          </div>
        </article>

        <section className="nomos-home__band" style={{ marginBottom: 24 }}>
          <h2>Need another policy or agreement?</h2>
          <p>These public documents cover the website, account access, and cookie behavior for Nomos at this stage.</p>
          <div className="nomos-home__cta-row">
            <Link className="nomos-home__pill" to="/">
              Back to homepage
            </Link>
            <Link className="nomos-home__pill nomos-home__pill--ghost" to="/pricing">
              View pricing
            </Link>
          </div>
        </section>
      </section>
    </PublicSiteShell>
  )
}
