import { BRAND } from '../../data/site.js';

export default function Logo({ compact = false, className = '' }) {
  return (
    <span className={`flex items-center gap-3 ${className}`}>
      <span className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-brass/40 bg-carbon-900 shadow-glow">
        <svg viewBox="0 0 40 40" className="h-6 w-6" aria-hidden="true">
          <defs>
            <linearGradient id="logo-mark" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#F2CE85" />
              <stop offset="100%" stopColor="#A87526" />
            </linearGradient>
          </defs>
          <path
            d="M6 10h28M20 10v22"
            stroke="url(#logo-mark)"
            strokeWidth="4.5"
            strokeLinecap="round"
          />
          <circle cx="20" cy="32" r="3" fill="#7FD8FF" />
        </svg>
      </span>

      <span className="flex flex-col leading-none">
        <span className="font-display text-lg font-bold tracking-tight text-white">
          Tein<span className="text-gradient-brass">térior</span>
        </span>
        {!compact ? (
          <span className="mt-1 text-[11px] font-medium uppercase tracking-[0.28em] text-slate-400">
            {BRAND.baseline}
          </span>
        ) : null}
      </span>
    </span>
  );
}
