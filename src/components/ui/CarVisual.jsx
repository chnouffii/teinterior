import { useId } from 'react';

/**
 * Visuels vectoriels générés en interne (aucune dépendance externe, aucun asset distant).
 * Chaque scène accepte une variante « before » / « after » afin d'alimenter le
 * comparateur avant / après et les vignettes de la galerie.
 */

/**
 * Silhouettes par type de carrosserie.
 *
 * Toutes partagent le même sol (bas de roue à y = 370) pour rester comparables
 * d'une vignette à l'autre. `wheels` donne l'entraxe et le rayon, `sill` la
 * hauteur du bas de caisse, `lamps` la position des feux.
 */
const BODIES = {
  berline: {
    body:
      'M96 316 C84 296 86 268 104 252 L238 236 L318 170 C360 146 500 142 546 172 L626 232 L700 246 C724 252 736 274 732 300 L728 316 Z',
    frontGlass: 'M256 230 L330 178 L452 174 L452 230 Z',
    rearGlass: 'M470 174 L540 176 L610 230 L470 230 Z',
    pillar: { x: 452, y: 172, w: 16, h: 60 },
    gloss: 'M104 252 L238 236 L318 170',
    crease: 'M120 288 C280 268 520 266 716 286',
    wheels: [232, 596],
    radius: 54,
    lamps: { front: [96, 266], rear: [712, 268] },
    handle: [486, 252],
  },
  break: {
    body:
      'M96 316 C84 296 86 268 104 252 L238 236 L318 168 C356 146 520 142 600 150 L668 158 L692 232 L706 246 C726 252 736 274 732 300 L728 316 Z',
    frontGlass: 'M256 230 L330 176 L452 172 L452 230 Z',
    rearGlass: 'M470 172 L636 160 L666 230 L470 230 Z',
    pillar: { x: 452, y: 170, w: 15, h: 62 },
    gloss: 'M104 252 L238 236 L318 168',
    crease: 'M120 288 C280 268 520 266 716 286',
    wheels: [232, 604],
    radius: 54,
    lamps: { front: [96, 266], rear: [712, 266] },
    handle: [486, 250],
  },
  suv: {
    body:
      'M100 302 C88 282 90 244 108 230 L226 214 L286 132 C322 110 522 106 578 134 L648 212 L700 226 C726 232 738 256 734 284 L730 302 Z',
    frontGlass: 'M248 208 L306 142 L448 138 L448 208 Z',
    rearGlass: 'M466 138 L570 142 L628 208 L466 208 Z',
    pillar: { x: 448, y: 136, w: 16, h: 74 },
    gloss: 'M108 230 L226 214 L286 132',
    crease: 'M124 268 C284 248 524 246 718 266',
    wheels: [230, 600],
    radius: 62,
    lamps: { front: [100, 244], rear: [714, 246] },
    handle: [484, 228],
  },
  citadine: {
    body:
      'M124 316 C112 296 114 268 132 252 L248 238 L318 174 C358 150 486 146 528 176 L600 240 L668 250 C692 256 702 276 698 300 L694 316 Z',
    frontGlass: 'M264 232 L334 182 L440 178 L440 232 Z',
    rearGlass: 'M458 178 L512 180 L586 232 L458 232 Z',
    pillar: { x: 440, y: 176, w: 15, h: 58 },
    gloss: 'M132 252 L248 238 L318 174',
    crease: 'M146 288 C292 270 512 268 684 286',
    wheels: [252, 566],
    radius: 52,
    lamps: { front: [124, 266], rear: [678, 268] },
    handle: [476, 254],
  },
  coupe: {
    body:
      'M96 320 C84 300 86 274 104 258 L246 244 L336 186 C388 156 512 152 566 188 L648 244 L702 252 C726 258 736 278 732 302 L728 320 Z',
    frontGlass: 'M282 240 L352 194 L460 190 L460 240 Z',
    rearGlass: 'M476 190 L546 198 L620 240 L476 240 Z',
    pillar: { x: 460, y: 188, w: 14, h: 54 },
    gloss: 'M104 258 L246 244 L336 186',
    crease: 'M124 292 C284 274 520 272 716 290',
    wheels: [236, 596],
    radius: 54,
    lamps: { front: [96, 272], rear: [712, 274] },
    handle: [492, 258],
  },
};

function Wheel({ cx, r = 54, rim, spokes = 6 }) {
  const cy = 370 - r;
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="#05070A" />
      <circle cx={cx} cy={cy} r={r * 0.78} fill="#0D1219" stroke={rim} strokeWidth="3" />
      <circle cx={cx} cy={cy} r={r * 0.26} fill={rim} opacity="0.75" />
      {Array.from({ length: spokes }).map((_, index) => {
        const angle = (index * 2 * Math.PI) / spokes;
        return (
          <line
            key={index}
            x1={cx + Math.cos(angle) * r * 0.28}
            y1={cy + Math.sin(angle) * r * 0.28}
            x2={cx + Math.cos(angle) * r * 0.72}
            y2={cy + Math.sin(angle) * r * 0.72}
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

function CarScene({ uid, variant, palette, mode, body = 'berline' }) {
  const shape = BODIES[body] ?? BODIES.berline;
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

      <path d={shape.body} fill={`url(#${uid}-body)`} stroke="#000" strokeOpacity="0.4" strokeWidth="2" />

      <path
        d={shape.gloss}
        fill="none"
        stroke="#fff"
        strokeOpacity={glossOpacity}
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d={shape.crease}
        fill="none"
        stroke="#fff"
        strokeOpacity={glossOpacity * 0.6}
        strokeWidth="2"
        strokeLinecap="round"
      />

      <path d={shape.frontGlass} fill={glassFill} />
      <path d={shape.rearGlass} fill={glassFill} />
      <rect
        x={shape.pillar.x}
        y={shape.pillar.y}
        width={shape.pillar.w}
        height={shape.pillar.h}
        fill={dark}
        opacity="0.9"
      />

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

      {shape.wheels.map((cx) => {
        const arch = shape.radius + 12;
        const cy = 370 - shape.radius;
        return (
          <path
            key={`arch-${cx}`}
            d={`M${cx - arch} ${cy} A ${arch} ${arch} 0 0 1 ${cx + arch} ${cy}`}
            fill="none"
            stroke="#04060A"
            strokeOpacity="0.85"
            strokeWidth="8"
          />
        );
      })}

      {shape.wheels.map((cx) => (
        <Wheel key={cx} cx={cx} r={shape.radius} rim={isAfter ? '#D9D9DE' : '#7C7F86'} />
      ))}

      <rect
        x={shape.lamps.front[0]}
        y={shape.lamps.front[1]}
        width="26"
        height="16"
        rx="4"
        fill={isAfter ? '#FFF3CE' : '#C9C3A8'}
      />
      <rect
        x={shape.lamps.rear[0]}
        y={shape.lamps.rear[1]}
        width="20"
        height="14"
        rx="4"
        fill={isAfter ? '#FF6B6B' : '#A15252'}
      />
      <rect
        x={shape.handle[0]}
        y={shape.handle[1]}
        width="34"
        height="7"
        rx="3"
        fill={light}
        opacity="0.7"
      />
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
  body = 'berline',
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
        <CarScene uid={uid} variant={variant} palette={palette} mode={scene} body={body} />
      )}
    </svg>
  );
}
