import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabaseConfigured = Boolean(url && anonKey)

/* Falls back to a harmless offline stub when keys are missing, so the app
   keeps running (guest/localStorage mode) without crashing in dev tools. */
export const supabase = supabaseConfigured
  ? createClient(url, anonKey)
  : {
      auth: {
        getSession: async () => ({ data: { session: null } }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }),
        signOut: async () => ({ error: null }),
        signInWithPassword: async () => ({ error: { message: 'Supabase keys are missing in .env' } }),
        signUp: async () => ({ error: { message: 'Supabase keys are missing in .env' } }),
        signInWithOAuth: async () => ({ error: { message: 'Supabase keys are missing in .env' } }),
      },
      from: (table) => {
        const fail = async () => ({ error: { message: 'Supabase keys are missing in .env' }, data: null })
        return {
          upsert: fail,
          select: (selector) => ({
            eq: () => ({ maybeSingle: fail, single: fail }),
          }),
        }
      },
    }
