import { create } from 'zustand'
import { User } from '@supabase/supabase-js'

interface SessionState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
}

export const useSessionStore = create<SessionState>((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  setUser: (user) => set({ 
    user, 
    isAuthenticated: !!user,
    isLoading: false 
  }),
  setLoading: (loading) => set({ isLoading: loading }),
}))
