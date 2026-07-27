# Vinarium Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild `/vinarium` (EN) and add `/vinarium/fr` as a rigakvest-style product landing in the portfolio's dark wine theme, with Nano Banana Pro ambiance visuals.

**Architecture:** One shared `Landing.astro` component rendered by two thin route pages, fed by a per-language copy object. Theme tokens restored in `global.css`. Motion via the existing GSAP + Lenis stack (`Reveal`, `StatCounter`, `initMotion`) plus one signature scroll-drawn SVG line effect.

**Tech Stack:** Astro 7 static, Inter Variable, GSAP + ScrollTrigger, Lenis, astro:assets images. No new dependencies.

**Spec:** `docs/superpowers/specs/2026-07-27-vinarium-landing-design.md`

## Global Constraints

- No em dash and no en dash anywhere in site copy (CLAUDE.md rule). Use commas, colons, periods.
- EN copy: first person, French-flavored English, matching the rest of the portfolio.
- App Store link: `https://apps.apple.com/app/vinarium/id6789688303`.
- Animations restrained: soft fades, counters, one signature effect only.
- Verification is `npm run check` plus a browser pass; the repo has no unit test suite.
- Images: generated art saved under `src/assets/vinarium/art/`, imported through `astro:assets` so they are optimized at build.

---

### Task 1: Generate Nano Banana Pro visuals

**Files:**
- Create: `src/assets/vinarium/art/hero.jpg`
- Create: `src/assets/vinarium/art/story.jpg`

**Interfaces:**
- Produces: two dark editorial photos imported by Task 4 (`heroArt`, `storyArt`).

- [ ] **Step 1: Generate both images via the Gemini API**

Key comes from the vinarium repo `.env` (`NITRO_GOOGLE_API_KEY`). Model `gemini-3-pro-image-preview` (Nano Banana Pro); if it 404s for this key, retry with `gemini-2.5-flash-image`.

```bash
KEY=$(grep '^NITRO_GOOGLE_API_KEY=' /Users/thibaut/Code/vinarium/.env | cut -d= -f2)
gen() { # $1 prompt, $2 aspect, $3 out
  curl -s "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image-preview:generateContent" \
    -H "x-goog-api-key: $KEY" -H 'Content-Type: application/json' \
    -d "{\"contents\":[{\"parts\":[{\"text\":\"$1\"}]}],\"generationConfig\":{\"responseModalities\":[\"IMAGE\"],\"imageConfig\":{\"aspectRatio\":\"$2\",\"imageSize\":\"2K\"}}}" \
  | bunx node-jq -r '[.candidates[0].content.parts[]|select(.inlineData)][0].inlineData.data' | base64 -d > "$3"
}
gen "Wide photograph of a private wine cellar at night, wooden shelves of resting bottles lit by warm hidden strip lighting, deep shadows, dark burgundy and amber palette, cinematic editorial mood, chiaroscuro, no people, no readable text on any label, medium format film grain" "21:9" /tmp/hero.png
gen "Close-up chiaroscuro still life of three dusty wine bottles resting on a dark wooden shelf, one warm light source from the left, near-black background, dark burgundy tones, dust motes in the beam, cinematic editorial photography, no readable text on any label" "16:9" /tmp/story.png
```

- [ ] **Step 2: Inspect both images (Read tool), regenerate if text artifacts or wrong mood**

- [ ] **Step 3: Convert to JPEG quality 82 and move into assets**

```bash
mkdir -p src/assets/vinarium/art
sips -s format jpeg -s formatOptions 82 /tmp/hero.png --out src/assets/vinarium/art/hero.jpg
sips -s format jpeg -s formatOptions 82 /tmp/story.png --out src/assets/vinarium/art/story.jpg
```

- [ ] **Step 4: Commit**

```bash
git add src/assets/vinarium/art
git commit -m "feat(vinarium): add nano banana pro ambiance visuals"
```

### Task 2: Restore theme + lang support in the layout

**Files:**
- Modify: `src/styles/global.css` (re-add the `[data-theme='vinarium']` block after the crypto theme block, around line 59)
- Modify: `src/layouts/Base.astro`

**Interfaces:**
- Produces: `theme: 'home' | 'crypto' | 'vinarium'`, new optional props `lang?: 'en' | 'fr'` (default `'en'`) and `alternates?: { hreflang: string; href: string }[]` on `Base.astro`.

- [ ] **Step 1: Re-add the theme block to `global.css`**

```css
[data-theme='vinarium'] {
  --bg: #181114;
  --text: #f6efe7;
  --muted: #b3a49b;
  --accent: var(--gold);
  --card: #221921;
  --border: rgba(246, 239, 231, 0.1);
  color-scheme: dark;
}
```

- [ ] **Step 2: Extend `Base.astro`**

Widen the `Props` interface, default `lang = 'en'`, render `<html lang={lang}>`, and render `alternates` as `<link rel="alternate" hreflang={a.hreflang} href={a.href} />` in `<head>`.

- [ ] **Step 3: Verify**

