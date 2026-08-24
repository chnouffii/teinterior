import { useMemo, useState } from 'react';
import { Search, X } from 'lucide-react';
import { Field, Select, TextArea, TextInput } from './Field';
import PhotoUploader from './PhotoUploader';
import { FUELS, GEARBOXES, VEHICLE_STATUS } from '../../data/vehicles.js';
import { EQUIPEMENTS, NOMBRE_EQUIPEMENTS, compterEquipements } from '../../data/equipements.js';
import type { Vehicle } from '../../store/types';

export const EMPTY_VEHICLE: Vehicle = {
  id: '',
  ref: '',
  brand: '',
  model: '',
  trim: '',
  year: new Date().getFullYear(),
  km: 0,
  gearbox: 'BVM',
  fuel: 'Essence',
  power: 0,
  price: 0,
  netSeller: 0,
  status: 'disponible',
  color: '',
  palette: ['#24282E', '#4A525C'],
  photos: [],
  coverIndex: 0,
  location: 'Brumath (67)',
  listedAt: new Date().toISOString().slice(0, 10),
  highlights: [],
  history: '',
  workshopWork: [],
  equipment: [],
  equipmentExtra: [],
};

/** Sans accent ni casse : « Régulateur » se trouve en tapant « regulateur ». */
const sansAccent = (valeur: string) =>
  valeur.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

/**
 * Les équipements du véhicule, à cocher.
 *
 * Cinquante-huit cases sans filtre obligeraient à parcourir toute la liste pour
 * en trouver une : le champ de recherche évite ce balayage à chaque annonce.
 */
