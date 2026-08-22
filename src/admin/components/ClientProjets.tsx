import { useState } from 'react';
import { ExternalLink, Handshake, Plus, Search, Trash2 } from 'lucide-react';
import { AdminButton, Field, Select, TextArea, TextInput } from './Field';
import StatusPill from './StatusPill';
import type {
  Client,
  Consignment,
  ConsignmentStatus,
  SearchStatus,
  VehicleSearch,
} from '../../store/types';

export const DEPOT_STATUSES: Record<ConsignmentStatus, { label: string; tone: string }> = {
  a_estimer: { label: 'À estimer', tone: 'warn' },
  estime: { label: 'Estimé', tone: 'accent' },
  en_depot: { label: 'En dépôt', tone: 'accent' },
  en_vente: { label: 'En vente', tone: 'ok' },
  vendu: { label: 'Vendu', tone: 'neutral' },
  abandonne: { label: 'Abandonné', tone: 'neutral' },
};

export const RECHERCHE_STATUSES: Record<SearchStatus, { label: string; tone: string }> = {
  en_recherche: { label: 'En recherche', tone: 'accent' },
  propositions: { label: 'Propositions envoyées', tone: 'warn' },
  trouve: { label: 'Véhicule trouvé', tone: 'ok' },
  livre: { label: 'Livré', tone: 'neutral' },
  abandonne: { label: 'Abandonné', tone: 'neutral' },
};

/** Une affaire est close quand elle n'appelle plus d'action de notre part. */
export const DEPOT_CLOS: ConsignmentStatus[] = ['vendu', 'abandonne'];
export const RECHERCHE_CLOSE: SearchStatus[] = ['livre', 'abandonne'];

const euro = (v?: number) => (v || v === 0 ? `${v.toLocaleString('fr-FR')} €` : '—');
const aujourdhui = () => new Date().toISOString().slice(0, 10);

/** Dépôts-vente : les véhicules que le client confie à l'atelier. */
export function SectionDepotVente({
  client,
  onSave,
}: {
  client: Client;
  onSave: (patch: Partial<Client>) => void;
}) {
  const [vehicule, setVehicule] = useState('');
  const depots = client.consignments ?? [];

  const ajouter = () => {
    if (!vehicule.trim()) return;
    onSave({
      consignments: [
        {
          id: `d${Date.now()}`,
          vehicle: vehicule.trim(),
          status: 'a_estimer',
          startedAt: aujourdhui(),
        },
        ...depots,
      ],
    });
    setVehicule('');
  };

  const modifier = (id: string, patch: Partial<Consignment>) =>
    onSave({ consignments: depots.map((d) => (d.id === id ? { ...d, ...patch } : d)) });

  return (
    <section>
      <div className="flex items-center gap-2">
        <Handshake className="h-4 w-4 text-accent" aria-hidden="true" />
        <h3 className="label-xs !text-muted">Dépôt-vente</h3>
      </div>
      <p className="mt-1 text-[11px] text-faint">
        Les véhicules que ce client nous confie pour la vente.
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        <TextInput
          className="min-w-[220px] flex-1"
          value={vehicule}
          onChange={(e) => setVehicule(e.target.value)}
          placeholder="Renault Zoé R135 — 2021"
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), ajouter())}
        />
        <AdminButton variant="ghost" onClick={ajouter}>
          <Plus className="h-4 w-4" aria-hidden="true" />
          Ajouter un dépôt
        </AdminButton>
      </div>

      {depots.length > 0 ? (
        <ul className="mt-3 space-y-3">
          {depots.map((d) => {
            const meta = DEPOT_STATUSES[d.status];
            const marge =
              d.soldPrice && d.commission ? d.commission : undefined;
            return (
              <li key={d.id} className="rounded-md border border-white/10 bg-ink-900 p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="flex-1 text-sm font-medium text-fg">{d.vehicle}</span>
                  <StatusPill label={meta.label} tone={meta.tone} />
                  <button
                    type="button"
                    onClick={() =>
                      onSave({ consignments: depots.filter((x) => x.id !== d.id) })
                    }
                    aria-label="Retirer ce dépôt-vente"
                    className="text-faint transition-colors hover:text-signal-danger"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>

                <div className="mt-3 grid gap-3 sm:grid-cols-3">
                  <Field label="Avancement">
                    <Select
                      value={d.status}
                      onChange={(e) => {
                        const status = e.target.value as ConsignmentStatus;
                        modifier(d.id, {
                          status,
                          ...(status === 'vendu' && !d.soldAt ? { soldAt: aujourdhui() } : {}),
                        });
                      }}
                    >
                      {Object.entries(DEPOT_STATUSES).map(([id, m]) => (
                        <option key={id} value={id}>
                          {m.label}
                        </option>
                      ))}
                    </Select>
                  </Field>
                  <Field label="Immatriculation">
                    <TextInput
                      defaultValue={d.plate ?? ''}
                      onBlur={(e) => modifier(d.id, { plate: e.target.value.toUpperCase() })}
                    />
                  </Field>
                  <Field label="Entré le">
                    <TextInput
                      type="date"
                      defaultValue={d.startedAt ?? ''}
                      onBlur={(e) => modifier(d.id, { startedAt: e.target.value })}
                    />
                  </Field>

                  <Field label="Prix espéré (€)" hint="Ce que le client vise">
                    <TextInput
                      type="number"
                      min={0}
                      defaultValue={d.expectedPrice ?? ''}
                      onBlur={(e) => modifier(d.id, { expectedPrice: Number(e.target.value) || undefined })}
                    />
                  </Field>
                  <Field label="Prix affiché (€)" hint="Convenu ensemble">
                    <TextInput
                      type="number"
                      min={0}
                      defaultValue={d.agreedPrice ?? ''}
                      onBlur={(e) => modifier(d.id, { agreedPrice: Number(e.target.value) || undefined })}
                    />
                  </Field>
                  <Field label="Commission (€)">
                    <TextInput
                      type="number"
                      min={0}
                      defaultValue={d.commission ?? ''}
                      onBlur={(e) => modifier(d.id, { commission: Number(e.target.value) || undefined })}
                    />
                  </Field>
                </div>

                {d.status === 'vendu' ? (
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <Field label="Vendu à (€)">
                      <TextInput
                        type="number"
                        min={0}
                        defaultValue={d.soldPrice ?? ''}
                        onBlur={(e) => modifier(d.id, { soldPrice: Number(e.target.value) || undefined })}
                      />
                    </Field>
                    <Field label="Vendu le">
                      <TextInput
                        type="date"
                        defaultValue={d.soldAt ?? ''}
                        onBlur={(e) => modifier(d.id, { soldAt: e.target.value })}
                      />
                    </Field>
                  </div>
                ) : null}

                <div className="mt-3">
                  <Field label="Notes">
                    <TextArea
                      rows={2}
                      defaultValue={d.notes ?? ''}
                      onBlur={(e) => modifier(d.id, { notes: e.target.value })}
                      placeholder="Deux clés, carnet complet, distribution faite à 74 000 km…"
                    />
                  </Field>
                </div>

                {d.status === 'vendu' ? (
                  <p className="num mt-2 text-xs text-faint">
                    Vendu {euro(d.soldPrice)}
                    {marge ? ` · commission ${euro(marge)}` : ''}
                  </p>
                ) : null}
              </li>
            );
          })}
        </ul>
      ) : null}
    </section>
  );
}

