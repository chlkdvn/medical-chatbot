/**
 * MedBot icon set — stroke line icons, no emojis, ever.
 * One consistent voice: 24px grid, 1.8 stroke, round caps. Parts of an
 * icon may transform on hover/focus (see CSS) so keep ids class-safe.
 */

export function Icon({ d, children, size = 24, strokeWidth = 1.8, className, ...rest }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {children ?? null}
      {d ? <path d={d} /> : null}
    </svg>
  )
}

/* ── Product marks ─────────────────────────────────────────────────── */

export const MedLogo = (p) => (
  <Icon {...p}>
    <path d="M4 5.5 h16 a2.2 2.2 0 0 1 2.2 2.2 v6.6 a2.2 2.2 0 0 1 -2.2 2.2 h-7.6 l-3.6 3.4 V16.5 H4 a2.2 2.2 0 0 1 -2.2 -2.2 V7.7 A2.2 2.2 0 0 1 4 5.5 Z" />
    <path d="M12 7.8 v6.4 M8.8 11 h6.4" />
  </Icon>
)

export const SendArrow = (p) => (
  <Icon {...p}>
    <path d="M3.6 11.1 L20.4 4 L15 20.2 l-3.9-7.2 Z" />
    <path d="M20.4 4 L11.1 13" />
  </Icon>
)

export const ArrowLeft = (p) => <Icon {...p} d="M15 5 L7.6 12 L15 19 M7.6 12 H21" />
export const ArrowRight = (p) => <Icon {...p} d="M9 5 L16.4 12 L9 19 M16.4 12 H3" />
export const Check = (p) => <Icon {...p} size={12} strokeWidth={2.4} d="M3.4 12.6 l4.3 4.4 L20.2 6.6" />
export const Lock = (p) => (
  <Icon {...p}>
    <rect x="5.4" y="10.6" width="13.2" height="9.2" rx="2.4" />
    <path d="M8.5 10.6 V8.2 a3.5 3.5 0 0 1 7 0 V10.6 M12 14.3 v1.9" />
  </Icon>
)
export const QuestionMark = (p) => (
  <Icon {...p}>
    <path d="M8.9 8.9 a3.2 3.2 0 1 1 5.3 2.6 c-1 .9-2.2 1.4-2.2 2.8 M12 18.2 h.01" />
  </Icon>
)
export const Sparkle = (p) => (
  <Icon {...p}>
    <path d="M11 4.5 l1.6 4.1 4.4 1.6 -4.4 1.6 -1.6 4.4 -1.6 -4.4 -4.4 -1.6 4.4 -1.6 Z" />
    <path d="M18.5 16.5 v3.4 M16.8 18.2 h3.4" />
  </Icon>
)
export const IcoBookOpen = (p) => (
  <Icon {...p}>
    <path d="M12 6 C 10.2 4.4 7.6 4.4 4.4 4.9 V 18.9 c 3.2 -.5 5.8 -.5 7.6 1.1 1.8 -1.6 4.4 -1.6 7.6 -1.1 V 4.9 C 16.4 4.4 13.8 4.4 12 6 Z" />
    <path d="M12 6 v 14" />
  </Icon>
)
export const Refresh = (p) => (
  <Icon {...p}>
    <path d="M4.4 12 a 7.6 7.6 0 0 1 13.4 -4.9 M19.6 12 a 7.6 7.6 0 0 1 -13.4 4.9" />
    <path d="M17.6 3.2 v 4 h -4 M6.4 20.8 v -4 h 4" />
  </Icon>
)
export const Menu = (p) => (
  <Icon {...p} d="M4.5 7.5 h15 M4.5 12 h15 M4.5 16.5 h15" />
)
export const XMark = (p) => <Icon {...p} d="M6 6 L18 18 M18 6 L6 18" />

/* ── Lesson icons (mapped by lesson id) ──────────────────────────────── */

