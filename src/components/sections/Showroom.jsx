import { useState } from 'react';
import { ArrowRight, Fuel, Gauge, MapPin, Settings2, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import SectionHeading from '../ui/SectionHeading.jsx';
import Reveal from '../ui/Reveal.jsx';
import Button from '../ui/Button.jsx';
import CarVisual from '../ui/CarVisual.jsx';
import { VEHICLES, VEHICLE_STATUS } from '../../data/vehicles.js';
import { ROUTES } from '../../data/site.js';
import { useQuote } from '../../context/QuoteContext.jsx';

export const STATUS_TONES = {
  emerald: 'border-emerald-400/40 bg-emerald-400/10 text-emerald-300',
  amber: 'border-amber-400/40 bg-amber-400/10 text-amber-300',
  slate: 'border-white/15 bg-white/5 text-slate-300',
};

const FILTERS = [
  { id: 'tous', label: 'Tous les véhicules' },
  { id: 'disponible', label: 'Disponibles' },
  { id: 'reserve', label: 'Réservés' },
  { id: 'vendu', label: 'Vendus' },
];

export function formatPrice(value) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(value);
}

/** Construit la demande d'essai envoyée au formulaire de devis. */
export function buildTestDriveRequest(vehicle) {
  return {
    service: 'depot-vente',
    message: `Bonjour, je souhaite réserver un essai pour la ${vehicle.title} (${
      vehicle.year
    }, ${vehicle.km.toLocaleString('fr-FR')} km) affichée à ${formatPrice(vehicle.price)}.`,
    label: vehicle.title,
  };
}

function Spec({ icon: SpecIcon, label }) {
  return (
    <span className="flex items-center gap-1.5 text-xs text-slate-300">
      <SpecIcon className="h-3.5 w-3.5 text-brass/80" aria-hidden="true" />
      {label}
    </span>
  );
}

function VehicleCard({ vehicle, index, onTestDrive }) {
  const status = VEHICLE_STATUS[vehicle.status];
  const isSold = vehicle.status === 'vendu';

  return (
    <Reveal
      delay={index * 80}
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-carbon-850/60 shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:border-brass/40"
    >
      <Link to={`${ROUTES.vehicules}/${vehicle.id}`} className="relative block overflow-hidden">
        <CarVisual
          scene="sale"
          variant="after"
          palette={vehicle.palette}
          className={`aspect-[16/10] w-full transition-transform duration-700 group-hover:scale-[1.04] ${
            isSold ? 'opacity-60 grayscale' : ''
          }`}
          title={vehicle.title}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-carbon-950/90 via-transparent to-transparent" />

        <span
          className={`absolute right-4 top-4 rounded-full border px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider ${
            STATUS_TONES[status.tone]
          }`}
        >
          {status.label}
        </span>

        <span className="absolute inset-x-4 bottom-4 flex flex-wrap gap-2">
          {vehicle.badges.map((badge) => (
            <span
              key={badge}
              className="inline-flex items-center gap-1.5 rounded-full border border-brass/30 bg-carbon-950/85 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-brass-light backdrop-blur"
            >
              <Sparkles className="h-3 w-3" aria-hidden="true" />
              {badge}
            </span>
          ))}
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-base font-bold leading-snug">
          <Link
            to={`${ROUTES.vehicules}/${vehicle.id}`}
            className="transition-colors hover:text-brass-light"
          >
            {vehicle.title}
          </Link>
        </h3>

        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
          <Spec icon={Gauge} label={`${vehicle.km.toLocaleString('fr-FR')} km`} />
          <Spec icon={Fuel} label={vehicle.energy} />
          <Spec icon={Settings2} label={vehicle.gearbox} />
          <Spec icon={MapPin} label={vehicle.location} />
        </div>

        <div className="mt-5 flex items-end justify-between gap-3">
          <div>
            <p className="font-display text-2xl font-bold text-white">{formatPrice(vehicle.price)}</p>
            <p className="mt-0.5 text-xs text-slate-400">
              ou {vehicle.monthly} €/mois — financement partenaire
            </p>
          </div>
          <span className="chip">{vehicle.year}</span>
        </div>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <Button
            as={Link}
            to={`${ROUTES.vehicules}/${vehicle.id}`}
            variant="secondary"
            size="sm"
            className="sm:flex-1"
          >
            Voir l’annonce
          </Button>
          <Button
            onClick={() => onTestDrive(vehicle)}
            size="sm"
            disabled={isSold}
            className="sm:flex-1"
            iconRight={ArrowRight}
          >
            {isSold ? 'Vendu' : 'Réserver un essai'}
          </Button>
        </div>
      </div>
    </Reveal>
  );
}

/** Mini showroom : grille filtrable des véhicules confiés à l'atelier. */
export default function Showroom({ hideHeading = false, limit = null, showFilters = true }) {
  const { requestQuote } = useQuote();
  const [filter, setFilter] = useState('tous');

  const filtered =
    filter === 'tous' ? VEHICLES : VEHICLES.filter((vehicle) => vehicle.status === filter);
  const vehicles = limit ? filtered.slice(0, limit) : filtered;

  const handleTestDrive = (vehicle) => requestQuote(buildTestDriveRequest(vehicle));

  return (
    <section
      id="vehicules"
      className={`scroll-mt-24 pb-20 lg:pb-28 ${hideHeading ? 'pt-2 lg:pt-4' : 'pt-20 lg:pt-28'}`}
    >
      <div className="container-x">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          {hideHeading ? null : (
            <SectionHeading
              eyebrow="Mini showroom"
              title="Nos véhicules"
              highlight="disponibles"
              description="Chaque voiture proposée est passée par notre atelier : contrôle mécanique, préparation esthétique complète et reportage photo. Vous achetez une voiture déjà prête à rouler."
            />
          )}

          {showFilters ? (
            <Reveal delay={100} className="flex flex-wrap gap-2">
              {FILTERS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setFilter(item.id)}
                  aria-pressed={filter === item.id}
                  className={`tap inline-flex items-center rounded-full border px-4 py-2 text-xs font-semibold transition-all duration-300 ${
                    filter === item.id
                      ? 'border-brass bg-brass/15 text-brass-light'
                      : 'border-white/10 bg-white/[0.03] text-slate-300 hover:border-white/25 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </Reveal>
          ) : null}
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {vehicles.map((vehicle, index) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              index={index}
              onTestDrive={handleTestDrive}
            />
          ))}
        </div>

        {vehicles.length === 0 ? (
          <p className="mt-12 rounded-3xl border border-white/10 bg-carbon-900/60 px-6 py-10 text-center text-sm text-slate-300">
            Aucun véhicule dans cette catégorie pour le moment. Dites-nous ce que vous cherchez :
            notre service de sourcing s’en occupe.
          </p>
        ) : null}

        {limit && filtered.length > limit ? (
          <Reveal delay={120} className="mt-10 flex justify-center">
            <Button as={Link} to={ROUTES.vehicules} variant="secondary" size="md" iconRight={ArrowRight}>
              Voir les {filtered.length} véhicules
            </Button>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
