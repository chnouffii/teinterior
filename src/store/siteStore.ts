import { create } from 'zustand';
import { api } from '../lib/api.js';
import { SERVICE_PACKS, SERVICE_OPTIONS as PACK_OPTIONS } from '../data/services.js';
import {
  RETROFIT_CATALOGUE,
  RETROFIT_FACTS,
  RETROFIT_KEEPS,
  RETROFIT_PROCESS,
} from '../data/retrofit.js';
import { VEHICLES } from '../data/vehicles.js';
import {
  BEFORE_AFTER,
  GALLERY_FILTERS,
  GALLERY_ITEMS,
  HERO,
  LAST_JOB,
  REVIEW_SUMMARY,
  SOURCING_FACTS,
  SOURCING_PIPELINE,
  TESTIMONIALS,
  WORKSHOP,
} from '../data/content.js';
import { LEADS } from '../data/leads.js';
import { BRAND, COMPANY, CONTACT, NAV_LINKS, POLES } from '../data/site.js';
import type {
  Client,
  ClientNote,
  BeforeAfterCase,
  ContactInfo,
  HeroContent,
  LastJob,
  Lead,
  LeadStatus,
  RetrofitBrand,
  ReviewSummary,
  ServiceOption,
  ServicePack,
  Testimonial,
  Vehicle,
  VehicleStatus,
  WorkshopContent,
} from './types';

interface SiteState {
  vehicles: Vehicle[];
  packs: ServicePack[];
  options: ServiceOption[];
  catalogue: RetrofitBrand[];
  hero: HeroContent;
  lastJob: LastJob;
  workshop: WorkshopContent;
  beforeAfter: BeforeAfterCase[];
  gallery: typeof GALLERY_ITEMS;
  galleryFilters: typeof GALLERY_FILTERS;
  poles: typeof POLES;
  navLinks: typeof NAV_LINKS;
  brand: typeof BRAND;
  company: typeof COMPANY;
  retrofitProcess: typeof RETROFIT_PROCESS;
  retrofitFacts: typeof RETROFIT_FACTS;
  retrofitKeeps: typeof RETROFIT_KEEPS;
  testimonials: Testimonial[];
  reviewSummary: ReviewSummary;
  pipeline: typeof SOURCING_PIPELINE;
  sourcingFacts: typeof SOURCING_FACTS;
  contact: ContactInfo;
  leads: Lead[];

  addVehicle: (vehicle: Vehicle) => void;
  updateVehicle: (id: string, patch: Partial<Vehicle>) => void;
  removeVehicle: (id: string) => void;
  setVehicleStatus: (id: string, status: VehicleStatus) => void;

  updatePack: (id: string, patch: Partial<ServicePack>) => void;
  updateOption: (id: string, patch: Partial<ServiceOption>) => void;
  updateSystem: (
    brandId: string,
    modelId: string,
    systemId: string,
    patch: Partial<RetrofitBrand['models'][number]['systems'][number]>
  ) => void;

  updateHero: (patch: Partial<HeroContent>) => void;
  updateWorkshop: (patch: Partial<WorkshopContent>) => void;
  updateContact: (patch: Partial<ContactInfo>) => void;
  updateBeforeAfter: (id: string, patch: Partial<BeforeAfterCase>) => void;
  updateTestimonial: (id: string, patch: Partial<Testimonial>) => void;
  addTestimonial: () => void;
  removeTestimonial: (id: string) => void;
  updateReviewSummary: (patch: Partial<ReviewSummary>) => void;

  /** Dépose une demande sur le serveur. Lève si l'envoi échoue. */
  addLead: (lead: Omit<Lead, 'id' | 'createdAt' | 'status'>) => Promise<Lead>;
  setLeadStatus: (id: string, status: LeadStatus) => Promise<void>;
  removeLead: (id: string) => Promise<void>;
  /** Recharge les demandes depuis le serveur (panel d'administration). */
  completerDemande: (
    id: string,
    jeton: string,
    champs: Partial<Lead>
  ) => Promise<Lead>;
  chargerDemandes: () => Promise<void>;

  clients: Client[];
  chargerClients: () => Promise<void>;
  creerClient: (champs: Partial<Client>) => Promise<Client>;
  modifierClient: (id: string, patch: Partial<Client>) => Promise<Client>;
  supprimerClient: (id: string) => Promise<void>;
  ajouterNote: (id: string, text: string) => Promise<ClientNote>;
  rattacherDemande: (leadId: string, clientId: string | null) => Promise<void>;

