import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import CarVisual from './CarVisual.jsx';

/**
 * Galerie de photos d'une annonce.
 *
 * Le défilement horizontal natif fait le travail : le doigt fait glisser les
 * photos sur mobile sans qu'on ait à interpréter le moindre geste, et l'accroche
 * CSS (`snap`) cale l'image suivante. Les flèches ne servent qu'au confort de la
 * souris, et le clavier suit l'élément qui a le focus.
 *
 * Sans photo, l'illustration vectorielle de repli reste affichée : l'annonce
 * tient debout avant même la séance photo.
 */
export default function GalerieVehicule({ vehicle, className = '', dimmed = false }) {
  const photos = (vehicle.photos ?? []).filter(Boolean);
  // La couverture ouvre la galerie ; les autres suivent dans leur ordre.
  const depart = Math.min(Math.max(vehicle.coverIndex ?? 0, 0), Math.max(photos.length - 1, 0));
  const ordonnees = photos.length > 1 ? [photos[depart], ...photos.filter((_, i) => i !== depart)] : photos;

  const piste = useRef(null);
  const [actif, setActif] = useState(0);

  // L'index suit le défilement réel, qu'il vienne du doigt, des flèches ou des
  // vignettes : une seule source de vérité, la position de la piste.
  useEffect(() => {
    const n = piste.current;
    if (!n) return undefined;
    let attente;
    const suivre = () => {
      cancelAnimationFrame(attente);
      attente = requestAnimationFrame(() => {
        const largeur = n.clientWidth || 1;
        setActif(Math.round(n.scrollLeft / largeur));
      });
    };
    n.addEventListener('scroll', suivre, { passive: true });
    return () => {
      cancelAnimationFrame(attente);
      n.removeEventListener('scroll', suivre);
    };
  }, [ordonnees.length]);

  const allerA = (index) => {
    const n = piste.current;
    if (!n) return;
    const cible = Math.min(Math.max(index, 0), ordonnees.length - 1);
    n.scrollTo({ left: cible * n.clientWidth, behavior: 'smooth' });
  };

  if (ordonnees.length === 0) {
    return (
      <CarVisual
        scene="polish"
        variant="after"
        palette={vehicle.palette}
        body={vehicle.body}
        className={className}
        title={`${vehicle.brand} ${vehicle.model}`}
      />
    );
  }

  const legende = `${vehicle.brand} ${vehicle.model} — ${vehicle.trim}, à vendre à Brumath`;

  return (
    <div>
      <div className="relative">
        <div
          ref={piste}
          role="group"
          aria-roledescription="carrousel"
          aria-label={`Photos — ${vehicle.brand} ${vehicle.model}`}
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === 'ArrowRight') { event.preventDefault(); allerA(actif + 1); }
            if (event.key === 'ArrowLeft') { event.preventDefault(); allerA(actif - 1); }
          }}
          className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto scroll-smooth rounded-t-lg
            focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {ordonnees.map((photo, index) => (
            <div
              key={photo}
              className={`relative w-full shrink-0 snap-center overflow-hidden bg-ink-950 ${className} ${
                dimmed ? 'opacity-50 grayscale' : ''
              }`}
            >
              {/*
                La photo entière, jamais recadrée — c'est le sujet.
                Le cadre garde un rapport fixe pour que la page ne saute pas
                d'une photo à l'autre, et ce qui reste autour est comblé par la
                photo elle-même, agrandie et floutée. Des bandes noires y
                passeraient pour un défaut d'affichage.
              */}
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
                alt={index === 0 ? legende : `${legende} — photo ${index + 1}`}
                width="1600"
                height="1000"
                // La première photo est le plus grand élément visible de la
                // page : la charger sans attendre évite de retarder l'affichage.
                loading={index === 0 ? 'eager' : 'lazy'}
                fetchPriority={index === 0 ? 'high' : 'auto'}
                decoding="async"
                className="relative h-full w-full object-contain"
              />
            </div>
          ))}
        </div>

        {ordonnees.length > 1 ? (
          <>
            <button
              type="button"
              onClick={() => allerA(actif - 1)}
              disabled={actif === 0}
              aria-label="Photo précédente"
              className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center
                rounded-full border border-white/15 bg-ink-950/70 text-fg backdrop-blur transition-opacity
                hover:bg-ink-950/90 disabled:pointer-events-none disabled:opacity-0"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => allerA(actif + 1)}
              disabled={actif >= ordonnees.length - 1}
              aria-label="Photo suivante"
              className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center
                rounded-full border border-white/15 bg-ink-950/70 text-fg backdrop-blur transition-opacity
                hover:bg-ink-950/90 disabled:pointer-events-none disabled:opacity-0"
            >
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>

            <p
              aria-live="polite"
              className="num absolute bottom-3 right-3 rounded-full border border-white/15 bg-ink-950/70
                px-2.5 py-1 text-[11px] font-semibold text-fg backdrop-blur"
            >
              {actif + 1} / {ordonnees.length}
            </p>
          </>
        ) : null}
      </div>

      {ordonnees.length > 1 ? (
        <ul className="no-scrollbar mt-2 flex gap-2 overflow-x-auto pb-1">
          {ordonnees.map((photo, index) => (
            <li key={photo}>
              <button
                type="button"
                onClick={() => allerA(index)}
                aria-label={`Voir la photo ${index + 1} sur ${ordonnees.length}`}
                aria-current={index === actif}
                className={`tap block overflow-hidden rounded border transition-colors ${
                  index === actif ? 'border-accent' : 'border-white/10 hover:border-white/30'
                }`}
              >
                <img
                  src={photo}
                  alt=""
                  width="112"
                  height="76"
                  loading="lazy"
                  decoding="async"
                  // Entières elles aussi : une vignette recadrée ne montre pas
                  // ce qu'on s'apprête à ouvrir.
                  className="h-[4.75rem] w-28 bg-ink-950 object-contain"
                />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
