import { ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import Reveal from '../ui/Reveal.jsx';
import StarRating from '../ui/StarRating.jsx';
import { ROUTES } from '../../data/site.js';
import { useSiteStore } from '../../store/siteStore';

export default function Testimonials({ limit = null, showAllLink = false }) {
  const testimonials = useSiteStore((state) => state.testimonials);
  const summary = useSiteStore((state) => state.reviewSummary);
  const items = limit ? testimonials.slice(0, limit) : testimonials;

  return (
    <section className="border-t border-white/5 py-12 lg:py-14">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="flex items-center gap-2 text-xs text-faint">
              <Star className="h-3.5 w-3.5 fill-accent text-accent" aria-hidden="true" />
              <span className="num text-muted">
                {summary.rating} / {summary.scale}
              </span>{' '}
              sur {summary.count} avis vérifiés
            </span>
            <h2 className="mt-3 text-xl font-bold sm:text-2xl">Ce que disent les clients</h2>
          </div>

          {showAllLink ? (
            <Link
              to={ROUTES.realisations}
              className="inline-flex min-h-[40px] items-center gap-2 text-sm font-semibold text-accent transition-colors hover:text-accent-soft"
            >
              Toutes les réalisations
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          ) : null}
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((testimonial, index) => (
            <Reveal
              key={testimonial.id}
              delay={(index % 3) * 60}
              className="flex h-full flex-col rounded-lg border border-white/10 bg-ink-900 p-5"
            >
              <StarRating rating={testimonial.rating} />
              <p className="mt-4 flex-1 text-sm leading-relaxed text-muted">
                « {testimonial.text} »
              </p>
              <div className="mt-5 border-t border-white/5 pt-4">
                <p className="text-sm font-semibold text-fg">{testimonial.name}</p>
                <p className="mt-0.5 text-[11px] text-faint">
                  {testimonial.city} · {testimonial.service} · {testimonial.date}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
