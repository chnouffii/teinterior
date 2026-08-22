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

export const ADMIN_NAV = [
  { to: '/admin', label: 'Tableau de bord', icon: 'LayoutDashboard', end: true },
  { to: '/admin/vehicules', label: 'Showroom', icon: 'Car' },
  { to: '/admin/prestations', label: 'Prestations', icon: 'Wrench' },
  { to: '/admin/contenu', label: 'Contenu du site', icon: 'FileText' },
  { to: '/admin/leads', label: 'Demandes', icon: 'Inbox' },
] as const;
