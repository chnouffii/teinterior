export type VehicleStatus = 'disponible' | 'reserve' | 'vendu';
export type Gearbox = 'BVM' | 'BVA';

export interface Vehicle {
  id: string;
  ref: string;
  brand: string;
  model: string;
  trim: string;
  year: number;
  km: number;
  gearbox: Gearbox;
  fuel: string;
  /** Puissance en chevaux DIN. */
  power: number;
  /** Prix de vente affiché sur le site public. */
  price: number;
  /** Prix net négocié avec le vendeur — interne, jamais affiché publiquement. */
  netSeller: number;
  status: VehicleStatus;
  color: string;
  /** Couple de teintes [sombre, clair] utilisé par l'illustration de repli. */
  palette: string[];
  /** Silhouette utilisée par l'illustration de repli. */
  body?: 'berline' | 'break' | 'suv' | 'citadine' | 'coupe';
  /** URLs des photos ; la couverture est donnée par coverIndex. */
  photos: string[];
  coverIndex: number;
  location: string;
  listedAt: string;
  highlights: string[];
  history: string;
  /** Travaux réalisés par l'atelier sur ce véhicule. */
  workshopWork: string[];
}

export interface PackStep {
  label: string;
  detail: string;
  duration: string;
}

export interface ServicePack {
  id: string;
  ref: string;
  name: string;
  subtitle: string;
  price: number;
  priceNote: string;
  duration: string;
  immobilisation: string;
  summary: string;
  steps: PackStep[];
  products: string[];
  note: string;
  featured?: boolean;
}

export interface ServiceOption {
  id: string;
  label: string;
  detail: string;
  price: string;
  duration: string;
}

export type FitmentId = 'plug' | 'module' | 'reserve' | 'etude';

export interface RetrofitSystem {
  id: string;
  name: string;
  ref: string;
  fitment: FitmentId;
  price: number;
  duration: string;
  harness: string;
  note: string;
}

export interface RetrofitModel {
  id: string;
  model: string;
  years: string;
  systems: RetrofitSystem[];
}

export interface RetrofitBrand {
  id: string;
  brand: string;
  models: RetrofitModel[];
}

export interface BeforeAfterCase {
  id: string;
  label: string;
  vehicle: string;
  scene: string;
  beforeCaption: string;
  afterCaption: string;
  summary: string;
  specs: { label: string; value: string }[];
  beforeImage?: string;
  afterImage?: string;
}

export interface HeroContent {
  kicker: string;
  title: string;
  subtitle: string;
  primaryCta: string;
  secondaryCta: string;
  facts: { label: string; value: string }[];
}

export interface WorkshopContent {
  title: string;
  intro: string;
  points: { label: string; detail: string }[];
}

export interface PhoneLine {
  id: string;
  label: string;
  number: string;
  href: string;
}

export interface ContactInfo {
  /** Lignes de l'atelier ; la première sert de contact principal. */
  phones: PhoneLine[];
  email: string;
  emailHref: string;
  whatsapp: string;
  address: { street: string; zone: string; city: string; mapsUrl: string };
  hours: { day: string; value: string }[];
  socials: { id: string; label: string; url: string }[];
}

export interface Testimonial {
  id: string;
  name: string;
  city: string;
  service: string;
  rating: number;
  date: string;
  text: string;
}

export interface ReviewSummary {
  rating: string;
  scale: string;
  count: string;
}

export type ClientStatus = 'prospect' | 'client' | 'inactif';

/** Une note datée dans le journal de suivi d'un client. */
export interface ClientNote {
  id: string;
  createdAt: string;
  text: string;
}

/** Un véhicule connu du client — pas forcément vendu par l'atelier. */
export interface ClientVehicle {
  id: string;
  label: string;
  plate?: string;
}

/** Une prestation réalisée, pour retrouver l'historique et le chiffre d'affaires. */
export interface ClientIntervention {
  id: string;
  date: string;
  label: string;
  amount?: number;
}

/** Avancement d'un dépôt-vente, de l'estimation à la remise des clés. */
export type ConsignmentStatus =
  | 'a_estimer'
  | 'estime'
  | 'en_depot'
  | 'en_vente'
  | 'vendu'
  | 'abandonne';

/** Un véhicule que le client confie à l'atelier pour le vendre. */
export interface Consignment {
  id: string;
  vehicle: string;
  plate?: string;
  status: ConsignmentStatus;
  /** Ce que le client espère en tirer. */
  expectedPrice?: number;
  /** Prix d'affichage convenu ensemble. */
  agreedPrice?: number;
  soldPrice?: number;
  commission?: number;
  startedAt?: string;
  soldAt?: string;
  /** Fiche du showroom correspondante, si le véhicule y est publié. */
  vehicleId?: string;
  notes?: string;
}

/** Avancement d'une recherche personnalisée. */
export type SearchStatus = 'en_recherche' | 'propositions' | 'trouve' | 'livre' | 'abandonne';

/** Un véhicule proposé au client dans le cadre d'une recherche. */
export interface SearchCandidate {
  id: string;
  label: string;
  price?: number;
  url?: string;
  note?: string;
}

/** Une recherche de véhicule menée pour le compte du client. */
export interface VehicleSearch {
  id: string;
  brief: string;
  status: SearchStatus;
  budgetMax?: number;
  yearMin?: number;
  kmMax?: number;
  gearbox?: string;
  fuel?: string;
  startedAt?: string;
  candidates: SearchCandidate[];
  notes?: string;
}

export interface Client {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  status: ClientStatus;
  /** D'où vient le client : site, recommandation, passage… */
  source: string;
  /**
   * Informations permanentes, à relire avant chaque échange : préférences,
   * contraintes, code du portail… Distinct du journal, qui raconte l'historique.
   */
  about: string;
  vehicles: ClientVehicle[];
  interventions: ClientIntervention[];
  /** Véhicules confiés à l'atelier pour la vente. */
  consignments: Consignment[];
  /** Recherches de véhicule menées pour ce client. */
  searches: VehicleSearch[];
  notes: ClientNote[];
  /** Identifiants des demandes entrantes rattachées à cette fiche. */
  leadIds: string[];
  /** Prochaine relance à ne pas oublier. */
  nextAction?: { date: string; label: string };
}

export type LeadType = 'estimation' | 'devis';
export type LeadStatus = 'nouveau' | 'contacte' | 'rdv' | 'cloture';

export interface Lead {
  id: string;
  type: LeadType;
  status: LeadStatus;
  createdAt: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  /** Demandes « vendre ma voiture ». */
  vehicle?: string;
  expectedPrice?: number;
  /** Demandes de devis. */
  service?: string;
  plate?: string;
  /** Fiche client à laquelle la demande a été rattachée. */
  clientId?: string;
}
