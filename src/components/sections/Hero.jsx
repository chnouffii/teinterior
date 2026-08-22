import { ArrowRight, ChevronDown, MousePointerClick, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../ui/Button.jsx';
import Icon from '../ui/Icon.jsx';
import Reveal from '../ui/Reveal.jsx';
import CarVisual from '../ui/CarVisual.jsx';
import { REASSURANCE, ROUTES, STATS } from '../../data/site.js';
import useSmoothScroll from '../../hooks/useSmoothScroll.js';

export default function Hero() {
  const scrollTo = useSmoothScroll();

  return (
    <section id="accueil" className="relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-28">
      <div className="pointer-events-none absolute inset-0 bg-grid-carbon bg-grid [mask-image:radial-gradient(70%_60%_at_50%_0%,black,transparent)]" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[560px] w-[860px] -translate-x-1/2 rounded-full bg-radial-brass blur-3xl" />

      <div className="container-x relative grid items-center gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-6">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-300 backdrop-blur">
              <Star className="h-3.5 w-3.5 fill-brass text-brass" aria-hidden="true" />
              4,9/5 sur 214 avis clients
            </span>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="mt-7 text-4xl font-extrabold leading-[1.05] sm:text-5xl lg:text-[3.6rem]">
              Votre voiture mérite
              <span className="block text-gradient-brass">un traitement d’exception.</span>
            </h1>
          </Reveal>

          <Reveal delay={160}>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
              Detailing haut de gamme, polissage, céramique et teintage de vitres. Intégration
              CarPlay et Android Auto sans toucher au système d’origine. Et quand vient le moment
              de changer de véhicule, nous gérons la vente de A à Z.
            </p>
          </Reveal>

          <Reveal delay={240}>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button as={Link} to={ROUTES.prestations} size="lg" iconRight={ArrowRight}>
                Réserver un soin
              </Button>
              <Button
                as={Link}
                to={ROUTES.vendre}
                variant="secondary"
                size="lg"
                iconRight={ArrowRight}
              >
                Vendre mon véhicule
              </Button>
            </div>
          </Reveal>

          <Reveal delay={320}>
            <ul className="mt-11 grid gap-4 sm:grid-cols-3">
              {REASSURANCE.map((item) => (
                <li
                  key={item.id}
                  className="glass rounded-2xl p-4 transition-colors duration-300 hover:border-brass/30"
                >
                  <Icon
                    name={item.icon}
                    className="h-5 w-5 text-brass"
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                  <p className="mt-3 text-sm font-semibold text-white">{item.title}</p>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-300">{item.text}</p>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <div className="lg:col-span-6">
          <Reveal delay={200} className="relative">
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-carbon-900 shadow-card">
              <CarVisual
                scene="polish"
                variant="after"
                palette={['#141A24', '#3E5570']}
                className="aspect-[16/11] w-full"
                title="Berline traitée par Teintérior"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-carbon-950 via-transparent to-transparent" />

              <div className="absolute inset-x-5 bottom-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-carbon-950/80 p-4 backdrop-blur-xl">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                    Dernier passage atelier
                  </p>
                  <p className="mt-1 text-sm font-semibold text-white">
                    Correction 2 passes + céramique 9H
                  </p>
                </div>
                <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-emerald-300">
                  Livrée en 48 h
                </span>
              </div>
            </div>

            <div className="absolute -left-3 top-8 hidden animate-float rounded-2xl border border-white/10 bg-carbon-900/90 p-4 shadow-card backdrop-blur-xl sm:block">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Devis moyen</p>
              <p className="mt-1 font-display text-xl font-bold text-white">
                sous <span className="text-gradient-brass">24 h</span>
              </p>
            </div>

            <div
              className="absolute -right-3 bottom-24 hidden animate-float rounded-2xl border border-white/10 bg-carbon-900/90 p-4 shadow-card backdrop-blur-xl sm:block"
              style={{ animationDelay: '1.4s' }}
            >
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Rétrofit posés</p>
              <p className="mt-1 font-display text-xl font-bold text-white">380 véhicules</p>
            </div>
          </Reveal>
        </div>
      </div>

      <div className="container-x relative mt-16 lg:mt-24">
        <Reveal className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 lg:grid-cols-4">
          {STATS.map((stat) => (
            <div key={stat.id} className="bg-carbon-950/90 px-6 py-7 text-center">
              <p className="font-display text-2xl font-bold text-white sm:text-3xl">{stat.value}</p>
              <p className="mt-2 text-xs uppercase tracking-[0.16em] text-slate-400">{stat.label}</p>
            </div>
          ))}
        </Reveal>

        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={() => scrollTo('poles')}
            className="group inline-flex min-h-[44px] flex-col items-center gap-2 text-xs uppercase tracking-[0.2em] text-slate-400 transition-colors hover:text-brass-light"
          >
            <MousePointerClick className="h-4 w-4" aria-hidden="true" />
            Découvrir nos trois pôles
            <ChevronDown
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5 group-hover:text-brass"
              aria-hidden="true"
            />
          </button>
        </div>
      </div>
    </section>
  );
}
