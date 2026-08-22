import { useEffect, useState } from 'react';
import { Menu, Phone, X } from 'lucide-react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import Logo from '../ui/Logo.jsx';
import Button from '../ui/Button.jsx';
import { NAV_LINKS, ROUTES, primaryPhone } from '../../data/site.js';
import { useSiteStore } from '../../store/siteStore';
import useScrollPosition from '../../hooks/useScrollPosition.js';
import useLockBodyScroll from '../../hooks/useLockBodyScroll.js';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const scrolled = useScrollPosition(24);
  const { pathname } = useLocation();
  const contact = useSiteStore((state) => state.contact);
  const phone = primaryPhone(contact);

  useLockBodyScroll(menuOpen);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-200 ${
        scrolled ? 'border-white/10 bg-ink-950/95' : 'border-transparent bg-ink-950'
      }`}
    >
      <div className="container-x flex h-16 items-center justify-between gap-4">
        <Link to={ROUTES.home} className="inline-flex min-h-[44px] items-center" aria-label="Teintérior — accueil">
          <Logo size="lg" />
        </Link>

        <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Navigation principale">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.id}
              to={link.path}
              className={({ isActive }) =>
                `inline-flex min-h-[40px] items-center whitespace-nowrap rounded-md px-2.5 text-sm transition-colors ${
                  isActive ? 'bg-ink-850 text-fg' : 'text-muted hover:text-fg'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={phone.href}
            className="num hidden min-h-[40px] shrink-0 items-center gap-2 whitespace-nowrap rounded-md border border-white/10 px-3 text-sm text-muted transition-colors hover:border-white/20 hover:text-fg xl:inline-flex"
          >
            <Phone className="h-3.5 w-3.5" aria-hidden="true" />
            {phone.number}
          </a>

          <Button as={Link} to={ROUTES.contact} size="sm" className="hidden whitespace-nowrap sm:inline-flex">
            Prendre RDV / Devis
          </Button>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="menu-mobile"
            aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-white/10 text-fg lg:hidden"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div
        id="menu-mobile"
        className={`overflow-hidden border-t border-white/5 bg-ink-950 transition-[max-height,opacity] duration-200 lg:hidden ${
          menuOpen ? 'max-h-[520px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <nav className="container-x flex flex-col gap-1 py-4" aria-label="Navigation mobile">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.id}
              to={link.path}
              className={({ isActive }) =>
                `flex min-h-[48px] items-center rounded-md px-3 text-sm transition-colors ${
                  isActive ? 'bg-ink-850 text-fg' : 'text-muted hover:text-fg'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <div className="mt-3 flex flex-col gap-2">
            <Button as={Link} to={ROUTES.contact} size="md">
              Prendre RDV / Devis
            </Button>
            <Button as="a" href={phone.href} variant="secondary" size="md" icon={Phone}>
              {phone.number}
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}
