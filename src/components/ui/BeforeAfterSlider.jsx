import { useCallback, useEffect, useRef, useState } from 'react';
import { MoveHorizontal } from 'lucide-react';
import CarVisual from './CarVisual.jsx';

/**
 * Comparateur avant / après, présenté comme un banc de contrôle :
 * cadre technique, repères gradués, position affichée en pourcentage.
 * Accepte de vraies photos (beforeImage / afterImage) ou retombe sur
 * l'illustration vectorielle.
 */
export default function BeforeAfterSlider({
  scene = 'polish',
  palette = ['#242A33', '#4A525C'],
  beforeCaption = 'Avant',
  afterCaption = 'Après',
  beforeImage,
  afterImage,
  reference,
  className = '',
}) {
  const [position, setPosition] = useState(50);
  const [dragging, setDragging] = useState(false);
  const containerRef = useRef(null);

  const updateFromClientX = useCallback((clientX) => {
    const node = containerRef.current;
    if (!node) return;
    const bounds = node.getBoundingClientRect();
    const ratio = ((clientX - bounds.left) / bounds.width) * 100;
    setPosition(Math.min(100, Math.max(0, ratio)));
  }, []);

  const handleKeyDown = (event) => {
    const step = event.shiftKey ? 10 : 2;
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      setPosition((value) => Math.max(0, value - step));
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      setPosition((value) => Math.min(100, value + step));
    } else if (event.key === 'Home') {
      event.preventDefault();
      setPosition(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      setPosition(100);
    }
  };

  useEffect(() => {
    if (!dragging) return undefined;
    const stop = () => setDragging(false);
    window.addEventListener('pointerup', stop);
    window.addEventListener('pointercancel', stop);
    return () => {
      window.removeEventListener('pointerup', stop);
      window.removeEventListener('pointercancel', stop);
    };
  }, [dragging]);

  const renderLayer = (image, variant, caption) =>
    image ? (
      <img src={image} alt={caption} className="h-full w-full object-cover" draggable={false} />
    ) : (
      <CarVisual
        scene={scene}
        variant={variant}
        palette={palette}
        className="h-full w-full"
        title={caption}
      />
    );

  return (
    <figure className={`overflow-hidden rounded-lg border border-white/10 bg-ink-900 ${className}`}>
      <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-2.5">
        <span className="label-xs">Banc de comparaison</span>
        {reference ? <span className="num text-[11px] text-faint">{reference}</span> : null}
      </div>

      <div
        ref={containerRef}
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture?.(event.pointerId);
          setDragging(true);
          updateFromClientX(event.clientX);
        }}
        onPointerMove={(event) => {
          if (dragging) updateFromClientX(event.clientX);
        }}
        onPointerUp={(event) => {
          event.currentTarget.releasePointerCapture?.(event.pointerId);
          setDragging(false);
        }}
        className="relative aspect-[16/10] w-full cursor-ew-resize select-none overflow-hidden"
      >
        <div className="absolute inset-0">{renderLayer(beforeImage, 'before', beforeCaption)}</div>

        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
          {renderLayer(afterImage, 'after', afterCaption)}
        </div>

        <span className="pointer-events-none absolute left-4 top-4 rounded-full border border-white/15 bg-ink-950/80 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
          {beforeCaption}
        </span>
        <span className="pointer-events-none absolute right-4 top-4 rounded-full border border-accent/40 bg-accent/15 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-soft">
          {afterCaption}
        </span>

        <div
          className="pointer-events-none absolute inset-y-0 w-px bg-fg/80"
          style={{ left: `${position}%` }}
        />

        <button
          type="button"
          role="slider"
          aria-label="Comparer l’avant et l’après"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(position)}
          aria-valuetext={`${Math.round(position)} % du résultat après intervention`}
          onKeyDown={handleKeyDown}
          onPointerDown={(event) => event.stopPropagation()}
          className="absolute top-1/2 z-10 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2
            items-center justify-center rounded-full border border-white/30 bg-ink-950/90 text-fg
            shadow-card transition-transform duration-200 hover:scale-110"
          style={{ left: `${position}%` }}
        >
          <MoveHorizontal className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <figcaption className="flex items-center justify-between gap-3 border-t border-white/10 px-4 py-2.5 text-[11px] text-faint">
        <span className="flex items-center gap-1.5">
          <MoveHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
          Glissez ou utilisez les flèches du clavier
        </span>
        <span className="num">{Math.round(position)} %</span>
      </figcaption>
    </figure>
  );
}
