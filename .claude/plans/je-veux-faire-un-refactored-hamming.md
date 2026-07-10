# Carte « Influences » sous la carte profil

## Contexte

Le portfolio (Astro, page unique `src/pages/index.astro`) affiche dans le hero une colonne gauche avec la carte profil, et à droite le titre + les cartes projets. Thibaut veut ajouter **sous la carte profil** une carte présentant ses influences (mentors du software craftsmanship) : la photo de chacun, et à côté ce qu'il a consommé d'eux (livres écoutés, chaînes/talks YouTube). Premiers entrants : **Martin Fowler** et **Sandro Mancuso** ; la liste doit être facilement extensible (« etc »).

Décisions validées : défauts éditables (Fowler → « Refactoring » + talks YouTube, lien martinfowler.com ; Mancuso → « The Software Craftsman », lien codurance.com) ; photos récupérées en ligne (Wikipédia CC pour Fowler, avatar GitHub pour Mancuso).

## Implémentation

Tout se passe dans `src/pages/index.astro` (+ 2 images d'assets). Réutiliser les patterns existants : carte claire (`--card`/`--border`/radius 1.5rem/ombre douce, comme `.profile-card`), icônes Lucide via `astro-icon` (`lucide:book-open`, `lucide:youtube`), `<Image>` d'`astro:assets`, wrapper `Reveal`.

### 1. Assets
- Télécharger le portrait de Martin Fowler (photo Wikimedia Commons, licence CC) et l'avatar GitHub de Sandro Mancuso (`https://github.com/sandromancuso.png`) → `src/assets/influences/martin-fowler.jpg` et `sandro-mancuso.jpg` (recadrés carrés si besoin via `sips`).

### 2. Données (frontmatter d'index.astro)
```ts
const influences = [
  {
    name: 'Martin Fowler',
    url: 'https://martinfowler.com',
    img: fowlerImg,
    items: [
      { icon: 'lucide:book-open', label: 'Refactoring' },
      { icon: 'lucide:youtube', label: 'Conference talks' },
    ],
  },
  {
    name: 'Sandro Mancuso',
    url: 'https://www.codurance.com',
    img: mancusoImg,
    items: [{ icon: 'lucide:book-open', label: 'The Software Craftsman' }],
  },
]
```
Ajouter une personne = ajouter une entrée + une image.

### 3. Markup
Dans `.hero__card-wrap` (colonne gauche du hero), après `</aside>` de la profile-card, ajouter une carte `influences-card` :
- petit eyebrow type « Influences » / « Learning from »
- une rangée par personne : médaillon rond (~2.75rem, `<Image>`), nom en lien (`target` externe), et en dessous les items avec leur icône Lucide + label en muted.

`.hero__card-wrap` repasse en `flex-direction: column; gap: 1.25rem` (pattern déjà utilisé pour l'ancienne mini-card Stats, visible dans l'historique git — commit « Add compact Stats macOS card under the profile card »), avec `.profile-card { flex: 1 }` conservé pour que le bas de la colonne reste aligné.

### 4. Styles (scoped dans index.astro)
- `.influences-card` : même famille visuelle que `.profile-card` (fond `var(--card)`, bordure, radius 1.5rem, ombre douce, padding ~1.4rem).
- `.influences-card__row` : flex, avatar rond avec ring léger, nom bold 0.95rem, items en 0.84rem `var(--muted)` avec icônes 0.9em.
- Attention au scope Astro : les classes posées sur des éléments rendus par `<Image>`/`Reveal` doivent être en `:global(...)` (pattern déjà en place partout dans le fichier).
- Mobile (≤900px) : la colonne est déjà centrée et limitée à `min(26rem, 100%)`, la carte suit.

## Vérification

1. `bunx astro check` + `bun run build` sans erreur.
2. Screenshot desktop 1440×900 (script playwright-core `f.ts` du scratchpad) : la carte Influences apparaît sous la carte profil, colonne gauche alignée en bas avec les cartes projets ; vérifier que la carte profil ne s'écrase pas (timeline lisible).
3. Screenshot mobile 390px : empilement propre, pas de débordement.
4. Commit puis `bunx firebase-tools hosting:channel:deploy preview --expires 7d` (ne pas toucher à la prod mottet.me).
