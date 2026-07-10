import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

export const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Declarative motion engine — deliberately restrained: soft fades only,
 * no parallax, no scale. Pages opt in via data attributes:
 *   data-reveal            gentle fade-up on scroll (data-reveal-delay="0.15", capped)
 *   data-reveal-group      staggered gentle fade-up of direct children
 *   data-count-to="3.27"   number counts up when visible
 *                          (data-count-decimals / -prefix / -suffix)
 */
export function initMotion(): void {
  if (prefersReducedMotion()) return

  const lenis = new Lenis({ lerp: 0.16 })
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((time) => lenis.raf(time * 1000))
  gsap.ticker.lagSmoothing(0)

  for (const el of document.querySelectorAll<HTMLElement>('[data-reveal]')) {
    gsap.from(el, {
      y: 18,
      autoAlpha: 0,
      duration: 0.65,
      ease: 'power2.out',
      delay: Math.min(Number(el.dataset['revealDelay'] ?? 0), 0.2),
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    })
  }

  for (const group of document.querySelectorAll<HTMLElement>('[data-reveal-group]')) {
    gsap.from(group.children, {
      y: 18,
      autoAlpha: 0,
      duration: 0.6,
      ease: 'power2.out',
      stagger: 0.08,
      scrollTrigger: { trigger: group, start: 'top 85%', once: true },
    })
  }

  for (const el of document.querySelectorAll<HTMLElement>('[data-count-to]')) {
    const target = Number(el.dataset['countTo'] ?? 0)
    const decimals = Number(el.dataset['countDecimals'] ?? 0)
    const prefix = el.dataset['countPrefix'] ?? ''
    const suffix = el.dataset['countSuffix'] ?? ''
    const state = { value: 0 }
    gsap.to(state, {
      value: target,
      duration: 1.8,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      onUpdate: () => {
        el.textContent = `${prefix}${state.value.toFixed(decimals)}${suffix}`
      },
    })
  }
}

export { gsap, ScrollTrigger }
