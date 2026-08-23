import { useState } from 'react';
import { Check, RotateCcw, Send } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading.jsx';
import Reveal from '../ui/Reveal.jsx';
import Button from '../ui/Button.jsx';
import { FUELS, GEARBOXES } from '../../data/vehicles.js';
import { useSiteStore } from '../../store/siteStore';
import { primaryPhone } from '../../data/site.js';
import { sendLead } from '../../lib/sendLead.js';
import { chiffresSeuls, formaterMontant, formaterTelephone } from '../../lib/format.js';

/**
 * Le formulaire d'estimation se remplit en deux temps.
 *
 * Étape 1 : cinq champs, le strict nécessaire pour rappeler la personne. La
 * demande est enregistrée dès cette étape. Étape 2 : les précisions qui
 * affinent l'estimation, facultatives. Quelqu'un qui abandonne l'étape 2 a déjà
 * été enregistré comme demande — ce qui est tout l'objet du formulaire.
 */
const ETAPE_1 = { vehicle: '', year: '', km: '', name: '', phone: '' };
const ETAPE_2 = { gearbox: '', fuel: '', expectedPrice: '', email: '', message: '' };
const EMPTY = { ...ETAPE_1, ...ETAPE_2 };

const CURRENT_YEAR = new Date().getFullYear();

/** Ne valide que l'étape 1 : le reste est facultatif par construction. */
function validate(form) {
  const errors = {};
  if (form.vehicle.trim().length < 3) errors.vehicle = 'Marque et modèle, au moins.';

  const year = Number(form.year);
  if (!form.year) errors.year = 'Année requise.';
  else if (!Number.isInteger(year) || year < 1980 || year > CURRENT_YEAR + 1)
    errors.year = `Entre 1980 et ${CURRENT_YEAR + 1}.`;

  const km = Number(chiffresSeuls(form.km));
  if (!chiffresSeuls(form.km)) errors.km = 'Kilométrage requis.';
  else if (Number.isNaN(km) || km > 900000) errors.km = 'Valeur invalide.';

  if (!form.name.trim()) errors.name = 'Nom requis.';
  if (chiffresSeuls(form.phone).length < 10) errors.phone = 'Numéro incomplet.';

  return errors;
}

/** L'étape 2 n'a qu'une contrainte : un email saisi doit être valide. */
function validerEtape2(form) {
  const errors = {};
  if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email))
    errors.email = 'Email invalide.';
  return errors;
}

function TextField({ id, label, error, suffix, className = '', ...rest }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          className={`field ${suffix ? 'pr-10' : ''} ${error ? 'border-signal-danger/60' : ''}`}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          {...rest}
        />
        {suffix ? (
          <span className="num pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-faint">
            {suffix}
          </span>
        ) : null}
      </div>
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-xs text-signal-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function SelectField({ id, label, error, options, className = '', ...rest }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      <select
        id={id}
        className={`field appearance-none ${error ? 'border-signal-danger/60' : ''}`}
        aria-invalid={Boolean(error)}
        {...rest}
      >
        <option value="">Sélectionner…</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {error ? <p className="mt-1.5 text-xs text-signal-danger">{error}</p> : null}
    </div>
  );
}

