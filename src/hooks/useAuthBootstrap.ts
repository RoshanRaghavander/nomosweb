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
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (error) {
          throw error
        }

        setSession(session)

        if (!session) {
          setProfile(null)
          setNotice(null)
          setStatus('ready')
          return
        }

        const profile = await fetchNomosProfile(session)
        setProfile(profile)
        setNotice(null)
        setStatus('ready')
      } catch (error) {
        console.error('Failed to bootstrap auth session', error)
        setSession(null)
        setProfile(null)
        setNotice('Nomos could not restore your session. Refresh the page and try again.')
        setStatus('ready')
      }
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
        useAuthStore.getState().setNotice(null)
        setCurrentStatus('ready')
        return
      }

      void fetchNomosProfile(session)
        .then((profile) => {
          const latestStore = useAuthStore.getState()
          latestStore.setProfile(profile)
          latestStore.setNotice(null)
          latestStore.setStatus('ready')
        })
        .catch((error) => {
          console.error('Failed to refresh auth state', error)
          const latestStore = useAuthStore.getState()
          latestStore.setNotice('Nomos could not refresh the latest account state.')
          latestStore.setStatus('ready')
        })
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])
}
