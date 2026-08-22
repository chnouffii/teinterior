import { useEffect, useRef, useState } from 'react';
import {
  CheckCircle2,
  Clock,
  ExternalLink,
  Mail,
  MapPin,
  MessageSquare,
  Paperclip,
  Phone,
  RotateCcw,
  Send,
  ShieldCheck,
  Trash2,
} from 'lucide-react';
import SectionHeading from '../ui/SectionHeading.jsx';
import Reveal from '../ui/Reveal.jsx';
import Button from '../ui/Button.jsx';
import { CONTACT, SERVICE_OPTIONS } from '../../data/site.js';
import { useQuote } from '../../context/QuoteContext.jsx';

const EMPTY_FORM = {
  service: '',
  name: '',
  phone: '',
  email: '',
  plate: '',
  message: '',
  consent: false,
};

const PLATE_PATTERN = /^[A-Z]{2}-?[0-9]{3}-?[A-Z]{2}$/;

function validate(form) {
  const errors = {};

  if (!form.service) errors.service = 'Choisissez le service souhaité.';
  if (!form.name.trim()) errors.name = 'Votre nom est requis.';

  const phoneDigits = form.phone.replace(/[^0-9+]/g, '');
  if (!form.phone.trim()) errors.phone = 'Téléphone requis.';
  else if (phoneDigits.length < 10) errors.phone = 'Numéro incomplet.';

  if (!form.email.trim()) errors.email = 'Email requis.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email)) errors.email = 'Email invalide.';

  if (form.plate.trim() && !PLATE_PATTERN.test(form.plate.trim().toUpperCase()))
    errors.plate = 'Format attendu : AB-123-CD.';

  if (form.message.trim().length < 12) errors.message = 'Décrivez votre besoin en quelques mots.';
  if (!form.consent) errors.consent = 'Merci d’accepter le traitement de vos données.';

  return errors;
}

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}

