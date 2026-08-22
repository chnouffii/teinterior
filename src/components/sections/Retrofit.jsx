import { useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CalendarCheck,
  Check,
  ChevronRight,
  Clock,
  RotateCcw,
  Wrench,
} from 'lucide-react';
import SectionHeading from '../ui/SectionHeading.jsx';
import Reveal from '../ui/Reveal.jsx';
import Button from '../ui/Button.jsx';
import Icon from '../ui/Icon.jsx';
import CarVisual from '../ui/CarVisual.jsx';
import {
  COMPAT_LEVELS,
  RETROFIT_BENEFITS,
  RETROFIT_BRANDS,
  RETROFIT_FEATURES_BASE,
} from '../../data/retrofit.js';
import { useQuote } from '../../context/QuoteContext.jsx';

const STEPS = [
  { id: 1, label: 'Marque' },
  { id: 2, label: 'Modèle & année' },
  { id: 3, label: 'Compatibilité' },
];

const TONES = {
  emerald: 'border-emerald-400/40 bg-emerald-400/10 text-emerald-300',
  brass: 'border-brass/40 bg-brass/10 text-brass-light',
  amber: 'border-amber-400/40 bg-amber-400/10 text-amber-300',
  ice: 'border-ice/40 bg-ice/10 text-ice',
};

