# MedBot — Know your body, the friendly way

MedBot is an **AI-powered medical education tutor**. You pick a teacher character, thumb through 17 lessons, and get a genuinely conversational teacher: it explains, asks you a comprehension question after everything it teaches, judges your answer (kindly, with generous phrasing), teaches the full correct answer, and keeps the lesson going. Your chats, choices and progress follow you — refresh mid-lesson and it continues, sign in and it lives forever in your own database rows.

Plus a stage: an interactive **anatomy theatre** where nine organs physically move — pulsing heart, breathing lungs, swaying ribcage, flexing bicep, squeezing kidneys — and every reply is **narrated out loud** by the browser's speech engine.

- **Frontend**: React 18 + Vite, framer-motion, custom Pollenair design system (warm cream, hairline cards, press-physics buttons, zero emoji — every icon is a stroke SVG)
- **Teacher**: OpenRouter (selects the best **free** model at boot, rotates on rate limits/truncation)
- **Memory + accounts**: Supabase (auth, Postgres with owner-only RLS)
- **Only if it breaks**: a small Node/Express API that hosts the model call, lesson catalog and safety prompt

---

## Highlights

### The AI teacher (`server/openrouter.js`)
- **One brain, no rule base.** Every message — chat, lesson open, theatre QAI, typed quiz answer — is answered by an LLM with a written standing instruction.
- **Character personas**: Maya (calm nurse, everyday analogies), Alex (playful explorer, fun-facts first), Riley (steady paramedic, step-then-why).
- **Safety law baked in**: never diagnoses, never prescribes or doses, escalates emergencies to "contact your local emergency number", stays on health topics, and an honesty clause (answers your actual question first; admits uncertainty; never invents numbers).
- **The teach-ask loop**: after every teaching turn it poses exactly one comprehension question drawn **only from material already taught**. Answer right → it confirms, teaches why, asks the next. Answer wrong → it teaches the correct answer without penalty.
- **Quiz judging**: your answer is judged against the taught material (synonyms and partial facts accepted, generous). When essentially right, the lesson is silently awarded via a machine-read marker, stripped from your view.
- **Grounding + memory** — the active lesson title is pinned and, for signed-in users, your last 14 conversation turns are re-read from your database rows before every reply, so it "continues from where it stopped", even days later.
- **Resilience**: free models are picked runtime from OpenRouter's catalog (today: minimax-m3.1-flash, nemotron-3.5-super, xing4.0), reasoning-model truncation is filtered out, and any failure falls back politely rather than crashing.

### Progress you can trust
- Sign up with **email/password or Google** (outright OAuth with Supabase through `/login`).
- `progress` table → one row per user (completed lessons), `messages` table → permanent chat history per character. Both **RLS-locked to the owner**: each user can only ever touch their own rows.
- **Refresh-proof**: chats are mirrored locally as they happen and the DB wins when signed in — reopening a chat restores the entire conversation *and* the lesson you were teaching.
- Guest mode works fully (device-only progress), with a polite "log in to keep your progress" nudge in the sidebar.

### Design & motion
- **Anatomy theatre** (`/explore`): 9 organs, glowing hotspots, spinning halo on the selected organ, reduced-motion aware.
- **Voice-over** shared engine (`src/voice.js`): organ narration + chat reads its replies aloud (markdown-stripped) with a mute toggle that remembers itself; an equalizer animates while the narrator speaks.
- Landing page with character cards, 17-lesson marquee, FAQ, and a wave close; press-physics buttons everywhere; the whole skin is one CSS file (starter + `.landing` + `.medi` layers).

---

## Tech stack

| Layer | Choice |
| --- | --- |
| Frontend | React 18, Vite 5, `framer-motion`, `react-router-dom` 6 |
| Design system | Pollenair tokens (Geist / Sora / Geist Mono), custom press-3D buttons |
| AI | OpenRouter chat completions, free-tier auto-selection, persona/safety system prompt |
| Auth + DB | Supabase (email + Google OAuth; Postgres + RLS) |
| API host | Express (Node) — chat proxy, catalog, safety tape; session memory for guests |
| Speech | Web `SpeechSynthesis` (no cloud, no cost) |

---

