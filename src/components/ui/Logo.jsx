import { useState } from 'react';

/**
 * Logo Teintérior.
 *
 * Le fichier `public/logo.png` (ou `.svg`) est utilisé dès qu'il existe. Tant
 * qu'il n'est pas déposé, on affiche le repli vectoriel ci-dessous : silhouette
 * de coupé dans le dégradé bleu → violet de la marque.
 */
export default function Logo({ withWordmark = true, size = 'md', className = '' }) {
  const [useFile, setUseFile] = useState(true);

  const mark = size === 'lg' ? 'h-11 w-11' : 'h-10 w-10';
  const word = size === 'lg' ? 'text-lg' : 'text-[17px]';

  return (
    <span className={`flex items-center gap-3 ${className}`}>
      {useFile ? (
        <img
          src="/logo.png"
          alt=""
          width="44"
          height="44"
          className={`${mark} shrink-0 rounded-md object-contain`}
          onError={() => setUseFile(false)}
        />
      ) : (
        <span
          className={`${mark} flex shrink-0 items-center justify-center rounded-md bg-ink-900 ring-1 ring-inset ring-white/10`}
        >
          <svg viewBox="0 0 64 34" className="h-6 w-6" aria-hidden="true">
            <defs>
              <linearGradient id="tei-mark" x1="0" y1="1" x2="1" y2="0">
                <stop offset="0%" stopColor="#1E4FD8" />
                <stop offset="55%" stopColor="#4A46DE" />
                <stop offset="100%" stopColor="#8A3CE0" />
              </linearGradient>
            </defs>
            {/* Carrosserie : capot plongeant, pavillon fuyant, poupe courte. */}
            <path
              d="M2 25.5c0-2 1.3-3.4 3.3-3.9l6.4-1.6 6.6-6.4c2.3-2.2 5.3-3.4 8.5-3.4h11.4c3.5 0 6.9 1.3 9.4 3.8l4.6 4.5 6.1 1.4c2.7.6 4.7 2.6 4.7 5v2.3c0 .9-.7 1.6-1.6 1.6H3.6c-.9 0-1.6-.7-1.6-1.6v-1.7Z"
              fill="url(#tei-mark)"
            />
            {/* Vitrage. */}
            <path
              d="M15.6 19.4 21 14.3c1.5-1.4 3.5-2.2 5.6-2.2h10.6c2.4 0 4.7.9 6.4 2.6l4.6 4.7H15.6Z"
              fill="#080A0E"
              opacity="0.5"
            />
            <path d="M31.4 12.1v7.3" stroke="#080A0E" strokeWidth="1.2" opacity="0.5" />
            {/* Roues. */}
            <circle cx="17.5" cy="26.5" r="4.6" fill="#080A0E" />
            <circle cx="17.5" cy="26.5" r="2" fill="#C9CEDA" />
            <circle cx="46.5" cy="26.5" r="4.6" fill="#080A0E" />
            <circle cx="46.5" cy="26.5" r="2" fill="#C9CEDA" />
          </svg>
        </span>
      )}

      {withWordmark ? (
        <span
          className={`font-display ${word} font-extrabold italic leading-none tracking-[-0.02em] text-fg`}
        >
          Teintérior
        </span>
      ) : null}
    </span>
  );
}
