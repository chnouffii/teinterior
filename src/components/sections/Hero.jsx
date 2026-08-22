import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../ui/Button.jsx';
import Reveal from '../ui/Reveal.jsx';
import CarVisual from '../ui/CarVisual.jsx';
import { ROUTES } from '../../data/site.js';
import { useSiteStore } from '../../store/siteStore';

export default function Hero() {
  const hero = useSiteStore((state) => state.hero);
  const packs = useSiteStore((state) => state.packs);
  const entryPrice = Math.min(...packs.map((pack) => pack.price));

  return (
    <section className="border-b border-ink-800 pt-24 lg:pt-28">
      <div className="container-x grid gap-12 pb-14 lg:grid-cols-12 lg:gap-10 lg:pb-16">
        <div className="lg:col-span-6">
          <Reveal>
            <span className="label-xs">{hero.kicker}</span>
          </Reveal>

          <Reveal delay={60}>
            <h1 className="mt-4 max-w-xl text-3xl font-extrabold leading-[1.08] sm:text-4xl lg:text-[2.9rem]">
              {hero.title}
            </h1>
          </Reveal>

          <Reveal delay={120}>
            <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
              {hero.subtitle}
            </p>
          </Reveal>

          <Reveal delay={180}>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button as={Link} to={ROUTES.prestations} size="lg" iconRight={ArrowRight}>
                {hero.primaryCta}
              </Button>
              <Button as={Link} to={ROUTES.vendre} variant="secondary" size="lg">
                {hero.secondaryCta}
              </Button>
            </div>
          </Reveal>

          <Reveal delay={240}>
            <p className="mt-5 text-xs text-faint">
              Devis gratuit sous 24 h ouvrées · prestations à partir de{' '}
              <span className="num text-muted">{entryPrice} €</span> · atelier sur rendez-vous
            </p>
          </Reveal>
        </div>

        <div className="lg:col-span-6">
          <Reveal delay={120}>
            <figure className="overflow-hidden rounded-lg border border-ink-700 bg-ink-900">
              <CarVisual
                scene="polish"
                variant="after"
                palette={['#1E242C', '#46505E']}
                className="aspect-[16/10] w-full"
                title="Berline traitée à l’atelier"
              />
              <figcaption className="flex flex-wrap items-center justify-between gap-3 border-t border-ink-700 px-4 py-3">
                <span className="text-xs text-muted">
                  Dernier passage : correction 2 passes + céramique
                </span>
                <span className="num text-[11px] text-faint">FULL-03 · 2 jours</span>
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </div>

      <div className="border-t border-ink-800">
        <div className="container-x grid grid-cols-2 divide-x divide-ink-800 lg:grid-cols-4">
          {hero.facts.map((fact) => (
            <div key={fact.label} className="px-4 py-5 first:pl-0 lg:px-6">
              <p className="num text-xl font-semibold text-fg sm:text-2xl">{fact.value}</p>
              <p className="mt-1.5 text-xs leading-snug text-faint">{fact.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
