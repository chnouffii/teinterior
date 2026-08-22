const TONES: Record<string, string> = {
  ok: 'border-signal-ok/40 bg-signal-ok/10 text-signal-ok',
  warn: 'border-signal-warn/40 bg-signal-warn/10 text-signal-warn',
  danger: 'border-signal-danger/40 bg-signal-danger/10 text-signal-danger',
  accent: 'border-accent/40 bg-accent/10 text-accent',
  neutral: 'border-white/20 bg-ink-800 text-faint',
};

export default function StatusPill({
  label,
  tone = 'neutral',
  className = '',
}: {
  label: string;
  tone?: keyof typeof TONES | string;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg border px-2 py-0.5 text-[11px] font-semibold ${
        TONES[tone] ?? TONES.neutral
      } ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}