export const IcoHeart = (p) => (
  <Icon {...p}>
    <path d="M12 19.6 C 5.4 15.2 4 10.9 5.7 8.2 c 1.5 -2.4 4.8 -2 6.3 .9 1.5 -2.9 4.8 -3.3 6.3 -.9 1.7 2.7 .3 7 -6.3 11.4 Z" />
  </Icon>
)

export const IcoLungs = (p) => (
  <Icon {...p}>
    <path d="M12 4 v6.5 M12 6.5 c 0 -.9 -.9 -1.8 -2.6 -2 M12 6.5 c 0 -.9 .9 -1.8 2.6 -2" />
    <path d="M9.4 7 c -2.6 1.2 -4.3 4.6 -4.3 8 0 2.8 1.6 4.4 3.6 4.4 2.2 0 3.3 -1.7 3.3 -4.2 v-4.6 c 0 -2.2 -.9 -3.5 -2.6 -3.6 Z" />
    <path d="M14.6 7 c 2.6 1.2 4.3 4.6 4.3 8 0 2.8 -1.6 4.4 -3.6 4.4 -2.2 0 -3.3 -1.7 -3.3 -4.2 v-4.6 c 0 -2.2 .9 -3.5 2.6 -3.6 Z" />
  </Icon>
)

export const IcoStomach = (p) => (
  <Icon {...p}>
    <path d="M8.5 4 v2.6 c 0 2 1.6 3.4 3.6 3.4 h2.2 c 3.4 0 5.7 2.3 5.7 5.5 0 4 -2.9 6.5 -7.2 6.5 -4 0 -7.2 -2.3 -8.3 -6.2 -.4 -1.6 -.4 -3.2 -.3 -5" />
    <path d="M19.9 15.4 c 1.2 -.2 2.1 -1 2.6 -2.2" />
    <path d="M6 13.6 c -.9 -.7 -2 -.9 -3 -.6" />
  </Icon>
)

export const IcoBrain = (p) => (
  <Icon {...p}>
    <path d="M12 3.8 c -1.7 0 -2.9 1.2 -2.9 2.7 -1.6 .1 -3 1.5 -3 3.3 0 .6 .2 1.2 .4 1.7 -1 .8 -1.5 2 -1.5 3.2 0 1.9 1.4 3.4 3.2 3.6 .2 1.7 1.7 3 3.4 3 h.4 Z" />
    <path d="M12 3.8 c 1.7 0 2.9 1.2 2.9 2.7 1.6 .1 3 1.5 3 3.3 0 .6 -.2 1.2 -.4 1.7 1 .8 1.5 2 1.5 3.2 0 1.9 -1.4 3.4 -3.2 3.6 -.2 1.7 -1.7 3 -3.4 3" />
    <path d="M12 3.8 v17.4" />
  </Icon>
)

export const IcoBone = (p) => (
  <Icon {...p}>
    <path d="M7.7 5.4 c -1 -.9 -2.6 -.9 -3.4 .1 -.7 .9 -.6 2.1 .1 2.9 -.7 .8 -.8 2 -.1 2.9 .9 1 2.4 1 3.4 .1" />
    <path d="M16.3 18.6 c 1 .9 2.6 .9 3.4 -.1 .7 -.9 .6 -2.1 -.1 -2.9 .7 -.8 .8 -2 .1 -2.9 -.9 -1 -2.4 -1 -3.4 -.1 Z" />
    <path d="M8.9 6.6 L 15.1 17.4" />
  </Icon>
)

export const IcoApple = (p) => (
  <Icon {...p}>
    <path d="M12 7.2 c -1.6 -2 -4.6 -2.5 -6.2 .4 -1.6 2.9 -.4 8 2 10.6 1.5 1.6 2.8 1.2 4.2 .5 1.4 .7 2.7 1.1 4.2 -.5 2.4 -2.6 3.6 -7.7 2 -10.6 -1.6 -2.9 -4.6 -2.4 -6.2 -.4 Z" />
    <path d="M12 7.2 c -.1 -2 1 -3.4 3 -4" />
  </Icon>
)

