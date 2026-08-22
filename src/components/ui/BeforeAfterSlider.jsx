import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, MoveHorizontal } from 'lucide-react';
import CarVisual from './CarVisual.jsx';

/**
 * Comparateur avant / après : l'utilisateur déplace le curseur horizontal
 * (souris, tactile ou clavier) pour révéler le résultat de la prestation.
 */
export default function BeforeAfterSlider({
  scene = 'polish',
  palette = ['#12171F', '#2D3747'],
  beforeCaption = 'Avant',
  afterCaption = 'Après',
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

  const handlePointerDown = (event) => {
    event.currentTarget.setPointerCapture?.(event.pointerId);
    setDragging(true);
    updateFromClientX(event.clientX);
  };

  const handlePointerMove = (event) => {
    if (!dragging) return;
    updateFromClientX(event.clientX);
  };

  const stopDragging = (event) => {
    event.currentTarget.releasePointerCapture?.(event.pointerId);
    setDragging(false);
  };

  const handleKeyDown = (event) => {
    const step = event.shiftKey ? 10 : 3;
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

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={stopDragging}
      className={`relative aspect-[16/10] w-full cursor-ew-resize select-none overflow-hidden
        rounded-3xl border border-white/10 bg-carbon-900 shadow-card ${className}`}
    >
      <div className="absolute inset-0">
        <CarVisual
          scene={scene}
          variant="before"
          palette={palette}
          className="h-full w-full"
          title={`${beforeCaption} — état initial`}
        />
      </div>

      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <CarVisual
          scene={scene}
          variant="after"
          palette={palette}
          className="h-full w-full"
          title={`${afterCaption} — après passage à l’atelier`}
        />
      </div>

      <span className="pointer-events-none absolute left-4 top-4 rounded-full border border-white/15 bg-carbon-950/80 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-300 backdrop-blur">
        {beforeCaption}
      </span>
      <span className="pointer-events-none absolute right-4 top-4 rounded-full border border-brass/40 bg-brass/15 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-brass-light backdrop-blur">
        {afterCaption}
      </span>

      <div
        className="pointer-events-none absolute inset-y-0 w-0.5 bg-white/90 shadow-[0_0_18px_rgba(255,255,255,0.6)]"
        style={{ left: `${position}%` }}
      />

      <button
        type="button"
        role="slider"
        aria-label="Comparer l’avant et l’après"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(position)}
        aria-valuetext={`${Math.round(position)} % du résultat après prestation`}
        onKeyDown={handleKeyDown}
        onPointerDown={(event) => event.stopPropagation()}
        className="absolute top-1/2 z-10 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2
          items-center justify-center rounded-full border border-white/30 bg-carbon-950/90
          text-white shadow-glow backdrop-blur transition-transform duration-200 hover:scale-110"
        style={{ left: `${position}%` }}
      >
        <ChevronLeft className="h-4 w-4 -mr-1" strokeWidth={2.4} aria-hidden="true" />
        <ChevronRight className="h-4 w-4 -ml-1" strokeWidth={2.4} aria-hidden="true" />
      </button>

      <span className="pointer-events-none absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/10 bg-carbon-950/80 px-4 py-1.5 text-[11px] font-medium text-slate-300 backdrop-blur">
        <MoveHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
        Glissez pour comparer
      </span>
    </div>
  );
}
