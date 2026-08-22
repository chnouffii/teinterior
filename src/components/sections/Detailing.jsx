import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading.jsx';
import Reveal from '../ui/Reveal.jsx';
import Button from '../ui/Button.jsx';
import BeforeAfterSlider from '../ui/BeforeAfterSlider.jsx';
import { useSiteStore } from '../../store/siteStore';
import { useQuote } from '../../context/QuoteContext.jsx';

/** Une prestation présentée comme un devis : lignes d'opérations, détails, durées. */
function PackSheet({ pack, onSelect, index }) {
  return (
    <Reveal delay={index * 60} className="overflow-hidden rounded-lg border border-ink-700 bg-ink-900">
      <header className="flex flex-wrap items-start justify-between gap-4 border-b border-ink-700 px-5 py-4">
        <div>
          <span className="num text-[11px] text-faint">{pack.ref}</span>
          <h3 className="mt-1 text-lg font-bold">{pack.name}</h3>
          <p className="mt-0.5 text-xs text-muted">{pack.subtitle}</p>
        </div>
        <div className="text-right">
          <p className="num text-2xl font-bold text-fg">{pack.price} €</p>
          <p className="mt-0.5 text-[11px] text-faint">{pack.priceNote}</p>
        </div>
      </header>

      <div className="grid gap-px bg-ink-800 lg:grid-cols-12">
        <div className="bg-ink-900 p-5 lg:col-span-4">
          <p className="text-sm leading-relaxed text-muted">{pack.summary}</p>

          <dl className="mt-5 space-y-3 border-t border-ink-800 pt-5 text-xs">
            <div className="flex justify-between gap-3">
              <dt className="text-faint">Temps d’intervention</dt>
              <dd className="num text-fg">{pack.duration}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-faint">Immobilisation</dt>
              <dd className="text-right text-muted">{pack.immobilisation}</dd>
            </div>
            <div>
              <dt className="text-faint">Produits et outillage</dt>
              <dd className="mt-1.5 flex flex-wrap gap-1.5">
                {pack.products.map((product) => (
                  <span key={product} className="chip">
                    {product}
                  </span>
                ))}
              </dd>
            </div>
          </dl>
        </div>

        <div className="bg-ink-900 lg:col-span-8">
          <table className="w-full border-collapse text-sm">
            <caption className="sr-only">Opérations incluses dans {pack.name}</caption>
            <thead>
              <tr className="border-b border-ink-800 text-left">
                <th className="px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-faint">
                  Opération
                </th>
                <th className="hidden px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-faint sm:table-cell">
                  Détail
                </th>
                <th className="px-5 py-2.5 text-right text-[11px] font-semibold uppercase tracking-wider text-faint">
                  Durée
                </th>
              </tr>
            </thead>
            <tbody>
              {pack.steps.map((step, position) => (
                <tr key={step.label} className="border-b border-ink-800 align-top last:border-0">
                  <td className="px-5 py-3">
                    <span className="num mr-2 text-xs text-faint">
                      {String(position + 1).padStart(2, '0')}
                    </span>
                    <span className="font-medium text-fg">{step.label}</span>
                    <span className="mt-1 block text-xs text-muted sm:hidden">{step.detail}</span>
                  </td>
                  <td className="hidden px-3 py-3 text-xs leading-relaxed text-muted sm:table-cell">
                    {step.detail}
                  </td>
                  <td className="num px-5 py-3 text-right text-xs text-muted">{step.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-ink-700 px-5 py-4">
        <p className="max-w-xl text-xs leading-relaxed text-faint">{pack.note}</p>
        <Button onClick={() => onSelect(pack)} size="sm" iconRight={ArrowRight}>
          Demander ce devis
        </Button>
      </footer>
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

  const handleSelect = (pack) => {
    requestQuote({
      service: pack.id,
      message: `Bonjour, je souhaite un devis pour la prestation « ${pack.name} » (${pack.ref}, à partir de ${pack.price} €). Merci de me proposer un créneau.`,
      label: pack.name,
    });
  };

  return (
    <section className={`pb-16 lg:pb-20 ${hideHeading ? 'pt-8' : 'pt-16 lg:pt-20'}`}>
      <div className="container-x">
        {hideHeading ? null : (
          <SectionHeading
            index="02 — Esthétique"
            title="Detailing, correction de peinture, céramique et teintage"
            description="Trois prestations, détaillées ligne par ligne comme sur le devis que vous recevrez."
          />
        )}

        <div className="mt-10 space-y-5">
          {packs.map((pack, index) => (
            <PackSheet key={pack.id} pack={pack} index={index} onSelect={handleSelect} />
          ))}
        </div>

        <Reveal className="mt-5 overflow-hidden rounded-lg border border-ink-700">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink-700 bg-ink-850 px-5 py-3">
            <h3 className="text-sm font-semibold text-fg">Options à la carte</h3>
            <p className="text-[11px] text-faint">Cumulables avec toutes les prestations · TTC</p>
          </div>
          <table className="w-full border-collapse bg-ink-900 text-sm">
            <tbody>
              {options.map((option) => (
                <tr key={option.id} className="border-b border-ink-800 align-top last:border-0">
                  <td className="px-5 py-3">
                    <span className="font-medium text-fg">{option.label}</span>
                    <span className="mt-1 block text-xs text-muted">{option.detail}</span>
                  </td>
                  <td className="num whitespace-nowrap px-3 py-3 text-right text-xs text-faint">
                    {option.duration}
                  </td>
                  <td className="num whitespace-nowrap px-5 py-3 text-right font-semibold text-fg">
                    {option.price}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Reveal>

        {current ? (
          <div className="mt-16 grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <Reveal>
                <h3 className="text-lg font-bold">Avant / après</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  Prises de vue au même emplacement, sous le même éclairage d’atelier. Aucune
                  retouche.
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {beforeAfter.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveCase(item.id)}
                      className={`inline-flex min-h-[38px] items-center rounded-md border px-3 text-xs font-semibold transition-colors ${
                        activeCase === item.id
                          ? 'border-accent/50 bg-accent/10 text-accent'
                          : 'border-ink-700 text-muted hover:border-ink-600 hover:text-fg'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>

                <div className="mt-6 rounded-lg border border-ink-700 bg-ink-900 p-5">
                  <p className="text-sm font-semibold text-fg">{current.vehicle}</p>
                  <p className="mt-2 text-xs leading-relaxed text-muted">{current.summary}</p>
                  <dl className="mt-4 grid grid-cols-3 gap-px overflow-hidden rounded border border-ink-800 bg-ink-800">
                    {current.specs.map((spec) => (
                      <div key={spec.label} className="bg-ink-900 px-3 py-2.5">
                        <dt className="text-[10px] uppercase tracking-wider text-faint">
                          {spec.label}
                        </dt>
                        <dd className="num mt-1 text-sm font-semibold text-fg">{spec.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </Reveal>
            </div>

            <Reveal delay={80} className="lg:col-span-8">
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