export const IcoDumbbell = (p) => (
  <Icon {...p}>
    <path d="M2.6 12 h2.2 M19.2 12 h2.2" />
    <path d="M6 8.4 v7.2 M9 6.5 v11 M15 6.5 v11 M18 8.4 v7.2 M9 12 h6" />
  </Icon>
)

export const IcoMoon = (p) => (
  <Icon {...p}>
    <path d="M20.2 14.6 A 8.6 8.6 0 1 1 9.4 3.8 a 6.9 6.9 0 0 0 10.8 10.8 Z" />
  </Icon>
)

export const IcoCalm = (p) => (
  <Icon {...p}>
    <path d="M3 8.6 c 1.5 -1.6 3.2 -1.6 4.7 0 s 3.2 1.6 4.7 0 3.2 -1.6 4.6 0 3.2 1.6 4.7 0" transform="translate(-0.7 0)" />
    <path d="M3 14.8 c 1.5 -1.6 3.2 -1.6 4.7 0 s 3.2 1.6 4.7 0 3.2 -1.6 4.6 0 3.2 1.6 4.7 0" transform="translate(-0.7 0)" />
  </Icon>
)

export const IcoDrop = (p) => (
  <Icon {...p}>
    <path d="M12 3.2 C 9.2 7.4 7.2 10.4 7.2 13.6 a 4.8 4.8 0 0 0 9.6 0 C 16.8 10.4 14.8 7.4 12 3.2 Z" />
    <path d="M9.8 13.9 a 2.3 2.3 0 0 0 2.2 2.2" />
  </Icon>
)

export const IcoPulse = (p) => (
  <Icon {...p}>
    <path d="M12 19.4 C 6 15.4 4.4 11.6 5.9 9 c 1.3 -2.3 4.8 -2 6.1 .7 1.3 -2.7 4.8 -3 6.1 -.7 1.5 2.6 -.1 6.4 -6.1 10.4 Z" />
    <path d="M7.2 11.2 h2 l 1.3 -2.6 1.9 5.6 1.4 -3 h1.9" strokeWidth="1.5" />
  </Icon>
)

export const IcoBandage = (p) => (
  <Icon {...p}>
    <g transform="rotate(45 12 12)">
      <rect x="3.4" y="8.9" width="17.2" height="6.2" rx="3.1" />
      <path d="M9.4 12 h.01 M12 12 h.01 M14.6 12 h.01 M12 9.4 v.01 M12 14.6 v.01" strokeWidth="1.9" />
    </g>
  </Icon>
)

export const IcoPersonAlert = (p) => (
  <Icon {...p}>
    <circle cx="10.2" cy="4.9" r="2.5" />
    <path d="M10.2 8.4 c -2.2 .4 -3.5 1.9 -3.7 4.6 -.1 1.6 0 3.4 .3 5 " />
    <path d="M8.2 15.3 h4 v4.2 M12.2 15.3 v4.2" transform="translate(-1 0)" />
    <path d="M9 9.9 c .9 -.7 1.9 -1 2.9 -.8" />
    <path d="M16.4 10.2 l1.5 4.6 h3.6 l1.4 -4.6 Z M17.5 16.9 h4" />
  </Icon>
)

export const IcoAlert = (p) => (
  <Icon {...p}>
    <path d="M12 3.8 L 21.4 19.4 H 2.6 Z" />
    <path d="M12 9.8 v4.4 M12 16.9 h.01" />
  </Icon>
)

export const IcoThermo = (p) => (
  <Icon {...p}>
    <path d="M10.3 4.7 a 1.7 1.7 0 0 1 3.4 0 v8.9 a 3.4 3.4 0 1 1 -3.4 0 Z" />
    <path d="M12 10.4 v6.2" />
    <path d="M16.6 7.2 h2 M16.6 10.2 h2" />
  </Icon>
)

