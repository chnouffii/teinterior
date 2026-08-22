import { useMemo, useState } from 'react';
import { Plus, Search, Trash2, UserPlus } from 'lucide-react';
import { AdminButton, Field, TextInput } from '../components/Field';
import Modal from '../components/Modal';
import StatusPill from '../components/StatusPill';
import { toast } from '../components/toast';
import { useSiteStore } from '../../store/siteStore';
import { useAdminUi } from '../adminUi';
import ClientDetail from '../components/ClientDetail';
import type { Client, ClientStatus } from '../../store/types';

export const CLIENT_STATUSES: Record<ClientStatus, { label: string; tone: string }> = {
  prospect: { label: 'Prospect', tone: 'warn' },
  client: { label: 'Client', tone: 'ok' },
  inactif: { label: 'Inactif', tone: 'neutral' },
};

/** Comparaison souple : les numéros se saisissent avec ou sans espaces. */
export const normaliser = (valeur: string) => valeur.toLowerCase().replace(/[\s.\-_/]/g, '');

const dateCourte = (iso: string) =>
  iso ? new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: '2-digit' }) : '—';

export default function ClientsPage() {
  const clients = useSiteStore((state) => state.clients);
  const leads = useSiteStore((state) => state.leads);
  const creerClient = useSiteStore((state) => state.creerClient);
  const supprimerClient = useSiteStore((state) => state.supprimerClient);
  const { query } = useAdminUi();

  const [filtre, setFiltre] = useState<'tous' | ClientStatus>('tous');
  const [ouvert, setOuvert] = useState<string | null>(null);
  const [creation, setCreation] = useState(false);
  const [nouveau, setNouveau] = useState({ name: '', phone: '', email: '', city: '', source: '' });
  const [aSupprimer, setASupprimer] = useState<Client | null>(null);

  const recherche = normaliser(query);

  const listeFiltree = useMemo(() => {
    return clients
      .filter((c) => (filtre === 'tous' ? true : c.status === filtre))
      .filter((c) => {
        if (!recherche) return true;
        const champs = [
          c.name,
          c.phone,
          c.email,
          c.city,
          ...c.vehicles.map((v) => `${v.label} ${v.plate ?? ''}`),
        ];
        return champs.some((champ) => normaliser(champ ?? '').includes(recherche));
      })
      .sort((a, b) => (b.updatedAt ?? '').localeCompare(a.updatedAt ?? ''));
  }, [clients, filtre, recherche]);

  const aujourdhui = new Date().toISOString().slice(0, 10);
  const relancesDues = clients.filter((c) => c.nextAction && c.nextAction.date <= aujourdhui);

  const compte = (statut: 'tous' | ClientStatus) =>
    statut === 'tous' ? clients.length : clients.filter((c) => c.status === statut).length;

  const clientOuvert = clients.find((c) => c.id === ouvert) ?? null;

  async function creer() {
    const nom = nouveau.name.trim();
    if (!nom) {
      toast('Le nom est obligatoire.', 'danger');
      return;
    }
    try {
      const cree = await creerClient(nouveau);
      setCreation(false);
      setNouveau({ name: '', phone: '', email: '', city: '', source: '' });
      setOuvert(cree.id);
      toast('Fiche créée.');
    } catch (erreur) {
      toast((erreur as Error).message, 'danger');
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-lg font-bold text-fg">Clients</h1>
          <p className="mt-1 text-xs text-faint">
            {clients.length} fiche{clients.length > 1 ? 's' : ''} · l’historique, les véhicules et
            les notes de chacun.
          </p>
        </div>
        <AdminButton onClick={() => setCreation(true)}>
          <Plus className="h-4 w-4" aria-hidden="true" />
          Nouvelle fiche
        </AdminButton>
      </div>

      {relancesDues.length > 0 ? (
        <section className="rounded-lg border border-accent/30 bg-accent/5 p-4">
          <h2 className="text-sm font-semibold text-accent">
            {relancesDues.length} relance{relancesDues.length > 1 ? 's' : ''} à faire
          </h2>
          <ul className="mt-2 space-y-1.5">
            {relancesDues.map((c) => (
              <li key={c.id} className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                <button
                  type="button"
                  onClick={() => setOuvert(c.id)}
                  className="font-medium text-fg underline-offset-2 hover:underline"
                >
                  {c.name}
                </button>
                <span className="text-muted">{c.nextAction?.label || 'Relance'}</span>
                <span className="num text-xs text-faint">
                  prévue le {dateCourte(c.nextAction!.date)}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <div className="flex flex-wrap gap-2">
        {(['tous', 'prospect', 'client', 'inactif'] as const).map((statut) => (
          <button
            key={statut}
            type="button"
            onClick={() => setFiltre(statut)}
            className={`inline-flex min-h-[38px] items-center gap-2 rounded-md border px-3 text-sm transition-colors ${
              filtre === statut
                ? 'border-accent/50 bg-accent/10 text-accent'
                : 'border-white/10 text-muted hover:border-white/20 hover:text-fg'
            }`}
          >
            {statut === 'tous' ? 'Tous' : CLIENT_STATUSES[statut].label}
            <span className="num text-xs text-faint">{compte(statut)}</span>
          </button>
        ))}
      </div>

      {listeFiltree.length === 0 ? (
        <p className="panel px-5 py-10 text-center text-sm text-faint">
          {clients.length === 0 ? (
            <>
              Aucune fiche pour l’instant. Créez-en une, ou rattachez une demande entrante depuis
              l’écran <strong className="text-muted">Demandes</strong>.
            </>
          ) : (
            <>
              <Search className="mx-auto mb-2 h-4 w-4" aria-hidden="true" />
              Aucune fiche ne correspond à cette recherche.
            </>
          )}
        </p>
      ) : (
        <div className="panel overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left">
                <th className="label-xs px-4 py-3">Client</th>
                <th className="label-xs px-4 py-3">Contact</th>
                <th className="label-xs px-4 py-3">Véhicules</th>
                <th className="label-xs px-4 py-3">Demandes</th>
                <th className="label-xs px-4 py-3">Suivi</th>
                <th className="label-xs px-4 py-3">Statut</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {listeFiltree.map((c) => {
                const meta = CLIENT_STATUSES[c.status];
                const demandes = leads.filter((d) => d.clientId === c.id).length;
                return (
                  <tr
                    key={c.id}
                    className="border-b border-white/5 transition-colors last:border-0 hover:bg-white/[0.02]"
                  >
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => setOuvert(c.id)}
                        className="text-left font-medium text-fg underline-offset-2 hover:underline"
                      >
                        {c.name}
                      </button>
                      <p className="text-[11px] text-faint">
                        {c.city || '—'} · depuis le {dateCourte(c.createdAt)}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      {c.phone ? (
                        <a href={`tel:${c.phone.replace(/\s/g, '')}`} className="num text-muted hover:text-accent">
                          {c.phone}
                        </a>
                      ) : (
                        <span className="text-faint">—</span>
                      )}
                      <p className="truncate text-[11px] text-faint">{c.email || ''}</p>
                    </td>
                    <td className="px-4 py-3 text-muted">
                      {c.vehicles.length > 0 ? (
                        <>
                          <p className="truncate">{c.vehicles[0].label}</p>
                          {c.vehicles.length > 1 ? (
                            <p className="text-[11px] text-faint">
                              +{c.vehicles.length - 1} autre{c.vehicles.length > 2 ? 's' : ''}
                            </p>
                          ) : null}
                        </>
                      ) : (
                        <span className="text-faint">—</span>
                      )}
                    </td>
                    <td className="num px-4 py-3 text-muted">{demandes || '—'}</td>
                    <td className="px-4 py-3">
                      <span className="num text-xs text-faint">{dateCourte(c.updatedAt)}</span>
                      <p className="text-[11px] text-faint">
                        {c.notes.length} note{c.notes.length > 1 ? 's' : ''}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <StatusPill label={meta.label} tone={meta.tone} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => setASupprimer(c)}
                        aria-label={`Supprimer la fiche de ${c.name}`}
                        className="text-faint transition-colors hover:text-signal-danger"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {clientOuvert ? (
        <ClientDetail client={clientOuvert} onClose={() => setOuvert(null)} />
      ) : null}

      {creation ? (
        <Modal
          title="Nouvelle fiche client"
          subtitle="Le nom suffit pour commencer ; le reste se complète au fil des échanges."
          onClose={() => setCreation(false)}
          footer={
            <>
              <AdminButton variant="ghost" onClick={() => setCreation(false)}>
                Annuler
              </AdminButton>
              <AdminButton onClick={creer}>
                <UserPlus className="h-4 w-4" aria-hidden="true" />
                Créer la fiche
              </AdminButton>
            </>
          }
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nom et prénom">
              <TextInput
                autoFocus
                value={nouveau.name}
                onChange={(e) => setNouveau({ ...nouveau, name: e.target.value })}
              />
            </Field>
            <Field label="Téléphone">
              <TextInput
                value={nouveau.phone}
                onChange={(e) => setNouveau({ ...nouveau, phone: e.target.value })}
              />
            </Field>
            <Field label="Email">
              <TextInput
                value={nouveau.email}
                onChange={(e) => setNouveau({ ...nouveau, email: e.target.value })}
              />
            </Field>
            <Field label="Ville">
              <TextInput
                value={nouveau.city}
                onChange={(e) => setNouveau({ ...nouveau, city: e.target.value })}
              />
            </Field>
            <Field label="Origine" hint="Site, recommandation, passage à l’atelier…">
              <TextInput
                value={nouveau.source}
                onChange={(e) => setNouveau({ ...nouveau, source: e.target.value })}
              />
            </Field>
          </div>
        </Modal>
      ) : null}

      {aSupprimer ? (
        <Modal
          title={`Supprimer la fiche de ${aSupprimer.name} ?`}
          subtitle="Les demandes entrantes rattachées sont conservées, mais perdent leur lien vers cette fiche."
          onClose={() => setASupprimer(null)}
          footer={
            <>
              <AdminButton variant="ghost" onClick={() => setASupprimer(null)}>
                Annuler
              </AdminButton>
              <AdminButton
                variant="danger"
                onClick={async () => {
                  try {
                    await supprimerClient(aSupprimer.id);
                    toast('Fiche supprimée.', 'info');
                  } catch (erreur) {
                    toast((erreur as Error).message, 'danger');
                  }
                  setASupprimer(null);
                }}
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
                Supprimer définitivement
              </AdminButton>
            </>
          }
        >
          <p className="text-sm text-muted">
            {aSupprimer.notes.length} note{aSupprimer.notes.length > 1 ? 's' : ''} et{' '}
            {aSupprimer.interventions.length} intervention
            {aSupprimer.interventions.length > 1 ? 's' : ''} seront effacées. Cette action est
            irréversible.
          </p>
        </Modal>
      ) : null}
    </div>
  );
}
