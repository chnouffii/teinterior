import { ArrowLeft, CalendarCheck, ChevronRight, ShieldCheck, Wrench } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import Button from '../components/ui/Button.jsx';
import Reveal from '../components/ui/Reveal.jsx';
import CtaBand from '../components/sections/CtaBand.jsx';
import {
  STATUS_TONES,
  VehicleCover,
  buildTestDriveRequest,
  formatPrice,
} from '../components/sections/Showroom.jsx';
import { VEHICLE_STATUS } from '../data/vehicles.js';
import { ROUTES } from '../data/site.js';
import { useSiteStore } from '../store/siteStore';
import { useQuote } from '../context/QuoteContext.jsx';
import usePageMeta from '../hooks/usePageMeta.js';
import NotFoundPage from './NotFoundPage.jsx';

export default function VehiculeDetailPage() {
  const { vehicleId } = useParams();
  const vehicles = useSiteStore((state) => state.vehicles);
  const contact = useSiteStore((state) => state.contact);
  const { requestQuote } = useQuote();

  const vehicle = vehicles.find((item) => item.id === vehicleId);

  usePageMeta({
    title: vehicle
      ? `${vehicle.brand} ${vehicle.model} ${vehicle.trim} — ${formatPrice(vehicle.price)} | Teintérior`
      : 'Véhicule introuvable | Teintérior',
    description: vehicle
      ? `${vehicle.brand} ${vehicle.model} ${vehicle.trim}, ${vehicle.year}, ${vehicle.km.toLocaleString('fr-FR')} km, ${vehicle.fuel}, ${vehicle.gearbox}. Contrôlé et préparé par l’atelier Teintérior.`
      : undefined,
  });

  if (!vehicle) {
    return <NotFoundPage message="Cette annonce n’existe plus ou le véhicule a été retiré." />;
  }

  const status = VEHICLE_STATUS[vehicle.status];
  const isSold = vehicle.status === 'vendu';
  const others = vehicles
    .filter((item) => item.id !== vehicle.id && item.status !== 'vendu')
    .slice(0, 3);

  const specs = [
    { label: 'Année', value: vehicle.year },
    { label: 'Kilométrage', value: `${vehicle.km.toLocaleString('fr-FR')} km` },
    { label: 'Boîte', value: vehicle.gearbox },
    { label: 'Énergie', value: vehicle.fuel },
    { label: 'Puissance', value: `${vehicle.power} ch` },
    { label: 'Teinte', value: vehicle.color },
    { label: 'Mise en ligne', value: new Date(vehicle.listedAt).toLocaleDateString('fr-FR') },
    { label: 'Localisation', value: vehicle.location },
  ];

  return (
    <>
      <div className="border-b border-ink-800 pt-24 pb-6 lg:pt-28">
        <div className="container-x">
          <nav
            aria-label="Fil d’Ariane"
            className="flex flex-wrap items-center gap-1.5 text-xs text-faint"
          >
            <Link to={ROUTES.home} className="-my-2 inline-flex items-center py-2 hover:text-accent">
              Accueil
            </Link>
            <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
            <Link
              to={ROUTES.vehicules}
              className="-my-2 inline-flex items-center py-2 hover:text-accent"
            >
              Véhicules
            </Link>
            <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="num text-muted">{vehicle.ref}</span>
          </nav>
        </div>
      </div>

      <section className="py-10">
        <div className="container-x grid gap-8 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <figure className="overflow-hidden rounded-lg border border-ink-700 bg-ink-900">
              <div className="relative">
                <VehicleCover
                  vehicle={vehicle}
                  className={`aspect-[16/10] w-full ${isSold ? 'opacity-50 grayscale' : ''}`}
                />
                <span
                  className={`absolute left-4 top-4 rounded border px-2 py-0.5 text-[11px] font-semibold ${
                    STATUS_TONES[status.tone]
                  }`}
                >
                  {status.label}
                </span>
              </div>
              <figcaption className="num border-t border-ink-700 px-4 py-2.5 text-[11px] text-faint">
                {vehicle.photos.length > 0
                  ? `${vehicle.photos.length} photo(s) — ${vehicle.ref}`
                  : `Illustration de repli — ${vehicle.ref}`}
              </figcaption>
            </figure>

            <div className="mt-4 grid gap-px overflow-hidden rounded-lg border border-ink-700 bg-ink-700 sm:grid-cols-4">
              {specs.map((spec) => (
                <div key={spec.label} className="bg-ink-900 px-4 py-3">
                  <p className="text-[11px] uppercase tracking-wider text-faint">{spec.label}</p>
                  <p className="num mt-1 text-sm font-semibold text-fg">{spec.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-lg border border-ink-700 bg-ink-900 p-5">
              <h2 className="text-sm font-semibold text-fg">Historique</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">{vehicle.history}</p>

              <h2 className="mt-6 flex items-center gap-2 text-sm font-semibold text-fg">
                <Wrench className="h-4 w-4 text-accent" aria-hidden="true" />
                Travaux réalisés par l’atelier
              </h2>
              <ul className="mt-2 space-y-1.5">
                {vehicle.workshopWork.map((item) => (
                  <li key={item} className="flex gap-2.5 text-sm text-muted">
                    <span className="mt-2 h-1 w-1 shrink-0 bg-accent" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <div className="lg:col-span-5">
            <Reveal delay={60} className="rounded-lg border border-ink-700 bg-ink-900 p-5">
              <h1 className="text-xl font-bold leading-snug sm:text-2xl">
                {vehicle.brand} {vehicle.model}
              </h1>
              <p className="mt-1 text-sm text-muted">{vehicle.trim}</p>

              <p className="num mt-5 border-t border-ink-800 pt-5 text-3xl font-bold text-fg">
                {formatPrice(vehicle.price)}
              </p>
              <p className="mt-1 text-xs text-faint">
                Prix affiché, frais de dossier inclus. Reprise de votre véhicule possible.
              </p>

              <h2 className="mt-6 text-[11px] font-semibold uppercase tracking-[0.12em] text-faint">
                Points forts
              </h2>
              <ul className="mt-3 space-y-2">
                {vehicle.highlights.map((item) => (
                  <li key={item} className="flex gap-2.5 text-sm text-muted">
                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex flex-col gap-2">
                <Button
                  onClick={() => requestQuote(buildTestDriveRequest(vehicle))}
                  size="lg"
                  icon={CalendarCheck}
                  disabled={isSold}
                >
                  {isSold ? 'Véhicule vendu' : 'Réserver un essai'}
                </Button>
                <Button as="a" href={contact.phoneHref} variant="secondary" size="lg">
                  Poser une question — {contact.phone}
                </Button>
              </div>

              <p className="mt-4 text-[11px] leading-relaxed text-faint">
                Contrôle 120 points, préparation à l’atelier, historique d’entretien remis avec le
                véhicule. Essai sur rendez-vous, permis et justificatif de domicile requis.
              </p>
            </Reveal>

            <Reveal delay={120} className="mt-4">
              <Link
                to={ROUTES.vehicules}
                className="inline-flex min-h-[40px] items-center gap-2 text-sm text-muted transition-colors hover:text-accent"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Retour aux véhicules
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {others.length > 0 ? (
        <section className="pb-10">
          <div className="container-x">
            <h2 className="text-sm font-semibold text-fg">Autres véhicules disponibles</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {others.map((item) => (
                <Link
                  key={item.id}
                  to={`${ROUTES.vehicules}/${item.id}`}
                  className="group flex items-center gap-3 rounded-lg border border-ink-700 bg-ink-900 p-3 transition-colors hover:border-ink-600"
                >
                  <VehicleCover vehicle={item} className="h-14 w-20 shrink-0 rounded object-cover" />
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-fg transition-colors group-hover:text-accent">
                      {item.brand} {item.model}
                    </span>
                    <span className="num block truncate text-xs text-faint">
                      {item.year} · {formatPrice(item.price)}
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <CtaBand
        title="Ce véhicule vous intéresse ?"
        text="Essai sur rendez-vous du lundi au samedi, reprise possible et financement partenaire étudié sur place."
        primaryLabel="Prendre rendez-vous"
      />
    </>
  );
}