export const IcoHeadAche = (p) => (
  <Icon {...p}>
    <circle cx="10.6" cy="12.4" r="6.6" />
    <path d="M8.8 12.6 c 1.2 -2.4 2.4 -3.6 3.6 -3.6 s 2.4 1.2 3.6 3.6" transform="translate(-2.2 0) scale(1)" />
    <path d="M18.6 4.2 l-2.1 2.9 h3.3 l-2.2 3" />
  </Icon>
)

export const IcoFlower = (p) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="1.9" />
    <ellipse cx="12" cy="6.4" rx="2.1" ry="3.1" />
    <ellipse cx="12" cy="17.6" rx="2.1" ry="3.1" />
    <ellipse cx="6.4" cy="12" rx="3.1" ry="2.1" />
    <ellipse cx="17.6" cy="12" rx="3.1" ry="2.1" />
  </Icon>
)

export const IcoLeaf = (p) => (
  <Icon {...p}>
    <path d="M5 19.5 C 5 10.4 9.9 5.2 19.6 4.9 c .4 9.5 -4.7 14.6 -14.6 14.6 Z" />
    <path d="M5.4 19.2 C 9.4 13.8 13.2 10.2 18.2 6.4" />
  </Icon>
)

export const IcoSpeaker = (p) => (
  <Icon {...p}>
    <path d="M4 9.5 v5 h3.5 L12 18.6 V5.4 L7.5 9.5 Z" />
    <path d="M15 9.2 a4.1 4.1 0 0 1 0 5.6" />
    <path d="M17.4 6.9 a7.5 7.5 0 0 1 0 10.2" />
  </Icon>
)

export const IcoSpeakerOff = (p) => (
  <Icon {...p}>
    <path d="M4 9.5 v5 h3.5 L12 18.6 V5.4 L7.5 9.5 Z" />
    <path d="M16.4 9.6 l4.6 4.8" />
    <path d="M21 9.6 l-4.6 4.8" />
  </Icon>
)

export const IcoLiver = (p) => (
  <Icon {...p}>
    <path d="M4.5 8 h11.6 c 2 0 2.9 2.3 2.1 4.1 -.9 2.4 -3 4.1 -5.8 4.1 -2.9 0 -5.4 -1.3 -7.1 -4.5 -.7 -1.4 -1 -2.6 -.8 -3.7 Z" />
    <path d="M9.5 8 c 1 1.4 2.7 2.2 4.6 2" />
  </Icon>
)

export const IcoGut = (p) => (
  <Icon {...p}>
    <path d="M7 5.5 h10 c 2.2 0 4 1.8 4 4 v6 c 0 3.9 -3.1 7 -7 7 h-4 c -3.9 0 -7 -3.1 -7 -7 v-6 c 0 -2.2 1.8 -4 4 -4 Z" />
    <path d="M6.8 12 c 2.5 -1.9 3.4 1.9 5.8 0 c 2.4 -1.9 3.3 1.9 4.8 0.5" />
    <path d="M6.8 16 c 2.5 -1.9 3.4 1.9 5.8 0 c 2.4 -1.9 3.3 1.9 4.8 0.5" />
  </Icon>
)

export const IcoStar = (p) => (
  <Icon {...p} size={14} strokeWidth={1.6}>
    <path d="M12 3.6 l2.5 5.2 5.7 .8 -4.1 4 1 5.7 -5.1 -2.7 -5.1 2.7 1 -5.7 -4.1 -4 5.7 -.8 Z" fill="currentColor" stroke="none" />
  </Icon>
)

export const Star = IcoStar

