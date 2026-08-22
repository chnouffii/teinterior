import { useState } from 'react';
import { ImagePlus, Star, Trash2 } from 'lucide-react';
import { Field, Select, TextArea, TextInput } from './Field';
import { FUELS, GEARBOXES, VEHICLE_STATUS } from '../../data/vehicles.js';
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
  location: 'Toulouse (31)',
  listedAt: new Date().toISOString().slice(0, 10),
  highlights: [],
  history: '',
  workshopWork: [],
};

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
  const [photoUrl, setPhotoUrl] = useState('');
  const margin = draft.price - draft.netSeller;
  const marginRate = draft.price > 0 ? (margin / draft.price) * 100 : 0;

  const addPhoto = () => {
    const url = photoUrl.trim();
    if (!url) return;
    onChange({ photos: [...draft.photos, url] });
    setPhotoUrl('');
  };

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
              className={`flex h-[42px] items-center justify-between rounded-2xl border px-3 text-sm ${
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
          Collez l’URL d’une photo hébergée. Sans photo, la fiche publique affiche l’illustration
          vectorielle de repli. L’étoile désigne la photo de couverture.
        </p>

        <div className="mt-3 flex gap-2">
          <TextInput
            value={photoUrl}
            onChange={(event) => setPhotoUrl(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                addPhoto();
              }
            }}
            placeholder="https://…/photo-01.jpg"
          />
          <button
            type="button"
            onClick={addPhoto}
            className="inline-flex min-h-[42px] shrink-0 items-center gap-2 rounded-2xl border border-white/10 px-3 text-sm text-muted transition-colors hover:border-white/20 hover:text-fg"
          >
            <ImagePlus className="h-4 w-4" aria-hidden="true" />
            Ajouter
          </button>
        </div>

        {draft.photos.length > 0 ? (
          <ul className="mt-3 space-y-2">
            {draft.photos.map((url, index) => (
              <li
                key={`${url}-${index}`}
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-ink-850 px-3 py-2"
              >
                <button
                  type="button"
                  onClick={() => onChange({ coverIndex: index })}
                  aria-label="Définir comme photo de couverture"
                  className={`shrink-0 transition-colors ${
                    draft.coverIndex === index ? 'text-accent' : 'text-faint hover:text-fg'
                  }`}
                >
                  <Star
                    className="h-4 w-4"
                    fill={draft.coverIndex === index ? 'currentColor' : 'none'}
                    aria-hidden="true"
                  />
                </button>
                <span className="flex-1 truncate text-xs text-muted">{url}</span>
                <button
                  type="button"
                  onClick={() => {
                    const photos = draft.photos.filter((_, position) => position !== index);
                    onChange({
                      photos,
                      coverIndex: Math.min(draft.coverIndex, Math.max(photos.length - 1, 0)),
                    });
                  }}
                  aria-label="Retirer la photo"
                  className="shrink-0 text-faint transition-colors hover:text-signal-danger"
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 rounded-2xl border border-dashed border-white/10 px-3 py-4 text-center text-xs text-faint">
            Aucune photo — illustration de repli utilisée sur le site.
          </p>
        )}
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
