# MedBot — Know your body, the friendly way

MedBot is a **rule-based medical education chatbot** that teaches anatomy, wellness and first aid as a conversation. You choose a teacher character, pick from 17 lessons, quiz yourself, and watch your body actually move in an interactive **anatomy theatre** with voice-over narration.

It is intentionally **not an LLM app**: every answer comes from a hand-written, vetted knowledge base served by a small Express API, so responses are safe, consistent, and fast — and users can confidently complete lessons and quizzes.

---

## Highlights

- **Character chat** — three teachers with distinct styles (Maya the nurse, Alex the explorer, Riley the paramedic), each with a hand-drawn avatar and its own color identity.
- **Full lesson catalog (17 topics)** across four categories: Body Basics, Health & Wellness, First Aid, Common Conditions. Ask "Give me a quiz" and the server tracks your session, reveals answers only after you reply, and marks the lesson complete.
- **Anatomy theatre** (`/explore`) — a hand-drawn SVG torso where **nine organs actually move**: the brain shimmering, lungs inhaling (offset phases), heartbeat pulse, ribcage sway, flexing bicep, stomach churn, kidney squeeze and more. Pick a glowing hotspot or a tab, and a **browser voice-over narrates the organ** automatically.
- **On-page QAI** — ask *How does it work? / Keep it healthy / A fun fact / Quiz me* right inside the theatre, type your own questions or quiz answers in a composer, and every reply is both rendered and **read aloud**.
- **Read-aloud everywhere** — chat answers and theatre replies are narrated by the browser's speech engine (no cloud TTS, zero cost), with a one-click mute toggle that remembers your choice.
- **Supabase accounts** — email/password sign-up, sign-in, and **Sign in with Google** (OAuth via Supabase). The UI adapts: signed-in users see their identity in the chat sidebar and landing nav.
- **Cloud progress + history** — completed lessons upsert into a `progress` row and **the entire conversation persists in a `messages` table**, both locked with Row Level Security so each user only ever touches their own data. Not signed in? Progress silently falls back to localStorage.
- **Pollenair design system** — warm cream canvas, hairline cards, hand-drawn accent underlines, press-physics buttons (3px "press" on click), word-by-word hero reveals, and **zero emoji** anywhere: every icon is a stroke-drawn SVG.

---

## Tech stack

| Layer | Choice |
| --- | --- |
| Frontend | React 18 + Vite 5, `framer-motion` (MotionConfig, page transitions), `react-router-dom` 6 |
| Design | Pollenair skill system — CSS custom properties, `.landing` / `.medi` scopes, Geist + Sora + Geist Mono type |
| Speech | Web `SpeechSynthesis` API (shared module `src/voice.js`) |
| Auth + DB | Supabase (`@supabase/supabase-js`) — auth, Postgres with RLS |
| Backend | Node + Express (`server/index.js`) — knowledge base, quiz engine, lesson/progress endpoints |
| Tooling | concurrently (dev server + API), Vite proxy `/api` → `localhost:3001` |

---

## Project structure

```
├─ server/index.js          Express API: knowledge base, quiz engine, endpoints
├─ src/
│  ├─ App.jsx               Routes: / · /chat/:characterId · /explore · /login
│  ├─ auth.jsx              AuthProvider + useAuth (session, signOut, display helpers)
│  ├─ supabase.js           Supabase client (safe stub when .env keys are missing)
│  ├─ voice.js              speak / stopSpeaking / stripForSpeech — one voice at a time
│  ├─ motion.jsx            Reveal / FloatCard primitives (framer-motion)
│  ├─ index.css             Entire design system (starter + app layers, ~2,900 lines)
│  └─ components/
│     ├─ Landing.jsx        Marketing site: hero, characters, lessons, FAQ, footer
│     ├─ Chat.jsx           Chat room: lessons sidebar, progress ring, messages
│     ├─ Explore.jsx        Anatomy theatre: 9 organs, voice-over, QAI composer
│     ├─ Login.jsx          Supabase sign in / sign up / Google
│     ├─ icons.jsx          All SVG icons + hand-drawn character avatars
│     └─ Accent.jsx         Ochre underline accent component
├─ supabase/schema.sql      progress + messages tables with RLS policies
├─ index.html               Fonts + favicon entry
└─ public/favicon.svg       MedBot chat-bubble cross mark
```

---

## Getting started

### 1. Install & run

```bash
npm install
npm start          # runs Express API (3001) + Vite dev server (5173) together
```

Open http://localhost:5173. The chat and theatre work **immediately** as a guest (progress kept in localStorage); sign in to sync to the cloud.

> `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` come from **Supabase → Project Settings → API**. `src/supabase.js` detects missing keys and falls back to a stub, so the app never crashes without them.

### 2. Supabase setup (one-time)

1. Create a project at [supabase.com](https://supabase.com), grab the **URL** and **anon key** into `.env`.
2. Open **SQL Editor** and run everything in [`supabase/schema.sql`](supabase/schema.sql):
   - `progress` table (one row per user: completed lessons array) with owner-only RLS.
   - `messages` table (per-message chat history per character) with owner-only RLS.
3. **Authentication → Providers → Google**: paste your Google OAuth client ID + secret. (Get them from [Google Cloud Console](https://console.cloud.google.com) → Credentials → OAuth client → *Web application*, registering the redirect URI `https://<your-ref>.supabase.co/auth/v1/callback`.)
4. **Authentication → URL Configuration**: set Site URL (e.g. `http://localhost:5173`) and redirect URLs (`http://localhost:5173/**`).

### 3. Production build

```bash
npm run build      # outputs dist/
npm run preview    # serve the build locally
```

---

## API

| Route | Purpose |
| --- | --- |
| `GET /api/lessons` | Lesson catalog grouped by category |
| `GET /api/lessons/:id` | One lesson's full body |
| `POST /api/chat` | `{ message, character, lesson, sessionId }` → knowledge-base reply; if a quiz is pending for the session, treats the message as the quiz answer and returns `lessonCompleted` |
| `POST /api/progress` | `{ sessionId, completed }` — guest progress backup |
| `GET /api/progress?sessionId=` | Guest progress |

Signed-in users bypass the guest progress endpoints: completed lessons are upserted directly to `progress`, and every chat line is inserted into `messages` keyed by character.

---

## Characters

| Character | Style | Drives |
| --- | --- | --- |
| **Maya** (leaf green) | Calm nurse, patient explanations | Body Basics |
| **Alex** (teal) | Curious explorer, loves fun facts | Health & Wellness |
| **Riley** (sand/terra) | Reassuring paramedic, safety-first | First Aid |

---

## Roadmap

- Smarter request matching (lightweight NLP/embeddings) while keeping answers vetted.
- More theatre scenes (circulatory journey, immune cells, sleep cycle).
- Per-topic certificate download.
- Deploy: static front to Vercel/Netlify, API to Render/Railway, swap the dev proxy for CORS.

---

*MedBot is an educational toy — it does not diagnose, treat, or replace a doctor. Real emergencies deserve real professionals.*
