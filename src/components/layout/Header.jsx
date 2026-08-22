import { useEffect, useState } from 'react';
import { CalendarCheck, Menu, Phone, X } from 'lucide-react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import Logo from '../ui/Logo.jsx';
import Button from '../ui/Button.jsx';
import { CONTACT, NAV_LINKS, ROUTES } from '../../data/site.js';
import useScrollPosition from '../../hooks/useScrollPosition.js';
import useLockBodyScroll from '../../hooks/useLockBodyScroll.js';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const scrolled = useScrollPosition(32);
  const { pathname } = useLocation();

  useLockBodyScroll(menuOpen);

  // Le menu mobile se referme dès qu'une page est chargée.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-white/10 bg-carbon-950/85 backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <div className="container-x flex h-[72px] items-center justify-between gap-6 lg:h-20">
        <Link
          to={ROUTES.home}
          className="inline-flex min-h-[44px] shrink-0 items-center"
          aria-label="Teintérior — retour à l’accueil"
        >
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 xl:flex" aria-label="Navigation principale">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.id}
              to={link.path}
              className={({ isActive }) =>
                `relative inline-flex min-h-[44px] items-center rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300 ${
                  isActive ? 'text-white' : 'text-slate-300 hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {link.label}
                  <span
                    className={`absolute inset-x-3 bottom-1 h-px origin-center bg-gradient-to-r from-transparent via-brass to-transparent transition-transform duration-300 ${
                      isActive ? 'scale-x-100' : 'scale-x-0'
                    }`}
                  />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href={CONTACT.phoneHref}
            className="hidden min-h-[44px] items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:border-brass/40 hover:text-white lg:inline-flex"
          >
            <Phone className="h-4 w-4" aria-hidden="true" />
            {CONTACT.phone}
          </a>

          <Button
            as={Link}
            to={ROUTES.contact}
            icon={CalendarCheck}
            size="sm"
            className="hidden sm:inline-flex"
          >
            Prendre RDV / Devis
          </Button>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="menu-mobile"
            aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white transition-colors hover:border-brass/40 xl:hidden"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div
        id="menu-mobile"
        className={`overflow-hidden border-t border-white/5 bg-carbon-950/95 backdrop-blur-xl transition-[max-height,opacity] duration-300 xl:hidden ${
          menuOpen ? 'max-h-[560px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <nav className="container-x flex flex-col gap-1 py-5" aria-label="Navigation mobile">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.id}
              to={link.path}
              className={({ isActive }) =>
                `flex min-h-[48px] items-center rounded-2xl px-4 py-3 text-base font-medium transition-colors ${
                  isActive
                    ? 'bg-brass/10 text-brass-light'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}

          <div className="mt-3 flex flex-col gap-3">
            <Button as={Link} to={ROUTES.contact} icon={CalendarCheck} size="md">
              Prendre RDV / Devis
            </Button>
            <Button as="a" href={CONTACT.phoneHref} variant="secondary" icon={Phone} size="md">
              {CONTACT.phone}
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}
