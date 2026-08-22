import { useMemo, useState } from 'react';
import { Mail, Phone, Trash2 } from 'lucide-react';
import Modal from '../components/Modal';
import StatusPill from '../components/StatusPill';
import { AdminButton, Select } from '../components/Field';
import { toast } from '../components/toast';
import { useAdminUi } from '../adminUi';
import { useSiteStore } from '../../store/siteStore';
import { LEAD_STATUSES, LEAD_TYPES } from '../../data/leads.js';
import type { Lead, LeadStatus } from '../../store/types';

const STATUS_ORDER: LeadStatus[] = ['nouveau', 'contacte', 'rdv', 'cloture'];
const statusMeta = LEAD_STATUSES as Record<string, { label: string; tone: string }>;
const typeMeta = LEAD_TYPES as Record<string, { label: string }>;

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });

export default function LeadsPage() {
  const leads = useSiteStore((state) => state.leads);
  const setLeadStatus = useSiteStore((state) => state.setLeadStatus);
  const removeLead = useSiteStore((state) => state.removeLead);
  const query = useAdminUi((state) => state.query);

  const [typeFilter, setTypeFilter] = useState<'tous' | 'estimation' | 'devis'>('tous');
  const [statusFilter, setStatusFilter] = useState<'tous' | LeadStatus>('tous');
  const [opened, setOpened] = useState<Lead | null>(null);

  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return leads
      .filter((lead) => (typeFilter === 'tous' ? true : lead.type === typeFilter))
      .filter((lead) => (statusFilter === 'tous' ? true : lead.status === statusFilter))
      .filter((lead) =>
        needle
          ? `${lead.id} ${lead.name} ${lead.email} ${lead.phone} ${lead.vehicle ?? ''} ${lead.service ?? ''}`
              .toLowerCase()
              .includes(needle)
          : true
      );
  }, [leads, typeFilter, statusFilter, query]);

  const counts = useMemo(
    () =>
      STATUS_ORDER.map((status) => ({
        status,
        label: statusMeta[status].label,
        count: leads.filter((lead) => lead.status === status).length,
      })),
    [leads]
  );

  return (
    <div>
      <h1 className="text-lg font-semibold text-fg">Demandes entrantes</h1>
      <p className="mt-1 text-xs text-faint">
        Formulaires « vendre ma voiture » et demandes de devis du site public.
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-4">
        {counts.map((item) => (
          <button
            key={item.status}
            type="button"
            onClick={() => setStatusFilter(statusFilter === item.status ? 'tous' : item.status)}
            className={`rounded-lg border p-4 text-left transition-colors ${
              statusFilter === item.status
                ? 'border-accent/50 bg-accent/5'
                : 'border-ink-700 bg-ink-900 hover:border-ink-600'
            }`}
          >
            <span className="num block text-2xl font-semibold text-fg">{item.count}</span>
            <span className="mt-1 block text-xs text-faint">{item.label}</span>
          </button>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {(['tous', 'estimation', 'devis'] as const).map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setTypeFilter(type)}
            className={`inline-flex min-h-[34px] items-center rounded-md border px-3 text-xs font-semibold transition-colors ${
              typeFilter === type
                ? 'border-accent/50 bg-accent/10 text-accent'
                : 'border-ink-700 text-muted hover:border-ink-600 hover:text-fg'
            }`}
          >
            {type === 'tous' ? 'Toutes' : typeMeta[type].label}
          </button>
        ))}
      </div>

      <div className="mt-5 overflow-x-auto rounded-lg border border-ink-700">
        <table className="w-full min-w-[820px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-ink-700 bg-ink-850 text-left">
              {['Réf.', 'Reçue le', 'Type', 'Contact', 'Objet', 'Statut', ''].map((head, index) => (
                <th
                  key={head || index}
                  className="px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-faint"
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((lead) => (
              <tr
                key={lead.id}
                className="cursor-pointer border-b border-ink-800 last:border-0 hover:bg-ink-850/60"
                onClick={() => setOpened(lead)}
              >
                <td className="num px-3 py-2.5 text-xs text-faint">{lead.id}</td>
                <td className="num px-3 py-2.5 text-xs text-muted">{formatDate(lead.createdAt)}</td>
                <td className="px-3 py-2.5 text-xs text-muted">{typeMeta[lead.type].label}</td>
                <td className="px-3 py-2.5">
                  <span className="block font-medium text-fg">{lead.name}</span>
                  <span className="num block text-xs text-faint">{lead.phone}</span>
                </td>
                <td className="max-w-[16rem] truncate px-3 py-2.5 text-muted">
                  {lead.vehicle ?? lead.service}
                </td>
                <td className="px-3 py-2.5">
                  <StatusPill label={statusMeta[lead.status].label} tone={statusMeta[lead.status].tone} />
                </td>
                <td className="px-3 py-2.5 text-right">
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      removeLead(lead.id);
                      toast('Demande supprimée.', 'danger');
                    }}
                    title="Supprimer"
                    className="flex h-8 w-8 items-center justify-center rounded text-faint transition-colors hover:bg-ink-800 hover:text-signal-danger"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {rows.length === 0 ? (
          <p className="px-4 py-10 text-center text-sm text-faint">Aucune demande à afficher.</p>
        ) : null}
      </div>

      {opened ? (
        <Modal
          title={`${opened.name} — ${opened.id}`}
          subtitle={formatDate(opened.createdAt)}
          onClose={() => setOpened(null)}
          footer={
            <AdminButton variant="ghost" onClick={() => setOpened(null)}>
              Fermer
            </AdminButton>
          }
        >
          <div className="space-y-5">
            <div className="grid gap-3 sm:grid-cols-2">
              <a
                href={`tel:${opened.phone.replace(/\s/g, '')}`}
                className="flex items-center gap-2.5 rounded-md border border-ink-700 bg-ink-850 px-3 py-2.5 text-sm text-muted transition-colors hover:text-fg"
              >
                <Phone className="h-4 w-4 text-accent" aria-hidden="true" />
                <span className="num">{opened.phone}</span>
              </a>
              <a
                href={`mailto:${opened.email}`}
                className="flex items-center gap-2.5 rounded-md border border-ink-700 bg-ink-850 px-3 py-2.5 text-sm text-muted transition-colors hover:text-fg"
              >
                <Mail className="h-4 w-4 text-accent" aria-hidden="true" />
                <span className="truncate">{opened.email}</span>
              </a>
            </div>

            <dl className="space-y-3 rounded-md border border-ink-700 bg-ink-850 p-4 text-sm">
              {opened.vehicle ? (
                <div>
                  <dt className="label-xs">Véhicule</dt>
                  <dd className="mt-1 text-fg">{opened.vehicle}</dd>
                </div>
              ) : null}
              {opened.expectedPrice ? (
                <div>
                  <dt className="label-xs">Prix espéré</dt>
                  <dd className="num mt-1 text-fg">
                    {opened.expectedPrice.toLocaleString('fr-FR')} €
                  </dd>
                </div>
              ) : null}
              {opened.service ? (
                <div>
                  <dt className="label-xs">Prestation demandée</dt>
                  <dd className="mt-1 text-fg">{opened.service}</dd>
                </div>
              ) : null}
              {opened.plate ? (
                <div>
                  <dt className="label-xs">Immatriculation</dt>
                  <dd className="num mt-1 text-fg">{opened.plate}</dd>
                </div>
              ) : null}
              <div>
                <dt className="label-xs">Message</dt>
                <dd className="mt-1 leading-relaxed text-muted">{opened.message}</dd>
              </div>
            </dl>

            <div>
              <span className="field-label">Suivi</span>
              <Select
                value={opened.status}
                onChange={(event) => {
                  const status = event.target.value as LeadStatus;
                  setLeadStatus(opened.id, status);
                  setOpened({ ...opened, status });
                  toast('Statut mis à jour.');
                }}
              >
                {STATUS_ORDER.map((status) => (
                  <option key={status} value={status}>
                    {statusMeta[status].label}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        </Modal>
      ) : null}
    </div>
  );
}
