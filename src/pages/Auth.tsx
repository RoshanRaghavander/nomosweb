import { Navigate, useLocation } from 'react-router-dom'

import AuthPanel from '@/components/AuthPanel'
import PublicSiteShell from '@/components/PublicSiteShell'
import { getDesktopReturnTarget } from '@/lib/supabase'
import { useAuthStore } from '@/store/useAuthStore'

const authBenefits = [
  'Use one account across the Nomos IDE, dashboard, and billing center.',
  'Access your workspace with standard email and password authentication.',
  'When sign-in starts from the desktop app, authentication can return directly to the IDE.',
]

export default function Auth() {
  const location = useLocation()
  const session = useAuthStore((state) => state.session)
  const status = useAuthStore((state) => state.status)
  const searchParams = new URLSearchParams(location.search)
  const desktopReturnTo = searchParams.get('returnTo')
  const isDesktopAuth = searchParams.get('desktop') === '1' && Boolean(getDesktopReturnTarget(desktopReturnTo))

  if (status === 'ready' && session && isDesktopAuth && desktopReturnTo) {
    return <Navigate replace to={`/auth/callback?desktop=1&returnTo=${encodeURIComponent(desktopReturnTo)}`} />
  }

  if (status === 'ready' && session) {
    return <Navigate replace to="/dashboard" />
  }

  return (
    <PublicSiteShell>
      <section className="nomos-public-section">
        <div className="nomos-public-hero">
          <article className="nomos-public-card">
            <span className="nomos-public-eyebrow">Account</span>
            <h1>Access your Nomos workspace with one account.</h1>
            <p className="nomos-public-body">
              Create your account or sign in to manage workspace access, billing, and product activity through a single
              Nomos identity.
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
