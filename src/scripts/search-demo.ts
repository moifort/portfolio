import { gsap, prefersReducedMotion } from './motion'

/**
 * Types example queries into the faux search bar, one after another, on a loop.
 * It types, holds, deletes, then moves on, so the bar reads as somebody using
 * the app rather than as a static screenshot.
 *
 * Paused off screen and in a background tab. Under reduced motion the first
 * example is simply shown.
 */
export function initSearchDemo(): void {
  const field = document.querySelector<HTMLElement>('[data-search-demo]')
  const output = field?.querySelector<HTMLElement>('[data-search-demo-text]')
  if (!field || !output) return

  let examples: string[] = []
  try {
    examples = JSON.parse(field.dataset['searchDemo'] ?? '[]')
  } catch {
    return
  }
  if (!examples.length) return

  if (prefersReducedMotion()) {
    output.textContent = examples[0] ?? ''
    return
  }

  const timeline = gsap.timeline({ repeat: -1, paused: true })

  for (const example of examples) {
    const state = { count: 0 }
    timeline
      .to(state, {
        count: example.length,
        duration: example.length * 0.07,
        ease: 'none',
        onUpdate: () => {
          output.textContent = example.slice(0, Math.round(state.count))
        },
      })
      .to({}, { duration: 1.5 })
      .to(state, {
        count: 0,
        duration: example.length * 0.03,
        ease: 'none',
        onUpdate: () => {
          output.textContent = example.slice(0, Math.round(state.count))
        },
      })
  }

  let onScreen = false

  const sync = () => {
    if (onScreen && !document.hidden) timeline.play()
    else timeline.pause()
  }

  new IntersectionObserver(
    ([entry]) => {
      onScreen = entry?.isIntersecting ?? false
      sync()
    },
    { threshold: 0.4 },
  ).observe(field)

  document.addEventListener('visibilitychange', sync)
}
