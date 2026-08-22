import { useState } from 'react';
import SectionHeading from '../ui/SectionHeading.jsx';
import Reveal from '../ui/Reveal.jsx';
import Icon from '../ui/Icon.jsx';
import CarVisual from '../ui/CarVisual.jsx';
import { GALLERY_FILTERS, GALLERY_ITEMS } from '../../data/gallery.js';

function GalleryCard({ item, index }) {
  return (
    <Reveal
      delay={(index % 3) * 90}
      className="group relative overflow-hidden rounded-3xl border border-white/10 bg-carbon-900 shadow-card"
    >
      <CarVisual
        scene={item.scene}
        variant="after"
        palette={item.palette}
        className="aspect-[4/3] w-full transition-transform duration-700 group-hover:scale-105"
        title={item.title}
      />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-carbon-950 via-carbon-950/25 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 p-5">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-carbon-950/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-brass-light backdrop-blur">
          <Icon name={item.icon} className="h-3 w-3" aria-hidden="true" />
          {item.subtitle}
        </span>

        <h3 className="mt-3 text-base font-bold leading-snug text-white">{item.title}</h3>

        <p className="mt-1 max-h-0 overflow-hidden text-xs text-slate-300 opacity-0 transition-all duration-500 group-hover:max-h-12 group-hover:opacity-100">
          {item.meta}
        </p>
      </div>
    </Reveal>
  );
}

/** Galerie filtrable des réalisations de l'atelier. */
export default function Gallery({ hideHeading = false, limit = null }) {
  const [filter, setFilter] = useState('tous');

  const filtered =
    filter === 'tous' ? GALLERY_ITEMS : GALLERY_ITEMS.filter((item) => item.category === filter);
  const items = limit ? filtered.slice(0, limit) : filtered;

  return (
    <section
      id="realisations"
      className={`scroll-mt-24 pb-16 lg:pb-20 ${hideHeading ? 'pt-2 lg:pt-4' : 'pt-20 lg:pt-28'}`}
    >
      <div className="container-x">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          {hideHeading ? null : (
            <SectionHeading
              eyebrow="Réalisations"
              title="Ce qui sort"
              highlight="de notre atelier"
              description="Un aperçu des véhicules passés entre nos mains ces derniers mois — detailing, rétrofits multimédia et véhicules vendus pour le compte de nos clients."
            />
          )}

          <Reveal delay={100} className="flex flex-wrap gap-2">
            {GALLERY_FILTERS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setFilter(item.id)}
                aria-pressed={filter === item.id}
                className={`tap inline-flex items-center rounded-full border px-4 py-2 text-xs font-semibold transition-all duration-300 ${
                  filter === item.id
                    ? 'border-brass bg-brass/15 text-brass-light'
                    : 'border-white/10 bg-white/[0.03] text-slate-300 hover:border-white/25 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </Reveal>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => (
            <GalleryCard key={item.id} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
