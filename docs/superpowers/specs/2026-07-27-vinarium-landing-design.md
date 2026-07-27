# Vinarium landing page design

Date: 2026-07-27
Status: validated with Thibaut (approach B, structure approved)

## Goal

Replace the deleted `/vinarium` page with a product landing page heavily inspired by
rigakvest.com's structure and editorial style, but in the portfolio's dark wine theme.
Ambiance visuals are generated with Nano Banana Pro (Gemini image API). App screenshots
come from `src/assets/vinarium/`.

## Reference analysis (rigakvest.com)

Structural and stylistic elements to borrow:

- Floating pill navigation bar (logo, links, language toggle, dark pill CTA).
- Full-bleed photo hero with white text over it, big 48-56px medium-weight headline,
  tiny uppercase eyebrow labels (tracking-wide, 10-12px).
- Rounded cards (24px+ radius) on plain sections, three-step "how it works" row.
- A dark full-bleed photo section for the personal story, with a round price badge.
- Hand-drawn animated SVG lines connecting sections (signature effect, drawn on scroll).
- Playful CTA copy ("Let's go!").

## Theme

Approach B: rigakvest structure, portfolio's wine-dark palette (restored from the old page):

```css
[data-theme='vinarium'] {
  --bg: #181114;
  --text: #f6efe7;
  --muted: #b3a49b;
  --accent: var(--gold); /* #c9a227 */
  --card: #221921;
  --border: rgba(246, 239, 231, 0.1);
  color-scheme: dark;
}
```

Typography stays Inter Variable (already shipped, close enough to Gilroy's geometric
feel at medium weights; no new font dependency). Headlines 48px/500, eyebrows 10-11px
uppercase with wide tracking, body 15-16px.

## Languages and routes

- `/vinarium` : English, default, tone matches the portfolio (first person,
  French-flavored English).
- `/vinarium/fr` : French version.
- FR/EN toggle in the pill nav, linking between the two routes.
- Copy lives in `src/data/vinarium-copy.ts` (one object per language); a single
  shared page component `src/components/vinarium/Landing.astro` renders either.
- `Base.astro` gains an optional `lang` prop (default `en`) and each page adds
  `link rel="alternate" hreflang` tags.
- No em dash or en dash anywhere in the copy (site rule).

## Page structure (8 blocks)

1. **Pill nav** (sticky): Vinarium app icon, anchor links (Scan, Cellar, Pricing),
   FR/EN toggle, dark pill CTA "App Store" linking to the App Store listing
   (`https://apps.apple.com/app/vinarium/id6789688303`, id found in the vinarium
   repo's `public/rejoindre.html`).
2. **Hero**: full-bleed Nano Banana Pro cellar photo (dark, warm light), eyebrow
   "NATIVE iOS APP", headline "Your cellar, understood." / "Votre cave, comprise.",
   one-line lede, CTA pill "Let's go!" + App Store badge. iPhone (dashboard screenshot)
   overlapping the hero edge.
3. **Benefits**: 48px headline + three rounded cards (AI scan in 10 seconds, physical
   cellar map, live value and drink windows), each with a small stat or icon.
4. **How it works**: three numbered steps in rigakvest's card style (Photograph the
   label, AI fills everything, Shelve it in the grid), followed by the scan -> scan-review
   screenshot duo in iPhone frames with an animated arrow/line between them.
5. **Dark story section**: full-bleed Nano Banana Pro photo (chiaroscuro bottle detail),
   the personal story (bottles found too late, past their peak), household sharing
   pitch, round gold price badge "Free".
6. **Dense features grid**: journal, global search, widgets (4 widget PNGs), 7 languages,
   data export, household sharing. Dense layout, many screenshots (wine-list, journal,
   wine-detail).
7. **Pricing**: two cards, Free (everything unlimited except scan, 5 AI scans/month)
   and Premium (unlimited scans, monthly or yearly with trial). Round badge motif.
8. **Footer**: reuse `SiteFooter` plus App Store badge and back-to-portfolio link.

Index page: restore the proof card link to `/vinarium` and its "See more" CTA
(currently detached in the working tree).

## Motion

Existing GSAP + Lenis stack via `initMotion()` and `Reveal` components. Restraint per
Thibaut's preference: soft fades, `StatCounter` where a number appears, and ONE signature
effect: hand-drawn SVG lines between sections drawn on scroll (stroke-dashoffset +
ScrollTrigger), echoing rigakvest.

## Nano Banana Pro visuals

Generated one-off via the Gemini API (`NITRO_GOOGLE_API_KEY` from the vinarium repo,
model `gemini-3-pro-image-preview`, fallback `gemini-2.5-flash-image`), saved under
`src/assets/vinarium/art/`, compressed. Planned shots (all dark, warm, editorial,
consistent with the App Store screenshot backgrounds):

1. `hero.png` (21:9 or 16:9, 2K): wide wine cellar, warm shelf lighting, deep shadows,
   no people, no readable labels.
2. `story.png` (16:9, 2K): close chiaroscuro of a few resting bottles, dust, single
   warm light source.
3. Optional texture/detail shot if a section needs it.

Prompts must avoid brand names and readable text (generated text artifacts).

## Non-goals

- No backend, no analytics, no cookie banner.
- No change to the vinarium repo.
- No new font or heavy dependency; reuse the existing stack.

## Verification

- `npm run check` (astro check) passes.
- Visual pass in the browser preview at desktop and mobile widths, both routes.
- Lighthouse-level sanity: images compressed, lazy-loaded below the fold.
