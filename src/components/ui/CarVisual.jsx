import { useId } from 'react';

/**
 * Illustrations vectorielles de repli, utilisées quand aucune photo n'est
 * renseignée. Rendu volontairement mat : aplats, contours fins, aucune lueur
 * ni dégradé fluo.
 */

const BODY =
  'M96 316 C84 296 86 268 104 252 L238 236 L318 170 C360 146 500 142 546 172 L626 232 L700 246 C724 252 736 274 732 300 L728 316 Z';
const GLASS_FRONT = 'M256 230 L330 178 L452 174 L452 230 Z';
const GLASS_REAR = 'M470 174 L540 176 L610 230 L470 230 Z';

function Wheel({ cx, tone }) {
  return (
    <g>
      <circle cx={cx} cy="316" r="52" fill="#0B0D11" />
      <circle cx={cx} cy="316" r="40" fill="none" stroke={tone} strokeWidth="2" opacity="0.7" />
      <circle cx={cx} cy="316" r="12" fill={tone} opacity="0.5" />
    </g>
  );
}

function CarScene({ variant, palette, mode }) {
  const isAfter = variant === 'after';
  const [dark, light] = palette;
  const glass =
    mode === 'tint' && isAfter ? '#12161C' : mode === 'tint' ? '#9FB4C4' : '#2A3340';

  return (
    <g opacity={isAfter ? 1 : 0.72}>
      <path d={BODY} fill={dark} stroke={light} strokeWidth="1.5" strokeOpacity="0.45" />
      <path
        d="M104 252 L238 236 L318 170"
        fill="none"
        stroke={light}
        strokeWidth="2"
        strokeOpacity={isAfter ? 0.85 : 0.25}
      />
      <path
        d="M120 288 C280 268 520 266 716 286"
        fill="none"
        stroke={light}
        strokeWidth="1.5"
        strokeOpacity={isAfter ? 0.5 : 0.15}
      />

      <path d={GLASS_FRONT} fill={glass} opacity={isAfter ? 0.95 : 0.75} />
      <path d={GLASS_REAR} fill={glass} opacity={isAfter ? 0.95 : 0.75} />
      <rect x="452" y="172" width="16" height="60" fill={dark} />

      {!isAfter ? (
        <g opacity="0.5">
          {Array.from({ length: 10 }).map((_, index) => (
            <line
              key={index}
              x1={170 + index * 52}
              y1={258 + (index % 3) * 14}
              x2={210 + index * 52}
              y2={262 + (index % 3) * 14}
              stroke="#C8CED8"
              strokeWidth="1"
              strokeOpacity="0.35"
            />
          ))}
        </g>
      ) : null}

      <path d="M172 316 A 64 64 0 0 1 296 316" fill="none" stroke="#0B0D11" strokeWidth="7" />
      <path d="M536 316 A 64 64 0 0 1 660 316" fill="none" stroke="#0B0D11" strokeWidth="7" />

      <Wheel cx={234} tone={light} />
      <Wheel cx={598} tone={light} />

      <rect x="98" y="268" width="24" height="12" rx="2" fill={light} opacity="0.8" />
      <rect x="712" y="270" width="18" height="10" rx="2" fill="#A45C55" opacity="0.9" />
    </g>
  );
}

function InteriorScene({ variant, palette }) {
  const isAfter = variant === 'after';
  const [dark, light] = palette;

  return (
    <g opacity={isAfter ? 1 : 0.72}>
      <rect x="48" y="52" width="704" height="316" rx="6" fill={dark} />
      <path d="M74 250 C176 212 254 212 332 246 L332 352 L74 352 Z" fill="#0D1014" />
      <path d="M100 244 C152 162 250 156 316 196" fill="none" stroke={light} strokeWidth="2" strokeOpacity={isAfter ? 0.7 : 0.25} />
      <circle cx="222" cy="298" r="50" fill="none" stroke={light} strokeWidth="9" opacity="0.7" />
      <circle cx="222" cy="298" r="14" fill="#0D1014" />
      <rect x="384" y="120" width="336" height="126" rx="4" fill="#0D1014" stroke={light} strokeOpacity="0.3" />
      <rect x="410" y="150" width="120" height="8" rx="2" fill={isAfter ? '#5B8DEF' : '#39424F'} />
      <rect x="410" y="172" width="220" height="6" rx="2" fill="#2A323C" />
      <rect x="410" y="190" width="180" height="6" rx="2" fill="#2A323C" />
      {!isAfter ? (
        <g fill="#05070A" opacity="0.4">
          <ellipse cx="182" cy="300" rx="42" ry="22" />
          <ellipse cx="268" cy="330" rx="26" ry="14" />
          <ellipse cx="596" cy="330" rx="48" ry="16" />
        </g>
      ) : null}
    </g>
  );
}

function ScreenScene({ variant, palette }) {
  const isAfter = variant === 'after';
  const [dark, light] = palette;
  const tiles = ['#5B8DEF', '#6FA980', '#C9973F', '#8A919E', '#7FA9F5', '#B4BAC4'];

  return (
    <g>
      <rect x="52" y="56" width="696" height="308" rx="6" fill={dark} stroke={light} strokeOpacity="0.25" />
      <rect x="78" y="82" width="644" height="256" rx="4" fill="#080A0E" />
      <rect x="78" y="82" width="644" height="30" fill="#11151B" />
      <circle cx="100" cy="97" r="4" fill={isAfter ? '#6FA980' : '#3A424E'} />
      <rect x="116" y="93" width="80" height="8" rx="2" fill="#39424F" />

      {isAfter ? (
        <g>
          {tiles.map((fill, index) => {
            const x = 122 + (index % 3) * 196;
            const y = 142 + Math.floor(index / 3) * 100;
            return (
              <g key={index}>
                <rect x={x} y={y} width="76" height="76" rx="8" fill={fill} opacity="0.85" />
                <rect x={x + 18} y={y + 30} width="36" height="6" rx="2" fill="#0B0D11" opacity="0.6" />
              </g>
            );
          })}
        </g>
      ) : (
        <g fill="#252D38">
          <rect x="122" y="140" width="220" height="14" rx="3" />
          <rect x="122" y="172" width="380" height="10" rx="3" />
          <rect x="122" y="198" width="320" height="10" rx="3" />
          <rect x="122" y="224" width="270" height="10" rx="3" />
          <rect x="560" y="140" width="120" height="120" rx="4" />
        </g>
      )}
    </g>
  );
}

export default function CarVisual({
  scene = 'polish',
  variant = 'after',
  palette = ['#242A33', '#4A525C'],
  className = '',
  title = 'Illustration véhicule',
}) {
  const rawId = useId();
  const uid = `tv${rawId.replace(/[^a-zA-Z0-9]/g, '')}`;

  return (
    <svg
      viewBox="0 0 800 420"
      className={className}
      role="img"
      aria-label={title}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <pattern id={`${uid}-hatch`} width="8" height="8" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2="0" y2="8" stroke="#FFFFFF" strokeOpacity="0.03" strokeWidth="1" />
        </pattern>
      </defs>

      <rect width="800" height="420" fill="#11141A" />
      <rect width="800" height="420" fill={`url(#${uid}-hatch)`} />

      {scene === 'interior' ? (
        <InteriorScene variant={variant} palette={palette} />
      ) : scene === 'screen' ? (
        <ScreenScene variant={variant} palette={palette} />
      ) : (
        <CarScene variant={variant} palette={palette} mode={scene} />
      )}
    </svg>
  );
}
