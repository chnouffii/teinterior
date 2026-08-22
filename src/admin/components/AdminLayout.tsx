import {
  Car,
  ChevronLeft,
  ExternalLink,
  FileText,
  Inbox,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  Wrench,
  X,
} from 'lucide-react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { ADMIN_NAV, useAdminUi } from '../adminUi';
import { useAuthStore } from '../../store/authStore';
import { useSiteStore } from '../../store/siteStore';
import Toaster from './Toaster';
import { toast } from './toast';

const ICONS = { LayoutDashboard, Car, Wrench, FileText, Inbox } as const;

export default function AdminLayout() {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const email = useAuthStore((state) => state.session?.email ?? state.email);
  const { query, setQuery, sidebarCollapsed, toggleSidebar, mobileNavOpen, setMobileNav } =
    useAdminUi();
  const newLeads = useSiteStore(
    (state) => state.leads.filter((lead) => lead.status === 'nouveau').length
  );

  const handleLogout = () => {
    logout();
    toast('Session fermée.', 'info');
    navigate('/admin/connexion', { replace: true });
  };

  return (
    <div className="min-h-screen bg-ink-950 text-muted">
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-white/10 bg-ink-900 transition-[width,transform] duration-200 ${
          sidebarCollapsed ? 'lg:w-[68px]' : 'lg:w-60'
        } ${mobileNavOpen ? 'w-64 translate-x-0' : '-translate-x-full w-64'} lg:translate-x-0`}
      >
        <div className="flex h-14 items-center justify-between gap-2 border-b border-white/10 px-4">
          <Link to="/admin" className="flex items-center gap-2 overflow-hidden">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-accent text-[11px] font-bold text-accent-on">
              T
            </span>
            {!sidebarCollapsed ? (
              <span className="truncate text-sm font-semibold text-fg">Teintérior Admin</span>
            ) : null}
          </Link>
          <button
            type="button"
            onClick={() => setMobileNav(false)}
            aria-label="Fermer le menu"
            className="-mr-1 p-1 text-faint hover:text-fg lg:hidden"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 p-3" aria-label="Navigation administration">
          {ADMIN_NAV.map((item) => {
            const Icon = ICONS[item.icon as keyof typeof ICONS];
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={'end' in item ? item.end : false}
                onClick={() => setMobileNav(false)}
                className={({ isActive }) =>
                  `flex min-h-[40px] items-center gap-3 rounded-md px-3 text-sm transition-colors ${
                    isActive
                      ? 'bg-ink-800 text-fg'
                      : 'text-muted hover:bg-ink-850 hover:text-fg'
                  }`
                }
                title={sidebarCollapsed ? item.label : undefined}
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                {!sidebarCollapsed ? <span className="truncate">{item.label}</span> : null}
                {item.to === '/admin/leads' && newLeads > 0 && !sidebarCollapsed ? (
                  <span className="ml-auto rounded-lg bg-accent px-1.5 py-0.5 text-[10px] font-bold text-accent-on">
                    {newLeads}
                  </span>
                ) : null}
              </NavLink>
            );
          })}
        </nav>

        <div className="space-y-1 border-t border-white/10 p-3">
          <Link
            to="/"
            className="flex min-h-[40px] items-center gap-3 rounded-md px-3 text-sm text-muted transition-colors hover:bg-ink-850 hover:text-fg"
            title="Voir le site public"
          >
            <ExternalLink className="h-4 w-4 shrink-0" aria-hidden="true" />
            {!sidebarCollapsed ? <span>Voir le site</span> : null}
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="flex min-h-[40px] w-full items-center gap-3 rounded-md px-3 text-sm text-muted transition-colors hover:bg-ink-850 hover:text-fg"
          >
            <LogOut className="h-4 w-4 shrink-0" aria-hidden="true" />
            {!sidebarCollapsed ? <span>Déconnexion</span> : null}
          </button>
        </div>
      </aside>

      {mobileNavOpen ? (
        <div
          className="fixed inset-0 z-40 bg-ink-950/70 lg:hidden"
          onClick={() => setMobileNav(false)}
          aria-hidden="true"
        />
      ) : null}

      <div className={`transition-[padding] duration-200 ${sidebarCollapsed ? 'lg:pl-[68px]' : 'lg:pl-60'}`}>
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-white/10 bg-ink-900/95 px-4">
          <button
            type="button"
            onClick={() => setMobileNav(true)}
            aria-label="Ouvrir le menu"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-muted lg:hidden"
          >
            <Menu className="h-4 w-4" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={toggleSidebar}
            aria-label={sidebarCollapsed ? 'Déplier la barre latérale' : 'Replier la barre latérale'}
            className="hidden h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-muted transition-colors hover:text-fg lg:flex"
          >
            <ChevronLeft
              className={`h-4 w-4 transition-transform duration-200 ${sidebarCollapsed ? 'rotate-180' : ''}`}
              aria-hidden="true"
            />
          </button>

          <div className="relative flex-1 max-w-md">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-faint"
              aria-hidden="true"
            />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Rechercher un véhicule, une demande…"
              aria-label="Recherche"
              className="field h-9 py-0 pl-9"
            />
          </div>

          <span className="ml-auto hidden text-xs text-faint sm:block">{email}</span>
        </header>

        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>

      <Toaster />
    </div>
  );
}
