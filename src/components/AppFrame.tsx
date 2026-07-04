import { type ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ArrowUpRight, LogOut, Sparkles } from 'lucide-react'

import '@/styles/homepage.css'

import { signOutUser } from '@/lib/supabase'
import { useAuthStore } from '@/store/useAuthStore'

interface AppFrameProps {
  children: ReactNode
}

const navigation = [
  { to: '/', label: 'Homepage' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/billing', label: 'Billing' },
]

export default function AppFrame({ children }: AppFrameProps) {
  const location = useLocation()
  const profile = useAuthStore((state) => state.profile)
  const session = useAuthStore((state) => state.session)
  const status = useAuthStore((state) => state.status)

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          'radial-gradient(120% 130% at 0% 0%, rgba(197,232,108,0.2) 0%, transparent 38%), radial-gradient(90% 120% at 100% 0%, rgba(207,233,245,0.5) 0%, transparent 42%), linear-gradient(180deg, #ffffff 0%, #f9faf7 100%)',
        color: '#111114',
      }}
    >
      <div className="mx-auto flex min-h-screen w-full max-w-[1240px] flex-col px-6 pb-10 pt-6 lg:px-10">
        <header className="mb-10 rounded-full border border-[#e7e7ea] bg-white/85 px-5 py-4 shadow-[0_12px_30px_rgba(17,17,20,0.05)] backdrop-blur">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <Link className="flex items-center gap-3 text-sm font-medium text-[#111114]" to="/">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#c5e86c] text-[#111114] shadow-[0_10px_30px_rgba(197,232,108,0.3)]">
                <Sparkles size={18} />
              </span>
              <span>
                <span className="block font-display text-xl text-[#111114]">Nomos</span>
                <span className="block text-xs uppercase tracking-[0.22em] text-[#8a8a92]">AI software builder</span>
              </span>
            </Link>

            <nav className="flex flex-wrap gap-2 text-sm text-[#3c3c43]">
              {navigation.map((item) => {
                const active = location.pathname === item.to

                return (
                  <Link
                    key={item.to}
                    className={`rounded-full px-4 py-2 transition ${
                      active ? 'bg-[#111114] text-white' : 'bg-[#f6f6f7] hover:bg-[#ececef]'
                    }`}
                    to={item.to}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </nav>

            <div className="flex flex-wrap items-center gap-3">
              <div className="rounded-full border border-[#e7e7ea] bg-[#f6f6f7] px-4 py-2 text-xs text-[#3c3c43]">
                {session?.user.email ?? (status === 'missing-env' ? 'Supabase env missing' : 'Signed out')}
              </div>

              {session ? (
                <button
                  className="inline-flex items-center gap-2 rounded-full border border-[#e7e7ea] bg-white px-4 py-2 text-sm text-[#111114] transition hover:bg-[#f6f6f7]"
                  onClick={() => void signOutUser()}
                  type="button"
                >
                  <LogOut size={16} />
                  Sign out
                </button>
              ) : (
                <Link
                  className="inline-flex items-center gap-2 rounded-full bg-[#111114] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#26262b]"
                  to="/"
                >
                  Get started
                  <ArrowUpRight size={16} />
                </Link>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="mt-10 flex flex-col gap-3 border-t border-[#e7e7ea] pt-6 text-sm text-[#8a8a92] md:flex-row md:items-center md:justify-between">
          <p>Nomos web for the AI agentic IDE, billing, and dashboard flows.</p>
          <p style={{ color: '#3c3c43' }}>{profile?.plan === 'pro' ? 'Pro account linked' : 'Free plan starter state'}</p>
        </footer>
      </div>
    </div>
  )
}
