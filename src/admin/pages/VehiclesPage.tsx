import { useMemo, useState } from 'react';
import { BadgeCheck, Pencil, Plus, Trash2 } from 'lucide-react';
import Modal from '../components/Modal';
import StatusPill from '../components/StatusPill';
import { AdminButton } from '../components/Field';
import { EMPTY_VEHICLE, VehicleForm } from '../components/VehicleForm';
import { toast } from '../components/toast';
import { useAdminUi } from '../adminUi';
import { useSiteStore } from '../../store/siteStore';
import { VEHICLE_STATUS } from '../../data/vehicles.js';
import type { Vehicle, VehicleStatus } from '../../store/types';

const FILTERS: { id: 'tous' | VehicleStatus; label: string }[] = [
  { id: 'tous', label: 'Tous' },
  { id: 'disponible', label: 'En vente' },
  { id: 'reserve', label: 'Réservé' },
  { id: 'vendu', label: 'Vendu' },
];

const euro = (value: number) => `${value.toLocaleString('fr-FR')} €`;

const slugify = (vehicle: Vehicle) =>
  `${vehicle.brand}-${vehicle.model}-${vehicle.trim}`
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 48) || `vehicule-${Date.now()}`;

export default function VehiclesPage() {
  const vehicles = useSiteStore((state) => state.vehicles);
  const addVehicle = useSiteStore((state) => state.addVehicle);
  const updateVehicle = useSiteStore((state) => state.updateVehicle);
  const removeVehicle = useSiteStore((state) => state.removeVehicle);
  const setVehicleStatus = useSiteStore((state) => state.setVehicleStatus);
  const query = useAdminUi((state) => state.query);

  const [filter, setFilter] = useState<'tous' | VehicleStatus>('tous');
  const [draft, setDraft] = useState<Vehicle | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [toDelete, setToDelete] = useState<Vehicle | null>(null);

  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return vehicles
      .filter((vehicle) => (filter === 'tous' ? true : vehicle.status === filter))
      .filter((vehicle) =>
        needle
          ? `${vehicle.ref} ${vehicle.brand} ${vehicle.model} ${vehicle.trim}`
              .toLowerCase()
              .includes(needle)
          : true
      );
  }, [vehicles, filter, query]);

  const totals = useMemo(() => {
    const stock = vehicles.filter((vehicle) => vehicle.status !== 'vendu');
    return {
      count: stock.length,
      value: stock.reduce((sum, vehicle) => sum + vehicle.price, 0),
      margin: stock.reduce((sum, vehicle) => sum + (vehicle.price - vehicle.netSeller), 0),
    };
  }, [vehicles]);

  const save = () => {
    if (!draft) return;
    if (!draft.brand.trim() || !draft.model.trim()) {
      toast('Marque et modèle sont obligatoires.', 'danger');
      return;
    }

    if (isNew) {
      const id = slugify(draft);
      addVehicle({
        ...draft,
        id: vehicles.some((vehicle) => vehicle.id === id) ? `${id}-${Date.now() % 1000}` : id,
        ref: draft.ref.trim() || `TV-${String(Date.now()).slice(-4)}`,
      });
      toast('Véhicule ajouté au showroom.');
    } else {
      updateVehicle(draft.id, draft);
      toast('Fiche véhicule enregistrée.');
    }

    setDraft(null);
    setIsNew(false);
  };

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold text-fg">Showroom</h1>
          <p className="mt-1 text-xs text-faint">
            {totals.count} véhicules en stock · {euro(totals.value)} de valeur affichée ·{' '}
            {euro(totals.margin)} de marge potentielle
          </p>
        </div>
        <AdminButton
          onClick={() => {
            setDraft({ ...EMPTY_VEHICLE });
            setIsNew(true);
          }}
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Ajouter un véhicule
        </AdminButton>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
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
              className={`inline-flex min-h-[34px] items-center gap-2 rounded-full border px-4 text-xs font-semibold transition-colors ${
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
      </div>

      <div className="mt-5 overflow-x-auto rounded-3xl border border-white/10">
        <table className="w-full min-w-[900px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-ink-850 text-left">
              {['Réf.', 'Véhicule', 'Année', 'Km', 'Boîte', 'Prix', 'Net vendeur', 'Marge', 'Statut', ''].map(
                (head, index) => (
                  <th
                    key={head || index}
                    className="px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-faint"
                  >
                    {head}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {rows.map((vehicle) => {
              const margin = vehicle.price - vehicle.netSeller;
              const status = VEHICLE_STATUS[vehicle.status] as { label: string; tone: string };
              return (
                <tr
                  key={vehicle.id}
                  className="border-b border-white/5 last:border-0 hover:bg-ink-850/60"
                >
                  <td className="num px-3 py-2.5 text-xs text-faint">{vehicle.ref}</td>
                  <td className="px-3 py-2.5">
                    <span className="block font-medium text-fg">
                      {vehicle.brand} {vehicle.model}
                    </span>
                    <span className="block text-xs text-faint">{vehicle.trim}</span>
                  </td>
                  <td className="num px-3 py-2.5 text-muted">{vehicle.year}</td>
                  <td className="num px-3 py-2.5 text-muted">
                    {vehicle.km.toLocaleString('fr-FR')}
                  </td>
                  <td className="px-3 py-2.5 text-muted">{vehicle.gearbox}</td>
                  <td className="num px-3 py-2.5 font-semibold text-fg">{euro(vehicle.price)}</td>
                  <td className="num px-3 py-2.5 text-muted">{euro(vehicle.netSeller)}</td>
                  <td
                    className={`num px-3 py-2.5 ${
                      margin >= 0 ? 'text-signal-ok' : 'text-signal-danger'
                    }`}
                  >
                    {euro(margin)}
                  </td>
                  <td className="px-3 py-2.5">
                    <StatusPill label={status.label} tone={status.tone} />
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center justify-end gap-1">
                      {vehicle.status !== 'vendu' ? (
                        <button
                          type="button"
                          onClick={() => {
                            setVehicleStatus(vehicle.id, 'vendu');
                            toast(`${vehicle.brand} ${vehicle.model} marquée vendue.`);
                          }}
                          title="Marquer comme vendu"
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-faint transition-colors hover:bg-ink-800 hover:text-signal-ok"
                        >
                          <BadgeCheck className="h-4 w-4" aria-hidden="true" />
                        </button>
                      ) : null}
                      <button
                        type="button"
                        onClick={() => {
                          setDraft({ ...vehicle });
                          setIsNew(false);
                        }}
                        title="Modifier"
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-faint transition-colors hover:bg-ink-800 hover:text-fg"
                      >
                        <Pencil className="h-4 w-4" aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setToDelete(vehicle)}
                        title="Supprimer"
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-faint transition-colors hover:bg-ink-800 hover:text-signal-danger"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {rows.length === 0 ? (
          <p className="px-4 py-10 text-center text-sm text-faint">
            Aucun véhicule ne correspond à ce filtre.
          </p>
        ) : null}
      </div>

      {draft ? (
        <Modal
          wide
          title={isNew ? 'Nouveau véhicule' : `${draft.brand} ${draft.model}`}
          subtitle={isNew ? 'Publié sur le site public dès l’enregistrement' : draft.ref}
          onClose={() => setDraft(null)}
          footer={
            <>
              <AdminButton variant="ghost" onClick={() => setDraft(null)}>
                Annuler
              </AdminButton>
              <AdminButton onClick={save}>Enregistrer</AdminButton>
            </>
          }
        >
          <VehicleForm draft={draft} onChange={(patch) => setDraft({ ...draft, ...patch })} />
        </Modal>
      ) : null}

      {toDelete ? (
        <Modal
          title="Supprimer ce véhicule ?"
          subtitle={`${toDelete.brand} ${toDelete.model} — ${toDelete.ref}`}
          onClose={() => setToDelete(null)}
          footer={
            <>
              <AdminButton variant="ghost" onClick={() => setToDelete(null)}>
                Annuler
              </AdminButton>
              <AdminButton
                variant="danger"
                onClick={() => {
                  removeVehicle(toDelete.id);
                  toast('Véhicule supprimé.', 'danger');
                  setToDelete(null);
                }}
              >
                Supprimer définitivement
              </AdminButton>
            </>
          }
        >
          <p className="text-sm text-muted">
            La fiche disparaîtra immédiatement du site public. Pour la garder en historique,
            préférez le statut « Vendu ».
          </p>
        </Modal>
      ) : null}
    </div>
  );
}
