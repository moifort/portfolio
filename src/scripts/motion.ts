import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

export const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Declarative motion engine. Pages opt in via data attributes:
 *   data-reveal            fade-up on scroll (data-reveal-delay="0.15")
 *   data-reveal-group      staggered fade-up of direct children
 *   data-parallax="0.2"    element drifts slower than the scroll
 *   data-count-to="3.27"   number counts up when visible
 *                          (data-count-decimals / -prefix / -suffix)
 */
export function initMotion(): void {
  if (prefersReducedMotion()) return

  const lenis = new Lenis({ lerp: 0.12 })
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((time) => lenis.raf(time * 1000))
  gsap.ticker.lagSmoothing(0)

  for (const el of document.querySelectorAll<HTMLElement>('[data-reveal]')) {
    gsap.from(el, {
      y: 48,
      autoAlpha: 0,
      duration: 1.1,
      ease: 'power3.out',
      delay: Number(el.dataset['revealDelay'] ?? 0),
      scrollTrigger: { trigger: el, start: 'top 86%', once: true },
    })
  }

  for (const group of document.querySelectorAll<HTMLElement>('[data-reveal-group]')) {
    gsap.from(group.children, {
      y: 40,
      autoAlpha: 0,
      duration: 0.9,
      ease: 'power3.out',
      stagger: 0.12,
      scrollTrigger: { trigger: group, start: 'top 82%', once: true },
    })
  }

  for (const el of document.querySelectorAll<HTMLElement>('[data-parallax]')) {
    const speed = Number(el.dataset['parallax'] ?? 0.15)
    gsap.to(el, {
      yPercent: -speed * 100,
      ease: 'none',
      scrollTrigger: {
        trigger: el.parentElement ?? el,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
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
