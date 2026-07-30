import { firebaseConfig } from '../data/firebase'

/**
 * Firebase Analytics, wired declaratively so the pages themselves stay free of
 * tracking code. `page_view` comes from the SDK for free on every load, since
 * the site is static and every navigation is a real document load.
 *
 * Elements opt in by data attribute:
 *   data-track="hire_me_click"   event name sent when the element is clicked
 *   data-track-place="nav"       extra event params, snake_cased for GA4
 *
 * Untagged links are counted anyway, so a link added later is never a blind
 * spot: mailto: sends contact_click and off-site links send outbound_click.
 */

type Params = Record<string, string | number | boolean>

/* The SDK is fetched lazily, so a click on an above-the-fold CTA can land
   before Analytics exists. Those events wait here instead of being dropped. */
const pending: { name: string; params: Params }[] = []
let send: ((name: string, params: Params) => void) | null = null

/* Silent in dev so local browsing never lands in the reports. Append
   ?analytics=debug to any URL to send anyway and echo every event to the
   console, which is how a newly tagged element gets checked. */
const debug = (): boolean => new URLSearchParams(location.search).get('analytics') === 'debug'
const enabled = (): boolean => import.meta.env.PROD || debug()

export function track(name: string, params: Params = {}): void {
  const enriched = { page_path: location.pathname, ...params }
  if (debug()) console.debug('[analytics]', name, enriched)
  if (send) send(name, enriched)
  else pending.push({ name, params: enriched })
}

async function start(): Promise<void> {
  const [{ initializeApp }, { getAnalytics, isSupported, logEvent }] = await Promise.all([
    import('firebase/app'),
    import('firebase/analytics'),
  ])

  /* False in a few real browsers (private Safari, no IndexedDB): calling
     getAnalytics there throws rather than degrading. */
  if (!(await isSupported())) return

  const analytics = getAnalytics(initializeApp(firebaseConfig))
  send = (name, params) => logEvent(analytics, name, params)

  for (const event of pending) send(event.name, event.params)
  pending.length = 0
}

/* data-track-place="nav" → { place: 'nav' }: the dataset hands keys over
   camelCased and prefixed, GA4 wants them bare and snake_cased. */
function paramsOf(el: HTMLElement): Params {
  const params: Params = {}

  for (const [key, value] of Object.entries(el.dataset)) {
    if (key === 'track' || !key.startsWith('track') || value === undefined) continue
    const name = key
      .slice('track'.length) // trackAppStore → AppStore
      .replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`) // → _app_store
      .slice(1) // → app_store
    params[name] = value
  }

  return params
}

/* One listener for the whole document, in capture so a handler that stops
   propagation cannot swallow the event. */
function onClick(event: MouseEvent): void {
  const from = event.target instanceof Element ? event.target : null
  if (!from) return

  const tagged = from.closest<HTMLElement>('[data-track]')
  if (tagged) {
    track(tagged.dataset['track'] ?? 'click', paramsOf(tagged))
    return
  }

  const link = from.closest('a[href]')
  if (!(link instanceof HTMLAnchorElement)) return

  if ((link.getAttribute('href') ?? '').startsWith('mailto:')) track('contact_click', { channel: 'email' })
  else if (link.hostname && link.hostname !== location.hostname)
    track('outbound_click', { destination: link.hostname })
}

export function initAnalytics(): void {
  if (!enabled()) return

  /* Listen first, load second: the queue covers the gap. */
  document.addEventListener('click', onClick, { capture: true, passive: true })

  /* requestIdleCallback only landed in Safari 18, so it needs a fallback; a
     timeout is enough to keep the SDK off the critical path. */
  const idle: (cb: () => void) => unknown =
    typeof window.requestIdleCallback === 'function'
      ? (cb) => window.requestIdleCallback(cb)
      : (cb) => window.setTimeout(cb, 1)

  idle(() => void start())
}
