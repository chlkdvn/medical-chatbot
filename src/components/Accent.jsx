/**
 * Accent — the one accented word per heading: spring green with a
 * hand-drawn ochre double underline and three sparks.
 */

export function Accent({ children }) {
  return (
    <em className="hc-accent">
      {children}
      <svg className="hc-underline" viewBox="0 0 300 26" preserveAspectRatio="none" aria-hidden>
        <path d="M4 12 C 80 6, 200 4, 296 10" />
        <path d="M30 20 C 120 14, 210 15, 292 22" />
      </svg>
      <svg className="hc-sparks" viewBox="0 0 44 44" aria-hidden>
        <path d="M10 6 L14 20" />
        <path d="M30 8 L22 22" />
        <path d="M38 28 L26 30" />
      </svg>
    </em>
  )
}

/** Marks the last occurrence of `accent` in `heading` with an Accent. */
export function withAccent(heading, accent) {
  if (!accent) return heading
  const at = heading.lastIndexOf(accent)
  if (at < 0) return heading
  return (
    <>
      {heading.slice(0, at)}
      <Accent>{accent}</Accent>
      {heading.slice(at + accent.length)}
    </>
  )
}
