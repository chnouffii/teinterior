import { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Loader2, Star, Trash2, Upload } from 'lucide-react';
import { api } from '../../lib/api.js';
import { preparerImage, ImageError } from '../../lib/image.js';

/**
 * Galerie photos : glisser-déposer, miniatures, photo de couverture, ordre.
 *
 * Les fichiers sont réduits dans le navigateur puis envoyés à l'API, qui les
 * écrit sur le disque du serveur. Rien ne transite par un service tiers.
 */
export default function PhotoUploader({
  photos,
  coverIndex,
  onChange,
}: {
  photos: string[];
  coverIndex: number;
  onChange: (patch: { photos?: string[]; coverIndex?: number }) => void;
}) {
  const [survol, setSurvol] = useState(false);
  const [enCours, setEnCours] = useState<{ fait: number; total: number } | null>(null);
  const [erreurs, setErreurs] = useState<string[]>([]);
  const champFichier = useRef<HTMLInputElement>(null);

  const majCouverture = (suivantes: string[], ancienIndex: number) =>
    Math.min(ancienIndex, Math.max(suivantes.length - 1, 0));

  async function traiter(fichiers: File[]) {
    const images = fichiers.filter((f) => f.type.startsWith('image/'));
    if (images.length === 0) {
      setErreurs(['Aucune image dans ce que vous avez déposé.']);
      return;
    }

    setErreurs([]);
    setEnCours({ fait: 0, total: images.length });
    const ajoutees: string[] = [];
    const problemes: string[] = [];

    for (const fichier of images) {
      try {
        const blob = await preparerImage(fichier);
        const { url } = await api.deposerImage(blob);
        ajoutees.push(url);
      } catch (erreur) {
        problemes.push(
          erreur instanceof ImageError
            ? erreur.message
            : `« ${fichier.name} » n’a pas pu être envoyée : ${(erreur as Error).message}`
        );
      }
      setEnCours((etat) => (etat ? { ...etat, fait: etat.fait + 1 } : etat));
    }

    setEnCours(null);
    setErreurs(problemes);
    if (ajoutees.length > 0) onChange({ photos: [...photos, ...ajoutees] });
  }

  function deplacer(index: number, direction: -1 | 1) {
    const cible = index + direction;
    if (cible < 0 || cible >= photos.length) return;
    const suivantes = [...photos];
    [suivantes[index], suivantes[cible]] = [suivantes[cible], suivantes[index]];

    // La couverture suit la photo qu'elle désignait.
    let couverture = coverIndex;
    if (coverIndex === index) couverture = cible;
    else if (coverIndex === cible) couverture = index;

    onChange({ photos: suivantes, coverIndex: couverture });
  }

  async function retirer(index: number) {
    const url = photos[index];
    const suivantes = photos.filter((_, position) => position !== index);
    onChange({ photos: suivantes, coverIndex: majCouverture(suivantes, coverIndex) });

    // Le fichier est effacé du serveur ; l'échec n'est pas bloquant, le ménage
    // des images orphelines pourra le rattraper.
    const nom = url.split('/').pop();
    if (nom) await api.supprimerImage(nom).catch(() => {});
  }

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setSurvol(true);
        }}
        onDragLeave={() => setSurvol(false)}
        onDrop={(e) => {
          e.preventDefault();
          setSurvol(false);
          void traiter([...e.dataTransfer.files]);
        }}
        className={`rounded-md border border-dashed px-4 py-6 text-center transition-colors ${
          survol ? 'border-accent bg-accent/5' : 'border-white/15 bg-ink-900'
        }`}
      >
        {enCours ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin text-accent" aria-hidden="true" />
            <p className="text-sm text-muted">
              Envoi {enCours.fait} / {enCours.total}…
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload className="h-5 w-5 text-faint" aria-hidden="true" />
            <p className="text-sm text-muted">
              Glissez vos photos ici, ou{' '}
              <button
                type="button"
                onClick={() => champFichier.current?.click()}
                className="font-semibold text-accent underline underline-offset-2"
              >
                parcourez vos fichiers
              </button>
            </p>
            <p className="text-[11px] text-faint">
              JPEG, PNG ou WebP. Réduites automatiquement avant l’envoi et stockées sur votre
              serveur.
            </p>
          </div>
        )}

        <input
          ref={champFichier}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={(e) => {
            void traiter([...(e.target.files ?? [])]);
            e.target.value = '';
          }}
        />
      </div>

      {erreurs.length > 0 ? (
        <ul className="mt-3 space-y-1" role="alert">
          {erreurs.map((message) => (
            <li
              key={message}
              className="rounded border border-signal-danger/40 bg-signal-danger/10 px-3 py-2 text-xs text-signal-danger"
            >
              {message}
            </li>
          ))}
        </ul>
      ) : null}

      {photos.length > 0 ? (
        <>
          <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {photos.map((url, index) => (
              <li
                key={url}
                className={`overflow-hidden rounded-md border bg-ink-900 ${
                  coverIndex === index ? 'border-accent' : 'border-white/10'
                }`}
              >
                <div className="relative">
                  <img
                    src={url}
                    alt=""
                    width="400"
                    height="300"
                    loading="lazy"
                    decoding="async"
                    className="aspect-[4/3] w-full object-cover"
                  />
                  {coverIndex === index ? (
                    <span className="absolute left-2 top-2 rounded bg-accent px-1.5 py-0.5 text-[10px] font-semibold text-accent-on">
                      Couverture
                    </span>
                  ) : null}
                </div>

                <div className="flex items-center justify-between gap-1 px-2 py-1.5">
                  <button
                    type="button"
                    onClick={() => onChange({ coverIndex: index })}
                    aria-label="Définir comme photo de couverture"
                    title="Photo de couverture"
                    className={`transition-colors ${
                      coverIndex === index ? 'text-accent' : 'text-faint hover:text-fg'
                    }`}
                  >
                    <Star
                      className="h-4 w-4"
                      fill={coverIndex === index ? 'currentColor' : 'none'}
                      aria-hidden="true"
                    />
                  </button>

                  <span className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => deplacer(index, -1)}
                      disabled={index === 0}
                      aria-label="Déplacer vers la gauche"
                      className="text-faint transition-colors hover:text-fg disabled:opacity-30"
                    >
                      <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deplacer(index, 1)}
                      disabled={index === photos.length - 1}
                      aria-label="Déplacer vers la droite"
                      className="text-faint transition-colors hover:text-fg disabled:opacity-30"
                    >
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => void retirer(index)}
                      aria-label="Supprimer la photo"
                      className="text-faint transition-colors hover:text-signal-danger"
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </span>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-[11px] text-faint">
            {photos.length} photo{photos.length > 1 ? 's' : ''} · la couverture est celle affichée
            dans le showroom.
          </p>
        </>
      ) : (
        <p className="mt-3 text-center text-xs text-faint">
          Aucune photo — le site affiche l’illustration vectorielle de repli.
        </p>
      )}
    </div>
  );
}
