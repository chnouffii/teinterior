import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import SectionHeading from '../ui/SectionHeading.jsx';
import Reveal from '../ui/Reveal.jsx';
import { POLES } from '../../data/site.js';

/** Les trois métiers de l'atelier, chacun renvoyant vers sa page. */
export default function PoleOverview() {
  return (
    <section className="border-b border-ink-800 py-16 lg:py-20">
      <div className="container-x">
        <SectionHeading
          index="01 — Métiers"
          title="Trois activités, un seul atelier"
          description="Chaque pôle a sa page : détail des opérations et tarifs pour l’esthétique, recherche de compatibilité pour le rétrofit, estimation en ligne pour la vente."
        />

        <div className="mt-10 grid gap-px overflow-hidden rounded-lg border border-ink-700 bg-ink-700 lg:grid-cols-3">
          {POLES.map((pole, index) => (
            <Reveal
              key={pole.id}
              delay={index * 70}
              className="group flex h-full flex-col bg-ink-900 p-6 transition-colors duration-200 hover:bg-ink-850"
            >
              <span className="num text-xs font-semibold text-accent">{pole.index}</span>
              <h3 className="mt-3 text-lg font-bold">{pole.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{pole.lead}</p>

              <ul className="mt-5 flex-1 space-y-2 border-t border-ink-800 pt-5">
                {pole.points.map((point) => (
                  <li key={point} className="flex gap-2.5 text-xs text-muted">
                    <span className="mt-1.5 h-1 w-1 shrink-0 bg-accent" />
                    {point}
                  </li>
                ))}
              </ul>

              <Link
                to={pole.to}
                className="mt-6 inline-flex min-h-[40px] items-center gap-2 text-sm font-semibold text-accent transition-colors hover:text-accent-soft"
              >
                {pole.cta}
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-1"
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
