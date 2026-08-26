import { useState } from 'react';
import { Images } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading.jsx';
import Reveal from '../ui/Reveal.jsx';
import CarVisual from '../ui/CarVisual.jsx';
import GaleriePhotos from '../ui/GaleriePhotos.jsx';
import Visionneuse from '../ui/Visionneuse.jsx';

import { useSiteStore } from '../../store/siteStore';

/** Identifiant du filtre qui n'en est pas un : il désactive le filtrage. */
const TOUS = 'tous';

/** Vignette d'un chantier : sa photo de couverture, ou l'illustration de repli. */
function Vignette({ item, className }) {
  const photo = item.photos?.[Math.min(item.coverIndex ?? 0, (item.photos?.length ?? 1) - 1)];

  if (!photo) {
    return (
      <CarVisual
        scene={item.scene}
        variant="after"
        palette={item.palette}
        body={item.body}
        className={className}
        title={item.title}
      />
    );
  }

  return (
    <div className={`relative overflow-hidden bg-ink-950 ${className}`}>
      {/* La photo entière, jamais recadrée ; le vide autour est comblé par
          elle-même, agrandie et floutée. Même parti pris que le showroom. */}
      <img
        src={photo}
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full scale-110 object-cover opacity-40 blur-2xl"
      />
      <img
        src={photo}
        alt={item.title}
        width="800"
        height="600"
        loading="lazy"
        decoding="async"
        className="relative h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.03]"
      />
    </div>
  );
}

export default function Gallery({ hideHeading = false, limit = null }) {
  const galleryFilters = useSiteStore((state) => state.galleryFilters);
  const items = useSiteStore((state) => state.gallery);
  const [filter, setFilter] = useState(TOUS);
  const [ouvert, setOuvert] = useState(null);

  /*
    Un filtre supprimé depuis le panel pendant qu'un visiteur le regardait
    laisserait la galerie vide sans qu'aucun bouton n'apparaisse actif. On
    retombe alors sur « tout », qui existe toujours.
  */
  const connu = filter === TOUS || galleryFilters.some((f) => f.id === filter);
  const actif = connu ? filter : TOUS;

  const filtered = actif === TOUS ? items : items.filter((item) => item.category === actif);
  const rows = limit ? filtered.slice(0, limit) : filtered;

  const chantier = ouvert ? items.find((item) => item.id === ouvert) : null;

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
                aria-pressed={actif === item.id}
                className={`tap inline-flex items-center rounded-full border px-4 text-xs font-semibold transition-colors ${
                  actif === item.id
                    ? 'border-accent/50 bg-accent/10 text-accent'
                    : 'border-white/10 text-muted hover:border-white/20 hover:text-fg'
                }`}
              >
                {item.label}
              </button>
            ))}
          </Reveal>
        </div>

        {rows.length === 0 ? (
          <p className="mt-8 rounded-lg border border-dashed border-white/10 px-5 py-8 text-center text-sm text-faint">
            Aucun chantier dans cette catégorie pour l’instant.
          </p>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rows.map((item, index) => {
              const nombre = item.photos?.length ?? 0;
              // Rien de plus à montrer qu'une vignette et deux lignes de texte :
              // en faire un bouton promettrait une fenêtre vide.
              const ouvrable = nombre > 0 || Boolean(item.detail);

              const contenu = (
                <>
                  <Vignette item={item} className="aspect-[4/3] w-full" />
                  {nombre > 1 ? (
                    <span
                      className="num pointer-events-none absolute right-3 top-3 inline-flex items-center gap-1
                        rounded-full border border-white/15 bg-ink-950/70 px-2 py-0.5 text-[11px] font-semibold
                        text-fg backdrop-blur"
                    >
                      <Images className="h-3 w-3" aria-hidden="true" />
                      {nombre}
                    </span>
                  ) : null}
                  <div className="border-t border-white/10 px-4 py-3 text-left">
                    <h3 className="text-sm font-semibold text-fg">{item.title}</h3>
                    <p className="num mt-1 text-[11px] leading-relaxed text-faint">{item.meta}</p>
                  </div>
                </>
              );

              return (
                <Reveal
                  key={item.id}
                  variante="carte"
                  delay={(index % 3) * 60}
                  className="relative overflow-hidden rounded-lg border border-white/10 bg-ink-900"
                >
                  {ouvrable ? (
                    <button
                      type="button"
                      onClick={() => setOuvert(item.id)}
                      aria-label={`Voir « ${item.title} »${nombre > 0 ? ` — ${nombre} photo${nombre > 1 ? 's' : ''}` : ''}`}
                      className="group block w-full text-left transition-colors hover:bg-ink-850"
                    >
                      {contenu}
                    </button>
                  ) : (
                    <div className="group">{contenu}</div>
                  )}
                </Reveal>
              );
            })}
          </div>
        )}
      </div>

      <Visionneuse ouvert={Boolean(chantier)} onFermer={() => setOuvert(null)} titre={chantier?.title}>
        {chantier ? (
          <>
            <GaleriePhotos
              photos={chantier.photos ?? []}
              coverIndex={chantier.coverIndex ?? 0}
              legende={chantier.title}
              label={`Photos — ${chantier.title}`}
              className="aspect-[16/10]"
              prioritaire={false}
              repli={
                <CarVisual
                  scene={chantier.scene}
                  variant="after"
                  palette={chantier.palette}
                  body={chantier.body}
                  className="aspect-[16/10] w-full rounded-t-lg"
                  title={chantier.title}
                />
              }
            />
            <div className="border-t border-white/10 px-5 py-4">
              <h3 className="text-base font-semibold text-fg">{chantier.title}</h3>
              <p className="num mt-1 text-xs text-faint">{chantier.meta}</p>
              {chantier.detail ? (
                <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted">
                  {chantier.detail}
                </p>
              ) : null}
            </div>
          </>
        ) : null}
      </Visionneuse>
    </section>
  );
}
