import { Suspense, lazy } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import AppLoading from '@/components/AppLoading'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useAuthBootstrap } from '@/hooks/useAuthBootstrap'
import AuthCallback from '@/pages/AuthCallback'
import Home from '@/pages/Home'

const Pricing = lazy(() => import('@/pages/Pricing'))
const Dashboard = lazy(() => import('@/pages/Dashboard'))
const Billing = lazy(() => import('@/pages/Billing'))

export default function App() {
  useAuthBootstrap()

  return (
    <BrowserRouter>
      <Suspense fallback={<AppLoading label="Loading Nomos…" />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/signup" element={<Navigate replace to="/" />} />
          <Route path="/signin" element={<Navigate replace to="/" />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/billing"
            element={
              <ProtectedRoute>
                <Billing />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate replace to="/" />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
