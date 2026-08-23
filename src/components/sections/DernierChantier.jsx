import { useState } from 'react';
import CarVisual from '../ui/CarVisual.jsx';

/**
 * Le chantier mis en avant en page d'accueil.
 *
 * Sans photo déposée, l'illustration générée reste affichée : le bloc est utile
 * dès l'installation et gagne en crédibilité dès qu'une vraie photo arrive.
 * Modifiable — et masquable — depuis Admin → Page d'accueil.
 */
export default function DernierChantier({ chantier }) {
  const photos = Array.isArray(chantier?.photos) ? chantier.photos.filter(Boolean) : [];
  const depart = Math.min(Math.max(chantier?.coverIndex ?? 0, 0), Math.max(photos.length - 1, 0));
  const [actif, setActif] = useState(depart);

  const affichee = photos[actif] ?? photos[0] ?? null;
  const legende = [chantier?.vehicle, chantier?.title].filter(Boolean).join(' — ');

  return (
    <div>
      <div className="relative overflow-hidden rounded-lg border border-white/10 bg-ink-900 shadow-card">
        {affichee ? (
          <img
            src={affichee}
            alt={legende || 'Véhicule traité à l’atelier'}
            // Le rapport est imposé par le conteneur : la place de l'image est
            // réservée avant son chargement, la page ne saute pas.
            className="aspect-[16/11] w-full object-cover"
            width="1120"
            height="770"
            fetchPriority="high"
            decoding="async"
          />
        ) : (
          <CarVisual
            scene="polish"
            variant="after"
            body="coupe"
            palette={['#141A24', '#3E5570']}
            className="aspect-[16/11] w-full"
            title="Berline traitée à l’atelier"
          />
        )}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950 via-transparent to-transparent" />

        {chantier?.eyebrow || chantier?.title || chantier?.badge ? (
          <div className="absolute inset-x-5 bottom-5 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-white/10 bg-ink-950/80 p-4">
            <div className="min-w-0">
              {chantier.eyebrow ? (
                <p className="text-xs uppercase tracking-[0.18em] text-faint">{chantier.eyebrow}</p>
              ) : null}
              {chantier.title ? (
                <p className="mt-1 text-sm font-semibold text-fg">{chantier.title}</p>
              ) : null}
              {chantier.vehicle ? (
                <p className="mt-0.5 text-xs text-muted">{chantier.vehicle}</p>
              ) : null}
            </div>
            {chantier.badge ? (
              <span className="rounded border border-signal-ok/30 bg-signal-ok/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-signal-ok">
                {chantier.badge}
              </span>
            ) : null}
          </div>
        ) : null}
      </div>

      {photos.length > 1 ? (
        <ul className="mt-3 flex flex-wrap gap-2">
          {photos.map((photo, index) => (
            <li key={photo}>
              <button
                type="button"
                onClick={() => setActif(index)}
                aria-label={`Photo ${index + 1} sur ${photos.length}`}
                aria-current={index === actif}
                className={`tap block overflow-hidden rounded border transition-colors ${
                  index === actif
                    ? 'border-accent'
                    : 'border-white/10 hover:border-white/30'
                }`}
              >
                <img
                  src={photo}
                  alt=""
                  className="h-14 w-20 object-cover"
                  width="80"
                  height="56"
                  loading="lazy"
                  decoding="async"
                />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
