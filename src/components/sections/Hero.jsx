import { ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../ui/Button.jsx';
import Reveal from '../ui/Reveal.jsx';
import DernierChantier from './DernierChantier.jsx';
import { ROUTES } from '../../data/site.js';
import { useSiteStore } from '../../store/siteStore';

export default function Hero() {
  const hero = useSiteStore((state) => state.hero);
  const lastJob = useSiteStore((state) => state.lastJob);
  const packs = useSiteStore((state) => state.packs);
  // `Math.min()` sans argument vaut Infinity : sans ce garde, supprimer la
  // dernière prestation depuis le panel afficherait « à partir de Infinity € ».
  const prix = packs.map((pack) => pack.price).filter((p) => Number.isFinite(p) && p > 0);
  const entryPrice = prix.length > 0 ? Math.min(...prix) : null;

  return (
    <section id="accueil" className="pt-28 pb-12 lg:pt-30 lg:pb-14">
      <div className="container-x grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
        <div className={lastJob?.enabled ? 'lg:col-span-6' : 'lg:col-span-9'}>
          <Reveal>
            <span className="flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-faint">
              <Star className="h-3.5 w-3.5 fill-accent text-accent" aria-hidden="true" />
              {hero.kicker}
            </span>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="mt-6 text-4xl font-extrabold leading-[1.05] sm:text-5xl lg:text-[3.25rem]">
              {hero.title}
            </h1>
          </Reveal>

          <Reveal delay={160}>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
              {hero.subtitle}
            </p>
          </Reveal>

          <Reveal delay={240}>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button as={Link} to={ROUTES.prestations} size="lg" iconRight={ArrowRight}>
                {hero.primaryCta}
              </Button>
              <Button
                as={Link}
                to={ROUTES.vendre}
                variant="secondary"
                size="lg"
                iconRight={ArrowRight}
              >
                {hero.secondaryCta}
              </Button>
            </div>
          </Reveal>

          <Reveal delay={320}>
            <p className="mt-6 text-xs text-faint">
              Devis gratuit sous 24 h ouvrées
              {entryPrice === null ? null : (
                <>
                  {' '}· prestations à partir de{' '}
                  <span className="num font-semibold text-accent-soft">{entryPrice} €</span>
                </>
              )}{' '}
              · atelier sur rendez-vous
            </p>
          </Reveal>
        </div>

        {/* Masquable depuis Admin → Page d'accueil : entre deux chantiers
            dignes d'être montrés, mieux vaut ne rien afficher. */}
        {lastJob?.enabled ? (
          <div className="lg:col-span-6">
            <Reveal delay={200} className="relative">
              <DernierChantier chantier={lastJob} />
            </Reveal>
          </div>
        ) : null}
      </div>

      <div className="container-x relative mt-16 lg:mt-20">
        <Reveal className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-white/10 bg-white/10 lg:grid-cols-4">
          {hero.facts.map((fact) => (
            <div key={fact.label} className="bg-ink-950/90 px-6 py-7 text-center">
              <p className="num font-display text-2xl font-bold text-fg sm:text-3xl">{fact.value}</p>
              <p className="mt-2 text-xs leading-snug text-faint">{fact.label}</p>
            </div>
          ))}
        </Reveal>

      </div>
    </section>
  );
}