export const LESSON_ICONS = {
  heart: IcoHeart,
  lungs: IcoLungs,
  digestive: IcoStomach,
  brain: IcoBrain,
  bones: IcoBone,
  nutrition: IcoApple,
  exercise: IcoDumbbell,
  sleep: IcoMoon,
  stress: IcoCalm,
  hydration: IcoDrop,
  cpr: IcoPulse,
  cuts: IcoBandage,
  choking: IcoPersonAlert,
  emergencies: IcoAlert,
  cold: IcoThermo,
  headaches: IcoHeadAche,
  allergies: IcoFlower,
  nutritionBasics: IcoLeaf,
  /* marquee aliases */
  stomach: IcoStomach,
  book: IcoBookOpen,
  dumbbell: IcoDumbbell,
  thermo: IcoThermo,
  headache: IcoHeadAche,
  calm: IcoCalm,
}

export function LessonIcon({ id, ...rest }) {
  const Cmp = LESSON_ICONS[id] || IcoBookOpen
  return <Cmp {...rest} />
}

/* ── Character avatars — hand-drawn line figures, one per character ──── */

export function AvatarMaya({ size = 96, ...rest }) {
  return (
    <svg viewBox="0 0 96 96" width={size} height={size} aria-hidden focusable="false" {...rest}>
      <g fill="none" stroke="#0f0e0c" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        {/* shoulders */}
        <path d="M24 96 C 24 76 36 69 48 69 c 12 0 24 7 24 27" fill="#e9f3ec" />
        {/* stethoscope */}
        <path d="M40 69 c 0 7 3 11 8 11 M56 69 c 0 7 -3 11 -8 11" />
        <circle cx="48" cy="82" r="3.4" fill="#2d8653" />
        {/* neck + head */}
        <path d="M42 62 c 0 5 2.6 7.4 6 7.4 s 6 -2.4 6 -7.4" fill="#f5f0e8" />
        <circle cx="48" cy="42" r="17" fill="#f5f0e8" />
        {/* hair bun */}
        <path d="M31 40 c 1.4 -10 8 -15.4 17 -15.4 c 9 0 15.6 5.4 17 15.4 -3 -3.4 -7 -5 -9.6 -4.6 -2.8 .4 -4 -2.6 -7.4 -2.6 s -4.6 3 -7.4 2.6 C 38 35 34 36.6 31 40 Z" fill="#123c2f" stroke="none" />
        <circle cx="64.6" cy="25.4" r="5.6" fill="#123c2f" stroke="none" />
        {/* face */}
        <path d="M43.5 42.6 h.01 M52.5 42.6 h.01" strokeWidth="3" />
        <path d="M45.6 49 c 1.5 1.3 3.3 1.3 4.8 0" />
        {/* coat collar */}
        <path d="M36 74 l 12 8 12 -8" />
      </g>
    </svg>
  )
}

export function AvatarAlex({ size = 96, ...rest }) {
  return (
    <svg viewBox="0 0 96 96" width={size} height={size} aria-hidden focusable="false" {...rest}>
      <g fill="none" stroke="#0f0e0c" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M24 96 C 24 76 36 69 48 69 c 12 0 24 7 24 27" fill="#e7f2f2" />
        {/* stethoscope + chest piece */}
        <path d="M40 69 v3 c 0 5.6 4 9 11.4 9" />
        <circle cx="55" cy="80.6" r="3.5" fill="#2a7e88" />
        <path d="M42 62 c 0 5 2.6 7.4 6 7.4 s 6 -2.4 6 -7.4" fill="#f5f0e8" />
        <circle cx="48" cy="42" r="17" fill="#f5f0e8" />
        {/* short hair */}
        <path d="M31 42 c .4 -10.4 7 -16.4 17 -16.4 s 16.6 6 17 16.4 c -1.2 -4.6 -3.2 -6.6 -6.4 -7.2 -3.4 -.6 -7.2 -.4 -10.6 -.4 s -7.2 -.2 -10.6 .4 C 34.2 35.4 32.2 37.4 31 42 Z" fill="#123c2f" stroke="none" />
        {/* glasses */}
        <circle cx="41.8" cy="43" r="4.4" />
        <circle cx="54.2" cy="43" r="4.4" />
        <path d="M46.2 43 h3.6 M37.4 42 l-3.6 -1.2 M58.6 42 l3.6 -1.2" />
        <path d="M45.4 50.4 c 1.7 1.2 3.5 1.2 5.2 0" />
        <path d="M36 74 l 12 8 12 -8" />
      </g>
    </svg>
  )
}

