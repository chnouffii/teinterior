import { useId } from 'react';

/**
 * Visuels vectoriels générés en interne (aucune dépendance externe, aucun asset distant).
 * Chaque scène accepte une variante « before » / « after » afin d'alimenter le
 * comparateur avant / après et les vignettes de la galerie.
 */

const BODY_PATH =
  'M96 316 C84 296 86 268 104 252 L238 236 L318 170 C360 146 500 142 546 172 L626 232 L700 246 C724 252 736 274 732 300 L728 316 Z';

const FRONT_GLASS = 'M256 230 L330 178 L452 174 L452 230 Z';
const REAR_GLASS = 'M470 174 L540 176 L610 230 L470 230 Z';

function Wheel({ cx, rim }) {
  return (
    <g>
      <circle cx={cx} cy="316" r="54" fill="#05070A" />
      <circle cx={cx} cy="316" r="42" fill="#0D1219" stroke={rim} strokeWidth="3" />
      <circle cx={cx} cy="316" r="14" fill={rim} opacity="0.75" />
      {Array.from({ length: 6 }).map((_, index) => {
        const angle = (index * Math.PI) / 3;
        return (
          <line
            key={index}
            x1={cx + Math.cos(angle) * 15}
            y1={316 + Math.sin(angle) * 15}
            x2={cx + Math.cos(angle) * 39}
            y2={316 + Math.sin(angle) * 39}
            stroke={rim}
            strokeWidth="4"
            strokeLinecap="round"
            opacity="0.55"
          />
        );
      })}
    </g>
  );
}

function CarScene({ uid, variant, palette, mode }) {
  const isAfter = variant === 'after';
  const [dark, light] = palette;
  const glossOpacity = isAfter ? 0.55 : 0.12;
  const glassFill =
    mode === 'tint'
      ? isAfter
        ? `url(#${uid}-tinted)`
        : `url(#${uid}-clear)`
      : `url(#${uid}-clear)`;

  return (
    <g filter={isAfter ? undefined : `url(#${uid}-dull)`}>
      <ellipse cx="410" cy="374" rx="316" ry="16" fill="#000" opacity="0.6" />

      <path d={BODY_PATH} fill={`url(#${uid}-body)`} stroke="#000" strokeOpacity="0.4" strokeWidth="2" />

      <path
        d="M104 252 L238 236 L318 170"
        fill="none"
        stroke="#fff"
        strokeOpacity={glossOpacity}
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M120 288 C280 268 520 266 716 286"
        fill="none"
        stroke="#fff"
        strokeOpacity={glossOpacity * 0.6}
        strokeWidth="2"
        strokeLinecap="round"
      />

      <path d={FRONT_GLASS} fill={glassFill} />
      <path d={REAR_GLASS} fill={glassFill} />
      <rect x="452" y="172" width="16" height="60" fill={dark} opacity="0.9" />

      {isAfter ? (
        <g opacity="0.5">
          <path d="M300 250 L360 168 L410 168 L350 250 Z" fill="#fff" opacity="0.12" />
          <path d="M430 250 L490 168 L512 168 L452 250 Z" fill="#fff" opacity="0.08" />
        </g>
      ) : (
        <g opacity="0.35">
          {Array.from({ length: 14 }).map((_, index) => (
            <ellipse
              key={index}
              cx={160 + index * 42}
              cy={262 + (index % 3) * 16}
              rx="22"
              ry="7"
              fill="none"
              stroke="#fff"
              strokeOpacity="0.22"
              strokeWidth="1"
            />
          ))}
        </g>
      )}

      <path
        d="M170 316 A 66 66 0 0 1 296 316"
        fill="none"
        stroke="#04060A"
        strokeOpacity="0.85"
        strokeWidth="8"
      />
      <path
        d="M534 316 A 66 66 0 0 1 660 316"
        fill="none"
        stroke="#04060A"
        strokeOpacity="0.85"
        strokeWidth="8"
      />

      <Wheel cx={232} rim={isAfter ? '#D9D9DE' : '#7C7F86'} />
      <Wheel cx={596} rim={isAfter ? '#D9D9DE' : '#7C7F86'} />

      <rect x="96" y="266" width="26" height="16" rx="6" fill={isAfter ? '#FFF3CE' : '#C9C3A8'} />
      <rect x="712" y="268" width="20" height="14" rx="5" fill={isAfter ? '#FF6B6B' : '#A15252'} />
      <rect x="486" y="252" width="34" height="7" rx="3.5" fill={light} opacity="0.7" />
    </g>
  );
}

