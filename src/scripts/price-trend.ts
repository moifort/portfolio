import { gsap, prefersReducedMotion } from './motion'

/** One period of the curve, in the SVG's own units. */
const PERIOD_X = 100
const PERIOD_Y = 12

/**
 * A price ticker that never rests: the curve scrolls by exactly one period, so
 * the second period lands where the first was and the loop has no seam, while
 * the figure wanders between plausible estimates instead of counting once.
 *
 * Paused off screen and in a background tab. Under reduced motion nothing
 * moves and the figure shows a settled value.
 */
export function initPriceTrend(): void {
  const chart = document.querySelector<SVGSVGElement>('[data-trend]')
  const scroller = chart?.querySelector<SVGGElement>('[data-trend-scroll]')
  const figure = document.querySelector<HTMLElement>('[data-trend-count]')
  if (!chart || !scroller || !figure) return

  const settled = Number(figure.dataset['trendCount'] ?? 0)

  if (prefersReducedMotion()) {
    figure.textContent = String(settled)
    return
  }

  const scroll = gsap.to(scroller, {
    x: -PERIOD_X,
    y: PERIOD_Y,
    duration: 7,
    ease: 'none',
    repeat: -1,
    paused: true,
  })

  // Wanders around the settled value rather than climbing to it once, so the
  // figure keeps moving for as long as the curve does.
  const reading = { value: settled }
  const ticker = gsap.timeline({ repeat: -1, paused: true })
  for (const offset of [-9, 14, -5, 21, -13, 7]) {
    ticker.to(reading, {
      value: settled + offset,
      duration: 1.15,
      ease: 'power1.inOut',
      onUpdate: () => {
        figure.textContent = String(Math.round(reading.value))
      },
    })
  }

  let onScreen = false

  const sync = () => {
    const run = onScreen && !document.hidden
    for (const anim of [scroll, ticker]) {
      if (run) anim.play()
      else anim.pause()
    }
  }

  new IntersectionObserver(
    ([entry]) => {
      onScreen = entry?.isIntersecting ?? false
      sync()
    },
    { threshold: 0.3 },
  ).observe(chart)

  document.addEventListener('visibilitychange', sync)
}
