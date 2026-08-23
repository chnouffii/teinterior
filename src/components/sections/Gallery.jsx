import { useState } from 'react';
import SectionHeading from '../ui/SectionHeading.jsx';
import Reveal from '../ui/Reveal.jsx';
import CarVisual from '../ui/CarVisual.jsx';

import { useSiteStore } from '../../store/siteStore';

export default function Gallery({ hideHeading = false, limit = null }) {
  const galleryFilters = useSiteStore((state) => state.galleryFilters);
  const items = useSiteStore((state) => state.gallery);
  const [filter, setFilter] = useState('tous');

  const filtered = filter === 'tous' ? items : items.filter((item) => item.category === filter);
  const rows = limit ? filtered.slice(0, limit) : filtered;

  return (
    <section className={`pb-12 lg:pb-14 ${hideHeading ? 'pt-8' : 'pt-12 lg:pt-14'}`}>
      <div className="container-x">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          {hideHeading ? (
            // Le titre de section porte le h2 de la page. Masqué, il laissait les
            // titres de cartes en h3 juste après le h1 : un lecteur d’écran y voit
            // un niveau manquant. On garde le h2, sans l’afficher.
            <h2 className="sr-only">Nos réalisations</h2>
          ) : (
            <SectionHeading
              eyebrow="Réalisations"
              title="Ce qui sort"
              highlight="de notre atelier"
              description="Véhicules passés entre nos mains ces derniers mois, avec le temps passé et les produits utilisés."
            />
          )}

          <Reveal delay={60} className="flex flex-wrap gap-2">
            {galleryFilters.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setFilter(item.id)}
                aria-pressed={filter === item.id}
                className={`tap inline-flex items-center rounded-full border px-4 text-xs font-semibold transition-colors ${
                  filter === item.id
                    ? 'border-accent/50 bg-accent/10 text-accent'
                    : 'border-white/10 text-muted hover:border-white/20 hover:text-fg'
                }`}
              >
                {item.label}
              </button>
            ))}
          </Reveal>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((item, index) => (
            <Reveal
              key={item.id}
              delay={(index % 3) * 60}
              className="overflow-hidden rounded-lg border border-white/10 bg-ink-900"
            >
              <CarVisual
                scene={item.scene}
                variant="after"
                palette={item.palette}
                body={item.body}
                className="aspect-[4/3] w-full"
                title={item.title}
              />
              <div className="border-t border-white/10 px-4 py-3">
                <h3 className="text-sm font-semibold text-fg">{item.title}</h3>
                <p className="num mt-1 text-[11px] leading-relaxed text-faint">{item.meta}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
