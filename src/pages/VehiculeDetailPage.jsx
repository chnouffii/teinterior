import {
  ArrowLeft,
  CalendarCheck,
  ChevronRight,
  Fuel,
  Gauge,
  MapPin,
  Palette,
  Settings2,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import Button from '../components/ui/Button.jsx';
import Reveal from '../components/ui/Reveal.jsx';
import CarVisual from '../components/ui/CarVisual.jsx';
import CtaBand from '../components/sections/CtaBand.jsx';
import {
  STATUS_TONES,
  buildTestDriveRequest,
  formatPrice,
} from '../components/sections/Showroom.jsx';
import { VEHICLES, VEHICLE_STATUS } from '../data/vehicles.js';
import { CONTACT, ROUTES } from '../data/site.js';
import { useQuote } from '../context/QuoteContext.jsx';
import usePageMeta from '../hooks/usePageMeta.js';
import NotFoundPage from './NotFoundPage.jsx';

export default function VehiculeDetailPage() {
  const { vehicleId } = useParams();
  const vehicle = VEHICLES.find((item) => item.id === vehicleId);
  const { requestQuote } = useQuote();

  usePageMeta({
    title: vehicle
      ? `${vehicle.title} — ${formatPrice(vehicle.price)} | Teintérior`
      : 'Véhicule introuvable | Teintérior',
    description: vehicle
      ? `${vehicle.title}, ${vehicle.year}, ${vehicle.km.toLocaleString('fr-FR')} km, ${
          vehicle.energy
        }, ${vehicle.gearbox}. Véhicule contrôlé et préparé par l’atelier Teintérior.`
      : undefined,
  });

  if (!vehicle) {
    return <NotFoundPage message="Cette annonce n’existe plus ou le véhicule a été retiré." />;
  }

  const status = VEHICLE_STATUS[vehicle.status];
  const isSold = vehicle.status === 'vendu';
  const others = VEHICLES.filter(
    (item) => item.id !== vehicle.id && item.status !== 'vendu'
  ).slice(0, 3);

  const specs = [
    { icon: Gauge, label: 'Kilométrage', value: `${vehicle.km.toLocaleString('fr-FR')} km` },
    { icon: Fuel, label: 'Énergie', value: vehicle.energy },
    { icon: Settings2, label: 'Boîte de vitesses', value: vehicle.gearbox },
    { icon: Zap, label: 'Puissance', value: vehicle.power },
    { icon: Palette, label: 'Teinte', value: vehicle.color },
    { icon: MapPin, label: 'Disponible à', value: vehicle.location },
  ];

  return (
    <>
      <div className="pt-28 lg:pt-36">
        <div className="container-x">
          <nav
            aria-label="Fil d’Ariane"
            className="flex flex-wrap items-center gap-1.5 text-xs text-slate-400"
          >
            <Link to={ROUTES.home} className="-my-2 inline-flex items-center py-2 transition-colors hover:text-brass-light">
              Accueil
            </Link>
            <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
            <Link to={ROUTES.vehicules} className="-my-2 inline-flex items-center py-2 transition-colors hover:text-brass-light">
              Véhicules à vendre
            </Link>
            <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="font-medium text-slate-300">{vehicle.title}</span>
          </nav>
        </div>
      </div>

      <section className="py-10 lg:py-14">
        <div className="container-x grid gap-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-carbon-900 shadow-card">
              <CarVisual
                scene="sale"
                variant="after"
                palette={vehicle.palette}
                className={`aspect-[16/10] w-full ${isSold ? 'opacity-60 grayscale' : ''}`}
                title={vehicle.title}
              />
              <span
                className={`absolute right-5 top-5 rounded-full border px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider ${
                  STATUS_TONES[status.tone]
                }`}
              >
                {status.label}
              </span>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {specs.map((spec) => (
                <div
                  key={spec.label}
                  className="rounded-2xl border border-white/10 bg-carbon-850/60 px-4 py-4"
                >
                  <span className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-slate-400">
                    <spec.icon className="h-3.5 w-3.5 text-brass" aria-hidden="true" />
                    {spec.label}
                  </span>
                  <p className="mt-1.5 text-sm font-semibold text-white">{spec.value}</p>
                </div>
              ))}
            </div>
          </Reveal>

          <div className="lg:col-span-5">
            <Reveal delay={80} className="panel p-7">
              <span className="chip">{vehicle.year}</span>
              <h1 className="mt-4 text-2xl font-bold leading-snug sm:text-3xl">{vehicle.title}</h1>

              <div className="mt-5 flex flex-wrap gap-2">
                {vehicle.badges.map((badge) => (
                  <span
                    key={badge}
                    className="rounded-full border border-brass/30 bg-brass/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-brass-light"
                  >
                    {badge}
                  </span>
                ))}
              </div>

              <div className="mt-7 border-t border-white/5 pt-6">
                <p className="font-display text-3xl font-bold text-white">
                  {formatPrice(vehicle.price)}
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  ou {vehicle.monthly} €/mois — financement partenaire, sous conditions
                </p>
              </div>

              <h2 className="mt-8 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Points forts
              </h2>
              <ul className="mt-3 space-y-2.5">
                {vehicle.highlights.map((item) => (
                  <li key={item} className="flex gap-3 text-sm text-slate-300">
                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-brass" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-col gap-3">
                <Button
                  onClick={() => requestQuote(buildTestDriveRequest(vehicle))}
                  size="lg"
                  icon={CalendarCheck}
                  disabled={isSold}
                >
                  {isSold ? 'Véhicule vendu' : 'Réserver un essai'}
                </Button>
                <Button as="a" href={CONTACT.phoneHref} variant="secondary" size="lg">
                  Poser une question — {CONTACT.phone}
                </Button>
              </div>

              <p className="mt-5 text-xs leading-relaxed text-slate-400">
                Véhicule contrôlé sur 120 points, préparé à l’atelier et livré avec son historique
                d’entretien complet. Essai sur rendez-vous, permis et justificatif de domicile
                requis.
              </p>
            </Reveal>

            <Reveal delay={160} className="mt-6">
              <Link
                to={ROUTES.vehicules}
                className="inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold text-slate-300 transition-colors hover:text-brass-light"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Retour à tous les véhicules
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {others.length > 0 ? (
        <section className="pb-8">
          <div className="container-x">
            <h2 className="text-lg font-bold">Autres véhicules disponibles</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {others.map((item) => (
                <Link
                  key={item.id}
                  to={`${ROUTES.vehicules}/${item.id}`}
                  className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-carbon-850/60 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-brass/40"
                >
                  <CarVisual
                    scene="sale"
                    variant="after"
                    palette={item.palette}
                    className="h-16 w-24 shrink-0 rounded-xl"
                    title={item.title}
                  />
                  <span>
                    <span className="block text-sm font-semibold leading-snug text-white transition-colors group-hover:text-brass-light">
                      {item.title}
                    </span>
                    <span className="mt-1 block text-xs text-slate-400">
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
        text="Essai sur rendez-vous du lundi au samedi, reprise de votre ancien véhicule possible et financement partenaire étudié sur place."
        primaryLabel="Prendre rendez-vous"
      />
    </>
  );
}
