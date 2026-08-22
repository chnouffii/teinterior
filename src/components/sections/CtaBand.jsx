import { ArrowRight, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../ui/Button.jsx';
import Reveal from '../ui/Reveal.jsx';
import { CONTACT, ROUTES } from '../../data/site.js';

/** Bande de conversion placée en fin de chaque page de service. */
export default function CtaBand({
  title = 'Un doute sur la prestation adaptée ?',
  text = 'Envoyez-nous quelques photos de votre véhicule : nous répondons avec un devis détaillé sous 24 h ouvrées, sans engagement.',
  primaryLabel = 'Demander un devis',
  primaryTo = ROUTES.contact,
}) {
  return (
    <section className="py-16 lg:py-20">
      <div className="container-x">
        <Reveal className="relative overflow-hidden rounded-[2rem] border border-brass/25 bg-carbon-850/70 p-8 shadow-card backdrop-blur sm:p-12">
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brass/10 blur-3xl" />

          <div className="relative flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <h2 className="text-2xl font-bold sm:text-3xl">{title}</h2>
              <p className="mt-4 text-sm leading-relaxed text-slate-300 sm:text-base">{text}</p>
            </div>

            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Button as={Link} to={primaryTo} size="lg" iconRight={ArrowRight}>
                {primaryLabel}
              </Button>
              <Button as="a" href={CONTACT.phoneHref} variant="secondary" size="lg" icon={Phone}>
                {CONTACT.phone}
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
