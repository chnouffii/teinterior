import { CalendarCheck, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CONTACT, ROUTES } from '../../data/site.js';
import useScrollPosition from '../../hooks/useScrollPosition.js';

/** Barre d'action permanente sur mobile : appeler l'atelier ou demander un devis. */
export default function MobileCallBar() {
  const visible = useScrollPosition(420);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-carbon-950/95 px-4 py-3
        backdrop-blur-xl transition-transform duration-300 sm:hidden ${
          visible ? 'translate-y-0' : 'translate-y-full'
        }`}
    >
      <div className="flex gap-3">
        <a
          href={CONTACT.phoneHref}
          className="flex flex-1 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 py-3 text-sm font-semibold text-white"
        >
          <Phone className="h-4 w-4" aria-hidden="true" />
          Appeler
        </a>
        <Link
          to={ROUTES.contact}
          className="flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-br from-brass-light via-brass to-brass-deep py-3 text-sm font-semibold text-carbon-950"
        >
          <CalendarCheck className="h-4 w-4" aria-hidden="true" />
          Devis
        </Link>
      </div>
    </div>
  );
}
