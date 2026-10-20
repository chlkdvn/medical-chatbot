import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { MedLogo, IcoBrain, IcoLungs, IcoHeart, IcoLiver, IcoStomach, IcoGut, IcoBone, IcoDumbbell, IcoDrop, SendArrow } from './icons'
import { Accent } from './Accent'
import { speak as narrate, stopSpeaking, stripForSpeech, canSpeak } from '../voice'
import { useAuth } from '../auth'

const SESSION_KEY = 'medbot-session'

const sessionId = (() => {
  let id = localStorage.getItem(SESSION_KEY)
  if (!id) {
    id = 's-' + Math.random().toString(36).slice(2) + Date.now().toString(36)
    localStorage.setItem(SESSION_KEY, id)
  }
  return id
})()

const ORGANS = [
  {
    id: 'brain',
    name: 'The brain',
    part: 'brain',
    lessonId: 'brain',
    hue: 'var(--teal)',
    tint: 'var(--gTeal)',
    Icon: IcoBrain,
    voice:
      'Here is the brain. It weighs about three pounds, runs on a fifth of all your energy, and connects eighty six billion neurons. Watch it shimmer - that is how a thought travels, at up to two hundred and fifty miles an hour. Ask me how it works, or ask for a fact.',
    blurb:
      'Three pounds, twenty percent of your energy, eighty-six billion neurons. The shimmer you see is a signal racing through it.',
    spot: { x: 50, y: 10.5 },
    halo: { cx: 180, cy: 62, r: 30 },
  },
  {
    id: 'lungs',
    name: 'The lungs',
    part: 'lungs',
    lessonId: 'lungs',
    hue: 'var(--teal)',
    tint: 'var(--gSky)',
    Icon: IcoLungs,
    voice:
      'These are your lungs, working right now, just like you. Watch them rise and settle. Your diaphragm pulls air in, and tiny air sacs trade oxygen for carbon dioxide before the air leaves again. Ask about breathing, or say quiz.',
    blurb:
      'They rise and settle on their own. Inside every breath: the diaphragm pulls, air arrives, and around three hundred million sacs trade oxygen for carbon dioxide.',
    spot: { x: 42, y: 40 },
    halo: { cx: 138, cy: 256, r: 62 },
  },
  {
    id: 'heart',
    name: 'The heart',
    part: 'heart',
    lessonId: 'heart',
    hue: 'var(--terra)',
    tint: 'rgba(196, 82, 42, 0.14)',
    Icon: IcoHeart,
    voice:
      'This is the heart, beating without a pause. Every pulse in the picture stands for a real beat, about one hundred thousand every single day. It carries its own electrical system, so it never waits for instructions. Ask anything, or say quiz.',
    blurb:
      'Each pulse is one of the hundred thousand beats it manages daily. It has its own electrical wiring, so it keeps time from before you were born.',
    spot: { x: 55, y: 41 },
    halo: { cx: 196, cy: 254, r: 36 },
  },
  {
    id: 'liver',
    name: 'The liver',
    part: 'liver',
    lessonId: 'digestive',
    hue: 'var(--terra)',
    tint: 'rgba(232, 160, 32, 0.18)',
    Icon: IcoLiver,
    voice:
      'Meet the liver, your personal factory. It runs over five hundred jobs: filtering blood, storing energy, and making the bile that digests fat. One of its tricks is regrowing itself. Ask about its work, or say quiz.',
    blurb:
      'A filter, a chemical plant and a pantry in one. Over five hundred jobs, and it can regrow itself when part is removed.',
    spot: { x: 40, y: 55 },
    halo: { cx: 154, cy: 342, r: 56 },
  },
  {
    id: 'stomach',
    name: 'The stomach',
    part: 'stomach',
    lessonId: 'digestive',
    hue: 'var(--leaf)',
    tint: 'var(--gLeaf)',
    Icon: IcoStomach,
    voice:
      'Here is the stomach, churning your food into a warm soup. Strong acid does the first stage of the work while the muscle wall squeezes from every direction. It even replaces its own lining every few days. Ask how the mixing helps, or say quiz.',
    blurb:
      'It folds food into a warm, acid soup and renews its lining every few days so the acid never wins.',
    spot: { x: 64.5, y: 56 },
    halo: { cx: 236, cy: 350, r: 36 },
  },
  {
    id: 'gut',
    name: 'The gut',
    part: 'gut',
    lessonId: 'digestive',
    hue: 'var(--leaf)',
    tint: 'var(--gLeaf)',
    Icon: IcoGut,
    voice:
      'This coiled tube is the gut. Around thirty feet of it. The gentle wave you see is peristalsis, the muscle wave that moves food onward while your body absorbs everything useful. Ask for a gut health tip, or say quiz.',
    blurb:
      'About thirty feet of tube, waving food along. The wave has a name: peristalsis. Most of your immune system lives down here too.',
    spot: { x: 51, y: 72.5 },
    halo: { cx: 186, cy: 448, r: 66 },
  },
  {
    id: 'bones',
    name: 'The bones',
    part: 'skeleton',
    lessonId: 'bones',
    hue: 'var(--ochre)',
    tint: 'rgba(232, 160, 32, 0.12)',
    Icon: IcoBone,
    voice:
      'These are your bones, the frame you live inside. Watch the ribs sway. Bone is not dead material - it is living tissue that repairs itself, makes blood cells in its marrow, and stores minerals you need every day. Ask how it works, or say quiz.',
    blurb:
      'A living frame. Twenty six hundred bones at birth, two hundred six for grownups, and the whole structure rebuilds itself your whole life.',
    spot: { x: 50, y: 38 },
    halo: { cx: 180, cy: 255, r: 88 },
  },
  {
    id: 'muscles',
    name: 'The muscles',
    part: 'muscle',
    lessonId: 'exercise',
    hue: 'var(--spring)',
    tint: 'var(--gSpring)',
    Icon: IcoDumbbell,
    voice:
      'Here is your muscle, flexing just for you. Every time it tightens, it tugs the bone attached to it. Muscles burn energy as they work, and after exercise they mend themselves stronger. Keep yours moving. Ask anything, or say quiz.',
    blurb:
      'Flex, pull, repeat. Muscles tug on bones to move you, burn energy all day, and rebuild stronger after every workout.',
    spot: { x: 78.5, y: 37 },
    halo: { cx: 284, cy: 244, r: 44 },
  },
  {
    id: 'kidneys',
    name: 'The kidneys',
    part: 'kidneys',
    lessonId: 'hydration',
    hue: 'var(--teal)',
    tint: 'var(--gSky)',
    Icon: IcoDrop,
    voice:
      'These bean shaped helpers are your kidneys. Watch them squeeze - about two hundred litres of blood pass through them every day, and they keep only the water and salts your body needs, sending the rest away. Drink water and they hum along. Ask a tip, or say quiz.',
    blurb:
      'Two quiet filters that clean about two hundred litres of blood daily and decide exactly which water you keep.',
    spot: { x: 51, y: 51 },
    halo: { cx: 180, cy: 316, r: 52 },
  },
]

