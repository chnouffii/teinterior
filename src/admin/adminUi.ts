import { create } from 'zustand';

interface AdminUiState {
  /** Recherche globale de la barre supérieure, consommée par les tables. */
  query: string;
  sidebarCollapsed: boolean;
  mobileNavOpen: boolean;
  setQuery: (query: string) => void;
  toggleSidebar: () => void;
  setMobileNav: (open: boolean) => void;
}

export const useAdminUi = create<AdminUiState>((set) => ({
  query: '',
  sidebarCollapsed: false,
  mobileNavOpen: false,
  setQuery: (query) => set({ query }),
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setMobileNav: (open) => set({ mobileNavOpen: open }),
}));

/**
 * Navigation du panel, groupée pour suivre la structure du site : on cherche
 * « la page rétrofit », pas « le tableau retrofitProcess ».
 */
export const ADMIN_NAV = [
  { to: '/admin', label: 'Tableau de bord', icon: 'LayoutDashboard', end: true, groupe: 'Suivi' },
  { to: '/admin/leads', label: 'Demandes', icon: 'Inbox', groupe: 'Suivi' },

  { to: '/admin/accueil', label: 'Page d’accueil', icon: 'Home', groupe: 'Pages' },
  { to: '/admin/prestations', label: 'Prestations', icon: 'Wrench', groupe: 'Pages' },
  { to: '/admin/avant-apres', label: 'Avant / après', icon: 'SlidersHorizontal', groupe: 'Pages' },
  { to: '/admin/retrofit', label: 'Rétrofit CarPlay', icon: 'MonitorSmartphone', groupe: 'Pages' },
  { to: '/admin/vendre', label: 'Vendre sa voiture', icon: 'Handshake', groupe: 'Pages' },
  { to: '/admin/vehicules', label: 'Showroom', icon: 'Car', groupe: 'Pages' },
  { to: '/admin/realisations', label: 'Réalisations et avis', icon: 'Images', groupe: 'Pages' },

  { to: '/admin/contenu', label: 'Atelier et coordonnées', icon: 'FileText', groupe: 'Réglages' },
  { to: '/admin/legal', label: 'Informations légales', icon: 'Scale', groupe: 'Réglages' },
] as const;
