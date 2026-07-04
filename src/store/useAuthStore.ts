import { type Session } from '@supabase/supabase-js'
import { create } from 'zustand'

import { type NomosProfile } from '@/lib/supabase'

export type AuthStatus = 'loading' | 'ready' | 'missing-env'

interface AuthStore {
  status: AuthStatus
  session: Session | null
  profile: NomosProfile | null
  notice: string | null
  setStatus: (status: AuthStatus) => void
  setSession: (session: Session | null) => void
  setProfile: (profile: NomosProfile | null) => void
  setNotice: (notice: string | null) => void
  reset: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  status: 'loading',
  session: null,
  profile: null,
  notice: null,
  setStatus: (status) => set({ status }),
  setSession: (session) => set({ session }),
  setProfile: (profile) => set({ profile }),
  setNotice: (notice) => set({ notice }),
  reset: () =>
    set({
      status: 'loading',
      session: null,
      profile: null,
      notice: null,
    }),
}))
