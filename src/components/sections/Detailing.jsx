import { useState } from 'react';
import { ArrowRight, Check, Clock, Plus } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading.jsx';
import Reveal from '../ui/Reveal.jsx';
import Button from '../ui/Button.jsx';
import BeforeAfterSlider from '../ui/BeforeAfterSlider.jsx';
import { useSiteStore } from '../../store/siteStore';
import { useQuote } from '../../context/QuoteContext.jsx';

/** Carte de formule : le détail du devis reste lisible, sans mise en tableau. */
function PackCard({ pack, onSelect, index }) {
  const popular = Boolean(pack.featured);

  return (
    <Reveal
      delay={index * 90}
      className={`group relative flex h-full flex-col rounded-lg border p-7 shadow-card
        transition-colors duration-150 hover:border-accent/50
        ${popular ? 'border-accent/50 bg-ink-850/80' : 'border-white/10 bg-ink-850'}`}
    >
      {popular ? (
        <span className="absolute -top-3 left-7 rounded-full bg-gradient-to-r from-accent-soft to-accent-deep px-3.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-accent-on">
          Le plus demandé
        </span>
      ) : null}

      <div className="flex items-start justify-between gap-4">
        <span className="num text-[11px] uppercase tracking-[0.16em] text-faint">{pack.ref}</span>
        <span className="chip">
          <Clock className="h-3 w-3" aria-hidden="true" />
          {pack.duration}
        </span>
      </div>

      <h3 className="mt-5 text-xl font-bold">{pack.name}</h3>
      <p className="mt-1 text-sm font-medium text-accent-soft">{pack.subtitle}</p>
      <p className="mt-4 text-sm leading-relaxed text-muted">{pack.summary}</p>

      <div className="mt-6 flex items-baseline gap-2">
        <span className="text-[11px] uppercase tracking-[0.16em] text-faint">à partir de</span>
        <span className="num font-display text-3xl font-bold text-fg">{pack.price} €</span>
      </div>
      <p className="mt-1 text-[11px] text-faint">{pack.priceNote}</p>

      <div className="my-6 hairline" />

      <ul className="flex-1 space-y-4">
        {pack.steps.map((step) => (
          <li key={step.label} className="flex gap-3">
            <Check
              className="mt-0.5 h-4 w-4 shrink-0 text-accent"
              strokeWidth={2.6}
              aria-hidden="true"
            />
            <span className="min-w-0">
              <span className="flex flex-wrap items-baseline justify-between gap-x-3">
                <span className="text-sm font-medium leading-snug text-fg">{step.label}</span>
                <span className="num text-[11px] text-faint">{step.duration}</span>
              </span>
              <span className="mt-1 block text-xs leading-relaxed text-muted">{step.detail}</span>
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex flex-wrap gap-1.5">
        {pack.products.map((product) => (
          <span key={product} className="chip">
            {product}
          </span>
        ))}
      </div>

      <p className="mt-5 rounded-lg border border-white/5 bg-white/[0.03] p-3 text-xs leading-relaxed text-faint">
        {pack.note}
      </p>

      <Button
        onClick={() => onSelect(pack)}
        variant={popular ? 'primary' : 'secondary'}
        size="md"
        iconRight={ArrowRight}
        className="mt-6 w-full"
      >
        Demander ce devis
      </Button>
    </Reveal>
  );
}

export default function Detailing({ hideHeading = false }) {
  const packs = useSiteStore((state) => state.packs);
  const options = useSiteStore((state) => state.options);
  const beforeAfter = useSiteStore((state) => state.beforeAfter);
  const { requestQuote } = useQuote();
  const [activeCase, setActiveCase] = useState(beforeAfter[0]?.id);

  const current = beforeAfter.find((item) => item.id === activeCase) ?? beforeAfter[0];

  const NOMBRES = ['Aucune formule', 'Une formule', 'Deux formules', 'Trois formules', 'Quatre formules', 'Cinq formules', 'Six formules'];
  const nombreFormules = NOMBRES[packs.length] ?? `${packs.length} formules`;

  const handleSelect = (pack) => {
    requestQuote({
      service: pack.id,
      message: `Bonjour, je souhaite un devis pour la prestation « ${pack.name} » (${pack.ref}, à partir de ${pack.price} €). Merci de me proposer un créneau.`,
      label: pack.name,
    });
  };

  return (
    <section className={`pb-20 lg:pb-28 ${hideHeading ? 'pt-6' : 'pt-20 lg:pt-28'}`}>
      <div className="container-x">
        {hideHeading ? (
          // Le titre de section porte le h2 de la page. Masqué, il laissait les
          // titres de cartes en h3 juste après le h1 : un lecteur d’écran y voit
          // un niveau manquant. On garde le h2, sans l’afficher.
          <h2 className="sr-only">Nos formules de detailing</h2>
        ) : (
          <SectionHeading
            eyebrow="Pôle esthétique auto"
            title="Detailing, correction de peinture,"
            highlight="céramique & teintage"
            // Le nombre suit les prestations réellement publiées : le texte
            // annonçait « Trois formules » même après en avoir ajouté une.
            description={`${nombreFormules}, détaillées opération par opération comme sur le devis que vous recevrez : produits utilisés, temps passé, résultat attendu.`}
          />
        )}

        <div className="mt-9 grid gap-5 lg:grid-cols-3">
          {packs.map((pack, index) => (
            <PackCard key={pack.id} pack={pack} index={index} onSelect={handleSelect} />
          ))}
        </div>

        <Reveal className="mt-8 rounded-lg border border-white/10 bg-ink-850/50 p-7">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h3 className="flex items-center gap-2 text-lg font-bold">
              <Plus className="h-5 w-5 text-accent" aria-hidden="true" />
              Options à la carte
            </h3>
            <p className="text-xs text-faint">
              Cumulables avec toutes les formules — tarifs TTC, véhicule de courtoisie sur demande.
            </p>
          </div>

          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {options.map((option) => (
              <li
                key={option.id}
                className="rounded-lg border border-white/5 bg-ink-900/60 px-5 py-4 transition-colors hover:border-accent/30"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-sm font-medium text-fg">{option.label}</span>
                  <span className="num shrink-0 text-sm font-semibold text-accent-soft">
                    {option.price}
                  </span>
                </div>
                <p className="mt-1.5 text-xs leading-relaxed text-muted">{option.detail}</p>
                <p className="num mt-2 text-[11px] text-faint">{option.duration}</p>
              </li>
            ))}
          </ul>
        </Reveal>

        {current ? (
          <div className="mt-20 grid items-center gap-10 lg:grid-cols-12">
            <Reveal className="lg:col-span-5">
              <span className="chip">Module interactif</span>
              <h3 className="mt-5 text-2xl font-bold sm:text-3xl">
                Faites glisser le curseur, jugez le résultat
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-muted">
                Prises de vue au même emplacement, sous le même éclairage d’atelier, avant et après
                intervention. Aucune retouche.
              </p>

              <div className="mt-7 flex flex-wrap gap-2">
                {beforeAfter.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveCase(item.id)}
                    className={`tap inline-flex items-center rounded-full border px-4 text-xs font-semibold transition-colors duration-150 ${
                      activeCase === item.id
                        ? 'border-accent bg-accent/15 text-accent-soft'
                        : 'border-white/10 bg-white/[0.03] text-muted hover:border-white/25 hover:text-fg'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <div className="mt-8 rounded-lg border border-white/10 bg-ink-900/60 p-6">
                <p className="text-xs uppercase tracking-[0.18em] text-faint">Véhicule</p>
                <p className="mt-1.5 font-display text-lg font-semibold text-fg">
                  {current.vehicle}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted">{current.summary}</p>

                <div className="mt-5 grid grid-cols-3 gap-3">
                  {current.specs.map((spec) => (
                    <div
                      key={spec.label}
                      className="rounded-lg border border-white/5 bg-ink-950/70 px-4 py-3"
                    >
                      <p className="num font-display text-xl font-bold text-accent">
                        {spec.value}
                      </p>
                      <p className="mt-1 text-[11px] uppercase tracking-wider text-faint">
                        {spec.label}
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
                beforeCaption={current.beforeCaption}
                afterCaption={current.afterCaption}
                beforeImage={current.beforeImage}
                afterImage={current.afterImage}
                reference={current.vehicle}
              />
            </Reveal>
          </div>
        ) : null}
      </div>
    </section>
  );
}