const ORGAN_BY_LESSON = {
  brain: 'brain',
  lungs: 'lungs',
  heart: 'heart',
  digestive: 'liver',
  bones: 'bones',
  exercise: 'muscles',
  hydration: 'kidneys',
}

const QUESTIONS = (o) => [
  { label: 'How does it work?', msg: `How does the ${o.part} work?` },
  { label: 'Keep it healthy', msg: `How do I keep my ${o.part} healthy?` },
  { label: 'A fun fact', msg: `Tell me a fact about my ${o.part}` },
  { label: 'Quiz me', msg: 'Give me a quiz' },
]

function richText(text) {
  return text.split(/\*\*(.+?)\*\*/g).map((part, i) => (i % 2 ? <b key={i}>{part}</b> : part))
}

export default function Explore() {
  const navigate = useNavigate()
  const { session } = useAuth()
  const [params] = useSearchParams()
  const focus = ORGAN_BY_LESSON[params.get('focus')] || 'brain'

  const [active, setActive] = useState(focus)
  const [speaking, setSpeaking] = useState(false)
  const [autoVoice, setAutoVoice] = useState(true)
  const [threads, setThreads] = useState({})
  const [draft, setDraft] = useState('')
  const threadEnd = useRef(null)

  const organ = ORGANS.find((o) => o.id === active) || ORGANS[0]
  const thread = threads[organ.id] || []

  useEffect(() => () => stopSpeaking(), [])

  useEffect(() => {
    setActive(ORGAN_BY_LESSON[params.get('focus')] || 'brain')
  }, [params])

  useEffect(() => {
    threadEnd.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [thread.length, speaking])

  function speak(text) {
    if (!canSpeak) return
    stopSpeaking()
    narrate(stripForSpeech(text), {
      onStart: () => setSpeaking(true),
      onEnd: () => setSpeaking(false),
      onError: () => setSpeaking(false),
    })
  }

  const stopVoice = () => {
    stopSpeaking()
    setSpeaking(false)
  }

  const pick = (id) => {
    stopVoice()
    setActive(id)
    if (autoVoice) {
      const o = ORGANS.find((x) => x.id === id)
      speak(o.voice)
    }
  }

  const send = async (display, wire) => {
    const o = ORGANS.find((x) => x.id === active)
    setThreads((prev) => ({ ...prev, [o.id]: [...(prev[o.id] || []), { role: 'user', text: display }] }))

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
        },
        body: JSON.stringify({ message: wire, character: 'alex', lesson: o.lessonId, sessionId }),
      })
      const data = await res.json()
      setThreads((prev) => ({
        ...prev,
        [o.id]: [...(prev[o.id] || []), { role: 'bot', text: data.response }],
      }))
      speak(stripForSpeech(data.response))
    } catch {
      const offline = 'The explainer is offline for a moment - try one more time?'
      setThreads((prev) => ({
        ...prev,
        [o.id]: [...(prev[o.id] || []), { role: 'bot', text: offline }],
      }))
      speak(offline)
    }
  }

  const ask = (chipMsg) => send(chipMsg.label, chipMsg.msg)

  const sendDraft = () => {
    const value = draft.trim()
    if (!value) return
    setDraft('')
    send(value, value)
  }

  return (
    <div className="landing">
      <div className="anat">
        <header className="anat-top">
          <button className="mark" onClick={() => navigate('/')} aria-label="Back to home">
            <MedLogo size={26} />
            MedBot
          </button>
          <div className="pair anat-topbtns">
            <button className="b2 anat-mini" onClick={() => navigate('/')}>Characters</button>
            <button className="b1 anat-mini" onClick={() => navigate('/chat/maya')}>Open the chat</button>
          </div>
        </header>

        <p className="anat-eyebrow">The live section</p>
        <div className="anat-title">
          <h2>
            Your body, live <Accent>on stage</Accent>
          </h2>
          <p className="anat-sub">
            Pick an organ and watch it work. A voice-over tells you what it does -
            and you can ask it questions without leaving the page.
          </p>
        </div>

        <div className="anat-tabs">
          {ORGANS.map((o) => (
            <button
              key={o.id}
              className={`anat-tab${o.id === active ? ' is-on' : ''}`}
              style={{ '--tab-fill': o.tint, '--tab-hue': o.hue }}
              onClick={() => pick(o.id)}
            >
              <span className="tab-ico"><o.Icon size={15} strokeWidth={2} /></span>
              {o.name}
            </button>
          ))}
        </div>

        <div className="anat-wrap">
          {/* ── Motion canvas ─────────────────────────────────────────── */}
          <div className="anat-body">
            <svg className="anat-canvas" viewBox="0 0 360 620" role="img" aria-label="Animated section of the human body with organ highlights">
              <g fill="none" stroke="var(--ink2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.85">
                <path d="M138 566 v 22 M222 566 v 22" />
                <path d="M158 116 L158 150 M202 116 L202 150" stroke="var(--ink)" />
              </g>

              {organ.halo && (
                <circle
                  className="anat-halo"
                  cx={organ.halo.cx}
                  cy={organ.halo.cy}
                  r={organ.halo.r}
                  stroke={organ.hue}
                  strokeWidth="2"
                />
              )}

              <g fill="none" strokeLinecap="round" strokeLinejoin="round">
                {/* torso silhouette */}
                <path
                  d="M76 150 C108 128 252 128 284 150 C310 200 312 280 300 350 C292 420 290 480 282 542 C262 566 98 566 78 542 C70 480 68 420 60 350 C48 280 50 200 76 150 Z"
                  fill="#fffdf8"
                  stroke="var(--ink)"
                  strokeWidth="2.6"
                />
                <circle cx="180" cy="78" r="46" fill="#fffdf8" stroke="var(--ink)" strokeWidth="2.6" />

                {/* trachea */}
                <path d="M180 156 v 26 M180 182 c -7 4 -13 10 -16 16 M180 182 c 7 4 13 10 16 16" opacity="0.65" />

                {/* bones - ghost ribcage behind the organs */}
                <g className="anat-anim-ribs" fill="none" stroke="var(--ink)" strokeWidth="1.6" opacity="0.42">
                  <path d="M180 158 v 196" strokeWidth="2" />
                  <path d="M180 172 c -10 1 -17 4 -20 9 M180 172 c 10 1 17 4 20 9" />
                  <path d="M180 194 C 157 198 133 224 129 254 M180 194 C 203 198 227 224 231 254" />
                  <path d="M180 234 C 153 238 135 262 133 290 M180 234 C 207 238 225 262 227 290" />
                  <path d="M180 274 C 157 278 143 300 141 322 M180 274 C 203 278 217 300 219 322" />
                  <path d="M180 314 C 161 318 151 334 149 352 M180 314 C 199 318 209 334 211 352" />
                </g>

                {/* brain */}
                <g className="anat-anim-brain" fill="rgba(42,126,136,0.12)" stroke="var(--teal)" strokeWidth="2.3">
                  <path d="M180 46 c -6.5 0 -11 4.6 -11 10.2 -6 0.3 -11.2 5.7 -11.2 12.4 0 2.2 0.6 4.3 1.5 6.1 -3.7 2.9 -5.5 7.2 -5.5 11.3 0 6.6 4.9 12 11.2 12.9 0.8 6 5.6 10.8 11.8 11 h 3.2 Z" />
                  <path d="M180 46 c 6.5 0 11 4.6 11 10.2 6 0.3 11.2 5.7 11.2 12.4 0 2.2 -0.6 4.3 -1.5 6.1 3.7 2.9 5.5 7.2 5.5 11.3 0 6.6 -4.9 12 -11.2 12.9 -0.8 6 -5.6 10.8 -11.8 11" />
                  <path d="M180 46 v 64" strokeWidth="1.6" />
                </g>

                {/* lungs */}
                <g className="anat-anim-lungL" fill="rgba(42,126,136,0.10)" stroke="var(--teal)" strokeWidth="2.3">
                  <path d="M140 196 C118 202 106 232 108 262 C110 292 124 310 142 308 C158 306 164 286 164 262 L164 204 C164 196 152 194 140 196 Z" />
                </g>
                <g className="anat-anim-lungR" fill="rgba(42,126,136,0.10)" stroke="var(--teal)" strokeWidth="2.3">
                  <path d="M220 196 C242 202 254 232 252 262 C250 292 236 310 218 308 C202 306 196 286 196 262 L196 204 C196 196 208 194 220 196 Z" />
                </g>

                {/* heart */}
                <g className="anat-anim-heart" fill="rgba(196,82,42,0.16)" stroke="var(--terra)" strokeWidth="2.4">
                  <path d="M196 236 C186 222 166 224 164 242 C162 257 175 269 196 284 C217 269 230 257 228 242 C226 224 206 222 196 236 Z" />
                </g>

                {/* liver */}
                <g className="anat-anim-liver" fill="rgba(232,160,32,0.18)" stroke="var(--terra)" strokeWidth="2.3">
                  <path d="M112 322 L202 322 C210 322 212 328 208 335 C197 357 177 368 149 368 C127 368 116 352 112 322 Z" />
                  <path d="M148 322 c2 18 -6 30 -20 38" strokeWidth="1.7" opacity="0.7" />
                </g>

                {/* stomach */}
                <g className="anat-anim-stomach" fill="rgba(63,169,104,0.13)" stroke="var(--leaf)" strokeWidth="2.3">
                  <path d="M212 344 C214 330 232 324 244 334 C256 344 256 364 244 372 C232 380 218 376 214 366 C212 360 210 352 212 344 Z" />
                  <path d="M244 334 c6 -6 14 -6 20 0" strokeWidth="1.7" opacity="0.7" />
                </g>

                {/* muscle - a right-arm bicep flexing */}
                <g className="anat-anim-biceps" fill="rgba(63,169,104,0.15)" stroke="var(--spring)" strokeWidth="2.3">
                  <path d="M280 192 C 293 213 298 242 289 264 C 284 280 275 287 268 284 C 260 279 257 265 262 247 C 266 226 271 206 280 192 Z" />
                  <path d="M268 284 C 262 298 252 310 240 318" strokeWidth="1.9" opacity="0.8" />
                  <path d="M280 192 C 291 197 295 206 295 212" strokeWidth="1.6" opacity="0.6" />
                </g>

                {/* kidneys + ureters */}
                <g className="anat-anim-kidL" fill="rgba(42,126,136,0.13)" stroke="var(--teal)" strokeWidth="2.2">
                  <path d="M156 296 C 146 300 144 312 151 322 C 157 331 169 330 173 321 C 176 313 172 302 166 297 C 162 294 159 294 156 296 Z" />
                </g>
                <g className="anat-anim-kidR" fill="rgba(42,126,136,0.13)" stroke="var(--teal)" strokeWidth="2.2">
                  <path d="M204 296 C 214 300 216 312 209 322 C 203 331 191 330 187 321 C 184 313 188 302 194 297 C 198 294 201 294 204 296 Z" />
                </g>
                <g fill="none" stroke="var(--teal)" strokeWidth="1.6" opacity="0.55">
                  <path d="M167 326 c 5 10 2 19 -6 27" />
                  <path d="M193 326 c -5 10 -2 19 6 27" />
                </g>

                {/* gut */}
                <g className="anat-anim-gut" fill="rgba(42,126,136,0.09)" stroke="var(--teal)" strokeWidth="2.3">
                  <path d="M116 420 C114 404 132 396 186 396 C240 396 258 404 256 420 C260 470 240 500 186 500 C132 500 112 470 116 420 Z" />
                  <path d="M138 430 c 20 -12 40 12 60 0 c 20 -12 40 12 58 0" strokeWidth="1.8" />
                  <path d="M136 456 c 20 -12 40 12 60 0 c 20 -12 40 12 58 0" strokeWidth="1.8" />
                  <path d="M142 480 c 18 -10 36 10 54 0" strokeWidth="1.8" />
                </g>
              </g>
            </svg>

            {ORGANS.map((o) => (
              <button
                key={o.id}
                className={`anat-spot${o.id === active ? ' is-on' : ''}`}
                style={{ left: `${o.spot.x}%`, top: `${o.spot.y}%`, '--spot': o.hue }}
                onClick={() => pick(o.id)}
                aria-label={o.name}
              >
                <i />
              </button>
            ))}

            <p className="anat-tip">
              {speaking ? 'Narrating - watch the movement' : 'Click a glowing spot to hear it'}
            </p>
          </div>

          {/* ── Narration panel ───────────────────────────────────────── */}
          <aside className="anat-panel" style={{ '--panel-hue': organ.hue, '--panel-tint': organ.tint }}>
            <p className="anat-kind">{organ.name} - lives on stage, questions welcome</p>
            <h3>{organ.name}</h3>
            <p className="anat-blurb">{organ.blurb}</p>

            <div className="anat-voice">
              <button
                className="anat-play"
                onClick={() => (speaking ? stopVoice() : speak(organ.voice))}
              >
                {speaking ? 'Pause the voice-over' : 'Hear it explained'}
              </button>
              {speaking && (
                <span className="anat-vo-eq" aria-hidden><i /><i /><i /><i /></span>
              )}
              <label className="anat-autoey">
                <input type="checkbox" checked={autoVoice} onChange={(e) => setAutoVoice(e.target.checked)} />
                Auto-play on pick
              </label>
            </div>

            {!canSpeak && (
              <p className="anat-lease">
                This browser does not expose a speech engine, so the voice-over is unavailable - the animation still plays.
              </p>
            )}

            <p className="anat-aske">Ask about the {organ.part}</p>
            <div className="anat-chips">
              {QUESTIONS(organ).map((q) => (
                <button key={q.label} className="anat-chip" onClick={() => ask(q)}>
                  {q.label}
                </button>
              ))}
            </div>

            {thread.length > 0 && (
              <div className="anat-thread">
                {thread.slice(-8).map((m, i) => (
                  <div key={i} className={`anat-msg ${m.role}`}>
                    {m.role === 'bot' ? richText(m.text) : m.text}
                  </div>
                ))}
                <div ref={threadEnd} />
              </div>
            )}

            {thread.length > 0 && (
              <form
                className="anat-field"
                onSubmit={(e) => {
                  e.preventDefault()
                  sendDraft()
                }}
              >
                <input
                  type="text"
                  className="anat-input"
                  placeholder="Type your answer, or ask anything..."
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  aria-label="Answer or question"
                />
                <button type="submit" className="anat-field-btn" disabled={!draft.trim()} aria-label="Send answer">
                  <SendArrow size={16} strokeWidth={2} />
                </button>
              </form>
            )}

            <p className="anat-lease">
              Voice-over uses your browser's built-in speech engine. Behind the scenes this page talks to the same explainer as the chat.
            </p>
          </aside>
        </div>
      </div>
    </div>
  )
}
