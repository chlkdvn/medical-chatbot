import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth, displayName, userInitial } from '../auth'
import { Reveal } from '../motion'
import { Accent } from './Accent'
import { LessonIcon, MedLogo, CharacterAvatar, FIELD_SYMBOLS, buildPlacements, Sparkle, Star } from './icons'

const FAQS = [
  {
    q: 'Is MedBot a real doctor?',
    a: "No. MedBot is a teacher, not a clinician. The characters explain how the body works and how to handle small, everyday situations. For anything urgent, unusual or worrying, talk to a real healthcare professional.",
  },
  {
    q: 'Do I need to sign up to use it?',
    a: 'No sign-up, no email, no password. You pick a character, pick a lesson, and start chatting. Your lesson progress is saved in your browser so you can put it down and come back.',
  },
  {
    q: 'How do the quizzes work?',
    a: "Pick a lesson in the chat and ask for a quiz. Your character asks a question; think it over, then ask for the answer. Answer the question and the lesson is marked complete on your progress ring.",
  },
  {
    q: 'What happens to what I type?',
    a: 'Your messages are answered in memory on the server and are not stored or shared. Only your completed-lesson list is saved, and it lives in your own browser.',
  },
  {
    q: 'Can I change characters in the middle?',
    a: 'Any time. Each character keeps the same lesson library — they just explain it in their own style. Switch from the characters page in one click.',
  },
]

const NAV_LINKS = [
  { label: 'Characters', href: '#characters' },
  { label: 'How it works', href: '#how' },
  { label: 'Lessons', href: '#lessons' },
  { label: 'FAQ', href: '#faq' },
]

const heroHeight = 760