Run: `npm run check`
Expected: 0 errors.

- [ ] **Step 4: Commit**

```bash
git add src/styles/global.css src/layouts/Base.astro
git commit -m "feat(layout): restore vinarium theme, add lang and hreflang support"
```

### Task 3: Copy data file (EN + FR)

**Files:**
- Create: `src/data/vinarium-copy.ts`

**Interfaces:**
- Produces: `export type VinariumCopy` and `export const copy: Record<'en' | 'fr', VinariumCopy>`. Shape (all strings unless noted): `nav { scan, cellar, pricing, appStore }`, `hero { eyebrow, title, lede, cta, sub }`, `benefits { title, cards: { title, body, stat?, statLabel? }[] }`, `how { title, steps: { n, title, body }[], caption }`, `story { eyebrow, title, body, sharing, badge }`, `features { title, items: { title, body }[] }`, `pricing { title, free: { name, price, lines: string[] }, premium: { name, price, lines: string[], note } }`, `footer { backLink }`.
- Copy content: EN and FR both fully written, first person, no dashes; the exact wording is drafted during implementation from the spec's section briefs and the vinarium README feature list (scan 5/month free, Premium unlimited, monthly or yearly with 7-day trial, 7 languages, household sharing, export).

- [ ] **Step 1: Write the file with the full EN and FR objects**
- [ ] **Step 2: Run `npm run check`, expect 0 errors**
- [ ] **Step 3: Commit `feat(vinarium): add bilingual landing copy`**

### Task 4: Landing component and routes

**Files:**
- Create: `src/components/vinarium/Landing.astro` (structure + all styles)
- Create: `src/pages/vinarium/index.astro` (EN: `<Landing lang="en" />`)
- Create: `src/pages/vinarium/fr.astro` (FR: `<Landing lang="fr" />`)
- Delete (already deleted in working tree): `src/pages/vinarium.astro`

**Interfaces:**
- Consumes: `copy` from Task 3, art from Task 1, components `IPhoneFrame`, `PhoneCarousel`, `Reveal`, `StatCounter`, `SiteFooter`, layout props from Task 2.
- Produces: routes `/vinarium` and `/vinarium/fr`; section ids `#scan`, `#cellar`, `#pricing` used by the nav anchors.

Eight blocks per the spec, rigakvest styling transposed to the dark theme: floating pill nav (fixed, blurred `--card` background, app icon, three anchor links, FR/EN toggle linking between routes, gold pill App Store CTA), full-bleed hero with `hero.jpg` under a dark gradient and the dashboard screenshot in an `IPhoneFrame` overlapping the fold, benefits with three 24px-radius `--card` cards, how-it-works three numbered steps plus the scan/scan-review duo, full-bleed `story.jpg` section with round gold "Free" badge, dense features grid reusing wine-list/journal/wine-detail shots and the four widget PNGs, pricing two cards, `SiteFooter` plus App Store badge. Eyebrows 11px uppercase `letter-spacing: 0.18em`, headlines `clamp(2.2rem, 5vw, 3.4rem)` weight 500.

- [ ] **Step 1: Build `Landing.astro` markup + styles, then the two route pages with title/description/alternates per language**
- [ ] **Step 2: `npm run check`, expect 0 errors**
- [ ] **Step 3: Browser pass on `/vinarium` and `/vinarium/fr` (dev server via launch config), desktop + mobile widths, console clean**
- [ ] **Step 4: Commit `feat(vinarium): rebuild landing as bilingual rigakvest-style page`**

### Task 5: Signature effect, scroll-drawn connector lines

**Files:**
- Modify: `src/components/vinarium/Landing.astro` (inline `<script>` + two decorative `<svg>` paths between sections)

**Interfaces:**
- Consumes: `gsap`, `ScrollTrigger` already exported by `src/scripts/motion.ts` setup.

- [ ] **Step 1: Add two hand-drawn-style SVG paths (gold stroke, ~2px, `fill:none`) positioned between hero/benefits and how/story; animate `strokeDashoffset` from path length to 0 with a ScrollTrigger scrub over each path's container**
- [ ] **Step 2: Browser pass: lines draw smoothly on scroll, `prefers-reduced-motion` shows them static (guard with `matchMedia`)**
- [ ] **Step 3: Commit `feat(vinarium): draw connector lines on scroll`**

### Task 6: Relink the home page card

**Files:**
- Modify: `src/pages/index.astro:392-420` (vinarium proof card)

- [ ] **Step 1: Turn the `<div class="proof-card proof-card--vinarium">` back into `<a ... href="/vinarium">` and restore `<span class="proof-card__cta">See more →</span>`**
- [ ] **Step 2: `npm run check` + click through from home in the browser**
- [ ] **Step 3: Commit `feat(cards): relink vinarium card to the new landing`**

### Task 7: Final verification

- [ ] **Step 1: `npm run build`, expect success**
- [ ] **Step 2: Full browser pass of both routes, screenshot shared with Thibaut**
- [ ] **Step 3: Code review via superpowers:requesting-code-review before declaring done**