/** Recherches personnalisées : on cherche un véhicule pour le client. */
export function SectionRecherche({
  client,
  onSave,
}: {
  client: Client;
  onSave: (patch: Partial<Client>) => void;
}) {
  const [brief, setBrief] = useState('');
  const recherches = client.searches ?? [];

  const ajouter = () => {
    if (!brief.trim()) return;
    onSave({
      searches: [
        {
          id: `r${Date.now()}`,
          brief: brief.trim(),
          status: 'en_recherche',
          startedAt: aujourdhui(),
          candidates: [],
        },
        ...recherches,
      ],
    });
    setBrief('');
  };

  const modifier = (id: string, patch: Partial<VehicleSearch>) =>
    onSave({ searches: recherches.map((r) => (r.id === id ? { ...r, ...patch } : r)) });

  return (
    <section>
      <div className="flex items-center gap-2">
        <Search className="h-4 w-4 text-accent" aria-hidden="true" />
        <h3 className="label-xs !text-muted">Recherche de véhicule</h3>
      </div>
      <p className="mt-1 text-[11px] text-faint">
        Les véhicules que nous cherchons pour ce client, et ce qu’on lui a déjà proposé.
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        <TextInput
          className="min-w-[220px] flex-1"
          value={brief}
          onChange={(e) => setBrief(e.target.value)}
          placeholder="Break diesel récent, boîte auto, attelage"
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), ajouter())}
        />
        <AdminButton variant="ghost" onClick={ajouter}>
          <Plus className="h-4 w-4" aria-hidden="true" />
          Ajouter une recherche
        </AdminButton>
      </div>

      {recherches.length > 0 ? (
        <ul className="mt-3 space-y-3">
          {recherches.map((r) => {
            const meta = RECHERCHE_STATUSES[r.status];
            return (
              <li key={r.id} className="rounded-md border border-white/10 bg-ink-900 p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="flex-1 text-sm font-medium text-fg">{r.brief}</span>
                  <StatusPill label={meta.label} tone={meta.tone} />
                  <button
                    type="button"
                    onClick={() => onSave({ searches: recherches.filter((x) => x.id !== r.id) })}
                    aria-label="Retirer cette recherche"
                    className="text-faint transition-colors hover:text-signal-danger"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>

                <div className="mt-3 grid gap-3 sm:grid-cols-3">
                  <Field label="Avancement">
                    <Select
                      value={r.status}
                      onChange={(e) => modifier(r.id, { status: e.target.value as SearchStatus })}
                    >
                      {Object.entries(RECHERCHE_STATUSES).map(([id, m]) => (
                        <option key={id} value={id}>
                          {m.label}
                        </option>
                      ))}
                    </Select>
                  </Field>
                  <Field label="Budget max (€)">
                    <TextInput
                      type="number"
                      min={0}
                      defaultValue={r.budgetMax ?? ''}
                      onBlur={(e) => modifier(r.id, { budgetMax: Number(e.target.value) || undefined })}
                    />
                  </Field>
                  <Field label="Démarrée le">
                    <TextInput
                      type="date"
                      defaultValue={r.startedAt ?? ''}
                      onBlur={(e) => modifier(r.id, { startedAt: e.target.value })}
                    />
                  </Field>

                  <Field label="Année min">
                    <TextInput
                      type="number"
                      min={0}
                      defaultValue={r.yearMin ?? ''}
                      onBlur={(e) => modifier(r.id, { yearMin: Number(e.target.value) || undefined })}
                    />
                  </Field>
                  <Field label="Km max">
                    <TextInput
                      type="number"
                      min={0}
                      defaultValue={r.kmMax ?? ''}
                      onBlur={(e) => modifier(r.id, { kmMax: Number(e.target.value) || undefined })}
                    />
                  </Field>
                  <Field label="Boîte / énergie">
                    <TextInput
                      defaultValue={[r.gearbox, r.fuel].filter(Boolean).join(' / ')}
                      placeholder="BVA / Diesel"
                      onBlur={(e) => {
                        const [gearbox = '', fuel = ''] = e.target.value.split('/').map((v) => v.trim());
                        modifier(r.id, { gearbox, fuel });
                      }}
                    />
                  </Field>
                </div>

                <Candidats recherche={r} onModifier={modifier} />

                <div className="mt-3">
                  <Field label="Notes">
                    <TextArea
                      rows={2}
                      defaultValue={r.notes ?? ''}
                      onBlur={(e) => modifier(r.id, { notes: e.target.value })}
                      placeholder="Refuse les véhicules importés. Veut absolument l’attelage d’origine."
                    />
                  </Field>
                </div>
              </li>
            );
          })}
        </ul>
      ) : null}
    </section>
  );
}

