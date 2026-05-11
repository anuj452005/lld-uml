'use client'

import { useEffect, useMemo } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useSessionStore } from '@/stores/sessionStore'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const setUser = useSessionStore((state) => state.setUser)
  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setUser(session.user)
      } else {
        setUser(null)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, setUser])

  return <>{children}</>
}