function Equipements({
  coches,
  libres,
  onChange,
}: {
  coches: string[];
  libres: string[];
  onChange: (patch: Partial<Vehicle>) => void;
}) {
  const [recherche, setRecherche] = useState('');
  const [ajout, setAjout] = useState('');
  const selection = useMemo(() => new Set(coches), [coches]);

  const groupes = useMemo(() => {
    const q = sansAccent(recherche.trim());
    if (!q) return EQUIPEMENTS;
    return EQUIPEMENTS.map((groupe) => ({
      ...groupe,
      items: groupe.items.filter((item) => sansAccent(item.label).includes(q)),
    })).filter((groupe) => groupe.items.length > 0);
  }, [recherche]);

  const basculer = (id: string) =>
    onChange({
      equipment: selection.has(id) ? coches.filter((x) => x !== id) : [...coches, id],
    });

  const ajouterLibre = () => {
    const valeur = ajout.trim();
    if (!valeur || libres.includes(valeur)) return setAjout('');
    onChange({ equipmentExtra: [...libres, valeur] });
    setAjout('');
  };

  const total = compterEquipements({ equipment: coches, equipmentExtra: libres } as Vehicle);

  return (
    <div className="mt-3 space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[15rem] flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-faint"
            aria-hidden="true"
          />
          <TextInput
            value={recherche}
            onChange={(event) => setRecherche(event.target.value)}
            placeholder={`Filtrer parmi ${NOMBRE_EQUIPEMENTS} équipements…`}
            aria-label="Filtrer les équipements"
            className="pl-9"
          />
        </div>
        <p className="num text-xs text-faint">
          {total} coché{total > 1 ? 's' : ''}
        </p>
      </div>

      {groupes.length === 0 ? (
        <p className="rounded-lg border border-dashed border-white/15 p-4 text-center text-xs text-faint">
          Aucun équipement ne correspond. Ajoutez-le en équipement libre ci-dessous.
        </p>
      ) : null}

      {groupes.map((groupe) => (
        <fieldset key={groupe.id} className="rounded-lg border border-white/10 p-4">
          <legend className="label-xs px-1">{groupe.label}</legend>
          <div className="grid gap-x-4 gap-y-1 sm:grid-cols-2 lg:grid-cols-3">
            {groupe.items.map((item) => (
              <label
                key={item.id}
                className="flex cursor-pointer items-start gap-2.5 rounded py-1.5 text-sm text-muted transition-colors hover:text-fg"
              >
                <input
                  type="checkbox"
                  checked={selection.has(item.id)}
                  onChange={() => basculer(item.id)}
                  className="mt-0.5 h-4 w-4 shrink-0 accent-accent"
                />
                {item.label}
              </label>
            ))}
          </div>
        </fieldset>
      ))}

      <div className="rounded-lg border border-white/10 p-4">
        <span className="label-xs">Équipement propre à ce véhicule</span>
        <p className="mb-3 mt-1 text-[11px] text-faint">
          Pour ce que le catalogue ne couvre pas : « Pack Sport Chrono », « Sièges Recaro »…
        </p>
        <div className="flex gap-2">
          <TextInput
            value={ajout}
            onChange={(event) => setAjout(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                // Sans cela, la touche Entrée validerait le formulaire entier.
                event.preventDefault();
                ajouterLibre();
              }
            }}
            placeholder="Pack Sport Chrono"
            aria-label="Ajouter un équipement"
          />
          <button
            type="button"
            onClick={ajouterLibre}
            disabled={!ajout.trim()}
            className="shrink-0 rounded-md border border-white/10 px-3 text-sm font-semibold text-muted transition-colors hover:border-white/20 hover:text-fg disabled:cursor-not-allowed disabled:opacity-40"
          >
            Ajouter
          </button>
        </div>

        {libres.length > 0 ? (
          <ul className="mt-3 flex flex-wrap gap-2">
            {libres.map((valeur) => (
              <li key={valeur}>
                <button
                  type="button"
                  onClick={() =>
                    onChange({ equipmentExtra: libres.filter((x) => x !== valeur) })
                  }
                  title="Retirer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-ink-850 py-1 pl-3 pr-2 text-xs text-muted transition-colors hover:border-signal-danger/40 hover:text-signal-danger"
                >
                  {valeur}
                  <X className="h-3 w-3" aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}

const linesToArray = (value: string) =>
  value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

export function VehicleForm({
  draft,
  onChange,
}: {
  draft: Vehicle;
  onChange: (patch: Partial<Vehicle>) => void;
}) {
  const margin = draft.price - draft.netSeller;
  const marginRate = draft.price > 0 ? (margin / draft.price) * 100 : 0;

  return (
    <div className="space-y-7">
      <section>
        <h3 className="label-xs">Identification</h3>
        <div className="mt-3 grid gap-4 sm:grid-cols-3">
          <Field label="Référence interne">
            <TextInput
              value={draft.ref}
              onChange={(event) => onChange({ ref: event.target.value })}
              placeholder="TV-0152"
            />
          </Field>
          <Field label="Marque">
            <TextInput
              value={draft.brand}
              onChange={(event) => onChange({ brand: event.target.value })}
              placeholder="BMW"
            />
          </Field>
          <Field label="Modèle">
            <TextInput
              value={draft.model}
              onChange={(event) => onChange({ model: event.target.value })}
              placeholder="Série 3 Touring"
            />
          </Field>
          <Field label="Finition" className="sm:col-span-3">
            <TextInput
              value={draft.trim}
              onChange={(event) => onChange({ trim: event.target.value })}
              placeholder="320d xDrive M Sport"
            />
          </Field>
        </div>
      </section>

      <section>
        <h3 className="label-xs">Caractéristiques</h3>
        <div className="mt-3 grid gap-4 sm:grid-cols-3">
          <Field label="Année">
            <TextInput
              type="number"
              value={draft.year}
              onChange={(event) => onChange({ year: Number(event.target.value) })}
            />
          </Field>
          <Field label="Kilométrage">
            <TextInput
              type="number"
              value={draft.km}
              onChange={(event) => onChange({ km: Number(event.target.value) })}
            />
          </Field>
          <Field label="Puissance (ch DIN)">
            <TextInput
              type="number"
              value={draft.power}
              onChange={(event) => onChange({ power: Number(event.target.value) })}
            />
          </Field>
          <Field label="Boîte">
            <Select
              value={draft.gearbox}
              onChange={(event) => onChange({ gearbox: event.target.value as Vehicle['gearbox'] })}
            >
              {GEARBOXES.map((box: string) => (
                <option key={box} value={box}>
                  {box}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Carburant">
            <Select value={draft.fuel} onChange={(event) => onChange({ fuel: event.target.value })}>
              {FUELS.map((fuel: string) => (
                <option key={fuel} value={fuel}>
                  {fuel}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Teinte">
            <TextInput
              value={draft.color}
              onChange={(event) => onChange({ color: event.target.value })}
              placeholder="Noir Saphir métallisé"
            />
          </Field>
        </div>
      </section>

      <section>
        <h3 className="label-xs">Données financières</h3>
        <div className="mt-3 grid gap-4 sm:grid-cols-3">
          <Field label="Prix affiché (€)">
            <TextInput
              type="number"
              value={draft.price}
              onChange={(event) => onChange({ price: Number(event.target.value) })}
            />
          </Field>
          <Field label="Net vendeur (€)" hint="Interne — jamais affiché sur le site public">
            <TextInput
              type="number"
              value={draft.netSeller}
              onChange={(event) => onChange({ netSeller: Number(event.target.value) })}
            />
          </Field>
          <div>
            <span className="field-label">Marge nette</span>
            <div
              className={`flex h-[42px] items-center justify-between rounded-md border px-3 text-sm ${
                margin >= 0
                  ? 'border-white/10 bg-ink-850 text-signal-ok'
                  : 'border-signal-danger/40 bg-signal-danger/10 text-signal-danger'
              }`}
            >
              <span className="num font-semibold">{margin.toLocaleString('fr-FR')} €</span>
              <span className="num text-xs text-faint">{marginRate.toFixed(1)} %</span>
            </div>
          </div>
          <Field label="Statut">
            <Select
              value={draft.status}
              onChange={(event) => onChange({ status: event.target.value as Vehicle['status'] })}
            >
              {Object.values(VEHICLE_STATUS).map((status: { id: string; label: string }) => (
                <option key={status.id} value={status.id}>
                  {status.label}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Mise en ligne">
            <TextInput
              type="date"
              value={draft.listedAt}
              onChange={(event) => onChange({ listedAt: event.target.value })}
            />
          </Field>
          <Field label="Localisation">
            <TextInput
              value={draft.location}
              onChange={(event) => onChange({ location: event.target.value })}
            />
          </Field>
        </div>
      </section>

      <section>
        <h3 className="label-xs">Galerie photos</h3>
        <p className="mt-1 text-[11px] text-faint">
          Les photos sont enregistrées sur votre serveur, à côté des contenus. L’étoile désigne
          celle affichée dans le showroom.
        </p>

        <div className="mt-3">
          <PhotoUploader
            photos={draft.photos}
            coverIndex={draft.coverIndex}
            onChange={onChange}
          />
        </div>
      </section>

      <section>
        <h3 className="label-xs">Équipements</h3>
        <Equipements
          coches={draft.equipment ?? []}
          libres={draft.equipmentExtra ?? []}
          onChange={onChange}
        />
      </section>

      <section>
        <h3 className="label-xs">Descriptif</h3>
        <div className="mt-3 space-y-4">
          <Field label="Points forts" hint="Une ligne par point">
            <TextArea
              rows={4}
              value={draft.highlights.join('\n')}
              onChange={(event) => onChange({ highlights: linesToArray(event.target.value) })}
              placeholder={'Deuxième main, carnet complet\nDistribution faite à 74 000 km'}
            />
          </Field>
          <Field label="Historique d’entretien">
            <TextArea
              rows={3}
              value={draft.history}
              onChange={(event) => onChange({ history: event.target.value })}
            />
          </Field>
          <Field label="Travaux réalisés par Teintérior" hint="Une ligne par intervention">
            <TextArea
              rows={3}
              value={draft.workshopWork.join('\n')}
              onChange={(event) => onChange({ workshopWork: linesToArray(event.target.value) })}
              placeholder={'Correction 1 passe + scellant\n4 pneus neufs'}
            />
          </Field>
        </div>
      </section>
    </div>
  );
}
