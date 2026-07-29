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
  const results = document.querySelector<HTMLElement>('[data-cellar-results]')
  const gate = document.querySelector<HTMLElement>('[data-cellar-gate]')
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
    // A list that fits has nothing to hand over, so it gets no prompt either.
    if (gate) gate.hidden = list.scrollHeight <= list.clientHeight
  }

  input.addEventListener('input', apply)
  apply()

  /* The catalogue scrolls inside a page that also scrolls, so a swipe or a
     wheel over it moved the list instead of the page. The stylesheet locks it
     while the gate reads "closed", which lets the gesture through to the page;
     picking the list, or the search field taking focus, hands the scroll back
     to it. Set from here rather than in the markup: without JavaScript there is
     no click to open the gate, and the list has to stay scrollable. */
  if (results) {
    const setGate = (open: boolean) => {
      results.dataset['gate'] = open ? 'open' : 'closed'
    }

    setGate(false)

    // A gesture over a locked list scrolls the page and fires no click, so a
    // click here is a deliberate pick rather than the end of a swipe.
    results.addEventListener('click', () => setGate(true))
    input.addEventListener('focus', () => setGate(true))

    const panel = results.closest('.vn-finder__panel') ?? results
    document.addEventListener('pointerdown', (event) => {
      const target = event.target
      if (target instanceof Node && !panel.contains(target)) setGate(false)
    })
  }
}
