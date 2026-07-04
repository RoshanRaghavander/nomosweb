import { useEffect, useMemo } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'

import AppLoading from '@/components/AppLoading'
import { useAuthStore } from '@/store/useAuthStore'

function getAuthError(location: ReturnType<typeof useLocation>) {
  const searchParams = new URLSearchParams(location.search)
  const hashParams = new URLSearchParams(location.hash.replace(/^#/, ''))

  return (
    searchParams.get('error_description') ??
    searchParams.get('error') ??
    hashParams.get('error_description') ??
    hashParams.get('error')
  )
}

export default function AuthCallback() {
  const location = useLocation()
  const navigate = useNavigate()
  const session = useAuthStore((state) => state.session)
  const status = useAuthStore((state) => state.status)
  const setNotice = useAuthStore((state) => state.setNotice)

  const authError = useMemo(() => getAuthError(location), [location])

  useEffect(() => {
    if (authError) {
      setNotice(authError)
      navigate('/', { replace: true })
      return
    }

    if (status === 'ready' && session) {
      setNotice('Your account is confirmed and ready.')
      navigate('/dashboard', { replace: true })
    }
  }, [authError, navigate, session, setNotice, status])

  if (status === 'missing-env') {
    return <Navigate replace to="/" />
  }

  if (authError) {
    return <AppLoading label="Returning to homepage…" />
  }

  if (status === 'ready' && !session) {
    return (
      <div
        className="flex min-h-screen items-center justify-center px-6"
        style={{
          background:
            'radial-gradient(120% 130% at 0% 0%, rgba(197,232,108,0.2) 0%, transparent 38%), radial-gradient(90% 120% at 100% 0%, rgba(207,233,245,0.5) 0%, transparent 42%), linear-gradient(180deg, #ffffff 0%, #f9faf7 100%)',
        }}
      >
        <div className="max-w-xl rounded-[32px] border border-[#e7e7ea] bg-white p-8 text-[#111114] shadow-[0_16px_36px_rgba(17,17,20,0.05)]">
          <p className="text-xs uppercase tracking-[0.24em] text-[#8a8a92]">Authentication</p>
          <h1 className="mt-4 font-display text-3xl">We could not complete the sign-in link.</h1>
          <p className="mt-4 text-sm leading-7 text-[#3c3c43]">
            Open the latest Nomos email and try the newest link again. Also make sure your Supabase redirect URLs include
            this deployed web domain.
          </p>
          <a
            className="mt-6 inline-flex items-center rounded-full bg-[#111114] px-5 py-3 text-sm font-medium text-white"
            href="/"
          >
            Return to homepage
          </a>
        </div>
      </div>
    )
  }

  return <AppLoading label="Signing you into Nomos…" />
}
