import { useState } from 'react';
import { BadgeEuro, CheckCircle2, RotateCcw, Send, ShieldCheck } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading.jsx';
import Reveal from '../ui/Reveal.jsx';
import Button from '../ui/Button.jsx';
import Icon from '../ui/Icon.jsx';
import {
  ENERGY_OPTIONS,
  GEARBOX_OPTIONS,
  SOURCING_ARGUMENTS,
  SOURCING_STEPS,
} from '../../data/vehicles.js';

const EMPTY_FORM = {
  brand: '',
  model: '',
  year: '',
  mileage: '',
  gearbox: '',
  energy: '',
  expectedPrice: '',
  name: '',
  phone: '',
  email: '',
};

const CURRENT_YEAR = new Date().getFullYear();

function validate(form) {
  const errors = {};

  if (!form.brand.trim()) errors.brand = 'Indiquez la marque.';
  if (!form.model.trim()) errors.model = 'Indiquez le modèle.';

  const year = Number(form.year);
  if (!form.year) errors.year = 'Année requise.';
  else if (!Number.isInteger(year) || year < 1980 || year > CURRENT_YEAR + 1)
    errors.year = `Année comprise entre 1980 et ${CURRENT_YEAR + 1}.`;

  const mileage = Number(form.mileage);
  if (!form.mileage) errors.mileage = 'Kilométrage requis.';
  else if (Number.isNaN(mileage) || mileage < 0 || mileage > 900000)
    errors.mileage = 'Kilométrage invalide.';

  if (!form.gearbox) errors.gearbox = 'Sélectionnez une boîte.';
  if (!form.energy) errors.energy = 'Sélectionnez une énergie.';

  const price = Number(form.expectedPrice);
  if (!form.expectedPrice) errors.expectedPrice = 'Prix espéré requis.';
  else if (Number.isNaN(price) || price < 500) errors.expectedPrice = 'Montant trop faible.';

  if (!form.name.trim()) errors.name = 'Votre nom est requis.';

  const phoneDigits = form.phone.replace(/[^0-9+]/g, '');
  if (!form.phone.trim()) errors.phone = 'Téléphone requis.';
  else if (phoneDigits.length < 10) errors.phone = 'Numéro incomplet.';

  if (!form.email.trim()) errors.email = 'Email requis.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email)) errors.email = 'Email invalide.';

  return errors;
}

function formatEuro(value) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(value);
}

