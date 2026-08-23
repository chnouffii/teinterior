import { useEffect, useMemo, useRef, useState } from 'react';
import { Check, Clock, ExternalLink, Mail, MapPin, MessageCircle, Paperclip, Phone, RotateCcw, Send, Trash2 } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading.jsx';
import Reveal from '../ui/Reveal.jsx';
import Button from '../ui/Button.jsx';
import { choixDePrestation, libelleDePrestation, primaryPhone } from '../../data/site.js';
import { useSiteStore } from '../../store/siteStore';
import { sendLead } from '../../lib/sendLead.js';
import { formaterPlaque, formaterTelephone } from '../../lib/format.js';
import { useQuote } from '../../context/QuoteContext.jsx';

const EMPTY = { service: '', name: '', phone: '', email: '', plate: '', message: '', consent: false };
const PLATE = /^[A-Z]{2}-?[0-9]{3}-?[A-Z]{2}$/;

function validate(form) {
  const errors = {};
  if (!form.service) errors.service = 'Choisissez la prestation.';
  if (!form.name.trim()) errors.name = 'Nom requis.';
  if (form.phone.replace(/[^0-9+]/g, '').length < 10) errors.phone = 'Numéro incomplet.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email)) errors.email = 'Email invalide.';
  if (form.plate.trim() && !PLATE.test(form.plate.trim().toUpperCase()))
    errors.plate = 'Format attendu : AB-123-CD.';
  if (form.message.trim().length < 12) errors.message = 'Décrivez votre besoin en quelques mots.';
  if (!form.consent) errors.consent = 'Merci d’accepter le traitement des données.';
  return errors;
}

const formatSize = (bytes) => {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
};

function WorkshopMap({ contact }) {
  return (
    <div className="overflow-hidden rounded-lg border border-white/10 bg-ink-900">
      <svg viewBox="0 0 600 280" className="h-48 w-full sm:h-56" role="img" aria-label="Plan d’accès">
        <rect width="600" height="280" fill="#11141A" />
        <g stroke="#1E232B" strokeWidth="14">
          <line x1="-20" y1="86" x2="620" y2="98" />
          <line x1="-20" y1="212" x2="620" y2="202" />
          <line x1="150" y1="-20" x2="128" y2="300" />
          <line x1="430" y1="-20" x2="458" y2="300" />
        </g>
        <g stroke="#2A303A" strokeWidth="4">
          <line x1="-20" y1="150" x2="620" y2="154" />
          <line x1="290" y1="-20" x2="286" y2="300" />
        </g>
        <g fill="#171B22">
          <rect x="34" y="112" width="76" height="30" rx="2" />
          <rect x="180" y="114" width="82" height="28" rx="2" />
          <rect x="330" y="108" width="72" height="34" rx="2" />
          <rect x="330" y="176" width="94" height="24" rx="2" />
          <rect x="490" y="116" width="78" height="36" rx="2" />
        </g>
        <rect x="272" y="136" width="34" height="34" rx="2" fill="#5B8DEF" opacity="0.18" />
        <path
          d="M289 138c-7 0-12.6 5.6-12.6 12.6 0 9.4 12.6 22 12.6 22s12.6-12.6 12.6-22c0-7-5.6-12.6-12.6-12.6Zm0 17.2a4.7 4.7 0 1 1 0-9.4 4.7 4.7 0 0 1 0 9.4Z"
          fill="#5B8DEF"
        />
      </svg>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 px-4 py-3">
        <div className="text-sm">
          <p className="font-medium text-fg">{contact.address.street}</p>
          <p className="text-xs text-muted">
            {[contact.address.zone, contact.address.city].filter(Boolean).join(' — ')}
          </p>
        </div>
        <Button
          as="a"
          href={contact.address.mapsUrl}
          target="_blank"
          rel="noreferrer noopener"
          variant="secondary"
          size="sm"
          iconRight={ExternalLink}
        >
          Itinéraire
        </Button>
      </div>
    </div>
  );
}