function InteriorScene({ uid, variant, palette }) {
  const isAfter = variant === 'after';
  const [dark, light] = palette;

  return (
    <g filter={isAfter ? undefined : `url(#${uid}-dull)`}>
      <rect x="40" y="40" width="720" height="340" rx="28" fill={`url(#${uid}-body)`} />

      <path
        d="M70 250 C170 210 250 210 330 246 L330 356 L70 356 Z"
        fill={dark}
        opacity="0.9"
      />
      <path
        d="M96 244 C150 156 250 148 316 190 L330 246 C250 210 170 210 70 250 Z"
        fill={light}
        opacity="0.55"
      />
      <path d="M110 232 C160 170 240 166 300 200" fill="none" stroke="#fff" strokeOpacity={isAfter ? 0.4 : 0.1} strokeWidth="3" />

      <rect x="380" y="120" width="340" height="130" rx="18" fill={dark} opacity="0.85" />
      <rect x="404" y="146" width="290" height="78" rx="12" fill="#05070A" />
      <rect x="420" y="164" width="120" height="10" rx="5" fill={isAfter ? '#7FD8FF' : '#3A4450'} />
      <rect x="420" y="188" width="200" height="8" rx="4" fill="#2B3440" />

      <circle cx="220" cy="300" r="54" fill="none" stroke={light} strokeWidth="12" opacity="0.85" />
      <circle cx="220" cy="300" r="16" fill={dark} />

      <rect x="380" y="284" width="340" height="72" rx="16" fill={dark} opacity="0.7" />
      {Array.from({ length: 5 }).map((_, index) => (
        <rect
          key={index}
          x={402 + index * 64}
          y="304"
          width="44"
          height="32"
          rx="8"
          fill={isAfter ? light : '#3A4450'}
          opacity={isAfter ? 0.7 : 0.5}
        />
      ))}

      {isAfter ? (
        <g opacity="0.35">
          <path d="M540 60 L700 60 L620 200 L470 200 Z" fill="#fff" opacity="0.1" />
        </g>
      ) : (
        <g>
          <ellipse cx="180" cy="300" rx="46" ry="26" fill="#000" opacity="0.35" />
          <ellipse cx="266" cy="330" rx="30" ry="18" fill="#000" opacity="0.3" />
          <ellipse cx="600" cy="330" rx="52" ry="20" fill="#000" opacity="0.22" />
        </g>
      )}
    </g>
  );
}

function ScreenScene({ uid, variant, palette }) {
  const isAfter = variant === 'after';
  const [dark, light] = palette;
  const apps = [
    { fill: '#7FD8FF' },
    { fill: '#8CE6B0' },
    { fill: '#F2CE85' },
    { fill: '#F29B85' },
    { fill: '#C4A9F2' },
    { fill: '#85E0D8' },
  ];

  return (
    <g>
      <rect x="40" y="46" width="720" height="328" rx="26" fill={dark} opacity="0.9" />
      <rect x="66" y="72" width="668" height="276" rx="18" fill="#04060A" />
      <rect x="66" y="72" width="668" height="34" rx="18" fill={light} opacity="0.18" />
      <circle cx="94" cy="89" r="5" fill={isAfter ? '#8CE6B0' : '#55606E'} />
      <rect x="112" y="84" width="88" height="10" rx="5" fill="#55606E" />
      <rect x="640" y="84" width="70" height="10" rx="5" fill="#55606E" />

      {isAfter ? (
        <g>
          {apps.map((app, index) => {
            const column = index % 3;
            const row = Math.floor(index / 3);
            const x = 116 + column * 200;
            const y = 136 + row * 106;
            return (
              <g key={index}>
                <rect x={x} y={y} width="82" height="82" rx="20" fill={app.fill} opacity="0.9" />
                <rect x={x + 22} y={y + 30} width="38" height="8" rx="4" fill="#04060A" opacity="0.55" />
                <rect x={x + 22} y={y + 46} width="24" height="8" rx="4" fill="#04060A" opacity="0.35" />
              </g>
            );
          })}
          <rect x="116" y="330" width="568" height="4" rx="2" fill="#7FD8FF" opacity="0.5" />
        </g>
      ) : (
        <g>
          <rect x="116" y="140" width="240" height="18" rx="9" fill="#2B3440" />
          <rect x="116" y="176" width="420" height="12" rx="6" fill="#1D242E" />
          <rect x="116" y="204" width="360" height="12" rx="6" fill="#1D242E" />
          <rect x="116" y="232" width="300" height="12" rx="6" fill="#1D242E" />
          <rect x="116" y="260" width="392" height="12" rx="6" fill="#1D242E" />
          <rect x="560" y="140" width="124" height="132" rx="12" fill="#12171F" />
          <circle cx="622" cy="206" r="34" fill="none" stroke="#2B3440" strokeWidth="8" />
        </g>
      )}
    </g>
  );
}

