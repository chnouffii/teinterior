import { useState } from 'react';
import { Car, Plus, Send, Trash2, Wrench } from 'lucide-react';
import { AdminButton, Field, Select, TextArea, TextInput } from './Field';
import Modal from './Modal';
import StatusPill from './StatusPill';
import { toast } from './toast';
import { useSiteStore } from '../../store/siteStore';
import { CLIENT_STATUSES } from '../pages/ClientsPage';
import { LEAD_STATUSES, LEAD_TYPES } from '../../data/leads.js';
import type { Client, ClientStatus } from '../../store/types';

const horodatage = (iso: string) =>
  new Date(iso).toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });

const statutsDemande = LEAD_STATUSES as Record<string, { label: string; tone: string }>;
const typesDemande = LEAD_TYPES as Record<string, { label: string }>;

/** Fiche client complète : identité, véhicules, interventions, notes, relance. */
export default function ClientDetail({ client, onClose }: { client: Client; onClose: () => void }) {
  const modifierClient = useSiteStore((state) => state.modifierClient);
  const ajouterNote = useSiteStore((state) => state.ajouterNote);
  const leads = useSiteStore((state) => state.leads);
  const rattacherDemande = useSiteStore((state) => state.rattacherDemande);

  const [note, setNote] = useState('');
  const [envoiNote, setEnvoiNote] = useState(false);

  const demandes = leads.filter((d) => d.clientId === client.id);
  const total = client.interventions.reduce((somme, i) => somme + (i.amount ?? 0), 0);

  const enregistrer = async (patch: Partial<Client>) => {
    try {
      await modifierClient(client.id, patch);
    } catch (erreur) {
      toast((erreur as Error).message, 'danger');
    }
  };

  async function publierNote() {
    const contenu = note.trim();
    if (!contenu) return;
    setEnvoiNote(true);
    try {
      await ajouterNote(client.id, contenu);
      setNote('');
    } catch (erreur) {
      toast((erreur as Error).message, 'danger');
    }
    setEnvoiNote(false);
  }

  return (
    <Modal
      wide
      title={client.name}
      subtitle={[client.city, client.source].filter(Boolean).join(' · ') || undefined}
      onClose={onClose}
      footer={<AdminButton variant="ghost" onClick={onClose}>Fermer</AdminButton>}
    >
      <div className="space-y-7">
        <section>
          <h3 className="label-xs">Coordonnées</h3>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <Field label="Nom">
              <TextInput
                defaultValue={client.name}
                onBlur={(e) => e.target.value !== client.name && enregistrer({ name: e.target.value })}
              />
            </Field>
            <Field label="Téléphone">
              <TextInput
                defaultValue={client.phone}
                onBlur={(e) => e.target.value !== client.phone && enregistrer({ phone: e.target.value })}
              />
            </Field>
            <Field label="Email">
              <TextInput
                defaultValue={client.email}
                onBlur={(e) => e.target.value !== client.email && enregistrer({ email: e.target.value })}
              />
            </Field>
            <Field label="Ville">
              <TextInput
                defaultValue={client.city}
                onBlur={(e) => e.target.value !== client.city && enregistrer({ city: e.target.value })}
              />
            </Field>
            <Field label="Origine">
              <TextInput
                defaultValue={client.source}
                onBlur={(e) => e.target.value !== client.source && enregistrer({ source: e.target.value })}
              />
            </Field>
            <Field label="Statut">
              <Select
                value={client.status}
                onChange={(e) => enregistrer({ status: e.target.value as ClientStatus })}
              >
                {Object.entries(CLIENT_STATUSES).map(([id, meta]) => (
                  <option key={id} value={id}>
                    {meta.label}
                  </option>
                ))}
              </Select>
            </Field>
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between">
            <h3 className="label-xs">Relance à venir</h3>
            {client.nextAction ? (
              <button
                type="button"
                onClick={() => enregistrer({ nextAction: undefined })}
                className="text-[11px] text-faint transition-colors hover:text-signal-danger"
              >
                Retirer
              </button>
            ) : null}
          </div>
          <div className="mt-3 grid gap-4 sm:grid-cols-[180px_1fr]">
            <Field label="Date">
              <TextInput
                type="date"
                defaultValue={client.nextAction?.date ?? ''}
                onBlur={(e) =>
                  enregistrer({
                    nextAction: e.target.value
                      ? { date: e.target.value, label: client.nextAction?.label ?? '' }
                      : undefined,
                  })
                }
              />
            </Field>
            <Field label="À faire">
              <TextInput
                placeholder="Rappeler pour le devis céramique"
                defaultValue={client.nextAction?.label ?? ''}
                onBlur={(e) =>
                  client.nextAction?.date &&
                  enregistrer({ nextAction: { date: client.nextAction.date, label: e.target.value } })
                }
              />
            </Field>
          </div>
        </section>

        <ListeVehicules client={client} onSave={enregistrer} />
        <ListeInterventions client={client} total={total} onSave={enregistrer} />

        {demandes.length > 0 ? (
          <section>
            <h3 className="label-xs">Demandes rattachées</h3>
            <ul className="mt-3 space-y-2">
              {demandes.map((d) => {
                const statut = statutsDemande[d.status];
                return (
                  <li
                    key={d.id}
                    className="rounded-md border border-white/10 bg-ink-900 px-3 py-2.5"
                  >
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="num text-xs text-faint">{d.id}</span>
                      <span className="text-sm text-fg">
                        {typesDemande[d.type]?.label ?? d.type}
                      </span>
                      {statut ? <StatusPill label={statut.label} tone={statut.tone} /> : null}
                      <span className="num ml-auto text-[11px] text-faint">
                        {horodatage(d.createdAt)}
                      </span>
                      <button
                        type="button"
                        onClick={() => rattacherDemande(d.id, null)}
                        className="text-[11px] text-faint transition-colors hover:text-signal-danger"
                      >
                        Détacher
                      </button>
                    </div>
                    {d.message ? (
                      <p className="mt-1.5 text-xs leading-relaxed text-muted">{d.message}</p>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </section>
        ) : null}

        <section>
          <h3 className="label-xs">Journal de suivi</h3>
          <div className="mt-3">
            <TextArea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Rappelé ce matin, veut réfléchir jusqu’à la semaine prochaine…"
              onKeyDown={(e) => {
                // Ctrl+Entrée envoie sans quitter le champ.
                if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                  e.preventDefault();
                  void publierNote();
                }
              }}
            />
            <div className="mt-2 flex items-center justify-between">
              <span className="text-[11px] text-faint">
                La date est posée automatiquement.
              </span>
              <AdminButton onClick={publierNote} disabled={envoiNote || !note.trim()}>
                <Send className="h-4 w-4" aria-hidden="true" />
                {envoiNote ? 'Ajout…' : 'Ajouter la note'}
              </AdminButton>
            </div>
          </div>

          {client.notes.length > 0 ? (
            <ol className="mt-4 space-y-3">
              {client.notes.map((n) => (
                <li key={n.id} className="border-l-2 border-white/10 pl-3">
                  <p className="num text-[11px] text-faint">{horodatage(n.createdAt)}</p>
                  <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-muted">
                    {n.text}
                  </p>
                </li>
              ))}
            </ol>
          ) : (
            <p className="mt-4 text-xs text-faint">
              Aucune note. C’est ici que se garde la mémoire des échanges.
            </p>
          )}
        </section>
      </div>
    </Modal>
  );
}

function ListeVehicules({
  client,
  onSave,
}: {
  client: Client;
  onSave: (patch: Partial<Client>) => void;
}) {
  const [label, setLabel] = useState('');
  const [plate, setPlate] = useState('');

  const ajouter = () => {
    if (!label.trim()) return;
    onSave({
      vehicles: [
        ...client.vehicles,
        { id: `v${Date.now()}`, label: label.trim(), plate: plate.trim().toUpperCase() },
      ],
    });
    setLabel('');
    setPlate('');
  };

  return (
    <section>
      <h3 className="label-xs">Véhicules</h3>
      <div className="mt-3 flex flex-wrap gap-2">
        <TextInput
          className="min-w-[200px] flex-1"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="BMW Série 1 118d — 2019"
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), ajouter())}
        />
        <TextInput
          className="w-36"
          value={plate}
          onChange={(e) => setPlate(e.target.value)}
          placeholder="AB-123-CD"
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), ajouter())}
        />
        <AdminButton variant="ghost" onClick={ajouter}>
          <Plus className="h-4 w-4" aria-hidden="true" />
          Ajouter
        </AdminButton>
      </div>

      {client.vehicles.length > 0 ? (
        <ul className="mt-3 space-y-2">
          {client.vehicles.map((v) => (
            <li
              key={v.id}
              className="flex items-center gap-3 rounded-md border border-white/10 bg-ink-900 px-3 py-2"
            >
              <Car className="h-4 w-4 shrink-0 text-faint" aria-hidden="true" />
              <span className="flex-1 text-sm text-muted">{v.label}</span>
              {v.plate ? <span className="num text-xs text-faint">{v.plate}</span> : null}
              <button
                type="button"
                onClick={() => onSave({ vehicles: client.vehicles.filter((x) => x.id !== v.id) })}
                aria-label="Retirer le véhicule"
                className="text-faint transition-colors hover:text-signal-danger"
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}

function ListeInterventions({
  client,
  total,
  onSave,
}: {
  client: Client;
  total: number;
  onSave: (patch: Partial<Client>) => void;
}) {
  const [date, setDate] = useState('');
  const [label, setLabel] = useState('');
  const [amount, setAmount] = useState('');

  const ajouter = () => {
    if (!label.trim()) return;
    const montant = Number(amount);
    onSave({
      interventions: [
        {
          id: `i${Date.now()}`,
          date: date || new Date().toISOString().slice(0, 10),
          label: label.trim(),
          ...(Number.isFinite(montant) && montant > 0 ? { amount: montant } : {}),
        },
        ...client.interventions,
      ],
    });
    setDate('');
    setLabel('');
    setAmount('');
  };

  return (
    <section>
      <div className="flex items-center justify-between">
        <h3 className="label-xs">Interventions</h3>
        {total > 0 ? (
          <span className="num text-xs text-muted">
            Total : <strong className="text-accent">{total.toLocaleString('fr-FR')} €</strong>
          </span>
        ) : null}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <TextInput className="w-40" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <TextInput
          className="min-w-[200px] flex-1"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Correction 2 passes + céramique"
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), ajouter())}
        />
        <TextInput
          className="w-28"
          type="number"
          min={0}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="€"
        />
        <AdminButton variant="ghost" onClick={ajouter}>
          <Plus className="h-4 w-4" aria-hidden="true" />
          Ajouter
        </AdminButton>
      </div>

      {client.interventions.length > 0 ? (
        <ul className="mt-3 space-y-2">
          {client.interventions.map((i) => (
            <li
              key={i.id}
              className="flex items-center gap-3 rounded-md border border-white/10 bg-ink-900 px-3 py-2"
            >
              <Wrench className="h-4 w-4 shrink-0 text-faint" aria-hidden="true" />
              <span className="num w-20 shrink-0 text-xs text-faint">
                {i.date ? i.date.split('-').reverse().slice(0, 2).join('/') : '—'}
              </span>
              <span className="flex-1 text-sm text-muted">{i.label}</span>
              {i.amount ? (
                <span className="num text-sm font-semibold text-fg">
                  {i.amount.toLocaleString('fr-FR')} €
                </span>
              ) : null}
              <button
                type="button"
                onClick={() =>
                  onSave({ interventions: client.interventions.filter((x) => x.id !== i.id) })
                }
                aria-label="Retirer l’intervention"
                className="text-faint transition-colors hover:text-signal-danger"
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