export default function Landing() {
  const navigate = useNavigate()
  const { user, signOut } = useAuth()
  const [sticky, setSticky] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const placements = buildPlacements(heroHeight)

  useEffect(() => {
    const onScroll = () => setSticky(window.scrollY > heroHeight - 80)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const startChat = (id = 'maya') => {
    navigate(`/chat/${id}`)
  }

  return (
    <div className="landing">
      {/* ── Nav (in-flow) ─────────────────────────────────────────────── */}
      <header className={`nav${menuOpen ? ' is-open' : ''}`}>
        <button className="mark" onClick={() => startChat()} aria-label="MedBot — start a lesson">
          <MedLogo size={26} className="mark-ico" />
          MedBot
        </button>
        <nav className="links" aria-label="Primary">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href}>{l.label}</a>
          ))}
          <Link to="/explore">Explore the body</Link>
        </nav>
        {user ? (
          <div className="who" key={user.id}>
            <span className="who-dot">{userInitial(user)}</span>
            <b className="who-name" title={user.email}>{displayName(user)}</b>
            <button onClick={() => signOut()}>Sign out</button>
          </div>
        ) : (
          <Link className="nav-login" to="/login">Log in</Link>
        )}
        <button className="go" onClick={() => startChat()}>Start a lesson</button>
        <button
          className="nav-burger"
          aria-expanded={menuOpen}
          aria-label="Menu"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span /><span /><span />
        </button>
        <div className="nav-panel" hidden={!menuOpen}>
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)}>{l.label}</a>
          ))}
          <Link to="/explore" onClick={() => setMenuOpen(false)}>Explore the body</Link>
          <div className="nav-panel-cta">
            {user ? (
              <button className="b1" onClick={() => { setMenuOpen(false); signOut() }}>Sign out ({user.email})</button>
            ) : (
              <Link to="/login" className="b2" onClick={() => setMenuOpen(false)}>Log in</Link>
            )}
            <button className="b1" onClick={() => { setMenuOpen(false); startChat() }}>Start a lesson</button>
          </div>
        </div>
      </header>

      {/* ── Sticky twin ──────────────────────────────────────────────── */}
      <div className={`nav-sticky${sticky ? ' is-shown' : ''}`}>
        <div className="nav">
          <button className="mark" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <MedLogo size={24} />
            MedBot
          </button>
          <button className="go" onClick={() => startChat()}>Start a lesson</button>
        </div>
      </div>

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="hero-c" id="top">
        <svg className="hc-tex" aria-hidden focusable="false">
          <defs>
            {Object.entries(FIELD_SYMBOLS).map(([id, sym]) => (
              <symbol key={id} id={`hd-${id}`} viewBox="0 0 48 48">
                {sym}
              </symbol>
            ))}
          </defs>
          <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            {placements.map((p, i) => (
              <use
                key={i}
                href={`#hd-${p.id}`}
                x={`${p.x}%`}
                y={p.y}
                width={p.s}
                height={p.s}
                className={[p.wideOnly && 'w', p.copyBand && 'c'].filter(Boolean).join(' ') || undefined}
                style={{ transform: `rotate(${p.r}deg)` }}
              />
            ))}
          </g>
        </svg>

        <div className="hello">
          <h1 className="hc-h1">
            <span>
              <span className="hw hw1">Know</span> <span className="hw hw2">your</span> <span className="hw hw3">body,</span>
            </span>{' '}
            <span className="hl2"><Accent size="lg">the friendly way</Accent></span>
          </h1>
          <div className="pitch">
            <p className="hc-sub">
              MedBot turns health knowledge into short, guided chats with three
              patient characters. Ask anything — from why your heart beats to
              what to do about a burn — and get an answer that makes sense.
            </p>
            <div className="hp">
              <p className="hp-badge">
                <span className="hp-stars" aria-hidden>
                  <Star /><Star /><Star /><Star /><Star />
                </span>
                17 guided lessons
              </p>
              <p className="hp-stat">
                <span className="hp-avatars" aria-hidden>
                  {['maya', 'alex', 'riley'].map((id) => (
                    <span className="hp-ava" key={id}><CharacterAvatar id={id} size={36} /></span>
                  ))}
                </span>
                Three characters, 600+ health facts
              </p>
            </div>
          </div>
          <div className="hc-pair pair">
            <a className="b1" href="#characters">Meet the characters</a>
            <a className="b2" href="#lessons">Browse the lessons</a>
          </div>
        </div>
      </section>

      {/* ── Characters — the primary act ─────────────────────────────── */}
      <section className="sec white wide" id="characters">
        <div className="inner">
          <div className="copy">
            <p className="eyebrow">Your teachers</p>
            <Reveal>
              <h2>
                Pick a character, <Accent>start a chat</Accent>
              </h2>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="body">
                Every character knows all 17 lessons — they simply explain in their
                own voice. Choose the one whose style fits you; you can swap at any time.
              </p>
            </Reveal>
          </div>
          <div className="char-grid">
            {[
              { id: 'maya', name: 'Dr. Maya', role: 'General health expert', tint: 'var(--gLeaf)', face: 'var(--leaf)', chips: ['Digestion', 'Sleep', 'Everyday habits'] },
              { id: 'alex', name: 'Dr. Alex', role: 'Anatomy specialist', tint: 'var(--gTeal)', face: 'var(--teal)', chips: ['Heart', 'Lungs', 'Body systems'] },
              { id: 'riley', name: 'Nurse Riley', role: 'Emergency care', tint: 'var(--gSand)', face: 'var(--terra)', chips: ['First aid', 'Burns and cuts', 'Quick help'] },
            ].map((c, i) => (
              <Reveal key={c.id} delay={i * 0.09}>
                <button className="char-card" style={{ '--card-tint': c.tint, '--card-face': c.face }} onClick={() => startChat(c.id)}>
                  <span className="char-ava floaty"><CharacterAvatar id={c.id} size={104} /></span>
                  <span className="char-name">{c.name}</span>
                  <span className="char-role">{c.role}</span>
                  <span className="char-chips">
                    {c.chips.map((ch) => <span key={ch}>{ch}</span>)}
                  </span>
                  <span className="char-go">
                    Start learning
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M9 5 L16.4 12 L9 19 M16.4 12 H3" />
                    </svg>
                  </span>
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works — tint band split ──────────────────────────── */}
      <HowItWorks />

      {/* ── Lessons marquee ─────────────────────────────────────────── */}
      <LessonMarquee navigate={navigate} />

      {/* ── FAQ ─────────────────────────────────────────────────────── */}
      <section className="fqs" id="faq">
        <h2>Before you <Accent>ask</Accent></h2>
        <div className="fq-list">
          {FAQS.map((f, i) => <FaqCard key={f.q} f={f} i={i} open={i === 0} />)}
        </div>
      </section>

      {/* ── Close + wave + footer ───────────────────────────────────── */}
      <section className="close">
        <div className="cl-inner">
          <h2>
            Feel better about <Accent>your body</Accent>
          </h2>
          <p>
            No ads, no sign-up, no doom. One conversation at a time —
            starting with the question you have been meaning to ask.
          </p>
          <button className="b1 cl-cta" onClick={() => startChat()}>
            Start the first lesson
          </button>
        </div>
        <div className="cl-stage" aria-hidden>
          <svg className="cl-wave" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path d="M0 160 C240 40 420 40 720 140 C1020 240 1200 240 1440 120 L1440 320 L0 320 Z" />
          </svg>
          <div className="cl-piece floaty" style={{ left: '14%', top: '34%' }}><LessonIcon id="heart" size={44} strokeWidth={1.6} /></div>
          <div className="cl-piece il-sway" style={{ left: '28%', top: '8%' }}><LessonIcon id="drop" size={30} strokeWidth={1.6} /></div>
          <div className="cl-piece il-lift" style={{ left: '78%', top: '6%' }}><LessonIcon id="brain" size={34} strokeWidth={1.6} /></div>
          <div className="cl-piece floaty" style={{ left: '90%', top: '40%' }}><LessonIcon id="lungs" size={40} strokeWidth={1.6} /></div>
          <div className="cl-piece il-pulse" style={{ left: '7%', top: '62%' }}><Sparkle size={26} strokeWidth={1.6} /></div>
          <div className="cl-mascot">
            <CharacterAvatar id="riley" size={190} />
          </div>
        </div>
      </section>

      <footer className="foot">
        <div className="foot-top">
          <div className="foot-brand">
            <div className="foot-mark"><MedLogo size={22} /> MedBot</div>
            <p>A calm place to learn how your body works — one friendly chat at a time.</p>
          </div>
          <div className="cols">
            <div className="col">
              <h4>Learn</h4>
              <a href="#characters">Characters</a>
              <a href="#lessons">Lessons</a>
              <a href="#how">How it works</a>
            </div>
            <div className="col">
              <h4>Support</h4>
              <a href="#faq">FAQ</a>
              <Link to="/explore">Explore in motion</Link>
              <a href="/chat/maya">Start a chat</a>
            </div>
            <div className="col">
              <h4>Character</h4>
              <button className="foot-link" onClick={() => startChat('maya')}>Dr. Maya</button>
              <button className="foot-link" onClick={() => startChat('alex')}>Dr. Alex</button>
              <button className="foot-link" onClick={() => startChat('riley')}>Nurse Riley</button>
            </div>
          </div>
        </div>
        <div className="base">
          <span>MedBot teaches — it does not diagnose or treat. For medical care, see a professional.</span>
          <span>Learn it once, remember it twice.</span>
        </div>
      </footer>
    </div>
  )
}

