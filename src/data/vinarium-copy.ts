export type VinariumCopy = {
  nav: { cellars: string; features: string; search: string; pricing: string; appStore: string }
  hero: { title: string; lede: string; cta: string }
  bento: {
    title: string
    share: string
    location: string
    favorites: string
    detail: string
    ai: string
    rating: string
    contacts: string
    price: string
    decanter: string
    comments: string
    search: string
    sake: string
    dataExport: string
    ready: string
    /* Carries a {year} placeholder: the app writes the drinking window as a
       deadline, not as a date. */
    readyBefore: string
  }
  search: {
    title: string
    placeholder: string
    examples: string[]
    filtersLabel: string
    filters: string[]
    fields: string[]
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
  pricing: {
    free: { name: string; price: string }
    /* Both plans, priced in the currency of the store this language sells in. */
    premium: { name: string; monthly: string; yearly: string; trial: string }
    /* true means "included as is"; a string spells out what the plan gives,
       which is how the one differing row reads. */
    rows: { label: string; free: string | true; premium: string | true }[]
    included: string
  }
  alts: {
    dashboard: string
    cellar: string
    scanResult: string
    wineList: string
    journal: string
    scanCamera: string
  }
}

export const appStoreUrl = 'https://apps.apple.com/app/vinarium/id6789688303'

export const copy: Record<'en' | 'fr', VinariumCopy> = {
  en: {
    nav: {
      cellars: 'Cellars',
      features: 'Features',
      search: 'Search',
      pricing: 'Pricing',
      appStore: 'App Store',
    },
    hero: {
      title: 'Manage your cellar,\nshare it, and more',
      lede: 'Every bottle scanned, located, valued, and opened at the right moment.',
      cta: 'Try it free on the App Store',
    },
    bento: {
      title: 'More than a cellar manager',
      share: 'Household sharing',
      location: 'Location',
      favorites: 'Favorites',
      detail: 'Detailed record',
      ai: 'AI analysis',
      rating: 'Tasting notes',
      contacts: 'Contacts',
      price: 'Price estimate',
      decanter: 'Fine spirits',
      comments: 'Tasting comments',
      search: 'Advanced search',
      sake: 'Sake and more',
      dataExport: 'Data export',
      ready: 'Ready to drink',
      readyBefore: 'Before {year}',
    },
    search: {
      title: 'Advanced search',
      placeholder: 'Search your cellar',
      examples: ['cotes du rhone', 'Grange des Pères', '2016', 'Porto', 'Marie', 'Roussillon'],
      filtersLabel: 'And filters, on top',
      filters: ['Red', 'White', 'Rosé', 'Favorites', 'In cellar', 'Drunk', 'Gifts'],
      fields: [
        'Wine name',
        'Producer',
        'Subtype',
        'Appellation',
        'Region',
        'Vintage',
        'Gifted by',
        'Gifted to',
        'Recommended by',
        'Tasted with',
      ],
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
    pricing: {
      free: { name: 'Free', price: '$0' },
      premium: {
        name: 'Premium',
        monthly: '$2.99/month',
        yearly: 'or $22.99/year',
        trial: '7-day free trial on the yearly plan',
      },
      rows: [
        { label: 'Cellar, bottle by bottle', free: true, premium: true },
        { label: 'Location', free: true, premium: true },
        { label: 'Journal and tastings', free: true, premium: true },
        { label: 'Household sharing', free: true, premium: true },
        { label: 'Link to a contact', free: true, premium: true },
        { label: 'Manual entry', free: true, premium: true },
        { label: 'Advanced search and filters', free: true, premium: true },
        { label: 'Home screen widgets', free: true, premium: true },
        { label: 'Price estimate', free: true, premium: true },
        { label: 'Data export', free: true, premium: true },
        { label: 'AI scans', free: '5 a month', premium: 'Unlimited' },
      ],
      included: 'Included',
    },
    alts: {
      dashboard: 'Vinarium dashboard: bottles in cellar, total value, ready-to-drink list',
      cellar: 'Physical cellar map, bottle by bottle',
      scanResult: 'AI-filled wine record after a scan',
      wineList: 'Wine list with vintages and prices',
      journal: 'Journal of cellar entries and exits',
      scanCamera: 'Scanning a wine label with the camera',
    },
  },
  fr: {
    nav: {
      cellars: 'Caves',
      features: 'Fonctionnalités',
      search: 'Recherche',
      pricing: 'Tarifs',
      appStore: 'App Store',
    },
    hero: {
      title: 'Gérer votre cave,\npartager, et plus',
      lede: 'Chaque bouteille scannée, localisée, valorisée, et ouverte au bon moment.',
      cta: "Tester gratuitement sur l'App Store",
    },
    bento: {
      title: "Plus qu'un gestionnaire de cave",
      share: 'Partage du foyer',
      location: 'Localisation',
      favorites: 'Favoris',
      detail: 'Fiche détaillée',
      ai: 'Analyse IA',
      rating: 'Notes de dégustation',
      contacts: 'Contacts',
      price: 'Estimation du prix',
      decanter: 'Grands spiritueux',
      comments: 'Commentaires',
      search: 'Recherche avancée',
      sake: 'Saké et plus',
      dataExport: 'Export des données',
      ready: 'Prêt à boire',
      readyBefore: 'Avant {year}',
    },
    search: {
      title: 'Une recherche avancée',
      placeholder: 'Chercher dans votre cave',
      examples: ['cotes du rhone', 'Grange des Pères', '2016', 'Porto', 'Marie', 'Roussillon'],
      filtersLabel: 'Et des filtres, en plus',
      filters: ['Rouge', 'Blanc', 'Rosé', "J'aime", 'En cave', 'Bu', 'Cadeaux'],
      fields: [
        'Nom du vin',
        'Producteur',
        'Sous-type',
        'Appellation',
        'Région',
        'Millésime',
        'Offert par',
        'Offert à',
        'Conseillé par',
        'Dégusté avec',
      ],
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
    pricing: {
      free: { name: 'Gratuit', price: '0 €' },
      premium: {
        name: 'Premium',
        monthly: '2,99 €/mois',
        yearly: 'ou 24,99 €/an',
        trial: "7 jours d'essai gratuit sur l'annuel",
      },
      rows: [
        { label: 'Cave, bouteille par bouteille', free: true, premium: true },
        { label: 'Localisation', free: true, premium: true },
        { label: 'Journal et dégustations', free: true, premium: true },
        { label: 'Partage du foyer', free: true, premium: true },
        { label: 'Lien avec un contact', free: true, premium: true },
        { label: 'Saisie manuelle', free: true, premium: true },
        { label: 'Recherche avancée et filtres', free: true, premium: true },
        { label: "Widgets d'écran d'accueil", free: true, premium: true },
        { label: 'Estimation du prix', free: true, premium: true },
        { label: 'Export des données', free: true, premium: true },
        { label: 'Scans IA', free: '5 par mois', premium: 'Illimités' },
      ],
      included: 'Inclus',
    },
    alts: {
      dashboard: 'Tableau de bord Vinarium : bouteilles en cave, valeur totale, liste prêt à boire',
      cellar: 'Plan physique de la cave, bouteille par bouteille',
      scanResult: 'Fiche vin remplie par l\'IA après un scan',
      wineList: 'Liste des vins avec millésimes et prix',
      journal: 'Journal des entrées et sorties de cave',
      scanCamera: 'Scan d\'une étiquette de vin avec l\'appareil photo',
    },
  },
}
