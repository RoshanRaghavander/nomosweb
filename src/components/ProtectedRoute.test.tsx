import { act, render, screen } from '@testing-library/react'
import { type Session } from '@supabase/supabase-js'
import { afterEach, describe, expect, it } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

import ProtectedRoute from '@/components/ProtectedRoute'
import { useAuthStore } from '@/store/useAuthStore'

const sessionStub = {
  access_token: 'token',
  refresh_token: 'refresh',
  expires_in: 3600,
  token_type: 'bearer',
  user: {
    id: 'user-1',
    email: 'user@example.com',
    app_metadata: {},
    user_metadata: {},
    aud: 'authenticated',
    created_at: '2026-07-04T00:00:00.000Z',
  },
} as Session

function renderRoute(initialPath = '/dashboard') {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/" element={<div>Home page</div>} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <div>Private dashboard</div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </MemoryRouter>,
  )
}

afterEach(() => {
  act(() => {
    useAuthStore.getState().reset()
  })
})

describe('ProtectedRoute', () => {
  it('shows a loading state while auth is bootstrapping', () => {
    act(() => {
      useAuthStore.setState({ status: 'loading', session: null, profile: null, notice: null })
    })
    renderRoute()
    expect(screen.getByText(/Loading your Nomos account/)).toBeInTheDocument()
  })

  it('redirects signed-out users to the homepage', () => {
    act(() => {
      useAuthStore.setState({ status: 'ready', session: null, profile: null, notice: null })
    })
    renderRoute()
    expect(screen.getByText('Home page')).toBeInTheDocument()
  })

  it('renders protected content for authenticated users', () => {
    act(() => {
      useAuthStore.setState({ status: 'ready', session: sessionStub, profile: null, notice: null })
    })
    renderRoute()
    expect(screen.getByText('Private dashboard')).toBeInTheDocument()
  })
})
