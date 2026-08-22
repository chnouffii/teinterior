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
}
