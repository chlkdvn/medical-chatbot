import { useEffect, useMemo, useRef, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { CHARACTER_MAP, CharacterAvatar, LessonIcon, MedLogo, ArrowLeft, SendArrow, Menu, Check, Sparkle, IcoSpeaker, IcoSpeakerOff } from './icons'
import { EASE_OUT } from '../motion'
import { useAuth, displayName, userInitial } from '../auth'
import { supabase } from '../supabase'
import { speak, stopSpeaking, stripForSpeech, canSpeak } from '../voice'
/* Fallback lesson map — used until /api/lessons answers, or if the server is down. */
const FALLBACK_LESSONS = {
  'Body Basics': [
    { id: 'heart', title: 'The Heart & Circulation', description: 'How blood moves you' },
    { id: 'lungs', title: 'How Lungs Work', description: 'Breathing explained' },
    { id: 'digestive', title: 'Digestive System', description: 'The food journey' },
    { id: 'brain', title: 'Brain & Nervous System', description: 'The control center' },
    { id: 'bones', title: 'Bones & Muscles', description: 'Your movement system' },
  ],
  'Health & Wellness': [
    { id: 'nutrition', title: 'Healthy Eating', description: 'Balanced basics' },
    { id: 'exercise', title: 'Exercise & Fitness', description: 'Stay active' },
    { id: 'sleep', title: 'Sleep Health', description: 'Better rest' },
    { id: 'stress', title: 'Stress Management', description: 'A calmer mind' },
    { id: 'hydration', title: 'Hydration', description: 'Water essentials' },
  ],
  'First Aid': [
    { id: 'cpr', title: 'CPR Basics', description: 'Be ready to help' },
    { id: 'cuts', title: 'Treating Cuts & Burns', description: 'Wound care' },
    { id: 'choking', title: 'Choking Response', description: 'Fast response' },
    { id: 'emergencies', title: 'Recognizing Emergencies', description: 'Know the signs' },
  ],
  'Common Conditions': [
    { id: 'cold', title: 'Cold & Flu', description: 'Seasonal illness' },
    { id: 'headaches', title: 'Headaches', description: 'Causes and relief' },
    { id: 'allergies', title: 'Allergies', description: 'Triggers and care' },
  ],
}

const QUICK_REPLIES = [
  'Tell me about this topic',
  'Give me a quiz',
  'What should I know?',
  'Can you explain more?',
]

const PROGRESS_KEY = 'medbot-progress'
const SESSION_KEY = 'medbot-session'
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

/** Renders **bold** spans inside bot copy. */
function richText(text) {
  return text.split(/\*\*(.+?)\*\*/g).map((part, i) => (i % 2 ? <b key={i}>{part}</b> : part))
}

const loadCompleted = () => {
  try {
    const raw = JSON.parse(localStorage.getItem(PROGRESS_KEY) || '[]')
    return Array.isArray(raw) ? raw.filter((x) => typeof x === 'string') : []
  } catch {
    return []
  }
}

const sessionId = (() => {
  let id = localStorage.getItem(SESSION_KEY)
  if (!id) {
    id = 's-' + Math.random().toString(36).slice(2) + Date.now().toString(36)
    localStorage.setItem(SESSION_KEY, id)
  }
  return id
})()

export default function Chat() {
  const { characterId } = useParams()
  const navigate = useNavigate()
  const char = CHARACTER_MAP[characterId] || CHARACTER_MAP.maya

  const [lessons, setLessons] = useState(FALLBACK_LESSONS)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [activeLesson, setActiveLesson] = useState(null)
  const [completed, setCompleted] = useState(loadCompleted)
  const [sideOpen, setSideOpen] = useState(false)
  const [readAloud, setReadAloud] = useState(() => {
    try { return localStorage.getItem('medbot-read-aloud') !== 'off' } catch { return true }
  })

  const { session, ready, signOut } = useAuth()
  const user = session?.user ?? null

  const endRef = useRef(null)
  const flowRef = useRef(null)

  const allLessons = useMemo(() => Object.values(lessons).flat(), [lessons])
  const lessonById = useMemo(() => Object.fromEntries(allLessons.map((l) => [l.id, l])), [allLessons])
  const allLessonIds = useMemo(() => allLessons.map((l) => l.id), [allLessons])
  const total = allLessons.length
  const progress = total ? Math.round((Math.min(completed.length, total) / total) * 100) : 0

  /* Lessons + progress */
  useEffect(() => {
    let alive = true
    fetch('/api/lessons')
      .then((r) => r.json())
      .then((data) => {
        if (alive && data && Object.keys(data).length) {
          setLessons(data)
        }
      })
      .catch(() => {})
    return () => { alive = false }
  }, [])

  /* Signed in? Pull progress from Supabase; otherwise keep local memory */
  useEffect(() => {
    let alive = true
    if (!user) return
    supabase
      .from('progress')
      .select('lessons')
      .eq('user_id', user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (!alive) return
        if (data && Array.isArray(data.lessons) && data.lessons.length) {
          const local = loadCompleted()
          const merged = Array.from(new Set([...(data.lessons), ...local]))
          setCompleted(merged)
        }
      })
      .catch(() => {})
    return () => { alive = false }
  }, [user])

  /* Read-aloud on/off */
  useEffect(() => {
    try { localStorage.setItem('medbot-read-aloud', readAloud ? 'on' : 'off') } catch {}
    if (!readAloud) stopSpeaking()
  }, [readAloud])

  /* Narrates bot answers (skipped when the user silences me) */
  const say = (text) => {
    if (!readAloud || !canSpeak || !text) return
    speak(stripForSpeech(text))
  }

  /*Signed in => every line lands in the user's messages table */
  const persistMessage = (sender, text, lesson) => {
    if (!user) return
    supabase
      .from('messages')
      .insert({ character_id: char.id, sender, text, lesson })
      .then(() => {}, () => {})
  }

  /* Hush the narrator when leaving the chat room */
  useEffect(() => () => stopSpeaking(), [])

  /* Welcome message per character */
  useEffect(() => {
    setMessages([
      {
        id: 1,
        type: 'bot',
        charId: char.id,
        text: `Hi, I'm ${char.name}. I keep things simple and honest.\n\nPick a lesson from the list, or just ask me anything about your health.\n\nWhat would you like to explore today?`,
      },
    ])
    setInput('')
  }, [char.id])

  /* Signed in? Pull history for this character from Supabase */
  useEffect(() => {
    let alive = true
    if (!user) return
    supabase
      .from('messages')
      .select('sender, text, lesson')
      .eq('character_id', char.id)
      .order('id', { ascending: false })
      .limit(60)
      .then(({ data, error }) => {
        if (!alive || error || !data || !data.length) return
        const rows = [...data].reverse()
        setMessages(rows.map((r, i) => ({
          id: 1_000_000 + i,
          type: r.sender === 'bot' ? 'bot' : 'user',
          text: r.text,
          charId: char.id,
        })))
        const last = rows[rows.length - 1]
        if (last.lesson && allLessonIds.includes(last.lesson)) {
          setActiveLesson(last.lesson)
        }
      })
    return () => { alive = false }
  }, [user, char.id])

  /* Completed lessons: mirror locally + push to the user's Supabase row */
  useEffect(() => {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(completed))
    if (!user) return
    supabase
      .from('progress')
      .upsert(
        { user_id: user.id, lessons: completed, updated_at: new Date().toISOString() },
        { onConflict: 'user_id' },
      )
      .then(() => {}, () => {})
  }, [completed, user])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages, isTyping])

  const whoTint = { '--who-tint': `var(${char.tintVar})` }

  const sendMessage = async (text = input) => {
    const value = (text || '').trim()
    if (!value || isTyping) return

    const userMsg = { id: Date.now(), type: 'user', text: value }
    setMessages((prev) => [...prev, userMsg])
    persistMessage('user', value, activeLesson)
    setInput('')
    setIsTyping(true)

    try {
      const [res] = await Promise.all([
        fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: value,
            character: char.id,
            lesson: activeLesson,
            sessionId,
          }),
        }),
        sleep(650 + Math.random() * 700),
      ])
      const data = await res.json()

      setIsTyping(false)
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, type: 'bot', charId: char.id, text: data.response },
      ])
      say(data.response)
      persistMessage('bot', data.response, activeLesson)

      if (data.lessonCompleted && typeof data.lessonCompleted === 'string' && lessonById[data.lessonCompleted]) {
        setCompleted((prev) => (prev.includes(data.lessonCompleted) ? prev : [...prev, data.lessonCompleted]))
      }
    } catch {
      setIsTyping(false)
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          type: 'bot',
          charId: char.id,
          text: "I can't reach my notes right now — the connection dropped. Try again in a moment?",
        },
      ])
    }
  }

  const handleLessonSelect = (lesson) => {
    setActiveLesson(lesson.id)
    setSideOpen(false)
    setMessages((prev) => [
      ...prev,
      { id: Date.now() + 2, type: 'user', text: lesson.title },
    ])
    persistMessage('user', lesson.title, lesson.id)
    setIsTyping(true)
    fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: `Let's start the lesson: ${lesson.title}`,
        character: char.id,
        lesson: lesson.id,
        sessionId,
      }),
    })
      .then((r) => r.json())
      .then(async (data) => {
        await sleep(500 + Math.random() * 500)
        setIsTyping(false)
        setMessages((prev) => [
          ...prev,
          { id: Date.now() + 3, type: 'bot', charId: char.id, text: data.response },
        ])
        say(data.response)
        persistMessage('bot', data.response, lesson.id)
        window.history.replaceState(null, '', `/chat/${characterId}`)
      })
      .catch(() => {
        setIsTyping(false)
        setMessages((prev) => [
          ...prev,
          { id: Date.now() + 3, type: 'bot', charId: char.id, text: 'I could not open that lesson just now. Try again?' },
        ])
      })
  }

  const activeTitle = activeLesson && lessonById[activeLesson] ? lessonById[activeLesson].title : 'Welcome'

  const RING_R = 20
  const CIRC = 2 * Math.PI * RING_R

  return (
    <div className={`medi${sideOpen ? ' sidebar-open' : ''}`} style={whoTint}>
      {/* ── Sidebar ────────────────────────────────────────────────── */}
      <aside className="md-side">
        <div className="md-brand">
          <button className="md-mark" onClick={() => navigate('/')} aria-label="Back to characters">
            <span className="med-badge"><MedLogo size={20} /></span>
            MedBot
          </button>
        </div>
        <button className="md-back" onClick={() => navigate('/')}>
          <ArrowLeft size={15} />
          All characters
        </button>

        <div className="md-who">
          <span className="md-ava"><CharacterAvatar id={char.id} size={52} /></span>
          <div>
            <b>{char.name}</b>
            <small>{char.role}</small>
          </div>
        </div>

        <nav className="md-lessons" aria-label="Lessons">
          {Object.entries(lessons).map(([category, items]) => (
            <div key={category}>
              <h3 className="md-cat">{category}</h3>
              {items.map((lesson) => (
                <button
                  key={lesson.id}
                  className={`md-lesson${activeLesson === lesson.id ? ' is-on' : ''}`}
                  onClick={() => handleLessonSelect(lesson)}
                >
                  <span className="md-lico"><LessonIcon id={lesson.id} size={19} /></span>
                  <span className="md-ltxt">
                    <b>{lesson.title}</b>
                    <small>{lesson.description}</small>
                  </span>
                  {completed.includes(lesson.id) && (
                    <span className="md-done" title="Lesson complete" aria-label="Lesson complete"><Check size={11} strokeWidth={3} /></span>
                  )}
                </button>
              ))}
            </div>
          ))}
        </nav>

        {user ? (
          <div className="md-account">
            <span className="md-account-dot">{userInitial(user)}</span>
            <div className="md-account-txt">
              <b title={user.email}>{displayName(user)}</b>
              <small>Progress syncing to cloud</small>
            </div>
            <button className="md-signout" onClick={() => signOut()}>
              Sign out
            </button>
          </div>
        ) : (
          ready && (
            <button className="md-signin" onClick={() => navigate('/login')}>
              Log in to save your progress across devices
            </button>
          )
        )}

        <button
          className="md-explore"
          onClick={() => navigate(`/explore${activeLesson ? `?focus=${activeLesson}` : ''}`)}
        >
          <Sparkle size={16} />
          Watch the lesson in motion
        </button>
      </aside>

      {/* ── Main ───────────────────────────────────────────────────── */}
      <main className="md-main">
        <header className="md-head">
          <button className="md-burger" onClick={() => setSideOpen(true)} aria-label="Open lessons">
            <Menu size={20} />
          </button>
          <div className="md-topic">
            <h2>{activeTitle}</h2>
            <p>{char.name} is here to help</p>
          </div>
          {canSpeak && (
            <button
              className={`md-voice${readAloud ? '' : ' is-off'}`}
              onClick={() => setReadAloud(!readAloud)}
              aria-pressed={readAloud}
              title={readAloud ? 'I read every answer aloud - click to hush me' : 'Narration is off - click to hear answers'}
            >
              {readAloud ? <IcoSpeaker size={19} /> : <IcoSpeakerOff size={19} />}
            </button>
          )}
          <div className="md-ring" title={`${completed.length} of ${total} lessons complete`}>
            <span className="rtag">Progress</span>
            <span className="md-ring-svg-wrap">
              <svg viewBox="0 0 48 48">
                <circle className="rt" cx="24" cy="24" r={RING_R} fill="none" strokeWidth="5.5" />
                <motion.circle
                  className="rp"
                  cx="24"
                  cy="24"
                  r={RING_R}
                  fill="none"
                  strokeWidth="5.5"
                  strokeDasharray={CIRC}
                  initial={false}
                  animate={{ strokeDashoffset: CIRC * (1 - progress / 100) }}
                  transition={{ duration: 0.6, ease: EASE_OUT }}
                  transform="rotate(-90 24 24)"
                />
                <text className="rnum" x="24" y="28.6" textAnchor="middle">{progress}%</text>
              </svg>
            </span>
          </div>
        </header>

        <div className="md-flow" ref={flowRef}>
          {messages.length <= 1 && !activeLesson && (
            <motion.div
              className="md-hello"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: EASE_OUT }}
            >
              <span className="md-hava"><CharacterAvatar id={char.id} size={96} className="md-who-ava" /></span>
              <h2>Let's start learning</h2>
              <p>Choose a lesson from the sidebar, or ask me anything about health. Ask for a quiz when you're ready to test yourself.</p>
            </motion.div>
          )}

          <AnimatePresence initial={false}>
            {messages.map((m) => (
              <motion.div
                key={m.id}
                className={`md-msg ${m.type}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.32, ease: EASE_OUT }}
              >
                {m.type === 'bot' && (
                  <span className="md-ava"><CharacterAvatar id={m.charId || char.id} size={38} /></span>
                )}
                <div className="md-bubble">{richText(m.text)}</div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div
              className="md-type"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.25 }}
            >
              <span className="md-ava"><CharacterAvatar id={char.id} size={38} /></span>
              <div className="md-dots" aria-label={`${char.name} is typing`}>
                <span /><span /><span />
              </div>
            </motion.div>
          )}

          <div ref={endRef} />
        </div>

        <div className="md-compose">
          {messages.length > 1 && !activeLesson && (
            <div className="md-quick">
              {QUICK_REPLIES.map((r) => (
                <button key={r} className="md-chip" onClick={() => sendMessage(r)}>
                  {r}
                </button>
              ))}
            </div>
          )}
          <div className="md-field">
            <input
              type="text"
              className="md-input"
              placeholder={`Message ${char.name}...`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              aria-label="Message"
            />
            <button className="md-send" onClick={() => sendMessage()} disabled={!input.trim() || isTyping} aria-label="Send">
              <SendArrow size={18} strokeWidth={1.9} />
            </button>
          </div>
        </div>
      </main>

      {/* Close the mobile drawer when tapping through its backdrop */}
      {sideOpen && (
        <button
          aria-label="Close lessons"
          onClick={() => setSideOpen(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 35, width: '100%',
            background: 'transparent', border: 0, cursor: 'default',
          }}
        />
      )}
    </div>
  )
}
