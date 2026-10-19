import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from './supabase'

const AuthCtx = createContext({ session: null, user: null, ready: false, signOut: async () => {} })

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let alive = true
    supabase.auth.getSession().then(({ data }) => {
      if (alive) {
        setSession(data.session ?? null)
        setReady(true)
      }
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next)
      setReady(true)
    })
    return () => {
      alive = false
      if (sub && sub.subscription) sub.subscription.unsubscribe()
    }
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <AuthCtx.Provider value={{ session, user: session?.user ?? null, ready, signOut }}>
      {children}
    </AuthCtx.Provider>
  )
}

export function useAuth() {
  return useContext(AuthCtx)
}

/** Best-effort human name from Supabase metadata (Google supplies name/full_name). */
export function displayName(user) {
  const meta = user?.user_metadata || {}
  return (
    meta.full_name ||
    meta.name ||
    meta.preferred_username ||
    (user?.email ? user.email.split('@')[0] : 'Guest')
  )
}

export function userInitial(user) {
  const name = displayName(user)
  return (name || 'M').trim().charAt(0).toUpperCase()
}
