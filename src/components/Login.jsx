import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'
import { useAuth } from '../auth'
import { MedLogo, Sparkle } from './icons'
import { Accent } from './Accent'

export default function Login() {
  const { session } = useAuth()
  const navigate = useNavigate()

  const [mode, setMode] = useState('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState(null)

  useEffect(() => {
    if (session) navigate('/', { replace: true })
  }, [session, navigate])

  const submit = async (e) => {
    e.preventDefault()
    if (busy) return
    setBusy(true)
    setMsg(null)
    if (mode === 'signup') {
      const { data, error } = await supabase.auth.signUp({ email, password })
      if (error) {
        setMsg({ kind: 'err', text: error.message })
      } else if (!data.session) {
        setMsg({ kind: 'ok', text: 'Account created. Check your inbox to confirm the address, then sign in here.' })
        setMode('signin')
      } else {
        navigate('/chat/maya')
        return
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setMsg({ kind: 'err', text: error.message })
      else {
        navigate('/chat/maya')
        return
      }
    }
    setBusy(false)
  }

  const google = async () => {
    setMsg(null)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + '/chat/maya' },
    })
    if (error) {
      setMsg({
        kind: 'err',
        text: error.message + ' (If it keeps failing, enable the Google provider under Supabase - Authentication - Providers.)',
      })
      setBusy(false)
    }
  }

  return (
    <div className="landing">
      <div className="auth">
        <Link className="marked home-mark" to="/" aria-label="Back to home">
          <MedLogo size={27} />
        </Link>

        <div className="auth-card">
          <h2>
            Pick up <Accent>where you left off</Accent>
          </h2>
          <p className="auth-sub">
            One account keeps your lesson progress safe across devices. Your medical questions stay yours.
          </p>

          <div className="seg" role="tablist" aria-label="Account mode">
            <button
              className={`seg-bg tab-signin${mode === 'signin' ? ' tab-on' : ''}`}
              onClick={() => { setMode('signin'); setMsg(null) }}
              role="tab"
              aria-selected={mode === 'signin'}
            >
              Sign in
            </button>
            <button
              className={`seg-bg tab-signup${mode === 'signup' ? ' tab-on' : ''}`}
              onClick={() => { setMode('signup'); setMsg(null) }}
              role="tab"
              aria-selected={mode === 'signup'}
            >
              Create account
            </button>
            <span className="seg-kid" />
          </div>

          <form className="auth-form" onSubmit={submit}>
            <label className="field">
              <span>Email</span>
              <input
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <label className="field">
              <span>Password</span>
              <input
                type="password"
                required
                minLength={6}
                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                placeholder={mode === 'signup' ? 'At least 6 characters' : 'Your password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>

            {msg && (
              <p className={`auth-msg ${msg.kind === 'ok' ? 'is-ok' : 'is-err'}`} role="alert">
                {msg.text}
              </p>
            )}

            <button className="go auth-go" type="submit" disabled={busy}>
              {busy ? 'Working...' : mode === 'signup' ? 'Create my account' : 'Sign in'}
            </button>
          </form>

          <div className="auth-or"><span>or</span></div>

          <button className="b2 auth-google" type="button" onClick={google} disabled={busy}>
            <span className="gmini"><Sparkle size={15} /></span>
            Continue with Google
          </button>

          <p className="auth-fine">
            Just visiting? <Link to="/chat/maya">Enter as a guest</Link> - progress stays on this device only.
          </p>
        </div>
      </div>
    </div>
  )
}
