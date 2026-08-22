import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import StatusPill from '../components/StatusPill';
import { useSiteStore } from '../../store/siteStore';
import { LEAD_STATUSES } from '../../data/leads.js';
import { VEHICLE_STATUS } from '../../data/vehicles.js';

const euro = (value: number) => `${value.toLocaleString('fr-FR')} €`;
const statusMeta = LEAD_STATUSES as Record<string, { label: string; tone: string }>;
const vehicleMeta = VEHICLE_STATUS as Record<string, { label: string; tone: string }>;

export default function DashboardPage() {
  const vehicles = useSiteStore((state) => state.vehicles);
  const leads = useSiteStore((state) => state.leads);
  const packs = useSiteStore((state) => state.packs);

  const stock = vehicles.filter((vehicle) => vehicle.status !== 'vendu');
  const sold = vehicles.filter((vehicle) => vehicle.status === 'vendu');
  const newLeads = leads.filter((lead) => lead.status === 'nouveau');
  const potentialMargin = stock.reduce(
    (sum, vehicle) => sum + (vehicle.price - vehicle.netSeller),
    0
  );

  const tiles = [
    { label: 'Véhicules en stock', value: String(stock.length), hint: `${sold.length} vendus` },
    { label: 'Valeur du stock', value: euro(stock.reduce((sum, v) => sum + v.price, 0)), hint: 'prix affichés' },
    { label: 'Marge potentielle', value: euro(potentialMargin), hint: 'prix affiché − net vendeur' },
    { label: 'Demandes à traiter', value: String(newLeads.length), hint: `${leads.length} au total` },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-lg font-semibold text-fg">Tableau de bord</h1>
        <p className="mt-1 text-xs text-faint">
          Vue d’ensemble du stock, des demandes entrantes et du catalogue de prestations.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {tiles.map((tile) => (
          <div key={tile.label} className="panel p-4">
            <span className="label-xs">{tile.label}</span>
            <p className="num mt-2 text-2xl font-semibold text-fg">{tile.value}</p>
            <p className="mt-1 text-[11px] text-faint">{tile.hint}</p>
          </div>
        ))}
      </div>

      <div className="grid min-w-0 gap-5 lg:grid-cols-2">
        <section className="panel min-w-0 p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-fg">Dernières demandes</h2>
            <Link
              to="/admin/leads"
              className="inline-flex items-center gap-1.5 text-xs text-accent hover:underline"
            >
              Tout voir
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>

          <ul className="mt-4 space-y-2">
            {leads.slice(0, 5).map((lead) => (
              <li
                key={lead.id}
                className="flex min-w-0 items-center justify-between gap-3 rounded-md border border-white/5 bg-ink-850 px-3 py-2.5"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm text-fg">{lead.name}</p>
                  <p className="truncate text-xs text-faint">{lead.vehicle ?? lead.service}</p>
                </div>
                <StatusPill
                  label={statusMeta[lead.status].label}
                  tone={statusMeta[lead.status].tone}
                />
              </li>
            ))}
          </ul>
        </section>

        <section className="panel min-w-0 p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-fg">Stock</h2>
            <Link
              to="/admin/vehicules"
              className="inline-flex items-center gap-1.5 text-xs text-accent hover:underline"
            >
              Gérer
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>

          <ul className="mt-4 space-y-2">
            {vehicles.slice(0, 5).map((vehicle) => (
              <li
                key={vehicle.id}
                className="flex min-w-0 items-center justify-between gap-3 rounded-md border border-white/5 bg-ink-850 px-3 py-2.5"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm text-fg">
                    {vehicle.brand} {vehicle.model}
                  </p>
                  <p className="num truncate text-xs text-faint">
                    {vehicle.year} · {vehicle.km.toLocaleString('fr-FR')} km · {euro(vehicle.price)}
                  </p>
                </div>
                <StatusPill
                  label={vehicleMeta[vehicle.status].label}
                  tone={vehicleMeta[vehicle.status].tone}
                />
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="panel min-w-0 p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-fg">Prestations publiées</h2>
          <Link
            to="/admin/prestations"
            className="inline-flex items-center gap-1.5 text-xs text-accent hover:underline"
          >
            Modifier les tarifs
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-4 grid min-w-0 gap-3 sm:grid-cols-3">
          {packs.map((pack) => (
            <div key={pack.id} className="rounded-md border border-white/5 bg-ink-850 p-4">
              <span className="num text-[11px] text-faint">{pack.ref}</span>
              <p className="mt-1 text-sm text-fg">{pack.name}</p>
              <p className="num mt-2 text-lg font-semibold text-accent">{pack.price} €</p>
              <p className="mt-1 text-[11px] text-faint">{pack.duration}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
