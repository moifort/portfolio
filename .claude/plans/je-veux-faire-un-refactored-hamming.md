# Portfolio mottet.me — refonte complète

## Contexte

Thibaut veut remplacer son portfolio actuel (mottet.me, Firebase Hosting, projet `portfolio-23342`) par un nouveau site qui le positionne pour sa recherche d'emploi : développeur full stack senior devenu **architecte-superviseur de LLM** (FP, DDD/CQRS, vision produit). La preuve de la méthode : des produits réels construits en supervisant Claude et utilisés au quotidien — **Crypto-bot** et **Vinarium** — présentés en landing pages « à la Apple » qui vendent le produit (storytelling, mockups, chiffres réels).

Le répertoire `/Users/thibaut/Code/portfolio` est **vide** : projet from scratch (git init inclus).

## Décisions validées avec l'utilisateur

- **Langue : anglais** (screenshots Vinarium en français, assumés — authenticité)
- **Stack : Astro 5**, TypeScript strictest, CSS moderne + **libs dédiées pour animations et mockups** (demande explicite : rendu super attractif, ne pas hésiter à utiliser des libs)
- **Animations : GSAP + ScrollTrigger** (pinning, scrub, parallax, compteurs — la référence du style Apple) + **Lenis** (smooth scroll)
- **Mockups iPhone : devices.css** (frames CSS réalistes) — fallback frame custom si le rendu ne convainc pas
- **Structure : multi-pages** — `/` (narrative avant/après LLM, pas de CV chronologique) + `/crypto-bot` + `/vinarium`
- **Chiffres crypto-bot en dur** dans un fichier TS unique éditable
- **Screenshots généreusement utilisés** pour expliquer le fonctionnement des apps, avec effets Apple (reveals au scroll, parallax, sections pinnées/scrubbées) et mockups iPhone

## Chiffres réels crypto-bot (fournis par l'utilisateur via screenshot de l'app)

- Net **+44,65 $ (+3,27 %)** sur **1 367 $** investis · brut +55,35 $ · frais −10,69 $
- **Alpha +18,60 %** vs HOLD (BTC ≈ −15 % sur la période) — angle marketing principal
- **17 trades**, depuis le **28 avril 2026**, grille 10 niveaux, BTC/USDC sur Kraken, cycle 30 s, 24/7

## Prérequis utilisateur

- **Screenshot de l'app CryptoBot** (celui partagé en conversation : dark, +3,27 % vert, badge Live) à fournir en fichier PNG pendant l'implémentation → `src/assets/crypto-bot/`. En attendant : placeholder aux mêmes proportions, non bloquant.

## Structure de fichiers

```
portfolio/
├── astro.config.mjs          # site: https://mottet.me, @astrojs/sitemap, trailingSlash: 'never'
├── tsconfig.json             # extends astro/tsconfigs/strictest
├── package.json              # runtime Bun
├── firebase.json             # hosting: dist/, cleanUrls, cache immutable /_astro/**
├── .firebaserc               # default: portfolio-23342
├── public/                   # favicon.svg, robots.txt, og/
├── src/
│   ├── data/
│   │   ├── crypto-bot.ts     # LE fichier de chiffres éditable (typé, commenté)
│   │   └── site.ts           # email, github moifort, meta SEO par page
│   ├── assets/
│   │   ├── vinarium/         # copie des 7 screenshots + AppIcon.png
│   │   └── crypto-bot/       # screenshot app (fourni par l'utilisateur)
│   ├── styles/
│   │   └── global.css        # reset, tokens, typo fluide clamp(), palettes par thème
│   ├── scripts/
│   │   └── motion.ts         # init GSAP/ScrollTrigger/Lenis, helpers data-attributes
│   ├── layouts/Base.astro    # head SEO/OG, fonts self-hosted, data-theme par page
│   ├── components/
│   │   ├── IPhoneFrame.astro # wrapper devices.css (frame iPhone réaliste) + <Image> optimisée
│   │   ├── Reveal.astro      # wrapper animation au scroll (data-attrs consommés par motion.ts)
│   │   ├── StatCounter.astro # compteur animé GSAP, no-JS safe, reduced-motion safe
│   │   ├── ProductCard.astro # teaser accueil → landings
│   │   └── SiteFooter.astro
│   └── pages/
│       ├── index.astro
│       ├── crypto-bot.astro
│       ├── vinarium.astro
│       └── 404.astro
```

