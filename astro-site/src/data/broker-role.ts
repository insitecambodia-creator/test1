/**
 * Copy for the "Our role as your broker" block (src/components/BrokerRole.astro)
 * shown on every service page, just above the quote form.
 *
 * The four step titles are shared; the heading and the text under each step
 * are written per page so the block speaks to that type of insurance.
 * Edit wording here: every page picks it up.
 */
import type { Lang } from '../i18n/ui';

export type BrokerRoleKey =
  | 'general'
  | 'vehicle'
  | 'fleet'
  | 'property'
  | 'businessProperty'
  | 'construction'
  | 'marine'
  | 'liability'
  | 'professional'
  | 'health'
  | 'internationalHealth'
  | 'employee'
  | 'travel';

interface PageCopy {
  heading: string;
  /** Text under each of the four steps, in order. */
  steps: [string, string, string, string];
}

export const brokerShared: Record<Lang, { eyebrow: string; lead: string; titles: [string, string, string, string] }> = {
  en: {
    eyebrow: 'Our role as your broker',
    lead: 'As a broker, we work for you, not for an insurer. Here is what we do for you, step by step.',
    titles: ['We study your risk', 'We compare insurers', 'We select the best options', 'You choose'],
  },
  fr: {
    eyebrow: 'Notre rôle de courtier',
    lead: 'En tant que courtier, nous travaillons pour vous, pas pour un assureur. Voici ce que nous faisons pour vous, étape par étape.',
    titles: ['Nous étudions votre risque', 'Nous comparons les assureurs', 'Nous sélectionnons les meilleures offres', 'Vous choisissez'],
  },
};