function EstimationForm() {
  const addLead = useSiteStore((state) => state.addLead);
  const completerDemande = useSiteStore((state) => state.completerDemande);
  const contact = useSiteStore((state) => state.contact);

  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(null);
  const [envoiEnCours, setEnvoiEnCours] = useState(false);
  const [envoiErreur, setEnvoiErreur] = useState(null);

  // Mise en forme à la frappe : la saisie prend visiblement la bonne forme au
  // lieu d'être corrigée au moment de valider.
  const FORMATEURS = {
    phone: formaterTelephone,
    km: formaterMontant,
    expectedPrice: formaterMontant,
  };

  const update = (field) => (event) => {
    const brut = event.target.value;
    const valeur = FORMATEURS[field] ? FORMATEURS[field](brut) : brut;
    setForm((previous) => ({ ...previous, [field]: valeur }));
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

  /** Description du véhicule à partir de ce qui a été renseigné. */
  const decrireVehicule = (d) =>
    [
      d.vehicle,
      d.year,
      chiffresSeuls(d.km) && `${Number(chiffresSeuls(d.km)).toLocaleString('fr-FR')} km`,
      d.gearbox,
      d.fuel,
    ]
      .filter(Boolean)
      .join(' · ');

  /** Notification email. Son échec ne doit jamais faire perdre la demande. */
  const notifier = async (d, reference) => {
    try {
      await sendLead({
        sujet: `Estimation — ${d.vehicle} — ${d.name}`,
        replyTo: d.email || undefined,
        champs: {
          Référence: reference,
          Véhicule: decrireVehicule(d),
          'Prix espéré': d.expectedPrice ? `${d.expectedPrice} €` : 'non précisé',
          Nom: d.name,
          Téléphone: d.phone,
          Email: d.email || 'non précisé',
          Précisions: d.message || 'Aucune',
        },
      });
    } catch (error) {
      console.warn('Notification email non envoyée :', error.message);
    }
  };

  // --- Étape 1 : la demande part ici ---
  const submit = async (event) => {
    event.preventDefault();
    const nextErrors = validate(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      document.getElementById(`est-${Object.keys(nextErrors)[0]}`)?.focus();
      return;
    }

    setEnvoiErreur(null);
    setEnvoiEnCours(true);

    let lead;
    try {
      lead = await addLead({
        type: 'estimation',
        name: form.name,
        phone: form.phone,
        email: '',
        vehicle: decrireVehicule(form),
        message: 'Demande initiale — précisions non encore fournies.',
      });
    } catch (error) {
      setEnvoiErreur(error.message || "L'enregistrement de votre demande a échoué.");
      setEnvoiEnCours(false);
      return;
    }

    await notifier(form, lead.id);
    setEnvoiEnCours(false);
    setSent({
      reference: lead.id,
      jeton: lead.completionToken,
      name: form.name,
      phone: form.phone,
    });
  };

  // --- Étape 2 : complète une demande déjà enregistrée ---
  const completer = async (event) => {
    event.preventDefault();
    const nextErrors = validerEtape2(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      document.getElementById(`est-${Object.keys(nextErrors)[0]}`)?.focus();
      return;
    }

    setEnvoiErreur(null);
    setEnvoiEnCours(true);
    try {
      await completerDemande(sent.reference, sent.jeton, {
        email: form.email,
        vehicle: decrireVehicule(form),
        expectedPrice: Number(chiffresSeuls(form.expectedPrice)) || undefined,
        message: form.message || 'Aucune précision.',
      });
      await notifier(form, sent.reference);
      setSent((etat) => ({ ...etat, complete: true }));
    } catch (error) {
      setEnvoiErreur(error.message || "L'envoi des précisions a échoué.");
    }
    setEnvoiEnCours(false);
  };

  const recommencer = () => {
    setSent(null);
    setForm(EMPTY);
    setErrors({});
    setEnvoiErreur(null);
  };

  if (sent) {
    return (
      <div className="rounded-lg border border-white/10 bg-ink-900 p-6">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-signal-ok/40 bg-signal-ok/10">
          <Check className="h-4 w-4 text-signal-ok" aria-hidden="true" />
        </span>

        <h3 className="mt-4 text-base font-bold">Demande enregistrée — {sent.reference}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Merci {sent.name}. Un membre de l’atelier vous rappelle au{' '}
          <span className="num">{sent.phone}</span> sous 24 h ouvrées, avec une estimation appuyée
          sur les ventes réelles des 90 derniers jours.
        </p>

        {sent.complete ? (
          <p className="mt-5 rounded-md border border-signal-ok/30 bg-signal-ok/5 px-4 py-3 text-sm leading-relaxed text-muted">
            Vos précisions sont bien arrivées. Elles nous permettent d’affiner l’estimation avant
            même de vous appeler.
          </p>
        ) : (
          <form onSubmit={completer} noValidate className="mt-6">
            <div className="rule" />
            <h4 className="mt-5 text-sm font-bold text-fg">Quelques détails de plus ?</h4>
            <p className="mt-1 text-xs leading-relaxed text-faint">
              C’est facultatif : votre demande est déjà enregistrée, vous pouvez fermer cette page.
              Mais plus nous en savons, plus l’estimation sera juste.
            </p>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <SelectField
                id="est-gearbox"
                label="Boîte"
                value={form.gearbox}
                onChange={update('gearbox')}
                options={GEARBOXES}
              />
              <SelectField
                id="est-fuel"
                label="Énergie"
                value={form.fuel}
                onChange={update('fuel')}
                options={FUELS}
              />
              <TextField
                id="est-expectedPrice"
                label="Prix espéré"
                inputMode="numeric"
                suffix="€"
                value={form.expectedPrice}
                onChange={update('expectedPrice')}
                placeholder="18 500"
              />
              <TextField
                id="est-email"
                label="Email"
                type="email"
                value={form.email}
                onChange={update('email')}
                onBlur={() => setErrors(validerEtape2(form))}
                error={errors.email}
                autoComplete="email"
              />
              <div className="sm:col-span-2">
                <label htmlFor="est-message" className="field-label">
                  Précisions
                </label>
                <textarea
                  id="est-message"
                  rows={3}
                  value={form.message}
                  onChange={update('message')}
                  className="field resize-y"
                  placeholder="Entretien à jour, deux jeux de roues, petit impact sur le pare-chocs arrière…"
                />
              </div>
            </div>

            {envoiErreur ? (
              <p
                role="alert"
                className="mt-4 rounded border border-signal-danger/40 bg-signal-danger/10 px-4 py-3 text-sm text-signal-danger"
              >
                {envoiErreur}
              </p>
            ) : null}

            <Button type="submit" size="md" icon={Send} disabled={envoiEnCours} className="mt-5">
              {envoiEnCours ? 'Envoi…' : 'Compléter ma demande'}
            </Button>
          </form>
        )}

        <Button variant="secondary" size="sm" icon={RotateCcw} className="mt-6" onClick={recommencer}>
          Estimer un autre véhicule
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="rounded-lg border border-white/10 bg-ink-900 p-6">
      <h3 className="text-base font-bold">Faire estimer mon véhicule</h3>
      <p className="mt-1 text-xs text-faint">
        Cinq champs, une minute. Réponse sous 24 h ouvrées, sans engagement.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <TextField
          id="est-vehicle"
          label="Véhicule"
          value={form.vehicle}
          onChange={update('vehicle')}
          onBlur={blur('vehicle')}
          error={errors.vehicle}
          placeholder="BMW Série 1 118d"
          className="sm:col-span-2"
        />
        <TextField
          id="est-year"
          label="Année"
          inputMode="numeric"
          value={form.year}
          onChange={update('year')}
          onBlur={blur('year')}
          error={errors.year}
          placeholder="2019"
        />
        <TextField
          id="est-km"
          label="Kilométrage"
          inputMode="numeric"
          suffix="km"
          value={form.km}
          onChange={update('km')}
          onBlur={blur('km')}
          error={errors.km}
          placeholder="82 000"
        />
        <TextField
          id="est-name"
          label="Nom et prénom"
          value={form.name}
          onChange={update('name')}
          onBlur={blur('name')}
          error={errors.name}
          autoComplete="name"
        />
        <TextField
          id="est-phone"
          label="Téléphone"
          type="tel"
          value={form.phone}
          onChange={update('phone')}
          onBlur={blur('phone')}
          error={errors.phone}
          autoComplete="tel"
          placeholder="06 12 34 56 78"
        />
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
        {envoiEnCours ? 'Envoi en cours…' : 'Obtenir mon estimation'}
      </Button>

      <p className="mt-3 text-center text-[11px] leading-relaxed text-faint">
        Données utilisées uniquement pour traiter votre demande. Aucune revente à des tiers.
      </p>
    </form>
  );
}

export default function Sourcing({ hideHeading = false }) {
  const pipeline = useSiteStore((state) => state.pipeline);
  const facts = useSiteStore((state) => state.sourcingFacts);

  return (
    <section className={`pb-12 lg:pb-14 ${hideHeading ? 'pt-8' : 'pt-12 lg:pt-14'}`}>
      <div className="container-x">
        {hideHeading ? null : (
          <SectionHeading
            eyebrow="Pôle sourcing & dépôt-vente"
            title="Confiez-nous"
            highlight="la vente de votre voiture"
            description="Nous prenons le véhicule en dépôt, le préparons, le mettons en scène et gérons la transaction jusqu’à la remise des clés."
          />
        )}

        <div className="mt-10 grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal className="overflow-hidden rounded-lg border border-white/10 bg-ink-900">
              <div className="border-b border-white/10 px-5 py-3">
                <h3 className="text-sm font-semibold text-fg">Déroulé d’un dépôt-vente</h3>
              </div>

              <ol className="divide-y divide-white/5">
                {pipeline.map((item) => (
                  <li key={item.step} className="flex gap-4 px-5 py-4">
                    <span className="num pt-0.5 text-xs font-semibold text-accent">{item.step}</span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                        <h4 className="text-sm font-semibold text-fg">{item.label}</h4>
                        <span className="num text-[11px] text-faint">{item.duration}</span>
                      </div>
                      <p className="mt-1.5 text-xs leading-relaxed text-muted">{item.detail}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </Reveal>

            <Reveal delay={60} className="mt-5 grid gap-px overflow-hidden rounded-lg border border-white/10 bg-white/10 sm:grid-cols-3">
              {facts.map((fact) => (
                <div key={fact.value} className="bg-ink-900 px-4 py-4">
                  <p className="num text-lg font-semibold text-fg">{fact.value}</p>
                  <p className="mt-1 text-[11px] leading-snug text-faint">{fact.label}</p>
                </div>
              ))}
            </Reveal>

            <Reveal delay={90} className="mt-5 rounded-lg border border-white/10 bg-ink-900 p-5">
              <h3 className="text-sm font-semibold text-fg">Vous cherchez plutôt un véhicule ?</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Cahier des charges défini avec vous, recherche en France et en Allemagne, expertise
                indépendante sur place avant tout achat, rapatriement et préparation avant livraison.
                Forfait annoncé au départ, sans commission sur le prix d’achat.
              </p>
            </Reveal>
          </div>

          <Reveal delay={80} className="lg:col-span-5">
            <EstimationForm />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
