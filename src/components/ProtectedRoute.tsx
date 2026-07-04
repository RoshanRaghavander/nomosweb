import { type ReactNode } from 'react'
import { Navigate } from 'react-router-dom'

import AppLoading from '@/components/AppLoading'
import { useAuthStore } from '@/store/useAuthStore'

interface ProtectedRouteProps {
  children: ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const session = useAuthStore((state) => state.session)
  const status = useAuthStore((state) => state.status)

  if (status === 'loading') {
    return <AppLoading label="Loading your Nomos account…" />
  }

  if (!session) {
    return <Navigate replace to="/" />
  }

  return <>{children}</>
}