/** Véhicules proposés au client dans le cadre d'une recherche. */
function Candidats({
  recherche,
  onModifier,
}: {
  recherche: VehicleSearch;
  onModifier: (id: string, patch: Partial<VehicleSearch>) => void;
}) {
  const [label, setLabel] = useState('');
  const [price, setPrice] = useState('');
  const [url, setUrl] = useState('');
  const candidats = recherche.candidates ?? [];

  const ajouter = () => {
    if (!label.trim()) return;
    onModifier(recherche.id, {
      candidates: [
        ...candidats,
        {
          id: `c${Date.now()}`,
          label: label.trim(),
          price: Number(price) || undefined,
          url: url.trim(),
        },
      ],
    });
    setLabel('');
    setPrice('');
    setUrl('');
  };

  return (
    <div className="mt-3">
      <span className="field-label">Véhicules proposés</span>

      <div className="flex flex-wrap gap-2">
        <TextInput
          className="min-w-[180px] flex-1"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Passat SW 2.0 TDI 150 — 2020"
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), ajouter())}
        />
        <TextInput
          className="w-28"
          type="number"
          min={0}
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="€"
        />
        <TextInput
          className="w-48"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://…"
        />
        <AdminButton variant="ghost" onClick={ajouter}>
          <Plus className="h-4 w-4" aria-hidden="true" />
          Ajouter
        </AdminButton>
      </div>

      {candidats.length > 0 ? (
        <ul className="mt-2 space-y-1.5">
          {candidats.map((c) => (
            <li
              key={c.id}
              className="flex items-center gap-2 rounded border border-white/10 bg-ink-850 px-3 py-1.5 text-sm"
            >
              <span className="flex-1 text-muted">{c.label}</span>
              {c.price ? <span className="num text-xs text-fg">{euro(c.price)}</span> : null}
              {c.url ? (
                <a
                  href={c.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-faint transition-colors hover:text-accent"
                  aria-label="Ouvrir l’annonce"
                >
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              ) : null}
              <button
                type="button"
                onClick={() =>
                  onModifier(recherche.id, {
                    candidates: candidats.filter((x) => x.id !== c.id),
                  })
                }
                aria-label="Retirer ce véhicule"
                className="text-faint transition-colors hover:text-signal-danger"
              >
                <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