function QuoteForm() {
  const { prefill } = useQuote();
  const addLead = useSiteStore((state) => state.addLead);
  const [form, setForm] = useState(EMPTY);
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const contact = useSiteStore((state) => state.contact);
  const [sent, setSent] = useState(null);
  const [envoiEnCours, setEnvoiEnCours] = useState(false);
  const [envoiErreur, setEnvoiErreur] = useState(null);

  // La liste suit le catalogue publié : une prestation renommée, ajoutée ou
  // supprimée depuis le panel se répercute ici sans rien recopier.
  const packs = useSiteStore((state) => state.packs);
  const optionsCarte = useSiteStore((state) => state.options);
  const groupes = useMemo(() => choixDePrestation(packs, optionsCarte), [packs, optionsCarte]);
  const fileInputRef = useRef(null);
  const formRef = useRef(null);

  useEffect(() => {
    if (!prefill) return;
    setSent(null);
    setForm((previous) => {
      // Un lien de devis peut viser une prestation entre-temps supprimée : on
      // bascule sur « Autre demande » plutôt que de laisser le menu vide, le
      // message pré-rempli disant déjà ce que le visiteur veut.
      const demande = prefill.service ?? previous.service;
      const connue = demande && libelleDePrestation(groupes, demande) !== null;
      return {
        ...previous,
        service: demande ? (connue ? demande : 'autre') : previous.service,
        message: prefill.message ?? previous.message,
      };
    });
    setErrors({});
    window.setTimeout(() => {
      formRef.current?.querySelector('#contact-name')?.focus({ preventScroll: true });
    }, 300);
  }, [prefill, groupes]);

  // Mise en forme à la frappe : le visiteur voit tout de suite si sa saisie
  // prend la bonne forme, au lieu de l'apprendre en validant.
  const FORMATEURS = { phone: formaterTelephone, plate: formaterPlaque };

  const update = (field) => (event) => {
    const brut = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    const value = FORMATEURS[field] ? FORMATEURS[field](brut) : brut;
    setForm((previous) => ({ ...previous, [field]: value }));
    setErrors((previous) => {
      if (!previous[field]) return previous;
      const next = { ...previous };
      delete next[field];
      return next;
    });
  };

  const blur = (field) => () => {
    const all = validate(form);
    setErrors((previous) => {
      const next = { ...previous };
      if (all[field]) next[field] = all[field];
      else delete next[field];
      return next;
    });
  };

  const handleFiles = (event) => {
    const selected = Array.from(event.target.files ?? []).map((file) => ({
      id: `${file.name}-${file.size}-${file.lastModified}`,
      name: file.name,
      size: file.size,
    }));
    setFiles((previous) => {
      const merged = [...previous];
      selected.forEach((file) => {
        if (!merged.some((item) => item.id === file.id)) merged.push(file);
      });
      return merged.slice(0, 6);
    });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const submit = async (event) => {
    event.preventDefault();
    const nextErrors = validate(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      document.getElementById(`contact-${Object.keys(nextErrors)[0]}`)?.focus();
      return;
    }

    const serviceLabel = libelleDePrestation(groupes, form.service) ?? 'Demande';
    const message = `${form.message}${
      files.length > 0 ? ` — ${files.length} pièce(s) jointe(s), à demander au client` : ''
    }`;

    setEnvoiErreur(null);
    setEnvoiEnCours(true);

    // L'enregistrement sur le serveur fait foi : c'est lui qui garantit que la
    // demande apparaîtra dans le panel. S'il échoue, on ne confirme rien.
    let lead;
    try {
      lead = await addLead({
        type: 'devis',
        name: form.name,
        phone: form.phone,
        email: form.email,
        service: serviceLabel,
        plate: form.plate.toUpperCase(),
        message,
      });
    } catch (error) {
      setEnvoiErreur(error.message || "L'enregistrement de votre demande a échoué.");
      setEnvoiEnCours(false);
      return;
    }

    // Notification par email, au mieux : la demande est déjà sauvegardée, un
    // échec d'envoi ne doit pas inquiéter le visiteur ni perdre sa demande.
    try {
      await sendLead({
        sujet: `Devis — ${serviceLabel} — ${form.name}`,
        replyTo: form.email,
        champs: {
          Référence: lead.id,
          Prestation: serviceLabel,
          Nom: form.name,
          Téléphone: form.phone,
          Email: form.email,
          Immatriculation: form.plate.toUpperCase() || '—',
          Message: message,
        },
      });
    } catch (error) {
      console.warn('Notification email non envoyée :', error.message);
    }

    setEnvoiEnCours(false);
    setSent({ reference: lead.id, name: form.name, phone: form.phone, service: serviceLabel });
  };

  if (sent) {
    return (
      <div className="rounded-lg border border-white/10 bg-ink-900 p-6">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-signal-ok/40 bg-signal-ok/10">
          <Check className="h-4 w-4 text-signal-ok" aria-hidden="true" />
        </span>
        <h3 className="mt-4 text-base font-bold">Demande envoyée — {sent.reference}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Merci {sent.name}. Votre demande « {sent.service} » est enregistrée. Réponse sous 24 h
          ouvrées au <span className="num">{sent.phone}</span>.
        </p>
        <Button
          variant="secondary"
          size="sm"
          icon={RotateCcw}
          className="mt-5"
          onClick={() => {
            setSent(null);
            setForm(EMPTY);
            setFiles([]);
          }}
        >
          Nouvelle demande
        </Button>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={submit} noValidate className="rounded-lg border border-white/10 bg-ink-900 p-6">
      <h3 className="text-base font-bold">Demander un devis</h3>
      <p className="mt-1 text-xs text-faint">
        Plus la description est précise, plus le devis l’est. Réponse sous 24 h ouvrées.
      </p>

      <div className="mt-6 space-y-4">
        <div>
          <label htmlFor="contact-service" className="field-label">
            Prestation souhaitée
          </label>
          <select
            id="contact-service"
            value={form.service}
            onChange={update('service')}
            onBlur={blur('service')}
            aria-invalid={Boolean(errors.service)}
            className={`field appearance-none ${errors.service ? 'border-signal-danger/60' : ''}`}
          >
            <option value="">Sélectionner…</option>
            {groupes.map((groupe) => (
              <optgroup key={groupe.groupe} label={groupe.groupe}>
                {groupe.items.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          {errors.service ? (
            <p className="mt-1.5 text-xs text-signal-danger">{errors.service}</p>
          ) : null}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {[
            { id: 'name', label: 'Nom et prénom', type: 'text', autoComplete: 'name' },
            { id: 'phone', label: 'Téléphone', type: 'tel', autoComplete: 'tel' },
            { id: 'email', label: 'Email', type: 'email', autoComplete: 'email' },
            { id: 'plate', label: 'Immatriculation (facultatif)', type: 'text' },
          ].map((field) => (
            <div key={field.id}>
              <label htmlFor={`contact-${field.id}`} className="field-label">
                {field.label}
              </label>
              <input
                id={`contact-${field.id}`}
                type={field.type}
                autoComplete={field.autoComplete}
                value={form[field.id]}
                onChange={update(field.id)}
                onBlur={blur(field.id)}
                aria-invalid={Boolean(errors[field.id])}
                placeholder={field.id === 'plate' ? 'AB-123-CD' : undefined}
                className={`field ${field.id === 'plate' ? 'uppercase' : ''} ${
                  errors[field.id] ? 'border-signal-danger/60' : ''
                }`}
              />
              {errors[field.id] ? (
                <p className="mt-1.5 text-xs text-signal-danger">{errors[field.id]}</p>
              ) : null}
            </div>
          ))}
        </div>

        <div>
          <label htmlFor="contact-message" className="field-label">
            Votre message
          </label>
          <textarea
            id="contact-message"
            rows={5}
            value={form.message}
            onChange={update('message')}
            onBlur={blur('message')}
            aria-invalid={Boolean(errors.message)}
            className={`field resize-y ${errors.message ? 'border-signal-danger/60' : ''}`}
            placeholder="État du véhicule, prestation envisagée, disponibilités…"
          />
          {errors.message ? (
            <p className="mt-1.5 text-xs text-signal-danger">{errors.message}</p>
          ) : null}
        </div>

        <div>
          <span className="field-label">Pièces jointes</span>
          <label
            htmlFor="contact-files"
            className="flex cursor-pointer flex-col items-center gap-1.5 rounded-md border border-dashed border-white/10 bg-ink-950 px-5 py-6 text-center transition-colors hover:border-accent/50"
          >
            <Paperclip className="h-4 w-4 text-accent" aria-hidden="true" />
            <span className="text-sm text-fg">Ajouter des photos ou un document</span>
            <span className="text-[11px] text-faint">JPG, PNG ou PDF — 6 fichiers maximum</span>
            <input
              id="contact-files"
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,application/pdf"
              onChange={handleFiles}
              className="sr-only"
            />
          </label>

          {files.length > 0 ? (
            <ul className="mt-2 space-y-1.5">
              {files.map((file) => (
                <li
                  key={file.id}
                  className="flex items-center justify-between gap-3 rounded-md border border-white/10 bg-ink-850 px-3 py-2"
                >
                  <span className="truncate text-xs text-muted">{file.name}</span>
                  <span className="flex shrink-0 items-center gap-3">
                    <span className="num text-[11px] text-faint">{formatSize(file.size)}</span>
                    <button
                      type="button"
                      onClick={() => setFiles(files.filter((item) => item.id !== file.id))}
                      aria-label={`Retirer ${file.name}`}
                      className="-m-2 flex h-9 w-9 items-center justify-center text-faint transition-colors hover:text-signal-danger"
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <label
          htmlFor="contact-consent"
          className="flex min-h-[44px] cursor-pointer items-start gap-3 py-2 text-xs leading-relaxed text-muted"
        >
          <input
            id="contact-consent"
            type="checkbox"
            checked={form.consent}
            onChange={update('consent')}
            className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer rounded-lg border-white/20 bg-ink-950 accent-accent"
          />
          <span>
            J’accepte que ces informations soient utilisées pour traiter ma demande. Aucune cession à
            des tiers.
          </span>
        </label>
        {errors.consent ? (
          <p className="text-xs text-signal-danger">{errors.consent}</p>
        ) : null}
      </div>

      {envoiErreur ? (
        <p
          role="alert"
          className="mt-6 rounded border border-signal-danger/40 bg-signal-danger/10 px-4 py-3 text-sm text-signal-danger"
        >
          {envoiErreur} Vous pouvez nous joindre au{' '}
          <a href={primaryPhone(contact).href} className="num font-semibold underline">
            {primaryPhone(contact).number}
          </a>
          .
        </p>
      ) : null}

      <Button
        type="submit"
        size="lg"
        icon={Send}
        disabled={envoiEnCours}
        className={`w-full ${envoiErreur ? 'mt-3' : 'mt-6'}`}
      >
        {envoiEnCours ? 'Envoi en cours…' : 'Envoyer ma demande'}
      </Button>
    </form>
  );
}

export default function Contact({ hideHeading = false }) {
  const contact = useSiteStore((state) => state.contact);

  return (
    <section className={`pb-12 lg:pb-14 ${hideHeading ? 'pt-8' : 'pt-12 lg:pt-14'}`}>
      <div className="container-x">
        {hideHeading ? null : (
          <SectionHeading
            eyebrow="Devis & contact"
            title="Parlons de"
            highlight="votre véhicule"
            description="Un projet de rénovation, une envie de CarPlay ou une voiture à vendre : décrivez le besoin, vous recevez un devis détaillé."
          />
        )}

        <div className="mt-10 grid gap-6 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <QuoteForm />
          </Reveal>

          <div className="space-y-4 lg:col-span-5">
            <Reveal delay={60} className="rounded-lg border border-white/10 bg-ink-900 p-5">
              <h3 className="text-sm font-semibold text-fg">L’atelier</h3>

              <ul className="mt-4 space-y-4 text-sm">
                <li className="flex gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                  <span className="text-muted">
                    {contact.address.street}
                    <br />
                    {contact.address.zone ? (
                      <>
                        {contact.address.zone}
                        <br />
                      </>
                    ) : null}
                    {contact.address.city}
                  </span>
                </li>
                <li className="flex gap-3">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                  <span className="flex flex-col gap-1">
                    {contact.phones.map((line) => (
                      <a
                        key={line.id}
                        href={line.href}
                        className="num inline-flex min-h-[36px] items-center gap-2 text-muted transition-colors hover:text-accent"
                      >
                        {line.number}
                        <span className="text-xs not-italic text-faint">{line.label}</span>
                      </a>
                    ))}
                  </span>
                </li>
                <li className="flex gap-3">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                  <a
                    href={contact.emailHref}
                    className="inline-flex min-h-[36px] items-center text-muted transition-colors hover:text-accent"
                  >
                    {contact.email}
                  </a>
                </li>
                {contact.whatsapp ? (
                  <li className="flex gap-3">
                    <MessageCircle
                      className="mt-0.5 h-4 w-4 shrink-0 text-accent"
                      aria-hidden="true"
                    />
                    <a
                      href={`${contact.whatsapp}?text=${encodeURIComponent(
                        'Bonjour, je souhaite un devis pour '
                      )}`}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex min-h-[36px] items-center text-muted transition-colors hover:text-accent"
                    >
                      WhatsApp — envoyez-nous vos photos
                    </a>
                  </li>
                ) : null}
                <li className="flex gap-3">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                  <span className="w-full text-muted">
                    {contact.hours.map((slot) => (
                      <span key={slot.day} className="mt-0.5 flex items-center justify-between gap-4">
                        {slot.day}
                        <span className="num text-xs text-faint">{slot.value}</span>
                      </span>
                    ))}
                  </span>
                </li>
              </ul>
            </Reveal>

            <Reveal delay={120}>
              <WorkshopMap contact={contact} />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
