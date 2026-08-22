import { ArrowRight, Quote, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import Reveal from '../ui/Reveal.jsx';
import StarRating from '../ui/StarRating.jsx';
import { TESTIMONIALS } from '../../data/gallery.js';
import { ROUTES } from '../../data/site.js';

/** Avis clients notés 5 étoiles — limitables pour un aperçu en page d'accueil. */
export default function Testimonials({ limit = null, showAllLink = false }) {
  const items = limit ? TESTIMONIALS.slice(0, limit) : TESTIMONIALS;

  return (
    <section className="py-16 lg:py-20">
      <div className="container-x">
        <Reveal className="flex flex-col items-center gap-4 text-center">
          <span className="flex items-center gap-2 rounded-full border border-brass/30 bg-brass/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-brass-light">
            <Star className="h-3.5 w-3.5 fill-brass text-brass" aria-hidden="true" />
            4,9/5 — 214 avis vérifiés
          </span>
          <h2 className="max-w-2xl text-2xl font-bold sm:text-3xl">
            Ce que disent les clients qui nous confient leur voiture
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {items.map((testimonial, index) => (
            <Reveal
              key={testimonial.id}
              delay={(index % 3) * 90}
              className="flex h-full flex-col rounded-3xl border border-white/10 bg-carbon-850/60 p-6 transition-colors duration-300 hover:border-brass/30"
            >
              <div className="flex items-start justify-between gap-3">
                <StarRating rating={testimonial.rating} />
                <Quote className="h-6 w-6 text-brass/30" aria-hidden="true" />
              </div>

              <p className="mt-4 flex-1 text-sm leading-relaxed text-slate-300">
                « {testimonial.text} »
              </p>

              <div className="mt-6 flex items-center gap-3 border-t border-white/5 pt-5">
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-brass/30 bg-brass/10 font-display text-sm font-bold text-brass-light">
                  {testimonial.name.charAt(0)}
                </span>
                <div>
                  <p className="text-sm font-semibold text-white">{testimonial.name}</p>
                  <p className="text-xs text-slate-400">
                    {testimonial.city} · {testimonial.service} · {testimonial.date}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {showAllLink ? (
          <Reveal delay={120} className="mt-10 flex justify-center">
            <Link
              to={ROUTES.realisations}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-6 text-sm font-semibold text-white transition-colors hover:border-brass/50 hover:text-brass-light"
            >
              Voir toutes les réalisations et tous les avis
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
