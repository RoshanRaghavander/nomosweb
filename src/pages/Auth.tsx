import { Navigate } from 'react-router-dom'

import AuthPanel from '@/components/AuthPanel'
import PublicSiteShell from '@/components/PublicSiteShell'
import { useAuthStore } from '@/store/useAuthStore'

const authBenefits = [
  'Use one account across the Nomos IDE, dashboard, and billing center.',
  'Create a standard email and password account without a separate signup flow on the homepage.',
  'Desktop sign-in can still return straight to the IDE after browser authentication completes.',
]

export default function Auth() {
  const session = useAuthStore((state) => state.session)
  const status = useAuthStore((state) => state.status)

  if (status === 'ready' && session) {
    return <Navigate replace to="/dashboard" />
  }

  return (
    <PublicSiteShell>
      <section className="nomos-public-section">
        <div className="nomos-public-hero">
          <article className="nomos-public-card">
            <span className="nomos-public-eyebrow">Account</span>
            <h1>Sign in to Nomos from one dedicated page.</h1>
            <p className="nomos-public-body">
              Create your account or sign in with standard credentials. This page is the public entry point for web access
              and the browser-based IDE authentication flow.
            </p>

            <div className="nomos-public-list">
              {authBenefits.map((item) => (
                <div className="nomos-public-list-item" key={item}>
                  <span className="nomos-public-dot" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </article>

          <AuthPanel />
        </div>
      </section>
    </PublicSiteShell>
  )
}
