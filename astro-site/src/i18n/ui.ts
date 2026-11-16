export const languages = {
  en: 'English',
  fr: 'Français',
} as const;

export type Lang = keyof typeof languages;

export const defaultLang: Lang = 'en';

export const ui = {
  en: {
    'skip.toContent': 'Skip to content',
    'nav.generalInsurance': 'General Insurance',
    'nav.allCoverages': 'All Coverages',
    'nav.property': 'Property & P&I',
    'nav.motor': 'Motor Insurance',
    'nav.publicLiability': 'Public Liability',
    'nav.construction': 'Construction All Risks',
    'nav.marine': 'Marine Cargo',
    'nav.healthInsurance': 'Health Insurance',
    'nav.allHealthCoverages': 'All Health Coverages',
    'nav.longTerm': 'Long-Term Insurance for Expats',
    'nav.employeeGroup': 'Employee & Group Health Plans',
    'nav.travel': 'Travel Insurance',
    'nav.claims': 'Claims',
    'nav.aboutUs': 'About Us',
    'nav.contact': 'Contact',
    'nav.getQuote': 'Get a free quote',
    'nav.toggleMenu': 'Toggle menu',
    'footer.tagline':
      'Your trusted insurance broker in Cambodia since 2006. Health, property, construction, motor and more — protecting businesses and individuals across the Kingdom.',
    'footer.generalInsurance': 'General Insurance',
    'footer.healthInsurance': 'Health Insurance',
    'footer.individualHealth': 'Individual Health',
    'footer.groupHealth': 'Group Health Plans',
    'footer.internationalHealth': 'International Health',
    'footer.contactUs': 'Contact Us',
    'footer.address': 'Sisowat Quay, Daun Penh, Phnom Penh 12300, Cambodia',
    'footer.hours': 'Mon–Fri 8:00–18:00, claims 24/7',
    'footer.rights': 'AG Cambodia. All rights reserved.',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Service',
  },
  fr: {
    'skip.toContent': 'Aller au contenu',
    'nav.generalInsurance': 'Assurance Générale',
    'nav.allCoverages': 'Toutes les couvertures',
    'nav.property': 'Propriété & P&I',
    'nav.motor': 'Assurance Automobile',
    'nav.publicLiability': 'Responsabilité Civile',
    'nav.construction': 'Tous Risques Chantier',
    'nav.marine': 'Cargo Maritime',
    'nav.healthInsurance': 'Assurance Santé',
    'nav.allHealthCoverages': 'Toutes les couvertures santé',
    'nav.longTerm': "Assurance long terme pour expatriés",
    'nav.employeeGroup': 'Assurance santé collective',
    'nav.travel': 'Assurance Voyage',
    'nav.claims': 'Sinistres',
    'nav.aboutUs': 'À Propos',
    'nav.contact': 'Contact',
    'nav.getQuote': 'Devis gratuit',
    'nav.toggleMenu': 'Menu',
    'footer.tagline':
      "Votre courtier d'assurance de confiance au Cambodge depuis 2006. Santé, propriété, construction, automobile et plus — protégeant entreprises et particuliers à travers le Royaume.",
    'footer.generalInsurance': 'Assurance Générale',
    'footer.healthInsurance': 'Assurance Santé',
    'footer.individualHealth': 'Santé Individuelle',
    'footer.groupHealth': 'Assurance Santé Collective',
    'footer.internationalHealth': 'Santé Internationale',
    'footer.contactUs': 'Nous Contacter',
    'footer.address': 'Sisowat Quay, Daun Penh, Phnom Penh 12300, Cambodge',
    'footer.hours': 'Lun–Ven 8h00–18h00, sinistres 24/7',
    'footer.rights': 'AG Cambodia. Tous droits réservés.',
    'footer.privacy': 'Politique de confidentialité',
    'footer.terms': "Conditions d'utilisation",
  },
} as const;

export function useTranslations(lang: Lang) {
  return function t(key: keyof (typeof ui)['en']): string {
    return ui[lang][key] ?? ui[defaultLang][key];
  };
}