## Assets sources (vérifiés présents)

- `/Users/thibaut/Code/vinarium/screenshots/` : `dashboard.png`, `cellar.png`, `wine-list.png`, `wine-detail.png`, `journal.png`, `scan.png`, `scan-review.png` (1206×2622)
- `/Users/thibaut/Code/vinarium/ios/Vinarium/Assets.xcassets/AppIcon.appiconset/AppIcon.png` (logo, palette bordeaux/or/anthracite à pipetter pour le thème Vinarium)

## Ordre de construction

### 1. Setup
`git init` → scaffold Astro minimal (Bun) → deps : `gsap`, `lenis`, `devices.css` → config Astro/TS → `firebase.json` + `.firebaserc` (**pas de deploy**) → copie des assets dans `src/assets/` (pour bénéficier d'`astro:assets` : AVIF/WebP responsive, crucial vu la taille des PNG) → premier commit.

### 2. Données et fondations
- `src/data/crypto-bot.ts` : `{ invested: 1367, netProfit: 44.65, netPercent: 3.27, grossProfit: 55.35, fees: 10.69, alphaVsHold: 18.6, holdPercent: -15, trades: 17, since: '2026-04-28', gridLevels: 10, pair: 'BTC/USDC', exchange: 'Kraken', cycleSeconds: 30 } as const` — toute la landing lit ce fichier ; rafraîchir les chiffres = éditer 1 fichier + redeploy.
- `global.css` : reset, tokens espacement, échelle typo fluide, `prefers-reduced-motion`. Palettes via `<body data-theme>` :
  - accueil : neutre clair, un accent
  - crypto-bot : quasi-noir `#0a0a0f`, vert profit `#30d158` (vert iOS de l'app)
  - vinarium : anthracite + bordeaux (~`#722f37`) + or (~`#c9a227`), à affiner depuis l'AppIcon
- `Base.astro` : head complet (title/description/OG/canonical par page), font variable self-hosted (Inter ou Geist).

### 3. Composants transverses et moteur d'animation
- `src/scripts/motion.ts` : init **Lenis** (smooth scroll) + **GSAP/ScrollTrigger** synchronisés ; système déclaratif par data-attributes (`data-reveal`, `data-parallax`, `data-pin`, `data-count-to`) pour que chaque page n'écrive aucun JS spécifique. Tout désactivé sous `prefers-reduced-motion`.
- `IPhoneFrame.astro` : frame **devices.css** (iPhone réaliste : encoche/Dynamic Island, bordures titane) enveloppant `<Image>` d'`astro:assets` avec `widths=[320,640,1206]` ; si le rendu devices.css déçoit, fallback frame custom.
- `Reveal.astro` (pose les data-attrs) · `StatCounter.astro` (compteur GSAP, valeur finale dans le HTML = no-JS safe) · `ProductCard.astro` · `SiteFooter.astro`.

### 4. Page d'accueil — narrative en 5 actes
1. **Hero identitaire** : « Thibaut Mottet » + phrase forte type *"I don't write code anymore. I ship products."* — senior full-stack, Paris.
2. **The shift** : avant (des années à écrire du code) / après (les LLM ont changé le paradigme, il supervise Claude). Ton confiant.
3. **How I work now** : 3 blocs — vision d'architecte (FP, DDD/CQRS, branded types, erreurs en unions discriminées), méthodologie produit, supervision de LLM.
4. **Proof: real products** : 2 `ProductCard` (Vinarium avec app icon · Crypto-bot avec +3,27 %/alpha en teaser) → liens landings. *"Built by supervising Claude. Used every day."*
5. **Contact** : GitHub, email.

### 5. Landing `/crypto-bot` (dark, Apple-style)
1. **Hero** : énorme `+3.27%` vert en StatCounter, *"while Bitcoin dropped 15%"*, badge « Live · since April 28, 2026 », mockup iPhone du screenshot de l'app.
2. **The problem** : HOLD −15 % vs bot +3,27 % — comparaison en deux barres CSS, **alpha +18,6 pts** en très gros (section dédiée).
3. **The grid, explained** : schéma SVG/CSS inline de la grille (achats bas/ventes haut) en **section sticky** pendant que le texte défile — *"an employee working 24/7, checking the market every 30 seconds"*, auto-tuning ATR : *"no parameters to babysit"*.
4. **Real numbers** : Brut − Frais = Net, 17 trades, post-only, stop-loss. Honnêteté = crédibilité.
5. **The craft** : TypeScript/Nitro/Bun, DDD/CQRS, FP, GraphQL Pothos, app iOS SwiftUI + widget — preuve de la méthode de supervision.
6. **CTA** : GitHub + retour accueil.

### 6. Landing `/vinarium` (bordeaux/or, chaleureux)
Les screenshots portent l'explication du fonctionnement — chaque feature = son screenshot en mockup, alternance texte/frame façon Apple :
1. **Hero** : app icon + tagline (*"Your cellar, understood."*), mockup `dashboard.png`.
2. **Scan IA en vedette** (section la plus travaillée) : duo `scan.png` → `scan-review.png` côte à côte, narration « photograph a label → full record + estimated price » (Claude vision + Gemini prix).
3. **Features** : plan physique de la cave (`cellar.png`), collection et fiches (`wine-list.png`, `wine-detail.png`), journal entrées/sorties (`journal.png`), drink windows « ready to drink », widgets iOS.
4. **The craft** : SwiftUI/Swift 6, Nitro sur Cloud Functions Gen 2, Pothos, DDD/CQRS/FP, Terraform one-shot bootstrap, Firestore.
5. **CTA/footer.**

### 7. SEO / finitions
`robots.txt`, sitemap, OG par page, favicon, `404.astro`.

## Animations (spectaculaires mais maîtrisées)

- **GSAP + ScrollTrigger** : reveals fade-up/scale, parallax sur les mockups, sections **pinnées avec scrub** (le hero crypto-bot dont le +3,27 % grossit au scroll, la grille expliquée étape par étape pendant que le schéma reste épinglé, le duo scan Vinarium qui se révèle en séquence), compteurs animés sur les chiffres.
- **Lenis** : smooth scroll global synchronisé avec ScrollTrigger (le « feel » Apple).
- Garde-fous : tout désactivé sous `prefers-reduced-motion: reduce` ; contenu complet lisible sans JS (GSAP ne fait qu'embellir, `gsap.set` initiaux plutôt que contenu caché en CSS).

## Déploiement (ne pas casser mottet.me)

1. Vérifier `firebase projects:list` (login déjà présent a priori).
2. **Preview d'abord** : `bun run build && firebase hosting:channel:deploy preview --expires 7d` → URL de preview partageable, le site live intact.
3. Validation humaine sur la preview (desktop + iPhone).
4. Prod : `firebase deploy --only hosting` (rollback en 1 clic dans la console Firebase).

## Vérification

1. `bun run build` + `astro check` sans erreur.
2. Lighthouse sur les 3 pages (`astro preview`) : Perf ≥ 95, A11y ≥ 95, SEO 100. Vigilance : poids des screenshots (AVIF < ~200 Ko par frame) et LCP du hero crypto-bot.
3. Responsive : 375 / 390–430 / 768 / 1440 px — typo géante du hero via `clamp()`, duo scan qui passe en colonne.
4. Test no-JS (chiffres visibles) et `prefers-reduced-motion` (aucune animation).
5. Les 3 URLs + 404 + OG tags vérifiés sur la preview channel → seulement ensuite deploy prod.
