import { gsap, prefersReducedMotion } from './motion'

/**
 * Entrance for the bento mosaic. Tiles do not fade in by DOM order, which on a
 * mosaic reads as a random scatter; they radiate from the centre tile outwards,
 * so the eye lands on the app name first and the grid assembles around it.
 *
 * Left alone under reduced motion: the markup is already in its final state.
 */
export function initBento(): void {
  if (prefersReducedMotion()) return

  for (const grid of document.querySelectorAll<HTMLElement>('[data-bento]')) {
    const tiles = Array.from(grid.children) as HTMLElement[]
    if (!tiles.length) continue

    const bounds = grid.getBoundingClientRect()
    const centreX = bounds.width / 2
    const centreY = bounds.height / 2

    const distances = tiles.map((tile) => {
      const box = tile.getBoundingClientRect()
      const x = box.left - bounds.left + box.width / 2 - centreX
      const y = box.top - bounds.top + box.height / 2 - centreY
      return Math.hypot(x, y)
    })

    const furthest = Math.max(...distances, 1)

    gsap.from(tiles, {
      autoAlpha: 0,
      scale: 0.88,
      duration: 0.7,
      ease: 'power3.out',
      delay: (i: number) => (distances[i] ?? 0) / furthest * 0.45,
      scrollTrigger: { trigger: grid, start: 'top 85%', once: true },
    })
  }
}
