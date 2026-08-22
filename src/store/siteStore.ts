import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { SERVICE_PACKS, SERVICE_OPTIONS as PACK_OPTIONS } from '../data/services.js';
import { RETROFIT_CATALOGUE } from '../data/retrofit.js';
import { VEHICLES } from '../data/vehicles.js';
import {
  BEFORE_AFTER,
  GALLERY_ITEMS,
  HERO,
  SOURCING_FACTS,
  SOURCING_PIPELINE,
  TESTIMONIALS,
  WORKSHOP,
} from '../data/content.js';
import { LEADS } from '../data/leads.js';
import { CONTACT } from '../data/site.js';
import type {
  BeforeAfterCase,
  ContactInfo,
  HeroContent,
  Lead,
  LeadStatus,
  RetrofitBrand,
  ServiceOption,
  ServicePack,
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
  workshop: WorkshopContent;
  beforeAfter: BeforeAfterCase[];
  gallery: typeof GALLERY_ITEMS;
  testimonials: typeof TESTIMONIALS;
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

  addLead: (lead: Omit<Lead, 'id' | 'createdAt' | 'status'>) => Lead;
  setLeadStatus: (id: string, status: LeadStatus) => void;
  removeLead: (id: string) => void;

  resetAll: () => void;
}

const seed = () => ({
  vehicles: VEHICLES as Vehicle[],
  packs: SERVICE_PACKS as ServicePack[],
  options: PACK_OPTIONS as ServiceOption[],
  catalogue: RETROFIT_CATALOGUE as RetrofitBrand[],
  hero: HERO as HeroContent,
  workshop: WORKSHOP as WorkshopContent,
  beforeAfter: BEFORE_AFTER as BeforeAfterCase[],
  gallery: GALLERY_ITEMS,
  testimonials: TESTIMONIALS,
  pipeline: SOURCING_PIPELINE,
  sourcingFacts: SOURCING_FACTS,
  contact: CONTACT as ContactInfo,
  leads: LEADS as Lead[],
});

const nextLeadId = (leads: Lead[]) => {
  const numbers = leads
    .map((lead) => Number.parseInt(lead.id.replace(/\D/g, ''), 10))
    .filter((value) => Number.isFinite(value));
  const max = numbers.length > 0 ? Math.max(...numbers) : 2600;
  return `LD-${max + 1}`;
};

export const useSiteStore = create<SiteState>()(
  persist(
    (set, get) => ({
      ...seed(),

      addVehicle: (vehicle) => set((state) => ({ vehicles: [vehicle, ...state.vehicles] })),

      updateVehicle: (id, patch) =>
        set((state) => ({
          vehicles: state.vehicles.map((item) => (item.id === id ? { ...item, ...patch } : item)),
        })),

      removeVehicle: (id) =>
        set((state) => ({ vehicles: state.vehicles.filter((item) => item.id !== id) })),

      setVehicleStatus: (id, status) =>
        set((state) => ({
          vehicles: state.vehicles.map((item) => (item.id === id ? { ...item, status } : item)),
        })),

      updatePack: (id, patch) =>
        set((state) => ({
          packs: state.packs.map((item) => (item.id === id ? { ...item, ...patch } : item)),
        })),

      updateOption: (id, patch) =>
        set((state) => ({
          options: state.options.map((item) => (item.id === id ? { ...item, ...patch } : item)),
        })),

      updateSystem: (brandId, modelId, systemId, patch) =>
        set((state) => ({
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

      updateHero: (patch) => set((state) => ({ hero: { ...state.hero, ...patch } })),
      updateWorkshop: (patch) => set((state) => ({ workshop: { ...state.workshop, ...patch } })),
      updateContact: (patch) => set((state) => ({ contact: { ...state.contact, ...patch } })),

      updateBeforeAfter: (id, patch) =>
        set((state) => ({
          beforeAfter: state.beforeAfter.map((item) =>
            item.id === id ? { ...item, ...patch } : item
          ),
        })),

      addLead: (lead) => {
        const created: Lead = {
          ...lead,
          id: nextLeadId(get().leads),
          status: 'nouveau',
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ leads: [created, ...state.leads] }));
        return created;
      },

      setLeadStatus: (id, status) =>
        set((state) => ({
          leads: state.leads.map((item) => (item.id === id ? { ...item, status } : item)),
        })),

      removeLead: (id) => set((state) => ({ leads: state.leads.filter((item) => item.id !== id) })),

      resetAll: () => set({ ...seed() }),
    }),
    {
      name: 'teinterior-site',
      version: 1,
      storage: createJSONStorage(() => localStorage),
    }
  )
);
