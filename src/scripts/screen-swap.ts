import { gsap, prefersReducedMotion } from './motion'

/**
 * Cross-fades the screenshots stacked inside a phone mock, so one frame can show
 * several screens of the app. Paused while off screen and while the tab is in
 * the background; under reduced motion only the first screen is shown.
 */
export function initScreenSwap(): void {
  for (const swap of document.querySelectorAll<HTMLElement>('[data-swap]')) {
    const shots = gsap.utils.toArray<HTMLElement>('[data-swap-shot]', swap)
    if (shots.length < 2) continue

    if (prefersReducedMotion()) {
      gsap.set(shots, { autoAlpha: 0 })
      gsap.set(shots[0]!, { autoAlpha: 1 })
      continue
    }

    const hold = 3.2
    const fade = 0.7
    const timeline = gsap.timeline({ repeat: -1, paused: true })

    gsap.set(shots, { autoAlpha: 0 })
    gsap.set(shots[0]!, { autoAlpha: 1 })

    shots.forEach((shot, index) => {
      const next = shots[(index + 1) % shots.length]!
      timeline
        .to({}, { duration: hold })
        .to(shot, { autoAlpha: 0, duration: fade, ease: 'power1.inOut' })
        .to(next, { autoAlpha: 1, duration: fade, ease: 'power1.inOut' }, '<')
    })

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
      { threshold: 0.2 },
    ).observe(swap)

    document.addEventListener('visibilitychange', sync)
  }
}
