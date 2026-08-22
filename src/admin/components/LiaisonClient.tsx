import { useMemo, useState } from 'react';
import { Link2, UserPlus, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AdminButton, Select } from './Field';
import { toast } from './toast';
import { useSiteStore } from '../../store/siteStore';
import { normaliser } from '../pages/ClientsPage';
import type { Lead } from '../../store/types';

/**
 * Rattachement d'une demande entrante à une fiche client.
 *
 * Les doublons sont fréquents : un même client redemande un devis six mois plus
 * tard, avec le même téléphone. On propose donc les fiches déjà existantes qui
 * partagent son numéro ou son email avant de laisser en créer une nouvelle.
 */
export default function LiaisonClient({ lead }: { lead: Lead }) {
  const clients = useSiteStore((state) => state.clients);
  const creerClient = useSiteStore((state) => state.creerClient);
  const rattacherDemande = useSiteStore((state) => state.rattacherDemande);
  const [enCours, setEnCours] = useState(false);
  const [choix, setChoix] = useState('');

  const rattachee = clients.find((c) => c.id === lead.clientId) ?? null;

  const correspondances = useMemo(() => {
    const tel = normaliser(lead.phone ?? '');
    const mail = normaliser(lead.email ?? '');
    const nom = normaliser(lead.name ?? '');
    return clients.filter((c) => {
      if (tel && normaliser(c.phone) === tel) return true;
      if (mail && normaliser(c.email) === mail) return true;
      return Boolean(nom) && normaliser(c.name) === nom;
    });
  }, [clients, lead]);

  async function creerDepuisDemande() {
    setEnCours(true);
    try {
      // Une demande « vendre ma voiture » est déjà un dépôt-vente en puissance :
      // on ouvre l'affaire directement, avec le prix espéré saisi par le client.
      const depot =
        lead.type === 'estimation' && lead.vehicle
          ? [
              {
                id: `d${Date.now()}`,
                vehicle: lead.vehicle,
                plate: lead.plate ?? '',
                status: 'a_estimer' as const,
                expectedPrice: lead.expectedPrice,
                startedAt: new Date().toISOString().slice(0, 10),
                notes: lead.message ?? '',
              },
            ]
          : [];

      const cree = await creerClient({
        name: lead.name,
        phone: lead.phone,
        email: lead.email,
        source: `Site — ${lead.type === 'estimation' ? 'estimation' : 'devis'}`,
        status: 'prospect',
        vehicles: lead.vehicle
          ? [{ id: `v${Date.now()}`, label: lead.vehicle, plate: lead.plate ?? '' }]
          : [],
        consignments: depot,
      });
      await rattacherDemande(lead.id, cree.id);
      toast('Fiche client créée et demande rattachée.');
    } catch (erreur) {
      toast((erreur as Error).message, 'danger');
    }
    setEnCours(false);
  }

  async function rattacher(id: string) {
    if (!id) return;
    setEnCours(true);
    try {
      await rattacherDemande(lead.id, id);
      toast('Demande rattachée à la fiche.');
    } catch (erreur) {
      toast((erreur as Error).message, 'danger');
    }
    setEnCours(false);
  }

  if (rattachee) {
    return (
      <div className="rounded-md border border-white/10 bg-ink-850 p-4">
        <span className="field-label">Fiche client</span>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/admin/clients"
            className="text-sm font-semibold text-accent underline-offset-2 hover:underline"
          >
            {rattachee.name}
          </Link>
          <span className="text-xs text-faint">
            {rattachee.notes.length} note{rattachee.notes.length > 1 ? 's' : ''} ·{' '}
            {rattachee.interventions.length} intervention
            {rattachee.interventions.length > 1 ? 's' : ''}
          </span>
          <button
            type="button"
            disabled={enCours}
            onClick={async () => {
              setEnCours(true);
              await rattacherDemande(lead.id, null);
              setEnCours(false);
              toast('Demande détachée.', 'info');
            }}
            className="ml-auto inline-flex items-center gap-1 text-[11px] text-faint transition-colors hover:text-signal-danger"
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />
            Détacher
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-md border border-white/10 bg-ink-850 p-4">
      <span className="field-label">Fiche client</span>

      {correspondances.length > 0 ? (
        <div className="mb-3 rounded border border-accent/30 bg-accent/5 px-3 py-2">
          <p className="text-xs text-accent">
            {correspondances.length === 1
              ? 'Une fiche existe déjà avec ces coordonnées :'
              : 'Des fiches existent déjà avec ces coordonnées :'}
          </p>
          <ul className="mt-1.5 space-y-1">
            {correspondances.map((c) => (
              <li key={c.id} className="flex items-center gap-2 text-sm">
                <span className="text-fg">{c.name}</span>
                <span className="num text-[11px] text-faint">{c.phone}</span>
                <button
                  type="button"
                  disabled={enCours}
                  onClick={() => rattacher(c.id)}
                  className="ml-auto inline-flex items-center gap-1 text-[11px] font-semibold text-accent hover:underline"
                >
                  <Link2 className="h-3.5 w-3.5" aria-hidden="true" />
                  Rattacher
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="flex flex-wrap items-end gap-2">
        <div className="min-w-[200px] flex-1">
          <Select value={choix} onChange={(e) => setChoix(e.target.value)} disabled={enCours}>
            <option value="">Rattacher à une fiche existante…</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
                {c.phone ? ` — ${c.phone}` : ''}
              </option>
            ))}
          </Select>
        </div>
        <AdminButton variant="ghost" disabled={!choix || enCours} onClick={() => rattacher(choix)}>
          <Link2 className="h-4 w-4" aria-hidden="true" />
          Rattacher
        </AdminButton>
        <AdminButton disabled={enCours} onClick={creerDepuisDemande}>
          <UserPlus className="h-4 w-4" aria-hidden="true" />
          Créer une fiche
        </AdminButton>
      </div>
    </div>
  );
}