function EstimationForm() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(null);

  const update = (field) => (event) => {
    const { value } = event.target;
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

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validate(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      const firstField = Object.keys(nextErrors)[0];
      document.getElementById(`estimation-${firstField}`)?.focus();
      return;
    }

    const price = Number(form.expectedPrice);
    setSubmitted({
      ...form,
      low: Math.round((price * 0.94) / 50) * 50,
      high: Math.round((price * 1.09) / 50) * 50,
      reference: `EST-${String(Date.now()).slice(-6)}`,
    });
  };

  if (submitted) {
    return (
      <div className="panel p-7 sm:p-9">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-400/30 bg-emerald-400/10">
          <CheckCircle2 className="h-6 w-6 text-emerald-400" aria-hidden="true" />
        </span>

        <h3 className="mt-5 text-xl font-bold">Demande enregistrée, merci {submitted.name} !</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-300">
          Référence <span className="font-semibold text-white">{submitted.reference}</span>. Un
          expert Teintérior vous rappelle au {submitted.phone} sous 24 h ouvrées avec une estimation
          argumentée par les ventes réelles du marché.
        </p>

        <div className="mt-6 rounded-2xl border border-brass/30 bg-brass/[0.07] p-6">
          <p className="text-[11px] uppercase tracking-[0.18em] text-brass-light">
            Fourchette indicative immédiate
          </p>
          <p className="mt-2 font-display text-2xl font-bold text-white sm:text-3xl">
            {formatEuro(submitted.low)} — {formatEuro(submitted.high)}
          </p>
          <p className="mt-2 text-xs text-slate-300">
            Estimation automatique basée sur votre prix espéré, avant préparation esthétique. La
            préparation offerte fait généralement gagner 8 à 12 % sur le prix final.
          </p>
        </div>

        <dl className="mt-6 grid gap-3 sm:grid-cols-2">
          {[
            ['Véhicule', `${submitted.brand} ${submitted.model}`],
            ['Année', submitted.year],
            ['Kilométrage', `${Number(submitted.mileage).toLocaleString('fr-FR')} km`],
            ['Boîte / énergie', `${submitted.gearbox} · ${submitted.energy}`],
          ].map(([label, value]) => (
            <div key={label} className="rounded-xl border border-white/5 bg-carbon-900/60 px-4 py-3">
              <dt className="text-[11px] uppercase tracking-wider text-slate-400">{label}</dt>
              <dd className="mt-1 text-sm font-semibold text-white">{value}</dd>
            </div>
          ))}
        </dl>

        <Button
          onClick={() => {
            setSubmitted(null);
            setForm(EMPTY_FORM);
          }}
          variant="secondary"
          size="md"
          icon={RotateCcw}
          className="mt-7"
        >
          Estimer un autre véhicule
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="panel p-7 sm:p-9">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold">Faire estimer mon véhicule</h3>
          <p className="mt-1.5 text-sm text-slate-300">
            2 minutes, sans engagement, réponse d’un expert sous 24 h.
          </p>
        </div>
        <span className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-brass/30 bg-brass/10 sm:flex">
          <BadgeEuro className="h-5 w-5 text-brass" aria-hidden="true" />
        </span>
      </div>

      <div className="mt-7 grid gap-4 sm:grid-cols-2">
        <TextField
          id="estimation-brand"
          label="Marque"
          placeholder="Peugeot, BMW, Tesla…"
          value={form.brand}
          onChange={update('brand')}
          onBlur={handleBlur('brand')}
          error={errors.brand}
        />
        <TextField
          id="estimation-model"
          label="Modèle"
          placeholder="308 GT, Série 3 320d…"
          value={form.model}
          onChange={update('model')}
          onBlur={handleBlur('model')}
          error={errors.model}
        />
        <TextField
          id="estimation-year"
          label="Année"
          type="number"
          inputMode="numeric"
          placeholder="2019"
          value={form.year}
          onChange={update('year')}
          onBlur={handleBlur('year')}
          error={errors.year}
        />
        <TextField
          id="estimation-mileage"
          label="Kilométrage"
          type="number"
          inputMode="numeric"
          placeholder="78 000"
          suffix="km"
          value={form.mileage}
          onChange={update('mileage')}
          onBlur={handleBlur('mileage')}
          error={errors.mileage}
        />
        <SelectField
          id="estimation-gearbox"
          label="Boîte de vitesses"
          value={form.gearbox}
          onChange={update('gearbox')}
          onBlur={handleBlur('gearbox')}
          error={errors.gearbox}
          options={GEARBOX_OPTIONS}
        />
        <SelectField
          id="estimation-energy"
          label="Énergie"
          value={form.energy}
          onChange={update('energy')}
          onBlur={handleBlur('energy')}
          error={errors.energy}
          options={ENERGY_OPTIONS}
        />
        <TextField
          id="estimation-expectedPrice"
          label="Prix espéré"
          type="number"
          inputMode="numeric"
          placeholder="18 500"
          suffix="€"
          value={form.expectedPrice}
          onChange={update('expectedPrice')}
          onBlur={handleBlur('expectedPrice')}
          error={errors.expectedPrice}
          className="sm:col-span-2"
        />
      </div>

      <div className="my-7 hairline" />

      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          id="estimation-name"
          label="Nom et prénom"
          placeholder="Camille Duarte"
          autoComplete="name"
          value={form.name}
          onChange={update('name')}
          onBlur={handleBlur('name')}
          error={errors.name}
        />
        <TextField
          id="estimation-phone"
          label="Téléphone"
          type="tel"
          placeholder="06 12 34 56 78"
          autoComplete="tel"
          value={form.phone}
          onChange={update('phone')}
          onBlur={handleBlur('phone')}
          error={errors.phone}
        />
        <TextField
          id="estimation-email"
          label="Email"
          type="email"
          placeholder="camille@email.fr"
          autoComplete="email"
          value={form.email}
          onChange={update('email')}
          onBlur={handleBlur('email')}
          error={errors.email}
          className="sm:col-span-2"
        />
      </div>

      <Button type="submit" size="lg" icon={Send} className="mt-7 w-full">
        Obtenir mon estimation gratuite
      </Button>

      <p className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400">
        <ShieldCheck className="h-3.5 w-3.5 text-brass/70" aria-hidden="true" />
        Vos données servent uniquement à traiter votre demande. Aucune revente à des tiers.
      </p>
    </form>
  );
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
          className={`field ${suffix ? 'pr-12' : ''} ${
            error ? 'border-rose-500/60 focus:border-rose-500' : ''
          }`}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          {...rest}
        />
        {suffix ? (
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
            {suffix}
          </span>
        ) : null}
      </div>
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-xs text-rose-400">
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
        className={`field appearance-none ${error ? 'border-rose-500/60' : ''}`}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        {...rest}
      >
        <option value="">Sélectionner…</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-xs text-rose-400">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export default function Sourcing({ hideHeading = false }) {
  return (
    <section
      id="vendre"
      className={`relative scroll-mt-24 pb-20 lg:pb-28 ${
        hideHeading ? 'pt-2 lg:pt-4' : 'pt-20 lg:pt-28'
      }`}
    >
      <div className="container-x">
        {hideHeading ? null : (
          <SectionHeading
            eyebrow="Pôle sourcing & dépôt-vente"
            title="Confiez-nous"
            highlight="la vente de votre voiture"
            description="Vous n’avez ni le temps ni l’envie de gérer les appels, les visites et les acheteurs peu sérieux ? Nous prenons le véhicule en dépôt, le préparons, le mettons en scène et gérons la transaction jusqu’à la remise des clés."
          />
        )}

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SOURCING_STEPS.map((step, index) => (
            <Reveal
              key={step.id}
              delay={index * 90}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-carbon-850/60 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brass/40"
            >
              <span className="pointer-events-none absolute -right-4 -top-6 font-display text-7xl font-extrabold text-white/[0.04] transition-colors duration-300 group-hover:text-brass/10">
                {step.number}
              </span>

              <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-brass/30 bg-brass/10">
                <Icon name={step.icon} className="h-5 w-5 text-brass" strokeWidth={2} aria-hidden="true" />
              </span>

              <h3 className="mt-5 text-base font-bold">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">{step.text}</p>
            </Reveal>
          ))}
        </div>

        <div className="mt-16 grid items-start gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Reveal className="space-y-3">
              {SOURCING_ARGUMENTS.map((argument) => (
                <div
                  key={argument.id}
                  className="flex items-center gap-5 rounded-2xl border border-white/10 bg-carbon-900/60 px-6 py-5"
                >
                  <span className="font-display text-2xl font-bold text-gradient-brass">
                    {argument.value}
                  </span>
                  <span className="text-sm leading-snug text-slate-300">{argument.label}</span>
                </div>
              ))}
            </Reveal>

            <Reveal delay={120} className="mt-6 rounded-3xl border border-ice/20 bg-ice/[0.04] p-6">
              <h3 className="text-base font-bold text-white">Vous cherchez plutôt un véhicule ?</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">
                Notre service de sourcing recherche le modèle exact que vous voulez, en France comme
                à l’étranger : sélection des annonces, expertise sur place, négociation, rapatriement
                et préparation esthétique avant livraison.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-slate-300">
                {[
                  'Cahier des charges défini avec vous (budget, options, kilométrage)',
                  'Expertise indépendante 120 points avant tout achat',
                  'Frais de service annoncés dès le départ, forfait unique',
                ].map((item) => (
                  <li key={item} className="flex gap-2.5">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-ice" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <Reveal delay={80} className="lg:col-span-7">
            <EstimationForm />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
