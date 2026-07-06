import { type ReactNode } from 'react'
import { ArrowRight, ChevronDown } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

import '@/styles/homepage.css'

import { useAuthStore } from '@/store/useAuthStore'

interface PublicSiteShellProps {
  children: ReactNode
}

export default function PublicSiteShell({ children }: PublicSiteShellProps) {
  const location = useLocation()
  const session = useAuthStore((state) => state.session)

  const featureHref = location.pathname === '/' ? '#features' : '/#features'

  return (
    <div className="nomos-home">
      <div className="nomos-home__wrap">
        <nav>
          <Link className="nomos-home__logo" to="/">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 1 L15 9 L23 12 L15 15 L12 23 L9 15 L1 12 L9 9 Z" fill="#111114" />
            </svg>
            Nomos
          </Link>

          <div className="nomos-home__nav-center">
            <a href={featureHref}>
              Features <ChevronDown className="nomos-home__caret" size={12} strokeWidth={2.2} />
            </a>
            <Link to="/pricing">Pricing</Link>
            {session ? <Link to="/dashboard">Dashboard</Link> : null}
          </div>

          <div className="nomos-home__nav-right">
            {session ? (
              <Link className="plain" to="/billing">
                Billing
              </Link>
            ) : (
              <Link className="plain" to="/auth">
                Sign in
              </Link>
            )}

            {session ? (
              <Link className="nomos-home__pill" to="/dashboard">
                Go to dashboard
                <ArrowRight size={16} />
              </Link>
            ) : (
              <a
                className="nomos-home__pill"
                href="https://github.com/2505-Labs/Nomos/releases"
                rel="noreferrer"
                target="_blank"
              >
                Download
                <ArrowRight size={16} />
              </a>
            )}
          </div>
        </nav>

        {children}

        <footer>
          <span>Nomos web for the AI agentic IDE, billing, and dashboard.</span>
          <div className="nomos-home__footer-links">
            <Link to="/pricing">Pricing</Link>
            <Link to={session ? '/dashboard' : '/'}>{session ? 'Dashboard' : 'Homepage'}</Link>
            <Link to="/terms">Terms</Link>
            <Link to="/privacy">Privacy</Link>
            <Link to="/cookies">Cookies</Link>
          </div>
        </footer>
      </div>
    </div>
  )
}
