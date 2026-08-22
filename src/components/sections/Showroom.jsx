import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import SectionHeading from '../ui/SectionHeading.jsx';
import Reveal from '../ui/Reveal.jsx';
import Button from '../ui/Button.jsx';
import CarVisual from '../ui/CarVisual.jsx';
import { ROUTES } from '../../data/site.js';
import { VEHICLE_STATUS } from '../../data/vehicles.js';
import { useSiteStore } from '../../store/siteStore';
import { useQuote } from '../../context/QuoteContext.jsx';

export const STATUS_TONES = {
  ok: 'border-signal-ok/40 bg-signal-ok/10 text-signal-ok',
  warn: 'border-signal-warn/40 bg-signal-warn/10 text-signal-warn',
  neutral: 'border-white/20 bg-ink-800 text-faint',
};

const FILTERS = [
  { id: 'tous', label: 'Tous' },
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

export function buildTestDriveRequest(vehicle) {
  return {
    service: 'depot-vente',
    message: `Bonjour, je souhaite réserver un essai pour la ${vehicle.brand} ${vehicle.model} ${
      vehicle.trim
    } (${vehicle.ref}, ${vehicle.year}, ${vehicle.km.toLocaleString(
      'fr-FR'
    )} km) affichée à ${formatPrice(vehicle.price)}.`,
    label: `${vehicle.brand} ${vehicle.model}`,
  };
}

/** Visuel de fiche : photo de couverture si renseignée, sinon illustration. */
export function VehicleCover({ vehicle, className = '' }) {
  const cover = vehicle.photos?.[vehicle.coverIndex] ?? vehicle.photos?.[0];

  if (cover) {
    return (
      <img
        src={cover}
        alt={`${vehicle.brand} ${vehicle.model}`}
        className={`object-cover ${className}`}
        loading="lazy"
      />
    );
  }

  return (
    <CarVisual
      scene="polish"
      variant="after"
      palette={vehicle.palette}
      body={vehicle.body}
      className={className}
      title={`${vehicle.brand} ${vehicle.model}`}
    />
  );
}

function VehicleCard({ vehicle, index, onTestDrive }) {
  const status = VEHICLE_STATUS[vehicle.status];
  const isSold = vehicle.status === 'vendu';

  return (
    <Reveal
      delay={index * 60}
      className="group flex h-full flex-col overflow-hidden rounded-lg border border-white/10 bg-ink-900 transition-colors duration-200 hover:border-white/20"
    >
      <Link to={`${ROUTES.vehicules}/${vehicle.id}`} className="relative block">
        <VehicleCover
          vehicle={vehicle}
          className={`aspect-[16/10] w-full ${isSold ? 'opacity-50 grayscale' : ''}`}
        />
        <span
          className={`absolute left-3 top-3 rounded-lg border px-2 py-0.5 text-[11px] font-semibold ${
            STATUS_TONES[status.tone]
          }`}
        >
          {status.label}
        </span>
        <span className="num absolute right-3 top-3 rounded-lg border border-white/10 bg-ink-950/85 px-2 py-0.5 text-[11px] text-muted">
          {vehicle.ref}
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-sm font-bold leading-snug">
          <Link
            to={`${ROUTES.vehicules}/${vehicle.id}`}
            className="transition-colors hover:text-accent"
          >
            {vehicle.brand} {vehicle.model}
          </Link>
        </h3>
        <p className="mt-0.5 text-xs text-muted">{vehicle.trim}</p>

        <dl className="num mt-4 grid grid-cols-4 gap-px overflow-hidden rounded-lg border border-white/5 bg-ink-800 text-center">
          {[
            { label: 'Année', value: vehicle.year },
            { label: 'Km', value: `${Math.round(vehicle.km / 1000)}k` },
            { label: 'Boîte', value: vehicle.gearbox },
            { label: 'Ch', value: vehicle.power },
          ].map((cell) => (
            <div key={cell.label} className="bg-ink-900 px-1 py-2">
              <dt className="text-[10px] uppercase tracking-wide text-faint">{cell.label}</dt>
              <dd className="mt-0.5 text-xs font-semibold text-fg">{cell.value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-4 flex items-end justify-between gap-3">
          <div>
            <p className="num text-lg font-bold text-fg">{formatPrice(vehicle.price)}</p>
            <p className="text-[11px] text-faint">{vehicle.fuel} · {vehicle.location}</p>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <Button
            as={Link}
            to={`${ROUTES.vehicules}/${vehicle.id}`}
            variant="secondary"
            size="sm"
            className="flex-1"
          >
            Voir l’annonce
          </Button>
          <Button
            onClick={() => onTestDrive(vehicle)}
            size="sm"
            disabled={isSold}
            className="flex-1"
            iconRight={ArrowRight}
          >
            {isSold ? 'Vendu' : 'Essai'}
          </Button>
        </div>
      </div>
    </Reveal>
  );
}

export default function Showroom({ hideHeading = false, limit = null, showFilters = true }) {
  const vehicles = useSiteStore((state) => state.vehicles);
  const { requestQuote } = useQuote();
  const [filter, setFilter] = useState('tous');

  const filtered =
    filter === 'tous' ? vehicles : vehicles.filter((vehicle) => vehicle.status === filter);
  const rows = limit ? filtered.slice(0, limit) : filtered;

  return (
    <section className={`pb-12 lg:pb-14 ${hideHeading ? 'pt-8' : 'pt-12 lg:pt-14'}`}>
      <div className="container-x">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          {hideHeading ? null : (
            <SectionHeading
              eyebrow="Mini showroom"
              title="Nos véhicules"
              highlight="disponibles"
              description="Chaque voiture est passée par l’atelier : contrôle 120 points, préparation esthétique et reportage photo avant mise en ligne."
            />
          )}

          {showFilters ? (
            <Reveal delay={60} className="flex flex-wrap gap-2">
              {FILTERS.map((item) => {
                const count =
                  item.id === 'tous'
                    ? vehicles.length
                    : vehicles.filter((vehicle) => vehicle.status === item.id).length;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setFilter(item.id)}
                    aria-pressed={filter === item.id}
                    className={`tap inline-flex items-center gap-2 rounded-full border px-4 text-xs font-semibold transition-colors ${
                      filter === item.id
                        ? 'border-accent/50 bg-accent/10 text-accent'
                        : 'border-white/10 text-muted hover:border-white/20 hover:text-fg'
                    }`}
                  >
                    {item.label}
                    <span className="num text-[11px] text-faint">{count}</span>
                  </button>
                );
              })}
            </Reveal>
          ) : null}
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((vehicle, index) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              index={index}
              onTestDrive={(item) => requestQuote(buildTestDriveRequest(item))}
            />
          ))}
        </div>

        {rows.length === 0 ? (
          <p className="mt-8 rounded-lg border border-white/10 bg-ink-900 px-5 py-8 text-center text-sm text-faint">
            Aucun véhicule dans cette catégorie. Dites-nous ce que vous cherchez : le service de
            sourcing s’en occupe.
          </p>
        ) : null}

        {limit && filtered.length > limit ? (
          <Reveal delay={80} className="mt-8 flex justify-center">
            <Button as={Link} to={ROUTES.vehicules} variant="secondary" size="md" iconRight={ArrowRight}>
              Voir les {filtered.length} véhicules
            </Button>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
