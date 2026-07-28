export type VinariumCopy = {
  nav: { scan: string; cellars: string; pricing: string; appStore: string }
  hero: { title: string; lede: string; cta: string }
  bento: {
    share: string
    location: string
    favorites: string
    detail: string
    ai: string
    rating: string
    contacts: string
    price: string
    priceNote: string
    types: { wine: string; spirit: string; beer: string; sake: string; cider: string; other: string }
  }
  cellars: {
    title: string
    lede: string
    placeholder: string
    searchLabel: string
    countLabel: string
    bottles: string
    zone: string
    zones: string
    empty: string
  }
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
  alts: {
    dashboard: string
    cellar: string
    scanResult: string
    wineList: string
    journal: string
    wineDetail: string
    scanCamera: string
  }
}

export const appStoreUrl = 'https://apps.apple.com/app/vinarium/id6789688303'

export const copy: Record<'en' | 'fr', VinariumCopy> = {
  en: {
    nav: {
      scan: 'Scan',
      cellars: 'Cellars',
      pricing: 'Pricing',
      appStore: 'App Store',
    },
    hero: {
      title: 'Manage your cellar,\nshare it, and more',
      lede: 'Every bottle scanned, located, valued, and opened at the right moment.',
      cta: 'Try it free on the App Store',
    },
    bento: {
      share: 'Household sharing',
      location: 'Location',
      favorites: 'Favorites',
      detail: 'Wine details',
      ai: 'AI analysis',
      rating: 'Tasting notes',
      contacts: 'Contacts',
      price: 'Price estimate',
      priceNote: 'estimated live',
      types: {
        wine: 'Wine',
        spirit: 'Spirit',
        beer: 'Beer',
        sake: 'Sake',
        cider: 'Cider',
        other: 'Other',
      },
    },
    cellars: {
      title: 'Your cellar, to the slot',
      lede: '{models} cellar models across {brands} brands. Yours is not on the list? No trouble, you can build a custom one.',
      placeholder: 'Liebherr, Climadiff, Haier...',
      searchLabel: 'Search a wine cooler model',
      countLabel: 'models supported',
      bottles: 'bottles',
      zone: 'zone',
      zones: 'zones',
      empty: 'Nothing matches. Build it yourself below, it takes two numbers.',
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
    alts: {
      dashboard: 'Vinarium dashboard: bottles in cellar, total value, ready-to-drink list',
      cellar: 'Physical cellar map, bottle by bottle',
      scanResult: 'AI-filled wine record after a scan',
      wineList: 'Wine list with vintages and prices',
      journal: 'Journal of cellar entries and exits',
      wineDetail: 'Wine detail record',
      scanCamera: 'Scanning a wine label with the camera',
    },
  },
  fr: {
    nav: {
      scan: 'Scan',
      cellars: 'Caves',
      pricing: 'Prix',
      appStore: 'App Store',
    },
    hero: {
      title: 'Gérer votre cave,\npartager, et plus',
      lede: 'Chaque bouteille scannée, localisée, valorisée, et ouverte au bon moment.',
      cta: "Tester gratuitement sur l'App Store",
    },
    bento: {
      share: 'Partage du foyer',
      location: 'Localisation',
      favorites: 'Favoris',
      detail: 'Vin détaillé',
      ai: 'Analyse IA',
      rating: 'Notes de dégustation',
      contacts: 'Contacts',
      price: 'Estimation du prix',
      priceNote: "estimé à l'instant",
      types: {
        wine: 'Vin',
        spirit: 'Spiritueux',
        beer: 'Bière',
        sake: 'Saké',
        cider: 'Cidre',
        other: 'Autre',
      },
    },
    cellars: {
      title: 'Votre cave sur mesure',
      lede: '{models} modèles de cave parmi {brands} marques. Votre cave n\'est pas dans la liste ? Pas de souci, vous pouvez en créer une sur mesure.',
      placeholder: 'Liebherr, Climadiff, Haier...',
      searchLabel: 'Chercher un modèle de cave',
      countLabel: 'modèles compatibles',
      bottles: 'bouteilles',
      zone: 'zone',
      zones: 'zones',
      empty: 'Aucun résultat. Construisez la vôtre ci-dessous, il suffit de deux nombres.',
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
    alts: {
      dashboard: 'Tableau de bord Vinarium : bouteilles en cave, valeur totale, liste prêt à boire',
      cellar: 'Plan physique de la cave, bouteille par bouteille',
      scanResult: 'Fiche vin remplie par l\'IA après un scan',
      wineList: 'Liste des vins avec millésimes et prix',
      journal: 'Journal des entrées et sorties de cave',
      wineDetail: 'Fiche détaillée d\'un vin',
      scanCamera: 'Scan d\'une étiquette de vin avec l\'appareil photo',
    },
  },
}
