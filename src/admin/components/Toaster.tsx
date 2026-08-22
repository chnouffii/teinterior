import { Check, Info, TriangleAlert, X } from 'lucide-react';
import { useToastStore } from './toast';

const TONES = {
  ok: { icon: Check, className: 'text-signal-ok' },
  info: { icon: Info, className: 'text-accent' },
  danger: { icon: TriangleAlert, className: 'text-signal-danger' },
} as const;

export default function Toaster() {
  const toasts = useToastStore((state) => state.toasts);
  const dismiss = useToastStore((state) => state.dismiss);

  if (toasts.length === 0) return null;

  return (
    <div
      className="pointer-events-none fixed bottom-5 right-5 z-[80] flex w-[min(22rem,calc(100vw-2.5rem))] flex-col gap-2"
      role="status"
      aria-live="polite"
    >
      {toasts.map((item) => {
        const tone = TONES[item.tone];
        const Icon = tone.icon;
        return (
          <div
            key={item.id}
            className="pointer-events-auto flex items-start gap-3 rounded-md border border-white/10 bg-ink-850 px-4 py-3 shadow-overlay animate-toast-in"
          >
            <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${tone.className}`} aria-hidden="true" />
            <p className="flex-1 text-sm text-fg">{item.message}</p>
            <button
              type="button"
              onClick={() => dismiss(item.id)}
              aria-label="Fermer la notification"
              className="-m-1 p-1 text-faint transition-colors hover:text-fg"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
