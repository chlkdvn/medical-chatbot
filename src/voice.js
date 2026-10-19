const synth = typeof window !== 'undefined' && 'speechSynthesis' in window ? window.speechSynthesis : null

export const canSpeak = Boolean(synth)

/** Turns markdown pass-gloss into something a narrator reads naturally. */
export function stripForSpeech(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*\*/g, '')
    .replace(/\n{2,}/g, '\n')
    .trim()
}

/**
 * Speaks a string. All callbacks are optional (onStart/onEnd/onError).
 * Cancels whatever is currently queued first — one voice at a time.
 */
export function speak(text, opts = {}) {
  if (!synth || !text) return
  synth.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.rate = opts.rate ?? 0.97
  const voices = synth.getVoices()
  const pick =
    voices.find((v) => /en[-_](US|GB)/i.test(v.lang)) ||
    voices.find((v) => /^en/i.test(v.lang)) ||
    voices[0]
  if (pick) u.voice = pick
  if (opts.onStart) u.onstart = opts.onStart
  if (opts.onEnd) u.onend = () => opts.onEnd()
  if (opts.onError) u.onerror = () => opts.onError()
  synth.speak(u)
}

export function stopSpeaking() {
  if (synth) synth.cancel()
}