export function AvatarRiley({ size = 96, ...rest }) {
  return (
    <svg viewBox="0 0 96 96" width={size} height={size} aria-hidden focusable="false" {...rest}>
      <g fill="none" stroke="#0f0e0c" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M24 96 C 24 76 36 69 48 69 c 12 0 24 7 24 27" fill="#f8dfcb" />
        {/* scrubs v-neck */}
        <path d="M41.5 69.5 L 48 78 l 6.5 -9" />
        <path d="M42 61.5 c 0 6 2.4 8.6 6 8.6 s 6 -2.6 6 -8.6" fill="#f5f0e8" />
        <circle cx="48" cy="41.5" r="17" fill="#f5f0e8" />
        {/* high ponytail + cap band */}
        <path d="M31.5 39.5 c -.6 -8.4 5.4 -13.4 16.5 -13.4 s 17.1 5 16.5 13.4 c -1.6 -2.8 -3.4 -4 -6.4 -4.2 -3 -.2 -6.8 -.2 -10.1 -.2 s -7.1 0 -10.1 .2 c -3 .2 -4.8 1.4 -6.4 4.2 Z" fill="#c4522a" stroke="none" />
        <path d="M31.8 33.4 c 0 -.2 0 -.4 .1 -.6 1 -3.2 6 -4 16.1 -4 s 15.1 .8 16.1 4 c .1 .2 .1 .4 .1 .6" />
        <circle cx="65" cy="20" r="6" fill="#c4522a" stroke="none" />
        {/* face */}
        <path d="M43.5 41.5 h.01 M52.5 41.5 h.01" strokeWidth="3" />
        <path d="M44.6 48.6 c 1.4 1.6 3.4 1.8 4.9 .4" />
        <path d="M36 74 l 12 8 12 -8" />
      </g>
    </svg>
  )
}

export const CHARACTERS = [
  {
    id: 'maya',
    name: 'Dr. Maya',
    role: 'General health expert',
    hue: 'leaf',
    tintVar: '--gLeaf',
    tintVarDark: '--leaf',
    Avatar: AvatarMaya,
    specialties: ['General health', 'Nutrition', 'Everyday habits'],
    blurb: 'Warm and unhurried — she explains the body in plain words and small, rememberable steps.',
    lessons: ['digestive', 'stress', 'sleep'],
  },
  {
    id: 'alex',
    name: 'Dr. Alex',
    role: 'Anatomy specialist',
    hue: 'teal',
    tintVar: '--gTeal',
    tintVarDark: '--teal',
    Avatar: AvatarAlex,
    specialties: ['Anatomy', 'Medical facts', 'Body systems'],
    blurb: 'Friendly and precise — he loves the “wait, really?” facts about how you are built.',
    lessons: ['heart', 'lungs', 'brain'],
  },
  {
    id: 'riley',
    name: 'Nurse Riley',
    role: 'Emergency care',
    hue: 'terra',
    tintVar: '--gSand',
    tintVarDark: '--terra',
    Avatar: AvatarRiley,
    specialties: ['First aid', 'Emergency response', 'Everyday fixes'],
    blurb: 'Energetic and practical — quick help for cuts, burns and the “what now” moments.',
    lessons: ['cuts', 'cpr', 'emergencies'],
  },
]

export const CHARACTER_MAP = Object.fromEntries(CHARACTERS.map((c) => [c.id, c]))