function SaleScene({ uid, palette }) {
  const [, light] = palette;

  return (
    <g>
      <CarScene uid={uid} variant="after" palette={palette} mode="polish" />
      <g transform="translate(556 44) rotate(-6)">
        <rect x="0" y="0" width="196" height="82" rx="16" fill="#0A0D12" stroke={light} strokeWidth="2" />
        <circle cx="26" cy="26" r="7" fill="#D9A441" />
        <rect x="46" y="20" width="120" height="12" rx="6" fill="#D9A441" opacity="0.9" />
        <rect x="20" y="46" width="146" height="10" rx="5" fill="#55606E" />
        <rect x="20" y="62" width="96" height="8" rx="4" fill="#39424F" />
      </g>
    </g>
  );
}

export default function CarVisual({
  scene = 'polish',
  variant = 'after',
  palette = ['#12171F', '#2D3747'],
  className = '',
  title = 'Illustration véhicule Teintérior',
}) {
  const rawId = useId();
  const uid = `tv${rawId.replace(/[^a-zA-Z0-9]/g, '')}`;
  const [dark, light] = palette;

  return (
    <svg
      viewBox="0 0 800 420"
      className={className}
      role="img"
      aria-label={title}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id={`${uid}-body`} x1="0" y1="0" x2="0.2" y2="1">
          <stop offset="0%" stopColor={light} />
          <stop offset="55%" stopColor={dark} />
          <stop offset="100%" stopColor="#05070A" />
        </linearGradient>
        <linearGradient id={`${uid}-clear`} x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0%" stopColor="#D6ECFA" stopOpacity="0.72" />
          <stop offset="100%" stopColor="#8FB4C9" stopOpacity="0.55" />
        </linearGradient>
        <linearGradient id={`${uid}-tinted`} x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0%" stopColor="#121821" stopOpacity="0.94" />
          <stop offset="100%" stopColor="#05070A" stopOpacity="0.98" />
        </linearGradient>
        <radialGradient id={`${uid}-bg`} cx="50%" cy="34%" r="72%">
          <stop offset="0%" stopColor={light} stopOpacity="0.32" />
          <stop offset="60%" stopColor="#080B10" stopOpacity="0.96" />
          <stop offset="100%" stopColor="#05070A" />
        </radialGradient>
        <filter id={`${uid}-dull`}>
          <feColorMatrix type="saturate" values="0.35" />
          <feGaussianBlur stdDeviation="0.9" />
        </filter>
      </defs>

      <rect width="800" height="420" fill={`url(#${uid}-bg)`} />
      <g opacity="0.16" stroke="#8FA3B8" strokeWidth="1">
        {Array.from({ length: 9 }).map((_, index) => (
          <line key={`h${index}`} x1="0" y1={index * 52} x2="800" y2={index * 52} />
        ))}
        {Array.from({ length: 16 }).map((_, index) => (
          <line key={`v${index}`} x1={index * 52} y1="0" x2={index * 52} y2="420" />
        ))}
      </g>

      {scene === 'interior' ? (
        <InteriorScene uid={uid} variant={variant} palette={palette} />
      ) : scene === 'screen' ? (
        <ScreenScene uid={uid} variant={variant} palette={palette} />
      ) : scene === 'sale' ? (
        <SaleScene uid={uid} palette={palette} />
      ) : (
        <CarScene uid={uid} variant={variant} palette={palette} mode={scene} />
      )}
    </svg>
  );
}