## Project structure

```
├─ server/index.js          Express API: catalog, guest memory + record, progress, chat proxy
├─ server/openrouter.js     FREE-model picking, persona/safety/teach-loop prompt, rotation
├─ src/
│  ├─ App.jsx               Routes: / · /chat/:characterId · /explore · /login (+ transitions)
│  ├─ auth.jsx              AuthProvider (session, signOut, display helpers)
│  ├─ supabase.js           Client init + safe offline stub when .env keys are missing
│  ├─ voice.js              speak / stopSpeaking / stripForSpeech — one voice at a time
│  ├─ motion.jsx            Reveal / FloatCard primitives
│  ├─ index.css             Whole design system (~2,900 lines, starter + layers)
│  └─ components/
│     ├─ Landing.jsx        Marketing site (hero, characters, lessons marquee, FAQ)
│     ├─ Chat.jsx           Lessons sidebar, progress ring, AI chat, refresh-proof restore
│     ├─ Explore.jsx        Anatomy theatre: 9 organ scenes, narration, QAI + composer
│     ├─ Login.jsx          Supabase sign in / sign up / Google
│     ├─ icons.jsx          All SVG icons + hand-drawn character avatars
│     └─ Accent.jsx         Ochre underline accent
├─ supabase/schema.sql      progress + messages tables with owner-only RLS
└─ public/favicon.svg       MedBot mark
```

---

## Getting started

### 1. Install & run

```bash
npm install
npm start     # Express API (3001) + Vite dev server (5173)
```

Open http://localhost:5173 — chat and theatre work immediately as a guest.

### 2. Environment (`.env`, never committed)

| Key | Purpose |
| --- | --- |
| `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` | Supabase project (from Project Settings → API) |
| `OPENROUTER_API_KEY` | OpenRouter key: server-side only — the UI never touches it |
| `DATABASE_URL` | Direct Postgres link (optional, for the schema script/tools) |

### 3. Supabase setup (one-time)

1. Create a project, drop the URL + anon key into `.env`.
2. Run [`supabase/schema.sql`](supabase/schema.sql) once in the **SQL Editor** (creates `progress` + `messages` with owner-only RLS).
3. **Auth → Providers → Google**: paste an OAuth client ID + secret from Google Cloud Console with redirect `https://<ref>.supabase.co/auth/v1/callback`.
4. **Auth → URL Configuration**: Site URL + redirect (`http://localhost:5173/**`).

### 4. Deploy

```bash
npm run build    # dist/
npm run preview  # local check of the build
```

---

## API

| Route | Notes |
| --- | --- |
| `POST /api/chat` | `{ message, character, lesson, sessionId }`. Send `Authorization: Bearer <supabase-access-token>` when signed in → server re-reads your history (RLS applies) and re-binds your last lesson automatically. Returns `{ response, lessonCompleted }` |
| `GET /api/lessons` / `GET /api/lessons/:id` | Catalog only; body knowledge lives in the model |
| `POST/GET /api/progress` | Guest progress mirror (accounted users bypass this via Supabase) |

---

## Characters

| Character | Voice | Drives |
| --- | --- | --- |
| **Maya** (leaf green) | Calm nurse, gentle analogies | Body Basics |
| **Alex** (teal) | Curious explorer, leads with a wow fact | Health & Wellness |
| **Riley** (sand/terra) | Reassuring paramedic: step, then why | First Aid |

---

## Anatomy theatre gallery

Brain (shimmer) · Lungs (offset breathing) · Heart (double pulse) · Liver (drift) · Stomach (churn) · Gut (peristalsis waves) · Bones (ribcage sway) · Muscle (flex pump) · Kidneys (filter squeeze) — each with narration, a four-chip QAI and a typed composer.

---

## Roadmap

- Streaming replies (SSE) so the narrated teaching starts while text types out.
- Lesson certificates once all check-questions in a topic are passed.
- Larger theatre casts: circulatory journey, immune cells, sleep cycle.
- Production deploy guide (Vercel + any host for `/server`, OpenRouter + Supabase in production env).

---

*MedBot is an educational toy — it does not diagnose, treat, or replace a doctor. Real emergencies deserve real professionals.*
