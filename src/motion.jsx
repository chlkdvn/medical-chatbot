/**
 * Pollenair Web Studio — motion primitives (MedBot edition).
 *
 * framer-motion wrappers with reduced-motion fallbacks built in.
 * Law: entrance and idle-float are different components — never stack two
 * animations on one element.
 */

import { Fragment, useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

/* The signature ease. Everything that arrives uses this. */
export const EASE_OUT = [0.22, 1, 0.36, 1]
/* The deliberate pop (badge focus, toggle flips). Use sparingly. */
export const EASE_POP = [0.34, 1.45, 0.5, 1]

/**
 * Scroll-triggered reveal: a calm fade + lift once the element enters view.
 * Honors prefers-reduced-motion (renders static). The default for all
 * sections below the fold — never hand-roll whileInView per block.
 */
export function Reveal({ children, delay = 0, y = 20, className, ...rest }) {
  const reduce = useReducedMotion()

  if (reduce) {
    return (
      <div className={className} {...rest}>
        {children}
      </div>
    )
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, delay, ease: EASE_OUT }}
      {...rest}
    >
      {children}
    </motion.div>
  )
}

/**
 * Gentle, endless vertical drift for floating cards and scene props. Calm
 * by design — small amplitude, long period. Static under reduced motion.
 */
export function FloatCard({ children, className, duration = 6, amplitude = 10, delay = 0 }) {
  const reduce = useReducedMotion()

  if (reduce) return <div className={className}>{children}</div>

  return (
    <motion.div
      className={className}
      animate={{ y: [-amplitude, amplitude, -amplitude] }}
      transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  )
}

/**
 * A list that reveals in order — for card grids. Keep stagger small
 * (0.08–0.12s); a long cascading wall reads as lag, not craft.
 */
export function RevealGrid({ children, stagger = 0.1, className }) {
  const reduce = useReducedMotion()

  if (reduce) return <div className={className}>{children}</div>

  return (
    <div className={className}>
      {Array.isArray(children)
        ? children.map((child, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: i * stagger, ease: EASE_OUT }}
            >
              {child}
            </motion.div>
          ))
        : children}
    </div>
  )
}
