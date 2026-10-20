import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import { initOpenRouter, askTeacher } from './openrouter.js'

const app = express()
const PORT = 3001

app.use(cors())
app.use(bodyParser.json())

/* The AI model is the knowledge. The server only keeps structure:
   session progress, per-session memory for guests, and the lesson catalog. */

/* Lesson catalog (icon = icon id rendered by the frontend, never an emoji) */
const CATALOG = {
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
    { id: 'nutritionBasics', title: 'Nutrition Basics', description: 'What food gives you' },
  ],
}

const catalogById = new Map()
for (const items of Object.values(CATALOG)) {
  for (const item of items) catalogById.set(item.id, { ...item, category: Object.keys(CATALOG).find((c) => CATALOG[c].includes(item)) })
}

const progressBySession = new Map()
const quizBySession = new Map()
const historyBySession = new Map()

const OFFLINE_NOTE =
  "I can't reach my library right now - the connection dropped. Give me one more moment and ask again?"

const MARKER_RE = /\[\[\s*lesson\s*complete\s*\]\]/i

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || ''
const SUPABASE_ANON = process.env.VITE_SUPABASE_ANON_KEY || ''

/* Signed-in users send their Supabase access token in the Authorization
   header; RLS then shows the server only their own saved rows, so the model
   can continue past conversations wherever they were left. */
async function fetchServerHistory(token, characterId, limit = 14) {
  if (!token || !SUPABASE_URL || !SUPABASE_ANON) return null
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/messages?character_id=eq.${encodeURIComponent(characterId)}&select=sender,text&order=id.desc&limit=${limit}`,
      { headers: { apikey: SUPABASE_ANON, Authorization: `Bearer ${token}` } },
    )
    if (!res.ok) return null
    const rows = await res.json()
    if (!Array.isArray(rows) || !rows.length) return []
    const history = rows
      .reverse()
      .map((row) => ({ role: row.sender === 'bot' ? 'assistant' : 'user', content: String(row.text || '') }))
      .filter((m) => m.content)
    /* The client usually saved the current line already; keep it as "user". */
    while (history.length && history[history.length - 1].role === 'user') history.pop()
    return history
  } catch {
    return null
  }
}

app.post('/api/chat', async (req, res) => {
  const { message, character, lesson, sessionId } = req.body
  const text = String(message || '').trim()
  const lower = text.toLowerCase()
  const authHeader = req.headers.authorization || ''
  const token = authHeader.replace(/^Bearer\s+/i, '')

  const meta = lesson && catalogById.get(lesson)
  const wantsQuiz = /(quiz|test me)/.test(lower)
  const lessonOpening = /lesson[:]/.test(lower)

  let history =
    (await fetchServerHistory(token, character || 'maya')) ||
    historyBySession.get(sessionId) ||
    []

  const lastAssistant = [...history].reverse().find((m) => m.role === 'assistant')
  const checkQuestionAsked = Boolean(lastAssistant && lastAssistant.content.trimEnd().endsWith('?'))
  const pending = quizBySession.get(sessionId)
  const judging = (checkQuestionAsked || Boolean(pending)) && !wantsQuiz && !lessonOpening && text.length > 0

  let lessonCompleted = null
  const reply = await askTeacher({
    character,
    lessonId: lesson || null,
    lessonMeta: meta || null,
    judging,
    wantsQuiz,
    lessonOpening,
    history,
    user: text,
  })

  let response = reply || OFFLINE_NOTE

  if (judging) {
    quizBySession.delete(sessionId)
    const praised = /got it|exactly right|absolutely right|perfect|spot on|well done|that's (?:correct|right)|that is (?:correct|right)|correct answer/i.test(response)
    const scolded = /not quite|unfortunately|not (?:correct|right)|incorrect|try again|close,? but|almost,? but|let me correct/i.test(response)
    if (MARKER_RE.test(response) || (praised && !scolded)) {
      lessonCompleted = (pending && pending.lesson) || lesson || null
      response = response.replace(MARKER_RE, '').trim()
    }
  }

  history.push({ role: 'user', content: text })
  history.push({ role: 'assistant', content: response })
  historyBySession.set(sessionId, history.slice(-12))

  if (wantsQuiz) quizBySession.set(sessionId, { lesson: lesson || null })

  res.json({ response, lessonCompleted })
})

app.get('/api/lessons', (req, res) => res.json(CATALOG))

app.get('/api/lessons/:id', (req, res) => {
  const meta = catalogById.get(req.params.id)
  if (!meta) return res.status(404).json({ error: 'Lesson not found' })
  res.json(meta)
})

app.post('/api/progress', (req, res) => {
  const { sessionId, completed } = req.body || {}
  if (!sessionId || !Array.isArray(completed)) {
    return res.status(400).json({ error: 'sessionId and completed[] required' })
  }
  const clean = [...new Set(completed.filter((x) => typeof x === 'string' && catalogById.has(x)))]
  progressBySession.set(sessionId, clean)
  res.json({ ok: true, completed: clean })
})

app.get('/api/progress', (req, res) => {
  const completed = progressBySession.get(req.query.sessionId) || []
  res.json({ completed })
})

initOpenRouter().catch(() => {})

app.listen(PORT, () => {
  console.log(`MedBot API listening on http://localhost:${PORT}`)
})