export const brokerCopy: Record<BrokerRoleKey, Record<Lang, PageCopy>> = {
  general: {
    en: {
      heading: 'How we find the right cover for you',
      steps: [
        'We look at what you need to protect: vehicles, property, your business activity, your liability or a project.',
        'We approach several licensed insurers in Cambodia and compare their cover, conditions and premiums.',
        'We shortlist the best options for each risk and explain the differences in plain language.',
        'You decide which offer suits you. We arrange the policy and help you through every claim.',
      ],
    },
    fr: {
      heading: 'Comment nous trouvons la bonne couverture',
      steps: [
        'Nous identifions ce que vous devez protéger : véhicules, biens, activité professionnelle, responsabilité ou projet.',
        'Nous consultons plusieurs assureurs agréés au Cambodge et comparons garanties, conditions et primes.',
        'Nous retenons les meilleures options pour chaque risque et vous expliquons clairement les différences.',
        'Vous choisissez l’offre qui vous convient. Nous mettons le contrat en place et vous accompagnons à chaque sinistre.',
      ],
    },
  },
  vehicle: {
    en: {
      heading: 'How we find the right motor insurance',
      steps: [
        'We look at your car or motorbike, how and where you drive, and the level of cover you need, from third party to all risks.',
        'We put your request to several insurers and compare premiums, excesses, third-party limits and claim service.',
        'We shortlist the policies that give the best protection for the price and explain what each one covers.',
        'You pick the option you prefer. We arrange the policy and stay by your side if you have an accident.',
      ],
    },
    fr: {
      heading: 'Comment nous trouvons votre assurance auto ou moto',
      steps: [
        'Nous examinons votre voiture ou votre moto, votre usage, vos trajets et le niveau de garantie souhaité, du tiers au tous risques.',
        'Nous interrogeons plusieurs assureurs et comparons primes, franchises, plafonds de responsabilité civile et service sinistres.',
        'Nous retenons les contrats offrant la meilleure protection au meilleur prix et vous expliquons ce que chacun couvre.',
        'Vous choisissez l’option qui vous convient. Nous mettons le contrat en place et restons à vos côtés en cas d’accident.',
      ],
    },
  },
  fleet: {
    en: {
      heading: 'How we insure your company fleet',
      steps: [
        'We review your fleet: number and type of vehicles, drivers, usage, routes and your claims history.',
        'We ask several insurers for fleet terms and compare cover, excesses, premiums and how they handle claims.',
        'We select the strongest offers, from compulsory third-party liability to own-damage cover for your vehicles.',
        'You decide. We place the policy, manage vehicles joining or leaving the fleet, and support your team with every claim.',
      ],
    },
    fr: {
      heading: 'Comment nous assurons votre flotte',
      steps: [
        'Nous analysons votre flotte : nombre et type de véhicules, conducteurs, usage, trajets et historique de sinistres.',
        'Nous sollicitons plusieurs assureurs et comparons garanties, franchises, primes et gestion des sinistres.',
        'Nous retenons les meilleures offres, de la responsabilité civile obligatoire aux dommages à vos propres véhicules.',
        'Vous décidez. Nous plaçons le contrat, gérons les entrées et sorties de véhicules et accompagnons vos équipes à chaque sinistre.',
      ],
    },
  },
  property: {
    en: {
      heading: 'How we find the right property insurance',
      steps: [
        'We assess your property, its value, its location and its exposure to fire, flood, storm and other risks.',
        'We compare fire and property insurance offers from several insurers in Cambodia.',
        'We shortlist the best options and check that the sums insured match the real value of your property.',
        'You choose the cover you prefer. We set it up and support you through any claim.',
      ],
    },
    fr: {
      heading: 'Comment nous trouvons votre assurance habitation',
      steps: [
        'Nous évaluons votre bien, sa valeur, sa situation et son exposition à l’incendie, aux inondations, aux tempêtes et aux autres risques.',
        'Nous comparons les offres d’assurance incendie et habitation de plusieurs assureurs au Cambodge.',
        'Nous retenons les meilleures options et vérifions que les capitaux assurés correspondent à la valeur réelle de votre bien.',
        'Vous choisissez la couverture qui vous convient. Nous la mettons en place et vous accompagnons en cas de sinistre.',
      ],
    },
  },
  businessProperty: {
    en: {
      heading: 'How we protect your business premises',
      steps: [
        'We look at your premises, contents, equipment and stock, and the specific risks of your site and activity.',
        'We compare offers from several insurers on covered perils, sums insured, excesses and price.',
        'We shortlist the policies that protect your assets properly, without paying for cover you don’t need.',
        'You choose the policy. We arrange it and handle the claim with the insurer if a loss occurs.',
      ],
    },
    fr: {
      heading: 'Comment nous protégeons vos locaux professionnels',
      steps: [
        'Nous examinons vos locaux, contenus, équipements et stocks, ainsi que les risques propres à votre site et à votre activité.',
        'Nous comparons les offres de plusieurs assureurs : risques couverts, capitaux assurés, franchises et prix.',
        'Nous retenons les contrats qui protègent réellement vos biens, sans vous faire payer des garanties inutiles.',
        'Vous choisissez le contrat. Nous le mettons en place et gérons le sinistre avec l’assureur en cas de dommage.',
      ],
    },
  },
  construction: {
    en: {
      heading: 'How we insure your construction project',
      steps: [
        'We study your project: contract value, duration, site, materials, equipment and the parties involved.',
        'We compare Contractor’s All Risks offers from several insurers, including third-party liability on site.',
        'We shortlist the policies that fit your project and the insurance requirements of your contract.',
        'You choose. We place the cover for the duration of the works and assist you with any claim.',
      ],
    },
    fr: {
      heading: 'Comment nous assurons votre chantier',
      steps: [
        'Nous étudions votre projet : montant du marché, durée, site, matériaux, équipements et intervenants.',
        'Nous comparons les offres Tous Risques Chantier de plusieurs assureurs, responsabilité civile sur site comprise.',
        'Nous retenons les contrats adaptés à votre projet et aux exigences d’assurance de votre marché.',
        'Vous choisissez. Nous plaçons la couverture pour toute la durée des travaux et vous assistons en cas de sinistre.',
      ],
    },
  },
  marine: {
    en: {
      heading: 'How we insure your cargo',
      steps: [
        'We look at what you ship, how often, by which routes and modes of transport, and under which Incoterms.',
        'We compare cargo cover from several insurers, for a single shipment or an annual open policy.',
        'We select the options with the right conditions and limits for your goods.',
        'You choose. We arrange the policy and help you document and follow up any claim.',
      ],
    },
    fr: {
      heading: 'Comment nous assurons vos marchandises',
      steps: [
        'Nous examinons ce que vous expédiez, à quelle fréquence, par quels itinéraires et modes de transport, et selon quels Incoterms.',
        'Nous comparons les garanties marchandises de plusieurs assureurs, au voyage ou en police d’abonnement annuelle.',
        'Nous retenons les options offrant les conditions et plafonds adaptés à vos marchandises.',
        'Vous choisissez. Nous mettons le contrat en place et vous aidons à constituer et suivre tout dossier de sinistre.',
      ],
    },
  },
  liability: {
    en: {
      heading: 'How we find the right liability cover',
      steps: [
        'We look at your activity, your premises, your visitors and how someone could be injured or their property damaged.',
        'We compare public liability offers from several insurers on limits, exclusions and premiums.',
        'We select the options with suitable limits and the fewest gaps for your business.',
        'You choose. We put the policy in place and support you if a claim is made against you.',
      ],
    },
    fr: {
      heading: 'Comment nous trouvons votre responsabilité civile',
      steps: [
        'Nous examinons votre activité, vos locaux, vos visiteurs et les situations où un tiers pourrait être blessé ou ses biens endommagés.',
        'Nous comparons les offres de responsabilité civile de plusieurs assureurs : plafonds, exclusions et primes.',
        'Nous retenons les options aux plafonds adaptés, avec le moins de lacunes possible pour votre entreprise.',
        'Vous choisissez. Nous mettons le contrat en place et vous accompagnons si une réclamation est faite contre vous.',
      ],
    },
  },
  professional: {
    en: {
      heading: 'How we find your professional indemnity cover',
      steps: [
        'We review your profession, your services, your contracts and the claims your clients could bring.',
        'We compare professional indemnity offers from several insurers on limits, excess, exclusions and price.',
        'We shortlist the policies that match your activity and any minimum limits your clients require.',
        'You choose the cover. We arrange it and support you if a client makes a claim.',
      ],
    },
    fr: {
      heading: 'Comment nous trouvons votre RC professionnelle',
      steps: [
        'Nous étudions votre métier, vos prestations, vos contrats et les réclamations que vos clients pourraient engager.',
        'Nous comparons les offres de RC professionnelle de plusieurs assureurs : plafonds, franchise, exclusions et prix.',
        'Nous retenons les contrats adaptés à votre activité et aux plafonds minimums exigés par vos clients.',
        'Vous choisissez la couverture. Nous la mettons en place et vous accompagnons si un client vous met en cause.',
      ],
    },
  },
  health: {
    en: {
      heading: 'How we find the right health plan for you',
      steps: [
        'We look at your age, health, family situation, where you would want to be treated and your budget.',
        'We compare international health plans from several insurers on cover, hospital network, waiting periods and price.',
        'We shortlist the plans that best fit your needs as an expat living in Cambodia.',
        'You choose the plan. We handle the application and help you with claims and renewals.',
      ],
    },
    fr: {
      heading: 'Comment nous trouvons votre assurance santé',
      steps: [
        'Nous prenons en compte votre âge, votre santé, votre situation familiale, le lieu où vous souhaitez être soigné et votre budget.',
        'Nous comparons les assurances santé internationales de plusieurs assureurs : garanties, réseau hospitalier, délais de carence et prix.',
        'Nous retenons les contrats les mieux adaptés à vos besoins d’expatrié au Cambodge.',
        'Vous choisissez votre contrat. Nous gérons l’adhésion et vous aidons pour vos remboursements et renouvellements.',
      ],
    },
  },
  internationalHealth: {
    en: {
      heading: 'How we choose your international health plan',
      steps: [
        'We review your medical needs, your family, where you would want treatment (Cambodia, the region or worldwide) and your budget.',
        'We compare long-term international plans from several insurers, including ACS, APRIL and LUMA, on cover, network and premiums.',
        'We shortlist the plans that suit expats and their families living in Cambodia, and explain the trade-offs.',
        'You choose. We take care of the application, then support you with claims and renewals.',
      ],
    },
    fr: {
      heading: 'Comment nous choisissons votre assurance santé internationale',
      steps: [
        'Nous étudions vos besoins médicaux, votre famille, la zone où vous souhaitez être soigné (Cambodge, région ou monde entier) et votre budget.',
        'Nous comparons les contrats internationaux longue durée de plusieurs assureurs, dont ACS, APRIL et LUMA : garanties, réseau et primes.',
        'Nous retenons les contrats adaptés aux expatriés et à leur famille au Cambodge, et vous expliquons les compromis.',
        'Vous choisissez. Nous nous occupons de l’adhésion, puis vous accompagnons pour vos remboursements et renouvellements.',
      ],
    },
  },
  employee: {
    en: {
      heading: 'How we build your staff health plan',
      steps: [
        'We study your team: headcount, ages, family members to cover, your budget and the benefits you want to offer.',
        'We compare group health plans from several local and international insurers.',
        'We shortlist the plans that best balance cover, hospital network and cost per employee.',
        'You choose the plan. We set it up, onboard your staff and help them with claims throughout the year.',
      ],
    },
    fr: {
      heading: 'Comment nous construisons la couverture santé de vos employés',
      steps: [
        'Nous étudions votre équipe : effectif, âges, ayants droit à couvrir, votre budget et les avantages que vous souhaitez offrir.',
        'Nous comparons les contrats santé collectifs de plusieurs assureurs locaux et internationaux.',
        'Nous retenons les contrats offrant le meilleur équilibre entre garanties, réseau hospitalier et coût par salarié.',
        'Vous choisissez le contrat. Nous le mettons en place, intégrons vos salariés et les aidons pour leurs remboursements toute l’année.',
      ],
    },
  },
  travel: {
    en: {
      heading: 'How we find the right travel insurance',
      steps: [
        'We look at where you travel, how often, for how long and who is travelling with you.',
        'We compare single-trip and annual multi-trip plans from several insurers.',
        'We select the plans with the right limits for medical care, evacuation, cancellation and baggage.',
        'You choose. We issue the policy and are there to help if something goes wrong abroad.',
      ],
    },
    fr: {
      heading: 'Comment nous trouvons votre assurance voyage',
      steps: [
        'Nous regardons où vous voyagez, à quelle fréquence, pour combien de temps et avec qui.',
        'Nous comparons les contrats au voyage et multi-voyages annuels de plusieurs assureurs.',
        'Nous retenons les contrats aux plafonds adaptés pour les frais médicaux, le rapatriement, l’annulation et les bagages.',
        'Vous choisissez. Nous émettons le contrat et sommes là pour vous aider en cas de problème à l’étranger.',
      ],
    },
  },
};