function FaqCard({ f, i, open: defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen)
  const on = open
  return (
    <div className={`fq${on ? ' is-open' : ''}`}>
      <h3>
        <button
          type="button"
          className="fq-q"
          aria-expanded={on}
          aria-controls={`med-faq-a-${i}`}
          onClick={() => setOpen(!on)}
        >
          <span>{f.q}</span>
          <span className="fq-toggle" aria-hidden>
            <svg viewBox="0 0 20 20">
              <path d="M4 10 H16" />
              <path className="fq-v" d="M10 4 V16" />
            </svg>
          </span>
        </button>
      </h3>
      <div className="fq-a" id={`med-faq-a-${i}`} role="region">
        <div><p>{f.a}</p></div>
      </div>
    </div>
  )
}

function HowItWorks() {
  return (
    <section className="sec band leaf" id="how">
      <div className="inner">
        <div className="copy">
          <p className="eyebrow">How it works</p>
          <Reveal>
            <h2>Ask, understand, <Accent>remember</Accent></h2>
          </Reveal>
          <ol className="steps">
            <Reveal delay={0.08}><li><b>Pick a lesson</b><span>Seventeen topics — heart to brain to bandages. Select one and your character opens it like a conversation.</span></li></Reveal>
            <Reveal delay={0.16}><li><b>Chat about it</b><span>Ask “how does it work”, “give me a fact” or your own question. Answers stay plain-spoken and short.</span></li></Reveal>
            <Reveal delay={0.24}><li><b>Check yourself</b><span>Ask for a quiz. Answer it right and the lesson ticks green on your progress ring.</span></li></Reveal>
          </ol>
        </div>
        <div className="art">
          <Reveal className="scene-wrap" delay={0.1}>
            <div className="chatscene">
              <div className="cs-card cs-lesson floaty">
                <span className="cs-ava"><LessonIcon id="heart" size={20} /></span>
                <div>
                  <b>The Heart & Circulation</b>
                  <small>Body Basics · lesson 1 of 5</small>
                </div>
              </div>
              <div className="cs-card cs-bubble cs-ask">
                <p>Why does your heart never get tired?</p>
              </div>
              <div className="cs-card cs-bubble cs-reply">
                <p><b>How it works:</b> cardiac muscle is built with its own electrical beat-maker, so it never waits for you to decide anything.</p>
              </div>
              <div className="cs-card cs-ring">
                <svg viewBox="0 0 48 48" width="52" height="52">
                  <circle className="rt" cx="24" cy="24" r="20" fill="none" strokeWidth="5" />
                  <circle className="rp" cx="24" cy="24" r="20" fill="none" strokeWidth="5" strokeLinecap="round" strokeDasharray="125.7" strokeDashoffset="38" />
                  <text x="24" y="28.4" textAnchor="middle" fontSize="11">70%</text>
                </svg>
                <div>
                  <b>3 lessons done</b>
                  <small>Come back any time</small>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function LessonMarquee({ navigate }) {
  const [live, setLive] = useState(false)
  const tiles = [...TILES, ...TILES]

  useEffect(() => {
    const el = document.querySelector('.cmq')
    if (!el) return
    const io = new IntersectionObserver(([e]) => setLive(e.isIntersecting), { rootMargin: '200px 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <section className="cbs" id="lessons" aria-label="Lesson topics">
      <div className="cbs-head">
        <h2>Every part of <span>the body</span></h2>
        <p>Four categories, seventeen lessons — pick one in the chat and ask anything about it.</p>
      </div>
      <div className={`cmq${live ? ' is-live' : ''}`} tabIndex={-1}>
        <div className="cmq-track">
          {tiles.map((b, i) => (
            <button
              key={`${b.id}-${i}`}
              className="cb"
              tabIndex={-1}
              aria-hidden={i >= TILES.length}
              onClick={() => navigate(`/chat/${b.char}`)}
            >
              <div className="cb-tile" style={{ '--cb-fill': b.fill, '--cb-edge': b.edge }}>
                <span className="cb-face"><LessonIcon id={b.id} size={60} strokeWidth={1.5} /></span>
              </div>
              <span className="cb-name">{b.label}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

const TILES = [
  { id: 'heart', label: 'The heart', char: 'alex', fill: 'var(--leaf)', edge: 'var(--leafEdge)' },
  { id: 'lungs', label: 'The lungs', char: 'alex', fill: 'var(--teal)', edge: 'var(--tealEdge)' },
  { id: 'stomach', label: 'Digestion', char: 'maya', fill: 'var(--ochre)', edge: 'rgba(0,0,0,0.22)' },
  { id: 'brain', label: 'The brain', char: 'alex', fill: 'var(--terra)', edge: 'var(--terra)' },
  { id: 'apple', label: 'Healthy eating', char: 'maya', fill: 'var(--leaf)', edge: 'var(--leafEdge)' },
  { id: 'dumbbell', label: 'Exercise', char: 'maya', fill: 'var(--spring)', edge: 'var(--springEdge)' },
  { id: 'moon', label: 'Sleep', char: 'maya', fill: 'var(--teal)', edge: 'var(--tealEdge)' },
  { id: 'drop', label: 'Hydration', char: 'maya', fill: 'var(--gSky)', edge: 'rgba(15,14,12,0.14)' },
  { id: 'pulse', label: 'CPR basics', char: 'riley', fill: 'var(--terra)', edge: 'var(--terra)' },
  { id: 'bandage', label: 'Burns and cuts', char: 'riley', fill: 'var(--ochre)', edge: 'rgba(0,0,0,0.22)' },
  { id: 'alert', label: 'Emergencies', char: 'riley', fill: 'var(--forest)', edge: 'rgba(0,0,0,0.3)' },
  { id: 'thermo', label: 'Cold and flu', char: 'riley', fill: 'var(--gSand)', edge: 'rgba(15,14,12,0.14)' },
  { id: 'headache', label: 'Headaches', char: 'maya', fill: 'var(--leaf)', edge: 'var(--leafEdge)' },
  { id: 'flower', label: 'Allergies', char: 'riley', fill: 'var(--spring)', edge: 'var(--springEdge)' },
  { id: 'bone', label: 'Bones and muscles', char: 'alex', fill: 'var(--teal)', edge: 'var(--tealEdge)' },
  { id: 'calm', label: 'Stress', char: 'maya', fill: 'var(--gLeaf)', edge: 'rgba(15,14,12,0.14)' },
  { id: 'book', label: 'Nutrition basics', char: 'maya', fill: 'var(--ochre)', edge: 'rgba(0,0,0,0.22)' },
]