export function CharacterAvatar({ id, size = 96, className, ...rest }) {
  const c = CHARACTER_MAP[id] || CHARACTER_MAP.maya
  const Avatar = c.Avatar
  return <Avatar size={size} className={className} {...rest} />
}

/* ── Hero icon-field symbols (medical domain) ────────────────────────── */

const S = {
  /* exported as FIELD_SYMBOLS for the hero icon field */
  medlogo: <path d="M6 8 H28.5 c1.5 0 2.7 1.2 2.7 2.7 v9 c0 1.5-1.2 2.7-2.7 2.7 H20.6 l-4.4 4.4 V22.4 H6 c-1.5 0 -2.7 -1.2 -2.7 -2.7 v-9 C3.3 9.2 4.5 8 6 8" />,
  heart: <path d="M24 37 C13.7 30 11.4 22.9 13.8 18.9 c 2.4 -3.8 7.6 -3.2 10.2 1.5 2.6 -4.7 7.8 -5.3 10.2 -1.5 2.4 4 .1 11.1 -10.2 18.1 Z" />,
  lungs: <path d="M24 7 v13 M24 9.5 c -1.8 -.3 -3.2 -.4 -4.6 -.4 C 13.4 9.1 9.5 15.4 9.5 21.4 c 0 4.6 2.6 7.2 5.8 7.2 3.4 0 5.4 -2.7 5.4 -6.6 v-14 M24 9.5 c 1.8 -.3 3.2 -.4 4.6 -.4 5.9 0 9.9 6.3 9.9 12.3 0 4.6 -2.6 7.2 -5.8 7.2 -3.4 0 -5.4 -2.7 -5.4 -6.6 v-14" />,
  brain: <path d="M24 8 c -3.4 0 -5.8 2.4 -5.8 5.4 -3.2 .2 -6 3 -6 6.6 0 1.2 .4 2.4 .8 3.4 -2 1.6 -3 4 -3 6.4 0 3.8 2.8 6.8 6.4 7.2 .4 3.4 3.4 6 6.8 6 h.8 Z" />,
  drop: <path d="M24 6 C 18.4 14.4 14.4 20.2 14.4 27 a 9.6 9.6 0 0 0 19.2 0 C 33.6 20.2 29.6 14.4 24 6 Z" />,
  apple: <path d="M24 14.4 c -3.2 -4 -9.2 -5 -12.4 .8 -3.2 5.8 -.8 16 4 21.2 3 3.2 5.6 2.4 8.4 1 2.8 1.4 5.4 2.2 8.4 -1 4.8 -5.2 7.2 -15.4 4 -21.2 -3.2 -5.8 -9.2 -4.8 -12.4 -.8 Z M24 14.4 c -.2 -4 2 -6.8 6 -8" />,
  pill: <path d="M9 18 h30 a 6 6 0 0 1 0 12 H9 a 6 6 0 0 1 0 -12 Z M18 18 c 2 2 2 10 0 12 M30 18 c -2 2 -2 10 0 12" />,
  stetho: <path d="M10 6 v12 a 8 8 0 0 0 16 0 V6 M18 26 v3 a 8.6 8.6 0 0 0 17.2 0 V 20 M35.2 20 a 3.4 3.4 0 1 1 .1 0" />,
  cross: <path d="M20 5 h8 v7 h7 v8 h-7 v7 h-8 v-7 h-7 v-8 h7 Z" />,
  bandage: <path d="M15 33 L 33 15 c 2.6 -2.6 2.6 -6.9 0 -9.5 -2.6 -2.6 -6.9 -2.6 -9.5 0 L 5.5 23.5 c -2.6 2.6 -2.6 6.9 0 9.5 2.6 2.6 6.9 2.6 9.5 0 Z M21.5 16.5 h.01 M24 19 h.01 M19 24 h.01" />,
  pulse: <path d="M4 24 h8 l3 -7 5 14 3 -7 h14" />,
  alert: <path d="M24 6 L 44 40 H 4 Z M24 17 v9 M24 31 h.01" />,
  moon: <path d="M41 29 A 17.2 17.2 0 1 1 19 5.5 a 13.6 13.6 0 0 0 22 23.5 Z" />,
  bone: <path d="M15.5 11 C 13.5 9.2 10.3 9.2 8.7 11.2 c -1.4 1.8 -1.2 4.2 .2 5.8 -1.4 1.6 -1.6 4 -.2 5.8 1.6 2 4.8 2 6.8 .2 M32.5 33 c 2 1.8 5.2 1.8 6.8 -.2 1.4 -1.8 1.2 -4.2 -.2 -5.8 1.4 -1.6 1.6 -4 .2 -5.8 -1.6 -2 -4.8 -2 -6.8 -.2 Z M17.4 13.4 L 30.6 30.6" />,
  thermo: <path d="M19.4 9.6 a 4.5 4.5 0 0 1 9 0 V 28.4 a 7 7 0 1 1 -9 0 Z M24 21 v 8 M33 14 h4 M33 20 h4" />,
  flower: <path d="M24 20 a 4 4 0 1 0 .01 0 Z M24 15 c 0 -5 -1 -8 -3 -8 s -3 3 -3 8 M27 15 c 0 -5 1 -8 3 -8 s 3 3 3 8 M24 29 c 0 5 -1 8 -3 8 s -3 -3 -3 -8 M27 29 c 0 5 1 8 3 8 s 3 -3 3 -8 M19 24 c -5 0 -8 -1 -8 -3 s 3 -3 8 -3 M19 27 c -5 0 -8 1 -8 3 s 3 3 8 3 M29 24 c 5 0 8 -1 8 -3 s -3 -3 -8 -3 M29 27 c 5 0 8 1 8 3 s -3 3 -8 3" />,
  book: <path d="M24 12 C 20.4 8.8 15.2 8.8 8.8 9.8 V 37.8 c 6.4 -1 11.6 -1 15.2 2.2 3.6 -3.2 8.8 -3.2 15.2 -2.2 V 9.8 C 32.8 8.8 27.6 8.8 24 12 Z M24 12 v 28" />,
  sparkle: <path d="M24 6 L 28 19 L 41 24 L 28 29 L 24 42 L 20 29 L 7 24 L 20 19 Z" />,
}

