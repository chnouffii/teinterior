import { ArrowRight, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import SectionHeading from '../ui/SectionHeading.jsx';
import Reveal from '../ui/Reveal.jsx';
import Icon from '../ui/Icon.jsx';
import { useSiteStore } from '../../store/siteStore';


/** Les trois métiers de l'atelier, chacun renvoyant vers sa page dédiée. */
export default function PoleOverview() {
  const poles = useSiteStore((state) => state.poles);
  return (
    <section id="poles" className="scroll-mt-24 py-12 lg:py-14">
      <div className="container-x">
        <SectionHeading
          eyebrow="Nos trois métiers"
          title="Un atelier,"
          highlight="trois expertises"
          description="Chaque pôle a sa page dédiée : formules et tarifs pour l’esthétique, recherche de compatibilité pour le rétrofit, estimation en ligne pour la vente."
        />

        <div className="mt-9 grid gap-5 lg:grid-cols-3">
          {poles.map((pole, index) => (
            <Reveal
              key={pole.id}
              delay={index * 90}
              className="group flex h-full flex-col rounded-lg border border-white/10 bg-ink-850 p-7 transition-colors duration-150 hover:border-white/25"
            >
              <span
                className={`flex h-12 w-12 items-center justify-center rounded-lg border ${
                  pole.accent === 'ice'
                    ? 'border-ice/30 bg-ice/10 text-ice'
                    : 'border-accent/30 bg-accent/10 text-accent'
                }`}
              >
                <Icon name={pole.icon} className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
              </span>

              <h3 className="mt-6 text-xl font-bold">{pole.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{pole.lead}</p>

              <ul className="mt-6 flex-1 space-y-2.5">
                {pole.points.map((point) => (
                  <li key={point} className="flex gap-2.5 text-sm text-muted">
                    <Check
                      className="mt-0.5 h-4 w-4 shrink-0 text-accent"
                      strokeWidth={2.6}
                      aria-hidden="true"
                    />
                    {point}
                  </li>
                ))}
              </ul>

              <Link
                to={pole.to}
                className="mt-7 inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold text-accent transition-colors hover:text-fg"
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
