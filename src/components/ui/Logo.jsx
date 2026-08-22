import { useState } from 'react';

/**
 * Logo Teintérior.
 * Si `public/logo.png` existe, c'est ce fichier qui est affiché ; sinon on
 * retombe sur la version vectorielle ci-dessous (silhouette + typo italique).
 */
export default function Logo({ withWordmark = true, className = '' }) {
  const [useFile, setUseFile] = useState(true);

  return (
    <span className={`flex items-center gap-2.5 ${className}`}>
      {useFile ? (
        <img
          src="/logo.png"
          alt=""
          width="36"
          height="36"
          className="h-9 w-9 rounded-lg object-cover"
          onError={() => setUseFile(false)}
        />
      ) : (
        <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-ink-900">
          <svg viewBox="0 0 48 28" className="h-5 w-5" aria-hidden="true">
            <path
              d="M3 21c0-1.4.9-2.4 2.3-2.8l5.4-1.5 5-4.6c1.6-1.5 3.7-2.3 5.9-2.3h8.6c2.6 0 5.1 1 6.9 2.9l3.1 3.1 3 .9c1.7.5 2.8 2 2.8 3.8V21c0 .8-.7 1.5-1.5 1.5H4.5c-.8 0-1.5-.7-1.5-1.5Z"
              fill="#5B8DEF"
            />
            <path
              d="M13.4 16.2 17 12.9c1.1-1 2.5-1.6 4-1.6h7.4c1.8 0 3.5.7 4.7 2l2.8 2.9H13.4Z"
              fill="#0F1115"
              opacity="0.55"
            />
            <circle cx="14" cy="22" r="3.4" fill="#0F1115" stroke="#8A919E" strokeWidth="1.4" />
            <circle cx="35" cy="22" r="3.4" fill="#0F1115" stroke="#8A919E" strokeWidth="1.4" />
          </svg>
        </span>
      )}

      {withWordmark ? (
        <span className="font-display text-base font-extrabold italic tracking-tight text-fg">
          Teintérior
        </span>
      ) : null}
    </span>
  );
}
