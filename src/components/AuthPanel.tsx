import { type FormEvent, useEffect, useState } from 'react'
import { ArrowRight, KeyRound } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

import {
  buildDesktopAuthReturnUrl,
  createAccountWithPassword,
  getDesktopReturnTarget,
  signInWithPassword,
} from '@/lib/supabase'
import { useAuthStore } from '@/store/useAuthStore'

export default function AuthPanel() {
  const location = useLocation()
  const notice = useAuthStore((state) => state.notice)
  const profile = useAuthStore((state) => state.profile)
  const session = useAuthStore((state) => state.session)
  const status = useAuthStore((state) => state.status)
  const setNotice = useAuthStore((state) => state.setNotice)

  const [mode, setMode] = useState<'signup' | 'signin'>('signup')
  const [email, setEmail] = useState(session?.user.email ?? '')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const searchParams = new URLSearchParams(location.search)
  const desktopReturnTo = searchParams.get('returnTo')
  const isDesktopAuth = searchParams.get('desktop') === '1' && Boolean(getDesktopReturnTarget(desktopReturnTo))
  const desktopReturnUrl = session && desktopReturnTo ? buildDesktopAuthReturnUrl(session, desktopReturnTo) : null

  useEffect(() => {
    if (session?.user.email) {
      setEmail(session.user.email)
    }
  }, [session?.user.email])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!email) {
      setNotice('Enter your email address.')
      return
    }

    if (!password) {
      setNotice('Enter your password.')
      return
    }

    setSubmitting(true)
    const redirectPath = isDesktopAuth && desktopReturnTo
      ? `/auth/callback?desktop=1&returnTo=${encodeURIComponent(desktopReturnTo)}`
      : '/auth/callback'
    const result = mode === 'signup'
      ? await createAccountWithPassword(email, password, redirectPath)
      : await signInWithPassword(email, password)
    setSubmitting(false)

    if (result.error) {
      setNotice(result.error.message)
      return
    }

    if (mode === 'signup' && !result.data.session) {
      setNotice(
        isDesktopAuth
          ? `Account created for ${email}. Confirm the email and Nomos will return you to the IDE after verification.`
          : `Account created for ${email}. Confirm the email to finish setup.`,
      )
      return
    }

    setNotice(isDesktopAuth ? 'Signed in. Return to Nomos to continue.' : 'Signed in successfully.')
  }

  return (
    <section className="nomos-public-card">
      <div className="flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#c5e86c] text-[#111114]">
          <KeyRound size={20} />
        </span>
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-[#8a8a92]">Account access</p>
          <h2 className="mt-1 font-display text-2xl text-[#111114]">
            {session ? 'You are signed in' : mode === 'signup' ? 'Create your account' : 'Sign in'}
          </h2>
        </div>
      </div>

      <p className="nomos-public-body">
        {isDesktopAuth
          ? 'Use your Nomos account here for the desktop app. After authentication or email confirmation, this page can hand the session back to Nomos automatically.'
          : 'Use a standard Nomos account with email and password. The same session unlocks the dashboard and billing routes.'}
      </p>

      {session ? (
        <div className="nomos-public-banner nomos-public-banner--neutral">
          <p className="font-medium text-[#111114]">{session.user.email}</p>
          <p className="mt-2">
            Plan: <span className="text-[#111114]">{profile?.plan === 'pro' ? 'Pro' : 'Free'}</span>
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            {desktopReturnUrl ? (
              <a className="nomos-home__pill" href={desktopReturnUrl}>
                Open Nomos IDE
              </a>
            ) : (
              <Link className="nomos-home__pill" to="/dashboard">
                Open dashboard
              </Link>
            )}
            <Link className="nomos-home__pill nomos-home__pill--ghost" to="/billing">
              Open billing
            </Link>
          </div>
        </div>
      ) : (
        <form className="nomos-public-form" onSubmit={handleSubmit}>
          <div className="flex gap-2">
            <button
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                mode === 'signup' ? 'bg-[#111114] text-white' : 'bg-[#f1f2f4] text-[#3c3c43]'
              }`}
              onClick={() => setMode('signup')}
              type="button"
            >
              Create account
            </button>
            <button
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                mode === 'signin' ? 'bg-[#111114] text-white' : 'bg-[#f1f2f4] text-[#3c3c43]'
              }`}
              onClick={() => setMode('signin')}
              type="button"
            >
              Sign in
            </button>
          </div>

          <label>
            <span>Email</span>
            <input
              onChange={(event) => setEmail(event.target.value)}
              placeholder="name@company.com"
              type="email"
              value={email}
            />
          </label>

          <label>
            <span>Password</span>
            <input
              minLength={6}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              type="password"
              value={password}
            />
          </label>

          <button
            className="nomos-home__pill w-full justify-center rounded-[18px] disabled:cursor-not-allowed disabled:opacity-60"
            disabled={submitting || status === 'missing-env'}
            type="submit"
          >
            {submitting ? 'Working…' : mode === 'signup' ? 'Create account' : 'Sign in'}
            <ArrowRight size={16} />
          </button>
        </form>
      )}

      {notice ? <p className="nomos-public-note">{notice}</p> : null}
    </section>
  )
}