function Stepper({ step }) {
  return (
    <ol className="flex items-center gap-2 sm:gap-4">
      {STEPS.map((item, index) => {
        const isDone = step > item.id;
        const isActive = step === item.id;
        return (
          <li key={item.id} className="flex flex-1 items-center gap-2 sm:gap-3">
            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-bold transition-colors duration-300 ${
                isDone
                  ? 'border-brass bg-brass text-carbon-950'
                  : isActive
                  ? 'border-brass bg-brass/15 text-brass-light'
                  : 'border-white/15 bg-white/5 text-slate-400'
              }`}
            >
              {isDone ? <Check className="h-4 w-4" strokeWidth={3} aria-hidden="true" /> : item.id}
            </span>
            <span
              className={`hidden text-xs font-semibold uppercase tracking-[0.14em] sm:block ${
                isActive || isDone ? 'text-white' : 'text-slate-400'
              }`}
            >
              {item.label}
            </span>
            {index < STEPS.length - 1 ? (
              <span className="h-px flex-1 bg-gradient-to-r from-white/20 to-white/5" />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}

function Configurator() {
  const { requestQuote } = useQuote();
  const [step, setStep] = useState(1);
  const [brandId, setBrandId] = useState(null);
  const [modelId, setModelId] = useState(null);
  const [generationId, setGenerationId] = useState(null);

  const brand = useMemo(
    () => RETROFIT_BRANDS.find((item) => item.id === brandId) ?? null,
    [brandId]
  );
  const model = useMemo(
    () => brand?.models.find((item) => item.id === modelId) ?? null,
    [brand, modelId]
  );
  const generation = useMemo(
    () => model?.generations.find((item) => item.id === generationId) ?? null,
    [model, generationId]
  );

  const compat = generation ? COMPAT_LEVELS[generation.compat] : null;

  const selectBrand = (id) => {
    setBrandId(id);
    setModelId(null);
    setGenerationId(null);
    setStep(2);
  };

  const selectGeneration = (id) => {
    setGenerationId(id);
    setStep(3);
  };

  const reset = () => {
    setBrandId(null);
    setModelId(null);
    setGenerationId(null);
    setStep(1);
  };

  const book = () => {
    requestQuote({
      service: 'retrofit',
      message: `Bonjour, je souhaite réserver une installation CarPlay / Android Auto sur ma ${brand.name} ${model.name} (${generation.years}, ${generation.system}). Tarif indicatif annoncé : ${generation.price} €.`,
      label: `${brand.name} ${model.name}`,
    });
  };

  return (
    <div className="panel overflow-hidden">
      <div className="border-b border-white/10 bg-carbon-900/60 px-6 py-5 sm:px-8">
        <Stepper step={step} />
      </div>

      <div className="p-6 sm:p-8">
        {step === 1 ? (
          <div>
            <h3 className="text-lg font-bold">Quelle est la marque de votre véhicule ?</h3>
            <p className="mt-2 text-sm text-slate-300">
              Plus de 40 constructeurs sont couverts. Voici les plus demandés à l’atelier.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {RETROFIT_BRANDS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => selectBrand(item.id)}
                  className="group flex items-center justify-between gap-2 rounded-2xl border border-white/10
                    bg-carbon-900/70 px-4 py-4 text-left transition-all duration-300
                    hover:-translate-y-0.5 hover:border-brass/50 hover:bg-carbon-800"
                >
                  <span className="font-display text-sm font-semibold text-white">{item.name}</span>
                  <ChevronRight
                    className="h-4 w-4 text-slate-400 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-brass"
                    aria-hidden="true"
                  />
                </button>
              ))}
            </div>

            <p className="mt-6 text-xs text-slate-400">
              Votre marque n’apparaît pas ? Écrivez-nous : nous validons la compatibilité sous 24 h.
            </p>
          </div>
        ) : null}

        {step === 2 && brand ? (
          <div>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400 transition-colors hover:text-brass-light"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              Changer de marque
            </button>

            <h3 className="mt-4 text-lg font-bold">
              {brand.name} — choisissez le modèle puis l’année
            </h3>

            <div className="mt-6 grid gap-3">
              {brand.models.map((item) => {
                const isOpen = modelId === item.id;
                return (
                  <div
                    key={item.id}
                    className={`rounded-2xl border transition-colors duration-300 ${
                      isOpen ? 'border-brass/40 bg-carbon-900' : 'border-white/10 bg-carbon-900/60'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setModelId(isOpen ? null : item.id)}
                      aria-expanded={isOpen}
                      className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                    >
                      <span className="font-display text-sm font-semibold text-white">
                        {item.name}
                      </span>
                      <span className="flex items-center gap-2 text-xs text-slate-400">
                        {item.generations.length} génération
                        {item.generations.length > 1 ? 's' : ''}
                        <ChevronRight
                          className={`h-4 w-4 transition-transform duration-300 ${
                            isOpen ? 'rotate-90 text-brass' : ''
                          }`}
                          aria-hidden="true"
                        />
                      </span>
                    </button>

                    {isOpen ? (
                      <div className="grid gap-2 border-t border-white/5 p-4 sm:grid-cols-2">
                        {item.generations.map((gen) => (
                          <button
                            key={gen.id}
                            type="button"
                            onClick={() => selectGeneration(gen.id)}
                            className="group rounded-xl border border-white/10 bg-carbon-850/80 px-4 py-3 text-left
                              transition-all duration-300 hover:-translate-y-0.5 hover:border-brass/50"
                          >
                            <span className="block text-sm font-semibold text-white">
                              {gen.years}
                            </span>
                            <span className="mt-1 block text-xs text-slate-300">{gen.system}</span>
                            <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-brass-light">
                              Vérifier
                              <ArrowRight
                                className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5"
                                aria-hidden="true"
                              />
                            </span>
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}

        {step === 3 && brand && model && generation && compat ? (
          <div>
            <button
              type="button"
              onClick={() => setStep(2)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400 transition-colors hover:text-brass-light"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              Modifier le modèle
            </button>

            <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                  Votre configuration
                </p>
                <h3 className="mt-1.5 font-display text-xl font-bold text-white">
                  {brand.name} {model.name}
                </h3>
                <p className="mt-1 text-sm text-slate-300">
                  {generation.years} · {generation.system}
                </p>
              </div>

              <span
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-wider ${
                  TONES[compat.tone]
                }`}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                {compat.short}
              </span>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-carbon-900/70 p-5">
                <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">
                  Tarif indicatif
                </p>
                <p className="mt-2 font-display text-2xl font-bold text-white">
                  {generation.price} €
                </p>
                <p className="mt-1 text-xs text-slate-400">pose et matériel inclus, TTC</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-carbon-900/70 p-5">
                <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">
                  Immobilisation
                </p>
                <p className="mt-2 flex items-center gap-2 font-display text-2xl font-bold text-white">
                  <Clock className="h-5 w-5 text-brass" aria-hidden="true" />
                  {generation.duration}
                </p>
                <p className="mt-1 text-xs text-slate-400">véhicule rendu le jour même</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-carbon-900/70 p-5">
                <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">Garantie</p>
                <p className="mt-2 font-display text-2xl font-bold text-white">2 ans</p>
                <p className="mt-1 text-xs text-slate-400">pièces, pose et mises à jour</p>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-white/10 bg-carbon-900/50 p-5">
              <p className="text-sm font-semibold text-white">{compat.label}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-300">{compat.description}</p>
              <p className="mt-3 flex gap-2 text-xs leading-relaxed text-slate-400">
                <Wrench className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brass" aria-hidden="true" />
                {generation.note}
              </p>
            </div>

            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {[...RETROFIT_FEATURES_BASE, ...generation.features].map((feature) => (
                <p
                  key={feature}
                  className="flex items-center gap-2.5 rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3 text-sm text-slate-300"
                >
                  <Check className="h-4 w-4 shrink-0 text-emerald-400" strokeWidth={2.6} aria-hidden="true" />
                  {feature}
                </p>
              ))}
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button onClick={book} size="lg" icon={CalendarCheck} className="sm:flex-1">
                Réserver l’installation
              </Button>
              <Button onClick={reset} variant="secondary" size="lg" icon={RotateCcw}>
                Refaire une simulation
              </Button>
            </div>

            <p className="mt-4 text-center text-xs text-slate-400 sm:text-left">
              Tarif indicatif confirmé après vérification de la référence exacte de votre unité
              multimédia. Aucun acompte demandé à la réservation.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default function Retrofit({ hideHeading = false }) {
  return (
    <section
      id="retrofit"
      className={`relative scroll-mt-24 overflow-hidden pb-20 lg:pb-28 ${
        hideHeading ? 'pt-2 lg:pt-4' : 'pt-20 lg:pt-28'
      }`}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-ice/30 to-transparent" />
      <div className="pointer-events-none absolute -right-32 top-20 h-[420px] w-[420px] rounded-full bg-ice/5 blur-3xl" />

      <div className="container-x relative">
        {hideHeading ? null : (
          <SectionHeading
            eyebrow="Pôle rétrofit & multimédia"
            title="CarPlay et Android Auto,"
            highlight="sans toucher à l’origine"
            description="Nous intégrons Apple CarPlay et Android Auto sans fil directement dans votre écran d’usine. Molette, boutons au volant, caméras et enceintes d’origine restent intacts — et tout est réversible."
          />
        )}

        <div className="mt-14 grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Reveal className="overflow-hidden rounded-3xl border border-white/10 bg-carbon-900 shadow-card">
              <CarVisual
                scene="screen"
                variant="after"
                palette={['#101722', '#2E5C7E']}
                className="aspect-[16/10] w-full"
                title="Interface CarPlay intégrée à l’écran d’origine"
              />
            </Reveal>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {RETROFIT_BENEFITS.map((benefit, index) => (
                <Reveal
                  key={benefit.id}
                  delay={index * 80}
                  className="rounded-2xl border border-white/10 bg-carbon-850/60 p-5 transition-colors hover:border-ice/30"
                >
                  <Icon
                    name={benefit.icon}
                    className="h-5 w-5 text-ice"
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                  <p className="mt-3 text-sm font-semibold text-white">{benefit.title}</p>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-300">{benefit.text}</p>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal delay={120} className="lg:col-span-7">
            <Configurator />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
