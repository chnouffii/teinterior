import { useState } from 'react';
import { ArrowRight, Check, ChevronRight, RotateCcw } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading.jsx';
import Reveal from '../ui/Reveal.jsx';
import Button from '../ui/Button.jsx';
import { FITMENT } from '../../data/retrofit.js';
import { useSiteStore } from '../../store/siteStore';
import { useQuote } from '../../context/QuoteContext.jsx';

const FITMENT_TONES = {
  ok: 'border-signal-ok/40 bg-signal-ok/10 text-signal-ok',
  accent: 'border-accent/40 bg-accent/10 text-accent',
  warn: 'border-signal-warn/40 bg-signal-warn/10 text-signal-warn',
  neutral: 'border-white/20 bg-ink-800 text-faint',
};

/** Colonne du sélecteur : liste d'options, façon catalogue de pièces. */
function PickerColumn({ label, step, items, selectedId, onSelect, empty }) {
  return (
    <div className="flex min-h-[15rem] flex-col border-white/10 lg:border-r lg:last:border-r-0">
      <div className="flex items-center gap-2 border-b border-white/10 bg-ink-850 px-4 py-2.5">
        <span className="num text-[11px] text-accent">{step}</span>
        <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
          {label}
        </span>
      </div>

      <ul className="flex-1 overflow-y-auto">
        {items.length === 0 ? (
          <li className="px-4 py-6 text-xs text-faint">{empty}</li>
        ) : (
          items.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => onSelect(item.id)}
                aria-pressed={selectedId === item.id}
                className={`flex min-h-[46px] w-full items-center justify-between gap-3 border-b border-white/5 px-4 py-2.5 text-left text-sm transition-colors ${
                  selectedId === item.id
                    ? 'bg-accent/10 text-accent'
                    : 'text-muted hover:bg-ink-850 hover:text-fg'
                }`}
              >
                <span className="min-w-0">
                  <span className="block truncate">{item.label}</span>
                  {item.sub ? (
                    <span className="num block truncate text-[11px] text-faint">{item.sub}</span>
                  ) : null}
                </span>
                <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-60" aria-hidden="true" />
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

function Finder() {
  const catalogue = useSiteStore((state) => state.catalogue);
  const { requestQuote } = useQuote();
  const [brandId, setBrandId] = useState(null);
  const [modelId, setModelId] = useState(null);
  const [systemId, setSystemId] = useState(null);

  const brand = catalogue.find((item) => item.id === brandId) ?? null;
  const model = brand?.models.find((item) => item.id === modelId) ?? null;
  const system = model?.systems.find((item) => item.id === systemId) ?? null;
  const fitment = system ? FITMENT[system.fitment] : null;

  return (
    <div className="overflow-hidden rounded-lg border border-white/10 bg-ink-900">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-3">
        <h3 className="text-sm font-semibold text-fg">Recherche de compatibilité</h3>
        <button
          type="button"
          onClick={() => {
            setBrandId(null);
            setModelId(null);
            setSystemId(null);
          }}
          className="inline-flex items-center gap-1.5 text-[11px] text-faint transition-colors hover:text-fg"
        >
          <RotateCcw className="h-3 w-3" aria-hidden="true" />
          Réinitialiser
        </button>
      </div>

      <div className="grid divide-y divide-white/10 lg:grid-cols-3 lg:divide-y-0">
        <PickerColumn
          step="01"
          label="Marque"
          items={catalogue.map((item) => ({ id: item.id, label: item.brand }))}
          selectedId={brandId}
          onSelect={(id) => {
            setBrandId(id);
            setModelId(null);
            setSystemId(null);
          }}
          empty="Aucune marque"
        />
        <PickerColumn
          step="02"
          label="Modèle"
          items={(brand?.models ?? []).map((item) => ({
            id: item.id,
            label: item.model,
            sub: item.years,
          }))}
          selectedId={modelId}
          onSelect={(id) => {
            setModelId(id);
            setSystemId(null);
          }}
          empty="Choisissez d’abord une marque"
        />
        <PickerColumn
          step="03"
          label="Système d’origine"
          items={(model?.systems ?? []).map((item) => ({
            id: item.id,
            label: item.name,
            sub: item.ref,
          }))}
          selectedId={systemId}
          onSelect={setSystemId}
          empty="Choisissez d’abord un modèle"
        />
      </div>

      {system && fitment ? (
        <div className="border-t border-white/10 bg-ink-850">
          <div className="grid gap-px bg-white/10 sm:grid-cols-4">
            {[
              { label: 'Réf. interface', value: system.ref, mono: true },
              { label: 'Tarif indicatif', value: `${system.price} €`, mono: true },
              { label: 'Durée de pose', value: system.duration, mono: true },
              { label: 'Garantie', value: '2 ans', mono: false },
            ].map((cell) => (
              <div key={cell.label} className="bg-ink-850 px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-faint">
                  {cell.label}
                </p>
                <p className={`mt-1 text-sm font-semibold text-fg ${cell.mono ? 'num' : ''}`}>
                  {cell.value}
                </p>
              </div>
            ))}
          </div>

          <div className="border-t border-white/10 px-5 py-4">
            <span
              className={`inline-flex items-center gap-1.5 rounded-lg border px-2 py-1 text-[11px] font-semibold ${
                FITMENT_TONES[fitment.tone]
              }`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
              {fitment.label}
            </span>

            <p className="mt-3 text-sm leading-relaxed text-muted">{fitment.detail}</p>

            <dl className="mt-4 grid gap-3 text-xs sm:grid-cols-2">
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-faint">
                  Méthode de branchement
                </dt>
                <dd className="mt-1 text-muted">{system.harness}</dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-faint">
                  Note atelier
                </dt>
                <dd className="mt-1 text-muted">{system.note}</dd>
              </div>
            </dl>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button
                size="md"
                iconRight={ArrowRight}
                onClick={() =>
                  requestQuote({
                    service: 'retrofit',
                    message: `Bonjour, je souhaite réserver une installation CarPlay / Android Auto sur ma ${brand.brand} ${model.model} (${model.years}) équipée du système ${system.name}. Référence interface ${system.ref}, tarif indicatif ${system.price} €.`,
                    label: `${brand.brand} ${model.model}`,
                  })
                }
              >
                Réserver l’installation
              </Button>
              <p className="text-[11px] leading-relaxed text-faint">
                Tarif confirmé après vérification de la référence exacte de votre unité multimédia.
                Aucun acompte à la réservation.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <p className="border-t border-white/10 px-5 py-5 text-xs text-faint">
          Sélectionnez marque, modèle puis système d’origine pour afficher la compatibilité, la
          référence d’interface et le tarif.
        </p>
      )}
    </div>
  );
}

export default function Retrofit({ hideHeading = false }) {
  const retrofitFacts = useSiteStore((state) => state.retrofitFacts);
  const retrofitProcess = useSiteStore((state) => state.retrofitProcess);
  const retrofitKeeps = useSiteStore((state) => state.retrofitKeeps);
  return (
    <section className={`relative overflow-hidden pb-20 lg:pb-28 ${hideHeading ? 'pt-6' : 'pt-20 lg:pt-28'}`}>
      <div className="pointer-events-none absolute -right-32 top-20 h-[420px] w-[420px] rounded-full bg-ice/5 blur-3xl" />

      <div className="container-x relative">
        {hideHeading ? (
          // Le titre de section porte le h2 de la page. Masqué, il laissait les
          // titres de cartes en h3 juste après le h1 : un lecteur d’écran y voit
          // un niveau manquant. On garde le h2, sans l’afficher.
          <h2 className="sr-only">Forfaits de rétrofit CarPlay</h2>
        ) : (
          <SectionHeading
            eyebrow="Pôle rétrofit & multimédia"
            title="CarPlay et Android Auto,"
            highlight="sans toucher à l’origine"
            description="L’interface se branche entre l’écran et le faisceau d’usine. Molette, boutons au volant, caméras et enceintes restent d’origine — et tout est réversible en trente minutes."
          />
        )}

        <Reveal className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-white/10 bg-white/10 lg:grid-cols-4">
          {retrofitFacts.map((fact) => (
            <div key={fact.label} className="bg-ink-950/90 px-6 py-6 text-center">
              <p className="num font-display text-2xl font-bold text-fg">{fact.value}</p>
              <p className="mt-2 text-[11px] leading-snug text-faint">{fact.label}</p>
            </div>
          ))}
        </Reveal>

        <div className="mt-8 grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <h3 className="text-lg font-bold">Déroulé de l’intervention</h3>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {retrofitProcess.map((item, index) => (
                <Reveal
                  key={item.step}
                  delay={index * 60}
                  className="group relative overflow-hidden rounded-lg border border-white/10 bg-ink-850 p-5 transition-colors duration-150 hover:border-ice/40"
                >
                  <span className="pointer-events-none absolute -right-3 -top-5 font-display text-6xl font-extrabold text-white/[0.04] transition-colors duration-500 group-hover:text-ice/10">
                    {item.step}
                  </span>
                  <div className="flex items-baseline justify-between gap-3">
                    <h4 className="text-sm font-bold text-fg">{item.label}</h4>
                    <span className="num text-[11px] text-faint">{item.duration}</span>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-muted">{item.detail}</p>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal delay={80} className="lg:col-span-4">
            <div className="rounded-lg border border-ice/20 bg-ice/[0.04] p-6">
              <h3 className="text-base font-bold text-fg">Ce qui reste d’origine</h3>
              <ul className="mt-4 space-y-3">
                {retrofitKeeps.map((item) => (
                  <li key={item} className="flex gap-2.5 text-sm text-muted">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-ice" strokeWidth={2.6} aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-5 border-t border-white/10 pt-4 text-xs leading-relaxed text-faint">
                Dépose de l’interface et retour à la configuration d’usine en 30 minutes, sans trace :
                utile avant une reprise en concession.
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal delay={60} className="mt-8">
          <Finder />
        </Reveal>
      </div>
    </section>
  );
}