  resetAll: () => void;

  /** Remplace une section entière de contenus et enregistre sur le serveur. */
  setSection: <K extends keyof SiteContent>(cle: K, valeur: SiteContent[K]) => void;
  /** Fusionne un correctif dans une section objet et enregistre. */
  patchSection: <K extends keyof SiteContent>(cle: K, patch: Partial<SiteContent[K]>) => void;

  /** Lance la requête de contenus sans encore l'appliquer à l'état. */
  precharger: () => Promise<Record<string, unknown>>;
  /** Applique les contenus du serveur. À appeler après l'hydratation. */
  hydrater: () => Promise<void>;

  /** État de la synchronisation, affiché dans le panel. */
  chargement: boolean;
  enregistrement: boolean;
  erreurSync: string | null;
  horsLigne: boolean;
}

/** Les clés de contenus modifiables depuis le panel d'administration. */
type SiteContent = Omit<
  SiteState,
  | 'leads'
  | 'clients'
  | 'chargement'
  | 'enregistrement'
  | 'erreurSync'
  | 'horsLigne'
  | keyof ActionsSeules
>;

type ActionsSeules = {
  [K in keyof SiteState as SiteState[K] extends (...args: never[]) => unknown ? K : never]: true;
};

const seed = () => ({
  vehicles: VEHICLES as Vehicle[],
  packs: SERVICE_PACKS as ServicePack[],
  options: PACK_OPTIONS as ServiceOption[],
  catalogue: RETROFIT_CATALOGUE as RetrofitBrand[],
  hero: HERO as HeroContent,
  lastJob: LAST_JOB as LastJob,
  workshop: WORKSHOP as WorkshopContent,
  beforeAfter: BEFORE_AFTER as BeforeAfterCase[],
  gallery: GALLERY_ITEMS,
  galleryFilters: GALLERY_FILTERS,
  poles: POLES,
  navLinks: NAV_LINKS,
  brand: BRAND,
  company: COMPANY,
  retrofitProcess: RETROFIT_PROCESS,
  retrofitFacts: RETROFIT_FACTS,
  retrofitKeeps: RETROFIT_KEEPS,
  testimonials: TESTIMONIALS as Testimonial[],
  reviewSummary: REVIEW_SUMMARY as ReviewSummary,
  pipeline: SOURCING_PIPELINE,
  sourcingFacts: SOURCING_FACTS,
  contact: CONTACT as ContactInfo,
  leads: LEADS as Lead[],
  clients: [] as Client[],
});


/**
 * Clés de contenus enregistrées sur le serveur. Les demandes en sont exclues :
 * elles ont leurs propres routes, et une sauvegarde de contenus ne doit jamais
 * pouvoir les écraser.
 */
const CLES_CONTENU = [
  'vehicles', 'packs', 'options', 'catalogue', 'hero', 'lastJob', 'workshop', 'beforeAfter',
  'gallery', 'galleryFilters', 'poles', 'navLinks', 'brand', 'company',
  'retrofitProcess', 'retrofitFacts', 'retrofitKeeps', 'testimonials',
  'reviewSummary', 'pipeline', 'sourcingFacts', 'contact',
] as const;

/**
 * Garde-fou : une section ajoutée à l'état mais oubliée dans `CLES_CONTENU`
 * s'édite normalement dans le panel et n'est jamais enregistrée — la
 * modification semble prise puis disparaît au rechargement. Le compilateur
 * signale l'oubli plutôt que de laisser découvrir le problème en production.
 */
type SectionsEnvoyees = (typeof CLES_CONTENU)[number];
type SectionsOubliees = Exclude<keyof SiteContent, SectionsEnvoyees>;
const _aucuneSectionOubliee: SectionsOubliees extends never ? true : never = true;
void _aucuneSectionOubliee;