function WorkshopMap() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-carbon-900">
      <svg viewBox="0 0 600 320" className="h-56 w-full sm:h-64" role="img" aria-label="Plan d’accès à l’atelier Teintérior">
        <rect width="600" height="320" fill="#0A0D12" />
        <g stroke="#1C2531" strokeWidth="16">
          <line x1="-20" y1="96" x2="620" y2="112" />
          <line x1="-20" y1="238" x2="620" y2="226" />
          <line x1="150" y1="-20" x2="126" y2="340" />
          <line x1="430" y1="-20" x2="462" y2="340" />
        </g>
        <g stroke="#2A3546" strokeWidth="5">
          <line x1="-20" y1="168" x2="620" y2="172" />
          <line x1="290" y1="-20" x2="286" y2="340" />
        </g>
        <g fill="#121821">
          <rect x="30" y="126" width="80" height="34" rx="6" />
          <rect x="176" y="128" width="88" height="30" rx="6" />
          <rect x="330" y="122" width="76" height="38" rx="6" />
          <rect x="40" y="196" width="64" height="26" rx="6" />
          <rect x="330" y="196" width="98" height="26" rx="6" />
          <rect x="492" y="130" width="82" height="40" rx="6" />
        </g>
        <g opacity="0.5" fill="#16351F">
          <rect x="486" y="196" width="88" height="48" rx="10" />
          <rect x="180" y="196" width="76" height="48" rx="10" />
        </g>
        <circle cx="300" cy="176" r="34" fill="#D9A441" opacity="0.14" />
        <circle cx="300" cy="176" r="20" fill="#D9A441" opacity="0.22" />
        <path
          d="M300 154c-8.8 0-16 7.2-16 16 0 12 16 28 16 28s16-16 16-28c0-8.8-7.2-16-16-16zm0 22a6 6 0 1 1 0-12 6 6 0 0 1 0 12z"
          fill="#F2CE85"
        />
        <text x="300" y="222" textAnchor="middle" fill="#F2CE85" fontSize="13" fontFamily="Inter, sans-serif" fontWeight="600">
          Teintérior
        </text>
      </svg>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 p-5">
        <div className="text-sm">
          <p className="font-semibold text-white">{CONTACT.address.street}</p>
          <p className="text-slate-300">
            {CONTACT.address.zone} — {CONTACT.address.city}
          </p>
        </div>
        <Button
          as="a"
          href={CONTACT.address.mapsUrl}
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
  const [form, setForm] = useState(EMPTY_FORM);
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(null);
  const fileInputRef = useRef(null);
  const formRef = useRef(null);

  useEffect(() => {
    if (!prefill) return;
    setSubmitted(null);
    setForm((previous) => ({
      ...previous,
      service: prefill.service ?? previous.service,
      message: prefill.message ?? previous.message,
    }));
    setErrors({});
    window.setTimeout(() => {
      formRef.current?.querySelector('#contact-name')?.focus({ preventScroll: true });
    }, 700);
  }, [prefill]);

  const update = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setForm((previous) => ({ ...previous, [field]: value }));
    setErrors((previous) => {
      if (!previous[field]) return previous;
      const next = { ...previous };
      delete next[field];
      return next;
    });
  };

  /** Validation à la sortie du champ : l'erreur apparaît sans attendre l'envoi. */
  const handleBlur = (field) => () => {
    const nextErrors = validate(form);
    setErrors((previous) => {
      const next = { ...previous };
      if (nextErrors[field]) next[field] = nextErrors[field];
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

  const removeFile = (id) => setFiles((previous) => previous.filter((file) => file.id !== id));

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validate(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      const firstField = Object.keys(nextErrors)[0];
      document.getElementById(`contact-${firstField}`)?.focus();
      return;
    }

    setSubmitted({
      ...form,
      files: files.length,
      reference: `DEV-${String(Date.now()).slice(-6)}`,
    });
  };

  if (submitted) {
    const serviceLabel =
      SERVICE_OPTIONS.find((option) => option.value === submitted.service)?.label ?? 'Demande';

    return (
      <div className="panel p-7 sm:p-9">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-400/30 bg-emerald-400/10">
          <CheckCircle2 className="h-6 w-6 text-emerald-400" aria-hidden="true" />
        </span>

        <h3 className="mt-5 text-xl font-bold">Demande envoyée !</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-300">
          Merci {submitted.name}, votre demande « {serviceLabel} » est enregistrée sous la référence{' '}
          <span className="font-semibold text-white">{submitted.reference}</span>. Nous revenons vers
          vous sous 24 h ouvrées au {submitted.phone}
          {submitted.files > 0
            ? ` — ${submitted.files} pièce${submitted.files > 1 ? 's' : ''} jointe${
                submitted.files > 1 ? 's' : ''
              } bien reçue${submitted.files > 1 ? 's' : ''}.`
            : '.'}
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <a
            href={CONTACT.phoneHref}
            className="flex items-center gap-3 rounded-2xl border border-white/10 bg-carbon-900/70 px-4 py-3.5 text-sm text-slate-300 transition-colors hover:border-brass/40 hover:text-white"
          >
            <Phone className="h-4 w-4 text-brass" aria-hidden="true" />
            Urgent ? Appelez-nous
          </a>
          <a
            href={CONTACT.whatsapp}
            target="_blank"
            rel="noreferrer noopener"
            className="flex items-center gap-3 rounded-2xl border border-white/10 bg-carbon-900/70 px-4 py-3.5 text-sm text-slate-300 transition-colors hover:border-brass/40 hover:text-white"
          >
            <MessageSquare className="h-4 w-4 text-brass" aria-hidden="true" />
            Envoyer des photos sur WhatsApp
          </a>
        </div>

        <Button
          onClick={() => {
            setSubmitted(null);
            setForm(EMPTY_FORM);
            setFiles([]);
          }}
          variant="secondary"
          size="md"
          icon={RotateCcw}
          className="mt-7"
        >
          Nouvelle demande
        </Button>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate className="panel p-7 sm:p-9">
      <h3 className="text-xl font-bold">Demander un devis</h3>
      <p className="mt-1.5 text-sm text-slate-300">
        Réponse chiffrée sous 24 h ouvrées. Plus vous nous donnez de détails, plus le devis est
        précis.
      </p>

      <div className="mt-7">
        <label htmlFor="contact-service" className="field-label">
          Service souhaité
        </label>
        <select
          id="contact-service"
          value={form.service}
          onChange={update('service')}
          onBlur={handleBlur('service')}
          aria-invalid={Boolean(errors.service)}
          className={`field appearance-none ${errors.service ? 'border-rose-500/60' : ''}`}
        >
          <option value="">Sélectionner une prestation…</option>
          {SERVICE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.service ? <p className="mt-1.5 text-xs text-rose-400">{errors.service}</p> : null}
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="field-label">
            Nom et prénom
          </label>
          <input
            id="contact-name"
            value={form.name}
            onChange={update('name')}
            onBlur={handleBlur('name')}
            autoComplete="name"
            placeholder="Camille Duarte"
            aria-invalid={Boolean(errors.name)}
            className={`field ${errors.name ? 'border-rose-500/60' : ''}`}
          />
          {errors.name ? <p className="mt-1.5 text-xs text-rose-400">{errors.name}</p> : null}
        </div>

        <div>
          <label htmlFor="contact-phone" className="field-label">
            Téléphone
          </label>
          <input
            id="contact-phone"
            type="tel"
            value={form.phone}
            onChange={update('phone')}
            onBlur={handleBlur('phone')}
            autoComplete="tel"
            placeholder="06 12 34 56 78"
            aria-invalid={Boolean(errors.phone)}
            className={`field ${errors.phone ? 'border-rose-500/60' : ''}`}
          />
          {errors.phone ? <p className="mt-1.5 text-xs text-rose-400">{errors.phone}</p> : null}
        </div>

        <div>
          <label htmlFor="contact-email" className="field-label">
            Email
          </label>
          <input
            id="contact-email"
            type="email"
            value={form.email}
            onChange={update('email')}
            onBlur={handleBlur('email')}
            autoComplete="email"
            placeholder="camille@email.fr"
            aria-invalid={Boolean(errors.email)}
            className={`field ${errors.email ? 'border-rose-500/60' : ''}`}
          />
          {errors.email ? <p className="mt-1.5 text-xs text-rose-400">{errors.email}</p> : null}
        </div>

        <div>
          <label htmlFor="contact-plate" className="field-label">
            Immatriculation <span className="normal-case text-slate-400">(facultatif)</span>
          </label>
          <input
            id="contact-plate"
            value={form.plate}
            onChange={update('plate')}
            onBlur={handleBlur('plate')}
            placeholder="AB-123-CD"
            maxLength={9}
            aria-invalid={Boolean(errors.plate)}
            className={`field uppercase ${errors.plate ? 'border-rose-500/60' : ''}`}
          />
          {errors.plate ? <p className="mt-1.5 text-xs text-rose-400">{errors.plate}</p> : null}
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor="contact-message" className="field-label">
          Votre message
        </label>
        <textarea
          id="contact-message"
          rows={5}
          value={form.message}
          onChange={update('message')}
          onBlur={handleBlur('message')}
          placeholder="Décrivez l’état du véhicule, la prestation souhaitée, vos disponibilités…"
          aria-invalid={Boolean(errors.message)}
          className={`field resize-y ${errors.message ? 'border-rose-500/60' : ''}`}
        />
        {errors.message ? <p className="mt-1.5 text-xs text-rose-400">{errors.message}</p> : null}
      </div>

      <div className="mt-4">
        <span className="field-label">Informations complémentaires</span>
        <label
          htmlFor="contact-files"
          className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-white/15 bg-carbon-900/60 px-6 py-7 text-center transition-colors hover:border-brass/50 hover:bg-carbon-900"
        >
          <Paperclip className="h-5 w-5 text-brass" aria-hidden="true" />
          <span className="text-sm font-medium text-white">
            Ajouter des photos ou un document
          </span>
          <span className="text-xs text-slate-400">
            JPG, PNG ou PDF — 6 fichiers maximum, 10 Mo par fichier
          </span>
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
          <ul className="mt-3 space-y-2">
            {files.map((file) => (
              <li
                key={file.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-carbon-900/70 px-4 py-2.5"
              >
                <span className="truncate text-xs text-slate-300">{file.name}</span>
                <span className="flex shrink-0 items-center gap-3">
                  <span className="text-xs text-slate-400">{formatSize(file.size)}</span>
                  <button
                    type="button"
                    onClick={() => removeFile(file.id)}
                    aria-label={`Retirer ${file.name}`}
                    className="-m-2 flex h-11 w-11 items-center justify-center text-slate-400 transition-colors hover:text-rose-400"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                </span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <label
        htmlFor="contact-consent"
        className="mt-5 flex min-h-[44px] cursor-pointer items-start gap-3 py-2 text-xs leading-relaxed text-slate-300"
      >
        <input
          id="contact-consent"
          type="checkbox"
          checked={form.consent}
          onChange={update('consent')}
          className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer rounded border-white/20 bg-carbon-900 accent-brass"
        />
        <span>
          J’accepte que Teintérior utilise ces informations pour me recontacter au sujet de ma
          demande. Aucune donnée n’est cédée à des tiers.
        </span>
      </label>
      {errors.consent ? <p className="mt-1.5 text-xs text-rose-400">{errors.consent}</p> : null}

      <Button type="submit" size="lg" icon={Send} className="mt-6 w-full">
        Envoyer ma demande de devis
      </Button>

      <p className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400">
        <ShieldCheck className="h-3.5 w-3.5 text-brass/70" aria-hidden="true" />
        Devis gratuit et sans engagement — réponse sous 24 h ouvrées.
      </p>
    </form>
  );
}

export default function Contact({ hideHeading = false }) {
  return (
    <section
      id="contact"
      className={`relative scroll-mt-24 pb-20 lg:pb-28 ${
        hideHeading ? 'pt-2 lg:pt-4' : 'pt-20 lg:pt-28'
      }`}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brass/30 to-transparent" />
      <div className="pointer-events-none absolute -left-40 top-24 h-[380px] w-[380px] rounded-full bg-brass/5 blur-3xl" />

      <div className="container-x relative">
        {hideHeading ? null : (
          <SectionHeading
            eyebrow="Devis & contact"
            title="Parlons de votre"
            highlight="véhicule"
            description="Un projet de rénovation, une envie de CarPlay ou une voiture à vendre ? Décrivez-nous votre besoin : nous répondons avec un devis détaillé, ligne par ligne."
          />
        )}

        <div className="mt-14 grid gap-8 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <QuoteForm />
          </Reveal>

          <div className="space-y-6 lg:col-span-5">
            <Reveal delay={100} className="panel p-7">
              <h3 className="text-lg font-bold">L’atelier Teintérior</h3>

              <ul className="mt-6 space-y-5">
                <li className="flex gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-brass/30 bg-brass/10">
                    <MapPin className="h-4 w-4 text-brass" aria-hidden="true" />
                  </span>
                  <span className="text-sm text-slate-300">
                    <span className="block font-semibold text-white">Adresse</span>
                    {CONTACT.address.street}, {CONTACT.address.zone}
                    <br />
                    {CONTACT.address.city}
                  </span>
                </li>

                <li className="flex gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-brass/30 bg-brass/10">
                    <Phone className="h-4 w-4 text-brass" aria-hidden="true" />
                  </span>
                  <span className="text-sm text-slate-300">
                    <span className="block font-semibold text-white">Téléphone</span>
                    <a href={CONTACT.phoneHref} className="inline-flex min-h-[40px] items-center transition-colors hover:text-brass-light">
                      {CONTACT.phone}
                    </a>
                  </span>
                </li>

                <li className="flex gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-brass/30 bg-brass/10">
                    <Mail className="h-4 w-4 text-brass" aria-hidden="true" />
                  </span>
                  <span className="text-sm text-slate-300">
                    <span className="block font-semibold text-white">Email</span>
                    <a href={CONTACT.emailHref} className="inline-flex min-h-[40px] items-center transition-colors hover:text-brass-light">
                      {CONTACT.email}
                    </a>
                  </span>
                </li>

                <li className="flex gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-brass/30 bg-brass/10">
                    <Clock className="h-4 w-4 text-brass" aria-hidden="true" />
                  </span>
                  <span className="w-full text-sm text-slate-300">
                    <span className="block font-semibold text-white">Horaires</span>
                    {CONTACT.hours.map((slot) => (
                      <span key={slot.day} className="mt-1 flex items-center justify-between gap-4">
                        {slot.day}
                        <span className="text-slate-300">{slot.value}</span>
                      </span>
                    ))}
                  </span>
                </li>
              </ul>
            </Reveal>

            <Reveal delay={180}>
              <WorkshopMap />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
