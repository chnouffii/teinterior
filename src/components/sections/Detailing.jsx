import { useState } from 'react';
import { ArrowRight, Check, Clock, Plus, Target } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading.jsx';
import Reveal from '../ui/Reveal.jsx';
import Button from '../ui/Button.jsx';
import Icon from '../ui/Icon.jsx';
import BeforeAfterSlider from '../ui/BeforeAfterSlider.jsx';
import { BEFORE_AFTER, DETAILING_OPTIONS, DETAILING_PACKAGES } from '../../data/packages.js';
import { useQuote } from '../../context/QuoteContext.jsx';

const SCENE_PALETTES = {
  polish: ['#16101A', '#5A2740'],
  tint: ['#101820', '#2E4A5C'],
  interior: ['#1A150F', '#5A4530'],
};

function PackageCard({ pack, onSelect, index }) {
  const accentRing = pack.popular ? 'border-brass/50' : 'border-white/10';

  return (
    <Reveal
      delay={index * 90}
      className={`group relative flex h-full flex-col rounded-3xl border ${accentRing} bg-carbon-850/70 p-7
        shadow-card backdrop-blur transition-all duration-300 hover:-translate-y-1.5 hover:border-brass/50
        ${pack.popular ? 'sm:col-span-2 lg:col-span-1' : ''}`}
    >
      {pack.popular ? (
        <span className="absolute -top-3 left-7 rounded-full bg-gradient-to-r from-brass-light to-brass-deep px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-carbon-950">
          Le plus demandé
        </span>
      ) : null}

      <div className="flex items-start justify-between gap-4">
        <span
          className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${
            pack.accent === 'ice'
              ? 'border-ice/30 bg-ice/10 text-ice'
              : 'border-brass/30 bg-brass/10 text-brass'
          }`}
        >
          <Icon name={pack.icon} className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
        </span>
        <span className="chip">
          <Clock className="h-3 w-3" aria-hidden="true" />
          {pack.duration}
        </span>
      </div>

      <h3 className="mt-6 text-xl font-bold">{pack.name}</h3>
      <p className="mt-1 text-sm font-medium text-brass-light">{pack.tagline}</p>
      <p className="mt-4 text-sm leading-relaxed text-slate-300">{pack.description}</p>

      <div className="mt-6 flex items-baseline gap-2">
        <span className="text-[11px] uppercase tracking-[0.16em] text-slate-400">
          {pack.priceSuffix}
        </span>
        <span className="font-display text-3xl font-bold text-white">{pack.price} €</span>
      </div>

      <div className="my-6 hairline" />

      <ul className="flex-1 space-y-3">
        {pack.includes.map((item) => (
          <li key={item} className="flex gap-3 text-sm text-slate-300">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-brass" strokeWidth={2.6} aria-hidden="true" />
            <span className="leading-snug">{item}</span>
          </li>
        ))}
      </ul>

      <p className="mt-6 flex gap-2 rounded-2xl border border-white/5 bg-white/[0.03] p-3 text-xs leading-relaxed text-slate-300">
        <Target className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ice" aria-hidden="true" />
        <span>
          <span className="font-semibold text-slate-300">Idéal pour :</span> {pack.idealFor}
        </span>
      </p>

      <Button
        onClick={() => onSelect(pack)}
        variant={pack.popular ? 'primary' : 'secondary'}
        size="md"
        iconRight={ArrowRight}
        className="mt-6 w-full"
      >
        Réserver cette formule
      </Button>
    </Reveal>
  );
}

export default function Detailing({ hideHeading = false }) {
  const { requestQuote } = useQuote();
  const [activeCase, setActiveCase] = useState(BEFORE_AFTER[0].id);
  const current = BEFORE_AFTER.find((item) => item.id === activeCase) ?? BEFORE_AFTER[0];

  const handleSelect = (pack) => {
    requestQuote({
      service:
        pack.id === 'interieur'
          ? 'detailing-interieur'
          : pack.id === 'exterieur'
          ? 'detailing-exterieur'
          : 'renovation-integrale',
      message: `Bonjour, je souhaite réserver la formule « ${pack.name} » (${pack.priceSuffix} ${pack.price} €). Merci de me proposer un créneau.`,
      label: pack.name,
    });
  };

  return (
    <section
      id="prestations"
      className={`scroll-mt-24 pb-20 lg:pb-28 ${
        hideHeading ? 'pt-2 lg:pt-4' : 'pt-20 lg:pt-28'
      }`}
    >
      <div className="container-x">
        {hideHeading ? null : (
          <SectionHeading
            eyebrow="Pôle esthétique auto"
            title="Detailing, polissage, céramique"
            highlight="& teintage"
            description="Trois formules claires, des tarifs annoncés à l’avance et un protocole détaillé étape par étape. Chaque véhicule est photographié avant et après passage à l’atelier."
          />
        )}

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {DETAILING_PACKAGES.map((pack, index) => (
            <PackageCard key={pack.id} pack={pack} index={index} onSelect={handleSelect} />
          ))}
        </div>

        <Reveal className="mt-8 rounded-3xl border border-white/10 bg-carbon-850/50 p-7 backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h3 className="flex items-center gap-2 text-lg font-bold">
              <Plus className="h-5 w-5 text-brass" aria-hidden="true" />
              Options à la carte
            </h3>
            <p className="text-xs text-slate-400">
              Cumulables avec toutes les formules — tarifs TTC, véhicule de courtoisie sur demande.
            </p>
          </div>

          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {DETAILING_OPTIONS.map((option) => (
              <li
                key={option.id}
                className="flex items-center justify-between gap-4 rounded-2xl border border-white/5 bg-carbon-900/60 px-4 py-3.5 transition-colors hover:border-brass/30"
              >
                <span className="flex items-center gap-3 text-sm text-slate-300">
                  <Icon
                    name={option.icon}
                    className="h-4 w-4 shrink-0 text-brass"
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                  {option.label}
                </span>
                <span className="shrink-0 text-sm font-semibold text-white">{option.price}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        <div className="mt-20 grid items-center gap-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <span className="chip">Module interactif</span>
            <h3 className="mt-5 text-2xl font-bold sm:text-3xl">
              Faites glisser le curseur, jugez le résultat
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-slate-300">
              Aucun retouche photo, aucun filtre : nos comparatifs sont réalisés au même endroit,
              avec le même éclairage d’atelier, avant et après intervention.
            </p>

            <div className="mt-7 flex flex-wrap gap-2">
              {BEFORE_AFTER.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveCase(item.id)}
                  className={`tap inline-flex items-center rounded-full border px-4 py-2 text-xs font-semibold transition-all duration-300 ${
                    activeCase === item.id
                      ? 'border-brass bg-brass/15 text-brass-light'
                      : 'border-white/10 bg-white/[0.03] text-slate-300 hover:border-white/25 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="mt-8 rounded-3xl border border-white/10 bg-carbon-900/60 p-6">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Véhicule</p>
              <p className="mt-1.5 font-display text-lg font-semibold text-white">
                {current.vehicle}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">{current.summary}</p>

              <div className="mt-5 grid grid-cols-2 gap-3">
                {current.stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl border border-white/5 bg-carbon-950/70 px-4 py-3"
                  >
                    <p className="font-display text-xl font-bold text-gradient-brass">{stat.value}</p>
                    <p className="mt-1 text-[11px] uppercase tracking-wider text-slate-400">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={120} className="lg:col-span-7">
            <BeforeAfterSlider
              key={current.id}
              scene={current.scene}
              palette={SCENE_PALETTES[current.scene] ?? SCENE_PALETTES.polish}
              beforeCaption={current.beforeCaption}
              afterCaption={current.afterCaption}
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
