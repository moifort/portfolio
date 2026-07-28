/**
 * Filters the compatible-cellar list as the visitor types.
 *
 * Every model is in the HTML from the start, so the list works without
 * JavaScript and search engines see the whole catalogue; this only hides the
 * rows that do not match. Matching is token based, so "haier 236" finds
 * "Haier HWS236GDEH1".
 */
export function initCellarFinder(): void {
  const input = document.querySelector<HTMLInputElement>('[data-cellar-search]')
  const list = document.querySelector<HTMLElement>('[data-cellar-list]')
  const counter = document.querySelector<HTMLElement>('[data-cellar-count]')
  const empty = document.querySelector<HTMLElement>('[data-cellar-empty]')
  if (!input || !list) return

  const items = Array.from(list.querySelectorAll<HTMLElement>('[data-cellar-item]'))

  const normalise = (value: string) =>
    value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')

  const haystacks = new Map(items.map((item) => [item, normalise(item.dataset['haystack'] ?? '')]))

  const apply = () => {
    const tokens = normalise(input.value).split(/\s+/).filter(Boolean)
    let matches = 0
    let last: HTMLElement | null = null

    for (const item of items) {
      const haystack = haystacks.get(item) ?? ''
      const hit = tokens.every((token) => haystack.includes(token))
      item.hidden = !hit
      delete item.dataset['last']
      if (hit) {
        matches++
        last = item
      }
    }

    // Hidden rows still count for :last-child, so the trailing rule has to be
    // lifted from whichever row ends up visible last.
    if (last) last.dataset['last'] = ''

    if (counter) counter.textContent = String(matches)
    if (empty) empty.hidden = matches > 0
  }

  input.addEventListener('input', apply)
  apply()
}
