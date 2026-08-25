import { useMemo, useState } from 'react';
import { BellOff, CalendarClock, Check, Plus, Search, Trash2, UserPlus } from 'lucide-react';
import { AdminButton, Field, TextInput } from '../components/Field';
import Modal from '../components/Modal';
import StatusPill from '../components/StatusPill';
import { toast } from '../components/toast';
import { useSiteStore } from '../../store/siteStore';
import { useAdminUi } from '../adminUi';
import ClientDetail from '../components/ClientDetail';
import { DEPOT_CLOS, RECHERCHE_CLOSE } from '../components/ClientProjets';
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
  const modifierClient = useSiteStore((state) => state.modifierClient);
  const { query } = useAdminUi();

  const [filtre, setFiltre] = useState<'tous' | ClientStatus>('tous');
  const [affaire, setAffaire] = useState<'toutes' | 'depot' | 'recherche'>('toutes');
  const [ouvert, setOuvert] = useState<string | null>(null);
  const [creation, setCreation] = useState(false);
  const [nouveau, setNouveau] = useState({ name: '', phone: '', email: '', city: '', source: '' });
  const [aSupprimer, setASupprimer] = useState<Client | null>(null);

  const recherche = normaliser(query);

  const depotsEnCours = (c: Client) =>
    (c.consignments ?? []).filter((d) => !DEPOT_CLOS.includes(d.status));
  const recherchesEnCours = (c: Client) =>
    (c.searches ?? []).filter((r) => !RECHERCHE_CLOSE.includes(r.status));

  const listeFiltree = useMemo(() => {
    return clients
      .filter((c) => (filtre === 'tous' ? true : c.status === filtre))
      .filter((c) => {
        if (affaire === 'depot') return depotsEnCours(c).length > 0;
        if (affaire === 'recherche') return recherchesEnCours(c).length > 0;
        return true;
      })
      .filter((c) => {
        if (!recherche) return true;
        const champs = [
          c.name,
          c.phone,
          c.email,
          c.city,
          ...c.vehicles.map((v) => `${v.label} ${v.plate ?? ''}`),
          ...(c.consignments ?? []).map((d) => `${d.vehicle} ${d.plate ?? ''}`),
          ...(c.searches ?? []).map((r) => r.brief),
        ];
        return champs.some((champ) => normaliser(champ ?? '').includes(recherche));
      })
      .sort((a, b) => (b.updatedAt ?? '').localeCompare(a.updatedAt ?? ''));
  }, [clients, filtre, affaire, recherche]);

  const aujourdhui = new Date().toISOString().slice(0, 10);

  /**
   * Rappel mis en veille pour la journée.
   *
   * Gardé dans le navigateur et non sur le serveur : c'est un confort
   * d'affichage propre à la personne devant l'écran, pas une donnée de
   * l'atelier. On enregistre le jour du masquage plutôt qu'un simple drapeau,
   * pour que le rappel revienne de lui-même le lendemain.
   */
  const [masqueLe, setMasqueLe] = useState(() => {
    try {
      return localStorage.getItem('teinterior:relances-masquees') ?? '';
    } catch {
      // Navigation privée ou stockage refusé : le rappel reste affiché.
      return '';
    }
  });

  const setRelancesMasquees = (actif: boolean) => {
    const valeur = actif ? aujourdhui : '';
    setMasqueLe(valeur);
    try {
      if (valeur) localStorage.setItem('teinterior:relances-masquees', valeur);
      else localStorage.removeItem('teinterior:relances-masquees');
    } catch {
      /* sans stockage, le masquage ne dure que le temps de la visite */
    }
  };

  const relancesDues =
    masqueLe === aujourdhui
      ? []
      : clients.filter((c) => c.nextAction && c.nextAction.date <= aujourdhui);

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

      {/*
        Chaque relance se traite depuis le bandeau : la retirer ou la repousser
        demandait jusqu'ici d'ouvrir la fiche, de trouver le bloc « Relance à
        venir » et de revenir. Une alerte qu'on ne peut pas éteindre là où on la
        lit finit par être ignorée.
      */}
      {relancesDues.length > 0 ? (
        <section className="rounded-lg border border-accent/30 bg-accent/5 p-4">
          <h2 className="text-sm font-semibold text-accent">
            {relancesDues.length} relance{relancesDues.length > 1 ? 's' : ''} à faire
          </h2>
          <ul className="mt-3 divide-y divide-accent/10">
            {relancesDues.map((c) => (
              <li
                key={c.id}
                className="flex flex-wrap items-center gap-x-3 gap-y-2 py-2 text-sm first:pt-0 last:pb-0"
              >
                <button
                  type="button"
                  onClick={() => setOuvert(c.id)}
                  className="font-medium text-fg underline-offset-2 hover:underline"
                >
                  {c.name}
                </button>
                <span className="min-w-0 flex-1 text-muted">{c.nextAction?.label || 'Relance'}</span>
                <span className="num text-xs text-faint">
                  prévue le {dateCourte(c.nextAction!.date)}
                </span>

                <span className="flex shrink-0 items-center gap-1">
                  <button
                    type="button"
                    title="Relance faite — retirer de la liste"
                    onClick={async () => {
                      await modifierClient(c.id, { nextAction: null });
                      toast(`Relance de ${c.name} marquée comme faite.`);
                    }}
                    className="flex h-8 items-center gap-1.5 rounded-md border border-white/10 px-2.5 text-xs text-muted transition-colors hover:border-signal-ok/40 hover:text-signal-ok"
                  >
                    <Check className="h-3.5 w-3.5" aria-hidden="true" />
                    Fait
                  </button>
                  <button
                    type="button"
                    title="Repousser d’une semaine"
                    onClick={async () => {
                      const dans7 = new Date(`${c.nextAction!.date}T12:00:00`);
                      // À partir d'aujourd'hui si la date est déjà passée :
                      // repousser une relance en retard d'une semaine depuis sa
                      // date d'origine la laisserait souvent en retard.
                      const base = dans7 < new Date() ? new Date() : dans7;
                      base.setDate(base.getDate() + 7);
                      const date = base.toISOString().slice(0, 10);
                      await modifierClient(c.id, {
                        nextAction: { date, label: c.nextAction!.label },
                      });
                      toast(`Relance de ${c.name} repoussée au ${dateCourte(date)}.`);
                    }}
                    className="flex h-8 items-center gap-1.5 rounded-md border border-white/10 px-2.5 text-xs text-muted transition-colors hover:border-white/25 hover:text-fg"
                  >
                    <CalendarClock className="h-3.5 w-3.5" aria-hidden="true" />
                    +7 j
                  </button>
                </span>
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={() => setRelancesMasquees(true)}
            className="mt-3 inline-flex items-center gap-1.5 text-[11px] text-faint transition-colors hover:text-muted"
          >
            <BellOff className="h-3.5 w-3.5" aria-hidden="true" />
            Masquer ce rappel jusqu’à demain
          </button>
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

      <div className="flex flex-wrap gap-2">
        {(
          [
            ['toutes', 'Toutes les affaires'],
            ['depot', 'Dépôt-vente en cours'],
            ['recherche', 'Recherche en cours'],
          ] as const
        ).map(([id, libelle]) => {
          const nombre =
            id === 'depot'
              ? clients.filter((c) => depotsEnCours(c).length > 0).length
              : id === 'recherche'
                ? clients.filter((c) => recherchesEnCours(c).length > 0).length
                : clients.length;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setAffaire(id)}
              className={`inline-flex min-h-[38px] items-center gap-2 rounded-md border px-3 text-sm transition-colors ${
                affaire === id
                  ? 'border-accent/50 bg-accent/10 text-accent'
                  : 'border-white/10 text-muted hover:border-white/20 hover:text-fg'
              }`}
            >
              {libelle}
              <span className="num text-xs text-faint">{nombre}</span>
            </button>
          );
        })}
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
                <th className="label-xs px-4 py-3">Affaires</th>
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
                    <td className="px-4 py-3">
                      <div className="flex flex-col items-start gap-1">
                        {depotsEnCours(c).length > 0 ? (
                          <StatusPill
                            label={`Dépôt ×${depotsEnCours(c).length}`}
                            tone="accent"
                          />
                        ) : null}
                        {recherchesEnCours(c).length > 0 ? (
                          <StatusPill
                            label={`Recherche ×${recherchesEnCours(c).length}`}
                            tone="warn"
                          />
                        ) : null}
                        {depotsEnCours(c).length === 0 && recherchesEnCours(c).length === 0 ? (
                          <span className="text-faint">—</span>
                        ) : null}
                      </div>
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
