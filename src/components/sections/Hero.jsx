import { ArrowRight, ChevronDown, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../ui/Button.jsx';
import Reveal from '../ui/Reveal.jsx';
import CarVisual from '../ui/CarVisual.jsx';
import { ROUTES } from '../../data/site.js';
import { useSiteStore } from '../../store/siteStore';
import useSmoothScroll from '../../hooks/useSmoothScroll.js';

export default function Hero() {
  const hero = useSiteStore((state) => state.hero);
  const packs = useSiteStore((state) => state.packs);
  const scrollTo = useSmoothScroll();
  const entryPrice = Math.min(...packs.map((pack) => pack.price));

  return (
    <section id="accueil" className="relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-24">
      <div className="pointer-events-none absolute inset-0 bg-grid-carbon bg-grid [mask-image:radial-gradient(70%_60%_at_50%_0%,black,transparent)]" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[560px] w-[860px] -translate-x-1/2 rounded-full bg-radial-brass blur-3xl" />

      <div className="container-x relative grid items-center gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-6">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted backdrop-blur">
              <Star className="h-3.5 w-3.5 fill-accent text-accent" aria-hidden="true" />
              {hero.kicker}
            </span>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="mt-7 text-4xl font-extrabold leading-[1.05] sm:text-5xl lg:text-[3.4rem]">
              Detailing, rétrofit CarPlay
              <span className="block text-gradient-brass">et vente de véhicules.</span>
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
              Devis gratuit sous 24 h ouvrées · prestations à partir de{' '}
              <span className="num font-semibold text-accent-soft">{entryPrice} €</span> · atelier
              sur rendez-vous
            </p>
          </Reveal>
        </div>

        <div className="lg:col-span-6">
          <Reveal delay={200} className="relative">
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-ink-900 shadow-card">
              <CarVisual
                scene="polish"
                variant="after"
                palette={['#141A24', '#3E5570']}
                className="aspect-[16/11] w-full"
                title="Berline traitée à l’atelier"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950 via-transparent to-transparent" />

              <div className="absolute inset-x-5 bottom-5 flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-white/10 bg-ink-950/80 p-4 backdrop-blur-xl">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-faint">
                    Dernier passage atelier
                  </p>
                  <p className="mt-1 text-sm font-semibold text-fg">
                    Correction 2 passes + céramique 9H
                  </p>
                </div>
                <span className="rounded-full border border-signal-ok/30 bg-signal-ok/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-signal-ok">
                  Livrée en 48 h
                </span>
              </div>
            </div>

            <div className="absolute -left-3 top-8 hidden animate-float rounded-3xl border border-white/10 bg-ink-900/90 p-4 shadow-card backdrop-blur-xl sm:block">
              <p className="text-[11px] uppercase tracking-[0.18em] text-faint">Devis moyen</p>
              <p className="mt-1 font-display text-xl font-bold text-fg">
                sous <span className="text-gradient-brass">24 h</span>
              </p>
            </div>

            <div
              className="absolute -right-3 bottom-24 hidden animate-float rounded-3xl border border-white/10 bg-ink-900/90 p-4 shadow-card backdrop-blur-xl sm:block"
              style={{ animationDelay: '1.4s' }}
            >
              <p className="text-[11px] uppercase tracking-[0.18em] text-faint">Rétrofits posés</p>
              <p className="mt-1 font-display text-xl font-bold text-fg">380 véhicules</p>
            </div>
          </Reveal>
        </div>
      </div>

      <div className="container-x relative mt-16 lg:mt-20">
        <Reveal className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 lg:grid-cols-4">
          {hero.facts.map((fact) => (
            <div key={fact.label} className="bg-ink-950/90 px-6 py-7 text-center">
              <p className="num font-display text-2xl font-bold text-fg sm:text-3xl">{fact.value}</p>
              <p className="mt-2 text-xs leading-snug text-faint">{fact.label}</p>
            </div>
          ))}
        </Reveal>

        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={() => scrollTo('poles')}
            className="group inline-flex min-h-[44px] flex-col items-center gap-2 text-xs uppercase tracking-[0.2em] text-faint transition-colors hover:text-accent-soft"
          >
            Découvrir nos trois pôles
            <ChevronDown
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5"
              aria-hidden="true"
            />
          </button>
        </div>
      </div>
    </section>
  );
}