export const useSiteStore = create<SiteState>()((set, get) => {
  /**
   * Enregistrement différé : les champs texte du panel déclenchent une frappe
   * par caractère. On regroupe les modifications sur un court délai plutôt que
   * d'envoyer une requête à chaque touche.
   */
  /**
   * La requête de contenus, lancée une seule fois.
   *
   * Elle démarre au chargement du script mais n'est appliquée qu'après
   * l'hydratation : modifier l'état pendant que React reprend le balisage
   * pré-rendu provoque une divergence d'hydratation, React jette alors tout le
   * DOM figé et le pré-rendu ne sert plus à rien.
   */
  let requeteContenus: Promise<Record<string, unknown>> | undefined;

  let minuteur: ReturnType<typeof setTimeout> | undefined;
  const enregistrerBientot = () => {
    clearTimeout(minuteur);
    set({ enregistrement: true });
    minuteur = setTimeout(async () => {
      const etat = get();
      const contenus = Object.fromEntries(
        CLES_CONTENU.map((cle) => [cle, etat[cle as keyof SiteState]])
      );
      try {
        await api.enregistrerContenus(contenus);
        set({ enregistrement: false, erreurSync: null });
      } catch (erreur) {
        set({
          enregistrement: false,
          erreurSync:
            (erreur as Error).message || "Enregistrement impossible. Vos modifications ne sont pas publiées.",
        });
      }
    }, 600);
  };

  /** Applique une modification locale puis programme l'enregistrement. */
  const modifier: typeof set = (partiel) => {
    set(partiel as never);
    enregistrerBientot();
  };

  return {
      ...seed(),

      chargement: true,
      enregistrement: false,
      erreurSync: null,
      horsLigne: false,

      precharger: () => {
        // Lance la requête sans rien appliquer : le réseau démarre dès le
        // chargement du script, l'état ne bouge qu'après l'hydratation.
        requeteContenus ??= api.lireContenus() as Promise<Record<string, unknown>>;
        return requeteContenus;
      },

      hydrater: async () => {
        try {
          requeteContenus ??= api.lireContenus() as Promise<Record<string, unknown>>;
          const contenus = await requeteContenus;
          const defauts = seed() as Record<string, unknown>;

          // Le serveur fait foi, mais on fusionne section par section avec les
          // données du build : un champ ajouté par une nouvelle version du site
          // et absent du fichier serveur garde ainsi sa valeur par défaut, au
          // lieu de laisser le panel travailler sur une section incomplète.
          const fusionne: Record<string, unknown> = { ...defauts };
          for (const [cle, valeur] of Object.entries(contenus)) {
            const defaut = defauts[cle];
            const objetSimple = (v: unknown) =>
              typeof v === 'object' && v !== null && !Array.isArray(v);
            fusionne[cle] =
              objetSimple(valeur) && objetSimple(defaut)
                ? { ...(defaut as object), ...(valeur as object) }
                : valeur;
          }

          set({ ...fusionne, chargement: false, horsLigne: false } as never);
        } catch {
          // L'API est injoignable : le site reste debout avec les contenus du
          // build plutôt que de s'afficher vide.
          set({ chargement: false, horsLigne: true });
        }
      },

      setSection: (cle, valeur) => modifier({ [cle]: valeur } as never),

      patchSection: (cle, patch) =>
        modifier({ [cle]: { ...(get()[cle] as object), ...patch } } as never),


      addVehicle: (vehicle) => modifier((state) => ({ vehicles: [vehicle, ...state.vehicles] })),

      updateVehicle: (id, patch) =>
        modifier((state) => ({
          vehicles: state.vehicles.map((item) => (item.id === id ? { ...item, ...patch } : item)),
        })),

      removeVehicle: (id) =>
        modifier((state) => ({ vehicles: state.vehicles.filter((item) => item.id !== id) })),

      setVehicleStatus: (id, status) =>
        modifier((state) => ({
          vehicles: state.vehicles.map((item) => (item.id === id ? { ...item, status } : item)),
        })),

      updatePack: (id, patch) =>
        modifier((state) => ({
          packs: state.packs.map((item) => (item.id === id ? { ...item, ...patch } : item)),
        })),

      updateOption: (id, patch) =>
        modifier((state) => ({
          options: state.options.map((item) => (item.id === id ? { ...item, ...patch } : item)),
        })),

      updateSystem: (brandId, modelId, systemId, patch) =>
        modifier((state) => ({
          catalogue: state.catalogue.map((brand) =>
            brand.id !== brandId
              ? brand
              : {
                  ...brand,
                  models: brand.models.map((model) =>
                    model.id !== modelId
                      ? model
                      : {
                          ...model,
                          systems: model.systems.map((system) =>
                            system.id === systemId ? { ...system, ...patch } : system
                          ),
                        }
                  ),
                }
          ),
        })),

      updateHero: (patch) => modifier((state) => ({ hero: { ...state.hero, ...patch } })),
      updateWorkshop: (patch) => modifier((state) => ({ workshop: { ...state.workshop, ...patch } })),
      updateContact: (patch) => modifier((state) => ({ contact: { ...state.contact, ...patch } })),

      updateBeforeAfter: (id, patch) =>
        modifier((state) => ({
          beforeAfter: state.beforeAfter.map((item) =>
            item.id === id ? { ...item, ...patch } : item
          ),
        })),

      updateTestimonial: (id, patch) =>
        modifier((state) => ({
          testimonials: state.testimonials.map((item) =>
            item.id === id ? { ...item, ...patch } : item
          ),
        })),

      addTestimonial: () =>
        modifier((state) => ({
          testimonials: [
            ...state.testimonials,
            {
              id: `t${Date.now()}`,
              name: '',
              city: '',
              service: '',
              rating: 5,
              date: '',
              text: '',
            },
          ],
        })),

      removeTestimonial: (id) =>
        modifier((state) => ({ testimonials: state.testimonials.filter((item) => item.id !== id) })),

      updateReviewSummary: (patch) =>
        modifier((state) => ({ reviewSummary: { ...state.reviewSummary, ...patch } })),

      addLead: async (lead) => {
        // Le serveur attribue la référence et l'horodatage : deux visiteurs
        // simultanés ne peuvent pas se voir attribuer le même numéro.
        const created = (await api.creerDemande(lead)) as Lead;
        set((state) => ({ leads: [created, ...state.leads] }));
        return created;
      },

      setLeadStatus: async (id, status) => {
        await api.changerStatutDemande(id, status);
        set((state) => ({
          leads: state.leads.map((item) => (item.id === id ? { ...item, status } : item)),
        }));
      },

      completerDemande: async (id, jeton, champs) => {
        const suivante = (await api.completerDemande(id, jeton, champs)) as Lead;
        set((state) => ({
          leads: state.leads.map((d) => (d.id === id ? suivante : d)),
        }));
        return suivante;
      },

      removeLead: async (id) => {
        await api.supprimerDemande(id);
        set((state) => ({ leads: state.leads.filter((item) => item.id !== id) }));
      },

      chargerDemandes: async () => {
        const leads = (await api.lireDemandes()) as Lead[];
        set({ leads });
      },

      // --- Fiches clients ---------------------------------------------------
      chargerClients: async () => {
        const clients = (await api.lireClients()) as Client[];
        set({ clients });
      },

      creerClient: async (champs) => {
        const cree = (await api.creerClient(champs)) as Client;
        set((state) => ({ clients: [cree, ...state.clients] }));
        return cree;
      },

      modifierClient: async (id, patch) => {
        const suivant = (await api.modifierClient(id, patch)) as Client;
        set((state) => ({
          clients: state.clients.map((c) => (c.id === id ? suivant : c)),
        }));
        return suivant;
      },

      supprimerClient: async (id) => {
        await api.supprimerClient(id);
        set((state) => ({
          clients: state.clients.filter((c) => c.id !== id),
          leads: state.leads.map((d) =>
            d.clientId === id ? { ...d, clientId: undefined } : d
          ),
        }));
      },

      ajouterNote: async (id, text) => {
        const note = (await api.ajouterNote(id, text)) as ClientNote;
        set((state) => ({
          clients: state.clients.map((c) =>
            c.id === id
              ? { ...c, notes: [note, ...c.notes], updatedAt: note.createdAt }
              : c
          ),
        }));
        return note;
      },

      rattacherDemande: async (leadId, clientId) => {
        await api.rattacherDemande(leadId, clientId);
        set((state) => ({
          leads: state.leads.map((d) =>
            d.id === leadId ? { ...d, clientId: clientId ?? undefined } : d
          ),
          clients: state.clients.map((c) => {
            const rattachee = c.leadIds.includes(leadId);
            if (c.id === clientId && !rattachee) {
              return { ...c, leadIds: [...c.leadIds, leadId] };
            }
            if (c.id !== clientId && rattachee) {
              return { ...c, leadIds: c.leadIds.filter((i) => i !== leadId) };
            }
            return c;
          }),
        }));
      },

      resetAll: () => modifier({ ...seed() }),
  };
});
