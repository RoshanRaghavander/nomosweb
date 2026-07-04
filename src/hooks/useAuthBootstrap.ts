import { useEffect, useRef } from 'react'

import { fetchNomosProfile, hasSupabaseEnv, supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store/useAuthStore'

export function useAuthBootstrap() {
  const initializedRef = useRef(false)

  useEffect(() => {
    if (initializedRef.current) {
      return
    }

    initializedRef.current = true

    const { setNotice, setProfile, setSession, setStatus } = useAuthStore.getState()

    if (!hasSupabaseEnv || !supabase) {
      setSession(null)
      setProfile(null)
      setStatus('missing-env')
      setNotice('Add your Supabase URL and publishable key to enable sign-in and live account data.')
      return
    }

    const syncSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      setSession(session)

      if (!session) {
        setProfile(null)
        setStatus('ready')
        return
      }

      const profile = await fetchNomosProfile(session)
      setProfile(profile)
      setStatus('ready')
    }

    void syncSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const { setProfile: setCurrentProfile, setSession: setCurrentSession, setStatus: setCurrentStatus } =
        useAuthStore.getState()

      setCurrentSession(session)

      if (!session) {
        setCurrentProfile(null)
        setCurrentStatus('ready')
        return
      }

      void fetchNomosProfile(session).then((profile) => {
        const latestStore = useAuthStore.getState()
        latestStore.setProfile(profile)
        latestStore.setStatus('ready')
      })
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])
}