export { S as FIELD_SYMBOLS }

export const FIELD_IDS = Object.keys(S)

/* Integer hash → 0..1 — deterministic placements, no SSR drift. */
export const hashRand = (i) => ((Math.imul(i + 1, 2654435761) >>> 0) % 997) / 997

export function buildPlacements(heroHeight = 720, ids = FIELD_IDS) {
  const out = []
  let k = 0
  const put = (x, y, wideOnly) => {
    const py = Math.round(y + (hashRand(k + 50) - 0.5) * 36)
    out.push({
      id: ids[(k * 7) % ids.length],
      x: Math.round((x + (hashRand(k) - 0.5) * 3) * 10) / 10,
      y: py,
      r: Math.round((hashRand(k + 99) - 0.5) * 28),
      s: 34 + Math.round(hashRand(k + 7) * 10),
      wideOnly,
      copyBand: py > 150 && py < heroHeight - 120,
    })
    k += 1
  }
  const rows = Math.max(6, Math.floor(heroHeight / 118))
  for (let row = 0; row < rows; row++) {
    const y = 104 + row * 118
    const even = row % 2 === 0
    const clearOfTop = y > 470
    for (const x of even ? [2.5, 14] : [8, 19.5]) if (x < 11 || clearOfTop) put(x, y, x > 11)
    for (const x of even ? [93, 81.5] : [87, 76]) if (x > 89 || clearOfTop) put(x, y, x < 89)
  }
  return out
}
