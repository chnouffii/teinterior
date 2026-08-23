import { Link, useParams } from 'react-router-dom';
import { ArrowRight, Check, MapPin, Phone } from 'lucide-react';
import PageHeader from '../components/layout/PageHeader.jsx';
import Button from '../components/ui/Button.jsx';
import Reveal from '../components/ui/Reveal.jsx';
import CtaBand from '../components/sections/CtaBand.jsx';
import Testimonials from '../components/sections/Testimonials.jsx';
import { ROUTES, primaryPhone } from '../data/site.js';
import { villeParSlug } from '../data/villes.js';
import { useSiteStore } from '../store/siteStore';
import usePageMeta from '../hooks/usePageMeta.js';
import NotFoundPage from './NotFoundPage.jsx';

/**
 * Page locale : elle répond à « detailing Strasbourg » plutôt qu'à
 * « detailing Brumath », que personne ne cherche depuis Strasbourg.
 */
export default function VillePage() {
  const { villeSlug } = useParams();
  const ville = villeParSlug(villeSlug);
  const contact = useSiteStore((state) => state.contact);

  usePageMeta({
    title: ville
      ? `${ville.titre} | Teintérior`
      : 'Page introuvable | Teintérior',
    description: ville ? ville.meta : undefined,
  });

  if (!ville) return <NotFoundPage />;

  const tel = primaryPhone(contact);

  return (
    <>
      <PageHeader
        eyebrow={ville.nom}
        title="Detailing et rétrofit CarPlay"
        highlight={`${ville.prefixe} ${ville.nom}`}
        description={ville.accroche}
      >
        <div className="flex flex-wrap gap-3">
          <Button as={Link} to={ROUTES.contact} iconRight={ArrowRight}>
            Demander un devis
          </Button>
          <Button as="a" href={tel.href} variant="secondary" icon={Phone}>
            {tel.number}
          </Button>
        </div>
      </PageHeader>

      <section className="pt-12 pb-12 lg:pt-14 lg:pb-14">
        <div className="container-x grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal>
              <h2 className="text-2xl font-bold sm:text-3xl">
                Ce que nous voyons arriver de {ville.nom}
              </h2>
              <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-muted">
                {ville.contexte}
              </p>
            </Reveal>

            <div className="mt-8 grid gap-4">
              {ville.arguments.map((point, index) => (
                <Reveal
                  key={point.titre}
                  delay={index * 60}
                  className="rounded-lg border border-white/10 bg-ink-850 p-5"
                >
                  <h3 className="flex items-start gap-2.5 text-base font-bold">
                    <Check
                      className="mt-1 h-4 w-4 shrink-0 text-accent"
                      strokeWidth={2.6}
                      aria-hidden="true"
                    />
                    {point.titre}
                  </h3>
                  <p className="mt-2 pl-7 text-sm leading-relaxed text-muted">{point.detail}</p>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal delay={80} className="lg:col-span-5">
            <div className="rounded-lg border border-white/10 bg-ink-900 p-6">
              <h2 className="flex items-center gap-2 text-base font-bold">
                <MapPin className="h-4 w-4 text-accent" aria-hidden="true" />
                Venir depuis {ville.nom}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                Comptez <strong className="text-fg">{ville.distance}</strong> {ville.axe} jusqu’à
                notre atelier de {contact.address.street}, {contact.address.city}. Nous travaillons
                sur rendez-vous, un seul véhicule à la fois.
              </p>

              <div className="rule my-5" />

              <h3 className="label-xs">Nous intervenons aussi pour</h3>
              <ul className="mt-3 flex flex-wrap gap-2">
                {ville.communes.map((commune) => (
                  <li key={commune} className="chip">
                    {commune}
                  </li>
                ))}
              </ul>

              <div className="rule my-5" />

              <div className="flex flex-col gap-2">
                <Button as={Link} to={ROUTES.prestations} variant="secondary" iconRight={ArrowRight}>
                  Voir les formules et les tarifs
                </Button>
                <Button as={Link} to={ROUTES.retrofit} variant="secondary" iconRight={ArrowRight}>
                  Vérifier la compatibilité CarPlay
                </Button>
                <Button as={Link} to={ROUTES.vendre} variant="secondary" iconRight={ArrowRight}>
                  Faire estimer un véhicule
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <Testimonials limit={3} showAllLink />
      <CtaBand
        title={`Votre voiture mérite le même traitement, ${ville.nom} ou pas`}
        text="Envoyez-nous quelques photos : vous recevez un devis détaillé ligne par ligne sous 24 h ouvrées, sans engagement."
      />
    </>
  );
}
