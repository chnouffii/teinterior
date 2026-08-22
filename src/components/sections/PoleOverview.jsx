import { ArrowRight, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import SectionHeading from '../ui/SectionHeading.jsx';
import Reveal from '../ui/Reveal.jsx';
import Icon from '../ui/Icon.jsx';
import { POLES } from '../../data/site.js';

/** Les trois métiers de l'atelier, chacun renvoyant vers sa page dédiée. */
export default function PoleOverview() {
  return (
    <section id="poles" className="scroll-mt-24 py-20 lg:py-24">
      <div className="container-x">
        <SectionHeading
          eyebrow="Nos trois métiers"
          title="Un atelier,"
          highlight="trois expertises"
          description="Chaque pôle a sa page dédiée : formules et tarifs pour l’esthétique, configurateur de compatibilité pour le rétrofit, estimation en ligne pour la vente."
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {POLES.map((pole, index) => (
            <Reveal
              key={pole.id}
              delay={index * 90}
              className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-carbon-850/60 p-7 shadow-card backdrop-blur transition-all duration-300 hover:-translate-y-1.5 hover:border-brass/40"
            >
              <span
                className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${
                  pole.accent === 'ice'
                    ? 'border-ice/30 bg-ice/10 text-ice'
                    : 'border-brass/30 bg-brass/10 text-brass'
                }`}
              >
                <Icon name={pole.icon} className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
              </span>

              <span className="mt-6 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                {pole.eyebrow}
              </span>
              <h3 className="mt-2 text-xl font-bold">{pole.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">{pole.text}</p>

              <ul className="mt-6 flex-1 space-y-2.5">
                {pole.bullets.map((bullet) => (
                  <li key={bullet} className="flex gap-2.5 text-sm text-slate-300">
                    <Check
                      className="mt-0.5 h-4 w-4 shrink-0 text-brass"
                      strokeWidth={2.6}
                      aria-hidden="true"
                    />
                    {bullet}
                  </li>
                ))}
              </ul>

              <Link
                to={pole.to}
                className="mt-7 inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold text-brass-light transition-colors hover:text-white"
              >
                {pole.cta}
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
