import { Suspense, lazy } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import AppLoading from '@/components/AppLoading'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useAuthBootstrap } from '@/hooks/useAuthBootstrap'
import Auth from '@/pages/Auth'
import AuthCallback from '@/pages/AuthCallback'
import CookiePolicy from '@/pages/CookiePolicy'
import Home from '@/pages/Home'
import PrivacyPolicy from '@/pages/PrivacyPolicy'
import TermsOfService from '@/pages/TermsOfService'

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
          <Route path="/auth" element={<Auth />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/terms-of-service" element={<Navigate replace to="/terms" />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/privacy-policy" element={<Navigate replace to="/privacy" />} />
          <Route path="/cookies" element={<CookiePolicy />} />
          <Route path="/cookie-policy" element={<Navigate replace to="/cookies" />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/signup" element={<Navigate replace to="/auth" />} />
          <Route path="/signin" element={<Navigate replace to="/auth" />} />
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
