export type VinariumCopy = {
  nav: { scan: string; cellar: string; pricing: string; appStore: string; langLabel: string; langHref: string }
  hero: { eyebrow: string; title: string; lede: string; cta: string; sub: string }
  benefits: {
    title: string
    cards: { title: string; body: string; stat?: string; statLabel?: string }[]
  }
  how: { title: string; steps: { n: string; title: string; body: string }[]; caption: string }
  story: { eyebrow: string; title: string; body: string; sharing: string; badge: string; badgeLabel: string }
  features: { title: string; lede: string; items: { title: string; body: string }[]; widgetsLabel: string }
  pricing: {
    eyebrow: string
    title: string
    free: { name: string; price: string; lines: string[] }
    premium: { name: string; price: string; lines: string[]; note: string }
    cta: string
  }
  footer: { tagline: string; backLink: string }
}

export const appStoreUrl = 'https://apps.apple.com/app/vinarium/id6789688303'

export const copy: Record<'en' | 'fr', VinariumCopy> = {
  en: {
    nav: {
      scan: 'Scan',
      cellar: 'Cellar',
      pricing: 'Pricing',
      appStore: 'App Store',
      langLabel: 'FR',
      langHref: '/vinarium/fr',
    },
    hero: {
      eyebrow: 'Native iOS app',
      title: 'Your cellar,\nunderstood.',
      lede: 'Every bottle scanned, located, valued, and opened at the right moment.',
      cta: "Let's go!",
      sub: 'Free on the App Store',
    },
    benefits: {
      title: 'A cellar you open\nat the right moment',
      cards: [
        {
          title: 'One photo per bottle',
          body: 'You photograph the label. The AI fills the producer, the appellation, the vintage, the grapes, and estimates the price. You correct one field maybe, you save.',
          stat: '10',
          statLabel: 'seconds per bottle',
        },
        {
          title: 'A real map of your cellar',
          body: 'Row A, slot 3: every bottle has a physical place in the grid. You find it without moving ten cases around.',
        },
        {
          title: 'Value and drink windows',
          body: 'The dashboard totals what your cellar is worth and flags what is ready to drink, before it fades.',
          stat: '7',
          statLabel: 'languages shipped',
        },
      ],
    },
    how: {
      title: 'How it works',
      steps: [
        {
          n: '01',
          title: 'Photograph the label',
          body: 'Open the scanner, point at the bottle. One photo is enough.',
        },
        {
          n: '02',
          title: 'The AI fills everything',
          body: 'Producer, appellation, vintage, grapes, and a price estimate grounded in a live web search.',
        },
        {
          n: '03',
          title: 'Shelve it in the grid',
          body: 'Pick a row and a slot. The bottle now has a place, a value and a drink window.',
        },
      ],
      caption: 'The scan on the right is real: a Grange des Peres 2016, read from one photo.',
    },
    story: {
      eyebrow: 'Why I built it',
      title: 'I kept finding bottles too late.',
      body: 'Past their peak, forgotten behind a case. Vinarium is the app I wanted: it tells me what to open tonight, and what can wait another winter.',
      sharing:
        'And since a cellar is rarely one person’s, the whole household can share the same grid with an invite code: anyone can place, move, drink or gift a bottle, and every move is signed in the journal.',
      badge: 'Free',
      badgeLabel: 'Price:',
    },
    features: {
      title: 'Everything a cellar needs',
      lede: 'The cellar, the journal, the sharing and the manual entry stay unlimited, forever.',
      items: [
        {
          title: 'Journal and tastings',
          body: 'Every entry and exit, with tasting notes, ratings, and the member behind each move.',
        },
        {
          title: 'Global search',
          body: 'Names, producers, regions, vintages, even people you gifted bottles to, ranked by relevance.',
        },
        {
          title: 'Home screen widgets',
          body: 'Cellar value, bottle count, ready-to-drink alerts and the latest journal moves, at a glance.',
        },
        {
          title: 'Your data is yours',
          body: 'Export the whole account to a JSON file, restore it anywhere, or erase every trace in one action.',
        },
      ],
      widgetsLabel: 'The four iOS widgets',
    },
    pricing: {
      eyebrow: 'Pricing',
      title: 'Free where it counts',
      free: {
        name: 'Free',
        price: '0 €',
        lines: [
          'Unlimited cellar, journal and sharing',
          'Unlimited manual entry',
          '5 AI scans a month',
          '7 languages, prices in your currency',
        ],
      },
      premium: {
        name: 'Premium',
        price: 'Subscription',
        lines: [
          'Unlimited AI scans',
          'Monthly, or yearly with a discount',
          '7-day free trial on the yearly plan',
        ],
        note: 'Everything else stays free. Premium only lifts the scan meter.',
      },
      cta: 'Get Vinarium',
    },
    footer: {
      tagline: 'Vinarium, a native iOS app built by supervising Claude.',
      backLink: 'See how it was built',
    },
  },
  fr: {
    nav: {
      scan: 'Scan',
      cellar: 'Cave',
      pricing: 'Prix',
      appStore: 'App Store',
      langLabel: 'EN',
      langHref: '/vinarium',
    },
    hero: {
      eyebrow: 'App iOS native',
      title: 'Votre cave,\ncomprise.',
      lede: 'Chaque bouteille scannée, localisée, valorisée, et ouverte au bon moment.',
      cta: "C'est parti !",
      sub: "Gratuit sur l'App Store",
    },
    benefits: {
      title: 'Une cave que vous ouvrez\nau bon moment',
      cards: [
        {
          title: 'Une photo par bouteille',
          body: "Vous photographiez l'étiquette. L'IA remplit le producteur, l'appellation, le millésime, les cépages, et estime le prix. Vous corrigez un champ peut-être, vous enregistrez.",
          stat: '10',
          statLabel: 'secondes par bouteille',
        },
        {
          title: 'Un vrai plan de votre cave',
          body: 'Rangée A, case 3 : chaque bouteille a une place physique dans la grille. Vous la retrouvez sans déplacer dix cartons.',
        },
        {
          title: 'Valeur et fenêtres de garde',
          body: "Le tableau de bord totalise la valeur de votre cave et signale ce qui est prêt à boire, avant que ça ne passe.",
          stat: '7',
          statLabel: 'langues disponibles',
        },
      ],
    },
    how: {
      title: 'Comment ça marche',
      steps: [
        {
          n: '01',
          title: "Photographiez l'étiquette",
          body: 'Ouvrez le scanner, visez la bouteille. Une photo suffit.',
        },
        {
          n: '02',
          title: "L'IA remplit tout",
          body: 'Producteur, appellation, millésime, cépages, et une estimation de prix appuyée sur une recherche web en direct.',
        },
        {
          n: '03',
          title: 'Rangez-la dans la grille',
          body: 'Choisissez une rangée et une case. La bouteille a désormais une place, une valeur et une fenêtre de garde.',
        },
      ],
      caption: 'Le scan de droite est réel : une Grange des Pères 2016, lue depuis une photo.',
    },
    story: {
      eyebrow: "Pourquoi je l'ai faite",
      title: 'Je trouvais mes bouteilles trop tard.',
      body: "Passées leur apogée, oubliées derrière un carton. Vinarium est l'app que je voulais : elle me dit quoi ouvrir ce soir, et ce qui peut attendre un hiver de plus.",
      sharing:
        "Et comme une cave est rarement à une seule personne, tout le foyer peut partager la même grille avec un code d'invitation : chacun peut placer, déplacer, boire ou offrir une bouteille, et chaque mouvement est signé dans le journal.",
      badge: 'Gratuit',
      badgeLabel: 'Prix :',
    },
    features: {
      title: "Tout ce qu'une cave demande",
      lede: "La cave, le journal, le partage et la saisie manuelle restent illimités, pour toujours.",
      items: [
        {
          title: 'Journal et dégustations',
          body: 'Chaque entrée et sortie, avec notes de dégustation, évaluations, et le membre derrière chaque mouvement.',
        },
        {
          title: 'Recherche globale',
          body: 'Noms, producteurs, régions, millésimes, même les personnes à qui vous avez offert des bouteilles.',
        },
        {
          title: "Widgets d'écran d'accueil",
          body: "Valeur de la cave, nombre de bouteilles, alertes prêt-à-boire et derniers mouvements, d'un coup d'œil.",
        },
        {
          title: 'Vos données sont à vous',
          body: "Exportez tout le compte en JSON, restaurez-le où vous voulez, ou effacez toute trace en une action.",
        },
      ],
      widgetsLabel: 'Les quatre widgets iOS',
    },
    pricing: {
      eyebrow: 'Prix',
      title: 'Gratuit là où ça compte',
      free: {
        name: 'Gratuit',
        price: '0 €',
        lines: [
          'Cave, journal et partage illimités',
          'Saisie manuelle illimitée',
          '5 scans IA par mois',
          '7 langues, prix dans votre devise',
        ],
      },
      premium: {
        name: 'Premium',
        price: 'Abonnement',
        lines: [
          'Scans IA illimités',
          'Mensuel, ou annuel avec réduction',
          "7 jours d'essai gratuit sur l'annuel",
        ],
        note: 'Tout le reste reste gratuit. Premium ne lève que le compteur de scans.',
      },
      cta: 'Télécharger Vinarium',
    },
    footer: {
      tagline: 'Vinarium, une app iOS native construite en supervisant Claude.',
      backLink: 'Voir comment elle a été construite',
    },
  },
}
