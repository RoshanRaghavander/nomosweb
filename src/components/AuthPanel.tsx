import { type FormEvent, useEffect, useState } from 'react'
import { ArrowRight, MailCheck } from 'lucide-react'

import { sendMagicLink } from '@/lib/supabase'
import { useAuthStore } from '@/store/useAuthStore'

export default function AuthPanel() {
  const notice = useAuthStore((state) => state.notice)
  const profile = useAuthStore((state) => state.profile)
  const session = useAuthStore((state) => state.session)
  const status = useAuthStore((state) => state.status)
  const setNotice = useAuthStore((state) => state.setNotice)

  const [email, setEmail] = useState(session?.user.email ?? '')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (session?.user.email) {
      setEmail(session.user.email)
    }
  }, [session?.user.email])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!email) {
      setNotice('Enter an email address to receive a magic link.')
      return
    }

    setSubmitting(true)
    const { error } = await sendMagicLink(email)
    setSubmitting(false)

    if (error) {
      setNotice(error.message)
      return
    }

    setNotice(`Magic link sent to ${email}. Use it to land directly in your dashboard.`)
  }

  return (
    <section className="nomos-public-card">
      <div className="flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#c5e86c] text-[#111114]">
          <MailCheck size={20} />
        </span>
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-[#8a8a92]">Account access</p>
          <h2 className="mt-1 font-display text-2xl text-[#111114]">
            {session ? 'You are signed in' : 'Email-first sign-in'}
          </h2>
        </div>
      </div>

      <p className="nomos-public-body">
        Start with passwordless access through Supabase Auth. The same session unlocks the dashboard and billing routes.
      </p>

      {session ? (
        <div className="nomos-public-banner nomos-public-banner--neutral">
          <p className="font-medium text-[#111114]">{session.user.email}</p>
          <p className="mt-2">
            Plan: <span className="text-[#111114]">{profile?.plan === 'pro' ? 'Pro' : 'Free'}</span>
          </p>
        </div>
      ) : (
        <form className="nomos-public-form" onSubmit={handleSubmit}>
          <label>
            <span>Email</span>
            <input
              onChange={(event) => setEmail(event.target.value)}
              placeholder="name@company.com"
              type="email"
              value={email}
            />
          </label>

          <button
            className="nomos-home__pill w-full justify-center rounded-[18px] disabled:cursor-not-allowed disabled:opacity-60"
            disabled={submitting || status === 'missing-env'}
            type="submit"
          >
            {submitting ? 'Sending link…' : 'Send magic link'}
            <ArrowRight size={16} />
          </button>
        </form>
      )}

      {notice ? <p className="nomos-public-note">{notice}</p> : null}
    </section>
  )
}
