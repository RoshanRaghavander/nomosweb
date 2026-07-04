import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import ProtectedRoute from '@/components/ProtectedRoute'
import { useAuthBootstrap } from '@/hooks/useAuthBootstrap'
import Billing from '@/pages/Billing'
import Dashboard from '@/pages/Dashboard'
import Home from '@/pages/Home'
import Pricing from '@/pages/Pricing'

export default function App() {
  useAuthBootstrap()

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
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
    </BrowserRouter>
  )
}
