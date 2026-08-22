import { CalendarCheck, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../data/site.js';
import { useSiteStore } from '../../store/siteStore';
import useScrollPosition from '../../hooks/useScrollPosition.js';

/** Barre d'action permanente sur mobile : appeler l'atelier ou demander un devis. */
export default function MobileCallBar() {
  const visible = useScrollPosition(420);
  const contact = useSiteStore((state) => state.contact);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-ink-700 bg-ink-950 px-4 py-3
        transition-transform duration-300 sm:hidden ${
          visible ? 'translate-y-0' : 'translate-y-full'
        }`}
    >
      <div className="flex gap-3">
        <a
          href={contact.phoneHref}
          className="flex flex-1 items-center justify-center gap-2 rounded-md border border-ink-700 bg-ink-850 py-3 text-sm font-semibold text-fg"
        >
          <Phone className="h-4 w-4" aria-hidden="true" />
          Appeler
        </a>
        <Link
          to={ROUTES.contact}
          className="flex flex-1 items-center justify-center gap-2 rounded-md bg-accent py-3 text-sm font-semibold text-accent-on"
        >
          <CalendarCheck className="h-4 w-4" aria-hidden="true" />
          Devis
        </Link>
      </div>
    </div>
  );
}
