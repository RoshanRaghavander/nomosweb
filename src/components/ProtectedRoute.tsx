import { type ReactNode } from 'react'
import { Navigate } from 'react-router-dom'

import { useAuthStore } from '@/store/useAuthStore'

interface ProtectedRouteProps {
  children: ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const session = useAuthStore((state) => state.session)
  const status = useAuthStore((state) => state.status)

  if (status === 'loading') {
    return (
      <div className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-6 text-sm text-slate-300">
        Loading your Nomos account…
      </div>
    )
  }

  if (!session) {
    return <Navigate replace to="/" />
  }

  return <>{children}</>
}
