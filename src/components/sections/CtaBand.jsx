import { ArrowRight, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../ui/Button.jsx';
import Reveal from '../ui/Reveal.jsx';
import { ROUTES, primaryPhone } from '../../data/site.js';
import { useSiteStore } from '../../store/siteStore';

/** Bande de conversion placée en fin de page. */
export default function CtaBand({
  title = 'Un doute sur la prestation adaptée ?',
  text = 'Envoyez quelques photos du véhicule : vous recevez un devis détaillé ligne par ligne sous 24 h ouvrées, sans engagement.',
  primaryLabel = 'Demander un devis',
  primaryTo = ROUTES.contact,
}) {
  const contact = useSiteStore((state) => state.contact);

  return (
    <section className="border-t border-white/5 py-14">
      <div className="container-x">
        <Reveal className="flex flex-col items-start gap-6 rounded-lg border border-white/10 bg-ink-900 p-6 lg:flex-row lg:items-center lg:justify-between lg:p-8">
          <div className="max-w-xl">
            <h2 className="text-xl font-bold sm:text-2xl">{title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">{text}</p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Button as={Link} to={primaryTo} size="lg" iconRight={ArrowRight}>
              {primaryLabel}
            </Button>
            <Button as="a" href={primaryPhone(contact).href} variant="secondary" size="lg" icon={Phone}>
              {primaryPhone(contact).number}
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
