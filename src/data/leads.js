/** Demandes entrantes reçues via les formulaires du site. */

export const LEAD_STATUSES = {
  nouveau: { id: 'nouveau', label: 'Nouveau', tone: 'accent' },
  contacte: { id: 'contacte', label: 'Contacté', tone: 'warn' },
  rdv: { id: 'rdv', label: 'RDV fixé', tone: 'ok' },
  cloture: { id: 'cloture', label: 'Clôturé', tone: 'neutral' },
};

export const LEAD_TYPES = {
  estimation: { id: 'estimation', label: 'Vendre ma voiture' },
  devis: { id: 'devis', label: 'Devis prestation' },
};

export const LEADS = [
  {
    id: 'LD-2609',
    type: 'estimation',
    status: 'nouveau',
    createdAt: '2026-08-20T09:12:00',
    name: 'Camille Duarte',
    phone: '06 24 55 18 03',
    email: 'camille.duarte@email.fr',
    vehicle: 'BMW Série 1 118d — 2019 · 82 000 km · BVA',
    expectedPrice: 18500,
    message: 'Véhicule entretenu en concession, deux clés, pneus neufs. Je vise une vente avant octobre.',
  },
  {
    id: 'LD-2608',
    type: 'devis',
    status: 'contacte',
    createdAt: '2026-08-19T17:40:00',
    name: 'Thomas Riviere',
    phone: '07 81 46 22 90',
    email: 't.riviere@email.fr',
    service: 'Correction peinture — 1 passe',
    plate: 'FD-482-QT',
    message: 'Golf R noire, beaucoup de micro-rayures après un lavage automatique. Dispo un samedi.',
  },
  {
    id: 'LD-2607',
    type: 'devis',
    status: 'rdv',
    createdAt: '2026-08-18T11:05:00',
    name: 'Sophie Nguyen',
    phone: '06 11 74 39 55',
    email: 'sophie.nguyen@email.fr',
    service: 'Rétrofit CarPlay / Android Auto',
    plate: 'GH-119-AB',
    message: 'Classe C 2017 avec COMAND NTG 5.0. RDV posé le 26/08 à 9 h.',
  },
  {
    id: 'LD-2604',
    type: 'estimation',
    status: 'cloture',
    createdAt: '2026-08-14T15:22:00',
    name: 'Pierre Lasserre',
    phone: '06 63 90 12 47',
    email: 'p.lasserre@email.fr',
    vehicle: 'Renault Zoé R135 — 2021 · 34 600 km · BVA',
    expectedPrice: 15000,
    message: 'Mandat signé, véhicule vendu le 12/08. Dossier clos.',
  },
];
