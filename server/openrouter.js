import 'dotenv/config'

const KEY = process.env.OPENROUTER_API_KEY || ''
const BASE = 'https://openrouter.ai/api/v1'

const PERSONAS = {
  maya: {
    name: 'Maya',
    who: 'a calm, warm nurse with fifteen years of hospital experience',
    voice:
      'You speak softly and patiently, like checking on a favorite patient. You use gentle everyday comparisons (the heart as a house with four rooms), begin with reassurance, and never rush the learner.',
  },
  alex: {
    name: 'Alex',
    who: 'a lively health explorer who loves fun facts',
    voice:
      'You are playful and curious, front-load the most surprising detail, sprinkle in vivid what-if questions, and celebrate curiosity before moving on.',
  },
  riley: {
    name: 'Riley',
    who: 'a reassuring paramedic who teaches first aid',
    voice:
      'You project calm confidence. You give crisp step plan then teach why. You are strict universally about safety realities while keeping the learner calm, never alarmist.',
  },
}

const MARKER = '[[lesson complete]]'

/* Picks free OpenRouter models at boot, newest good ones first. */
let modelCache = null

async function pickModels() {
  try {
    const ctrl = new AbortController()
    const timer = setTimeout(() => ctrl.abort(), 12000)
    const res = await fetch(`${BASE}/models`, {
      headers: KEY ? { Authorization: `Bearer ${KEY}` } : {},
      signal: ctrl.signal,
    })
    clearTimeout(timer)
    const json = await res.json()
    const free = (json.data || []).filter(
      (m) => typeof m.id === 'string' && (m.id.endsWith(':free') || Number(m.pricing?.prompt) === 0),
    )
    const preference = [
      /deepseek.*chat.*(3\.1|v3)/i,
      /deepseek.*v3/i,
      /llama-3\.3-70b/i,
      /gemini-2\.0-flash/i,
      /qwen.*(72b|3-235b)/i,
      /llama-3\.1-8b/i,
      /mistral/i,
      /glm/i,
    ]
    const scored = new Map()
    for (const pref of preference) {
      const hit = free.find((m) => pref.test(m.id) && !/(vision|image|thinking|non[- ]?extended)/i.test(m.id))
      if (hit && !scored.has(hit.id)) scored.set(hit.id, scored.size)
    }
    for (const m of free) if (!scored.has(m.id)) scored.set(m.id, scored.size)
    modelCache = [...scored.keys()].slice(0, 4)
  } catch {
    modelCache = null
  }
  if (!modelCache || !modelCache.length) modelCache = ['meta-llama/llama-3.1-8b-instruct:free']
  console.log(`OpenRouter models: ${modelCache.slice(0, 3).join(', ')}`)
  return modelCache
}

export async function initOpenRouter() {
  if (!KEY) {
    console.log('OpenRouter key missing - replies will be offline until OPENROUTER_API_KEY is set.')
    return
  }
  return pickModels()
}

export function buildSystemPrompt({ character, lessonId, lessonMeta, judging, wantsQuiz, lessonOpening }) {
  const persona = PERSONAS[character] || PERSONAS.maya
  const lines = []
  lines.push(`You are ${persona.name}, ${persona.who} - a teacher inside MedBot, a friendly medical education app. MESSAGES below are from the user.`)
  lines.push(`VOICE: ${persona.voice}`)
  lines.push(
    'STYLE: Warm, plain language a curious teenager enjoys. Short paragraphs. Bold only the most important terms with **double asterisks**. Stay under 140 words unless a quiz step needs more. ALWAYS end with one short follow-up question or a tiny health tip. Never use emoji, curly quotes, lists longer than 4 items, or tables.',
  )
  lines.push(
    'SAFETY: You teach, you never diagnose, prescribe medication or doses. If something sounds like an emergency (severe chest pain, trouble breathing, heavy bleeding, suicidal thoughts), calmly tell them to contact their local emergency number right away. Stay gentle and never scary. Keep every topic inside health, medicine and the human body; if the user drifts elsewhere, steer warmly back to the body.',
  )
  lines.push(
    'HONESTY: Teach only what you are confident about. If unsure, say so plainly and give the safe general picture. Answer the learner\'s actual question FIRST, then teach around it. If they ask something you already explained, reference your earlier answer instead of pretending it is new. Never invent numbers, statistics or studies outside what you are confident in. Match the learner\'s language; keep grammar calm and classic (no slang, no shouting).',
  )

  if (lessonMeta) {
    lines.push(`ACTIVE LESSON: ${lessonMeta.title} (${lessonMeta.category}) - ${lessonMeta.description}. Teach within this topic unless the learner clearly moves to another body topic.`)
  }

  lines.push(
    'TEACHING LOOP: After you teach anything (a lesson opening, an explanation, a story), end with exactly ONE comprehension question about what you have ALREADY taught in this conversation. Never test material you have not covered - the question must come only from what is above. When the learner replies to your question: confirm briefly, gently explain the complete correct answer, then ask ONE new question on the same already-taught material. Always pose a different question than the previous one.',
  )

  if (lessonOpening) {
    lines.push('The user just selected this lesson: open it with a striking fact and a warm welcome, then point toward today\'s plan.')
  }

  if (wantsQuiz) {
    lines.push('QUIZ MODE: Learner asked for a quiz on their current topic. Ask exactly ONE short question in this reply (end with the question) drawn only from material already covered in this conversation or from the active lesson basics.')
  }

  if (judging) {
    lines.push(
      `JUDGING: My previous message asked the user one comprehension question (see the history). Judge ONLY that question against what was taught. Accept different phrasing, synonyms and partial facts; be generous. If their reply addresses the asked question and is essentially right: confirm it in one sentence and teach the full correct answer - and you MUST write ${MARKER} on its own line somewhere in this reply (we machine-read it; hide nothing). After that, ask your next question about already-taught material. If the reply is unrelated, answer it and re-ask. If plainly wrong, kindly teach the correct answer without the marker.`,
    )
  }

  return lines.join('\n\n')
}

/* Asks OpenRouter. history: [{role, content}] (no system). Never throws. */
export async function askTeacher({ character, lessonId, lessonMeta, judging = false, wantsQuiz = false, lessonOpening = false, history = [], user }) {
  if (!KEY) return null
  const models = modelCache || (await pickModels())
  const payload = {
    messages: [
      { role: 'system', content: buildSystemPrompt({ character, lessonId, lessonMeta, judging, wantsQuiz, lessonOpening }) },
      ...history.slice(-8),
      { role: 'user', content: user },
    ],
    max_tokens: 1100,
    temperature: 0.65,
  }

  for (const model of models) {
    try {
      const ctrl = new AbortController()
      const timer = setTimeout(() => ctrl.abort(), 45000)
      const res = await fetch(`${BASE}/chat/completions`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://medbot.app',
          'X-Title': 'MedBot',
        },
        body: JSON.stringify({ model, ...payload }),
        signal: ctrl.signal,
      })
      clearTimeout(timer)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()
      const choice = json.choices?.[0]
      const text = choice?.message?.content?.trim()
      /* Reasoning models burn hidden tokens; a "length"-truncated essay
         would arrive mid-sentence, so only accept complete-enough replies. */
      const complete = choice?.finish_reason !== 'length' || (text && text.length >= 120)
      if (text && complete) return text
    } catch {
      /* try the next free model */
    }
  }
  return null
}
